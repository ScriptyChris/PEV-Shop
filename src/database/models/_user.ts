/**
 * @module
 * @notExported
 */

import {
  model,
  Schema,
  Types,
  Document,
  Model,
  TUserRoleName,
  COLLECTION_NAMES,
  USER_ROLES_MAP,
} from '@database/models/__core-and-commons';
import { randomBytes } from 'crypto';
import { getToken, comparePasswords } from '@middleware/features/auth';

require('mongoose-type-email');

const USER_CREDENTIALS_ERROR = new Error('Credentials error');
const PASSWORD_METADATA = {
  EMPTY_OR_INCORRECT_TYPE: {
    errorMessage: 'password must be a non-empty string!',
  },
  MIN_LENGTH: {
    value: 8,
    errorMessage: 'password should has at least 8 chars!',
  },
  MAX_LENGTH: {
    value: 20,
    errorMessage: 'password should has maximum of 20 chars!',
  },
};
const SINGLE_TOKEN_EXPIRE_TIME_MS = 1000 * 60 * 60;

type TTokensKeys = keyof IUser['tokens'];
type TDeclaredTokens = { [k in TTokensKeys]: string };
type TSingleTokensKeys = Exclude<keyof TDeclaredTokens, 'auth'>;

const populateOrderProducts = (order: Document, optionalUserLogin?: IUser['login']) =>
  order
    .execPopulate(
      // @ts-ignore
      'regardingProducts.productRef'
    )
    .then((populatedOrder: any) => ({
      ...populatedOrder.toObject(),
      regardingProducts: populatedOrder.regardingProducts.map(({ quantity, unitPrice, productRef: { name } }: any) => ({
        name,
        quantity,
        unitPrice,
      })),
      regardingUser: optionalUserLogin || undefined,
    }));

const userSchema = new Schema<IUser>(
  {
    login: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: Schema.Types.Email,
      unique: true,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    observedProductsIDs: {
      type: [Schema.Types.ObjectId],
      default: undefined,
    },
    tokens: {
      auth: {
        type: [String],
        default: undefined,
      },
      confirmRegistration: {
        type: String,
        default: undefined,
      },
      resetPassword: {
        type: String,
        default: undefined,
      },
    },
  },
  {
    toObject: { virtuals: true },
  }
);

userSchema.virtual('accountType', {
  ref: COLLECTION_NAMES.User_Role,
  localField: '_id',
  foreignField: 'owners',
  justOne: true,
});
userSchema.virtual('orders', {
  ref: COLLECTION_NAMES.Order,
  localField: '_id',
  foreignField: 'regardingUser',
  justOne: false,
});

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as IUser;
  const authToken = getToken({ _id: user._id });

  if (!user.tokens.auth) {
    user.tokens.auth = [];
  }

  // TODO: [duplication] check for possible duplication
  user.tokens.auth.push(authToken);
  await user.save();

  return authToken;
};

userSchema.methods.toJSON = function (): TUserPublic {
  const user: IUser = this.toObject();

  if (!user.accountType?.roleName) {
    throw new TypeError('User role was not successfully populated!');
  }

  return {
    _id: user._id,
    login: user.login,
    email: user.email,
    observedProductsIDs: user.observedProductsIDs || [],
    accountType: user.accountType.roleName,
  };
};

userSchema.methods.matchPassword = function (password: string): Promise<boolean> {
  return comparePasswords(password, this.password);
};

userSchema.methods.setSingleToken = function (tokenName: TSingleTokensKeys): Promise<IUser> {
  this.tokens[tokenName] = randomBytes(256).toString('base64');

  setTimeout(() => this.deleteSingleToken(tokenName), SINGLE_TOKEN_EXPIRE_TIME_MS);

  return this.save();
};

userSchema.methods.deleteSingleToken = function (tokenName: TSingleTokensKeys): Promise<IUser> {
  this.tokens[tokenName] = undefined;

  return this.save();
};

userSchema.methods.confirmUser = function (): Promise<IUser> {
  this.isConfirmed = true;
  return this.save();
};

userSchema.methods.addProductToObserved = function (productId: string): string {
  const user = this as IUser;
  const productObjectId = new Types.ObjectId(productId);

  if (!user.observedProductsIDs) {
    user.observedProductsIDs = [productObjectId];
  } else if (user.observedProductsIDs.includes(productObjectId)) {
    return 'Product is already observed by user!';
  } else {
    user.observedProductsIDs.push(productObjectId);
  }

  return '';
};

userSchema.methods.removeProductFromObserved = function (productId: string): string {
  const user = this as IUser;
  const productObjectId = new Types.ObjectId(productId);

  if (!user.observedProductsIDs || !user.observedProductsIDs.includes(productObjectId)) {
    return 'Product was not observed by user!';
  }

  const lengthBeforeRemoval = user.observedProductsIDs.length;
  user.observedProductsIDs = user.observedProductsIDs.filter(
    (observedProductId) => observedProductId.toString() !== productObjectId.toString()
  ) as [Types.ObjectId];

  if (lengthBeforeRemoval - 1 === user.observedProductsIDs.length) {
    if (user.observedProductsIDs.length === 0) {
      user.observedProductsIDs = undefined;
    }

    return '';
  }

  return `Product observation was either not removed or there were multiple observations for same product! 
  Number of observed products before removing: ${lengthBeforeRemoval}; after: ${user.observedProductsIDs.length}.`;
};

