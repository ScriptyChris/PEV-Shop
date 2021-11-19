import type { Document, Model } from 'mongoose';
import { model, Schema, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { getToken, comparePasswords } from '../../middleware/features/auth';

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
const ACCOUNT_TYPES = ['client', 'retailer'] as const;
const SINGLE_TOKEN_EXPIRE_TIME_MS = 1000 * 60 * 60;

type TTokensKeys = keyof IUser['tokens'];
type TDeclaredTokens = { [k in TTokensKeys]: string };
type TSingleTokensKeys = Exclude<keyof TDeclaredTokens, 'auth'>;

const userSchema = new Schema<IUser>({
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
    // @ts-ignore
    type: Schema.Types.Email,
    unique: true,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: {
      values: ACCOUNT_TYPES,
      message: '{VALUE} is not a proper account type!',
    },
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
});

userSchema.virtual('roleName', {
  ref: 'User-Role',
  localField: '_id',
  foreignField: 'owners',
});

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as IUser;
  const authToken = getToken({ _id: user._id });

  if (!user.tokens.auth) {
    user.tokens.auth = [];
  }

  user.tokens.auth.push(authToken);
  await user.save();

  return authToken;
};

userSchema.methods.toJSON = function (): IUserPublic {
  const user: IUser = this.toObject();

  return {
    login: user.login,
    email: user.email,
    observedProductsIDs: user.observedProductsIDs || [],
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
  const productObjectId = new Types.ObjectId(productId) as unknown as Schema.Types.ObjectId;

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
  const productObjectId = new Types.ObjectId(productId) as unknown as Schema.Types.ObjectId;

  if (!user.observedProductsIDs || !user.observedProductsIDs.includes(productObjectId)) {
    return 'Product was not observed by user!';
  }

  const lengthBeforeRemoval = user.observedProductsIDs.length;
  user.observedProductsIDs = user.observedProductsIDs.filter(
    (observedProductId) => observedProductId.toString() !== productObjectId.toString()
  ) as [Schema.Types.ObjectId];

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

userSchema.statics.validatePassword = (password: any): string => {
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

export const UserModel = model<IUser, IUserStatics>('User', userSchema);

type IUserPublic = Pick<IUser, 'login' | 'email' | 'observedProductsIDs'>;

interface IUserStatics extends Model<IUser> {
  validatePassword(password: any): string;
}

export interface IUser extends Document {
  login: string;
  password: string;
  email: string;
  accountType: typeof ACCOUNT_TYPES[number];
  isConfirmed: boolean;
  observedProductsIDs: Schema.Types.ObjectId[] | undefined;
  tokens: {
    auth: string[] | undefined;
    confirmRegistration: string | undefined;
    resetPassword: string | undefined;
  };
  generateAuthToken(): Promise<string>;
  toJSON(): IUserPublic;
  matchPassword(password: string): Promise<boolean>;
  setSingleToken(tokenName: TSingleTokensKeys): Promise<IUser>;
  deleteSingleToken(tokenName: TSingleTokensKeys): Promise<IUser>;
  confirmUser(): Promise<IUser>;
  addProductToObserved(productId: string): string;
  removeProductFromObserved(productId: string): string;
  removeAllProductsFromObserved(): string;
}