userSchema.methods.removeAllProductsFromObserved = function (): string {
  const user = this as IUser;

  if (!user.observedProductsIDs) {
    return 'No product was observed by user!';
  }

  user.observedProductsIDs = undefined;

  return '';
};

userSchema.methods.findCurrentUserOrders = async function () {
  const userWithOrders = (await this.execPopulate(
    // @ts-ignore
    'orders accountType'
  )) as IUser & {
    orders: ({ regardingUser: Record<string, any>[]; regardingProducts: Record<string, any>[] } & Document)[];
  };

  const userOrdersWithProducts = await Promise.all(userWithOrders.orders.map((order) => populateOrderProducts(order)));

  return userOrdersWithProducts;
};

userSchema.methods.findAllUsersOrders = async function (getFromDB: any) {
  const allUsersOrders = (await getFromDB(
    { modelName: COLLECTION_NAMES.User, findMultiple: true, population: 'orders accountType' },
    {},
    { orders: 1, login: 1, accountType: 1 }
  )) as (IUser & {
    orders: ({ regardingUser: Record<string, any>[]; regardingProducts: Record<string, any>[] } & Document)[];
  })[];

  const usersOrdersWithProducts = (
    await Promise.all(
      allUsersOrders
        .filter(({ accountType }) => accountType!.roleName === USER_ROLES_MAP.client)
        .map(({ login, orders }) => Promise.all(orders.map((order) => populateOrderProducts(order, login))))
    )
  ).flat();

  return usersOrdersWithProducts;
};

userSchema.statics.validateNewUserPayload = (newUser: any) => {
  if (!newUser) {
    return 'New user payload not provided!';
  } else if (!newUser.login) {
    return 'New user login not provided!';
  } else if (!newUser.password) {
    return 'New user password not provided!';
  } else if (!newUser.email) {
    return 'New user email not provided!';
  } else if (!newUser.accountType) {
    return 'New user accountType not provided!';
  }

  return '';
};

userSchema.statics.validatePassword = (password: unknown): string => {
  if (typeof password !== 'string') {
    return PASSWORD_METADATA.EMPTY_OR_INCORRECT_TYPE.errorMessage;
  }

  if (password.length < PASSWORD_METADATA.MIN_LENGTH.value) {
    return PASSWORD_METADATA.MIN_LENGTH.errorMessage;
  }

  if (password.length > PASSWORD_METADATA.MAX_LENGTH.value) {
    return PASSWORD_METADATA.MAX_LENGTH.errorMessage;
  }

  return '';
};

// TODO: remove if unused
userSchema.statics.findByCredentials = async (userModel: any, nick: string, password: string) => {
  const user = userModel.findOne({ nick });

  if (!user) {
    throw USER_CREDENTIALS_ERROR;
  }

  const isPasswordMatch = await comparePasswords(password, user.password);

  if (!isPasswordMatch) {
    throw USER_CREDENTIALS_ERROR;
  }

  return user;
};

export const UserModel = model<IUser, IUserModel>(COLLECTION_NAMES.User, userSchema);
export type TUserModel = typeof UserModel;

export type TUserPublic = Pick<IUser, 'login' | 'email' | 'observedProductsIDs'> & {
  accountType: NonNullable<IUser['accountType']>['roleName'];
  _id: Types.ObjectId;
};

export type TUserToPopulate = Pick<IUser, 'login' | 'password' | 'email' | 'isConfirmed'> & {
  __accountType: TUserRoleName;
};

/**
 * @internal
 */
interface IUserModel extends Model<IUser> {
  validateNewUserPayload(newUser: any): string;
  validatePassword(password: unknown): string;
}

/**
 * @internal
 */
export interface IUser extends Document {
  login: string;
  password: string;
  email: string;
  isConfirmed: boolean;
  observedProductsIDs: Types.ObjectId[] | undefined;
  tokens: {
    auth: string[] | undefined;
    confirmRegistration: string | undefined;
    resetPassword: string | undefined;
  };
  accountType?: { roleName: TUserRoleName };

  generateAuthToken(): Promise<string>;
  toJSON(): TUserPublic;
  matchPassword(password: string): Promise<boolean>;
  setSingleToken(tokenName: TSingleTokensKeys): Promise<IUser>;
  deleteSingleToken(tokenName: TSingleTokensKeys): Promise<IUser>;
  confirmUser(): Promise<IUser>;
  addProductToObserved(productId: string): string;
  removeProductFromObserved(productId: string): string;
  removeAllProductsFromObserved(): string;
  findCurrentUserOrders(): Promise<any>;
  findAllUsersOrders(getFromDB: any): Promise<any>;
}

export type TUserRegistrationCredentials = Pick<IUser, 'login' | 'password' | 'email'> & {
  repeatedPassword: IUser['password'];
};
