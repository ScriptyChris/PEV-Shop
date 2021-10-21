import { model, Schema, Document } from 'mongoose';
// TODO: [refactor] swap it for crypto.randomBytes(..)
import { v4 as uuidv4 } from 'uuid';
import { getToken, comparePasswords } from '../../middleware/features/auth';

require('mongoose-type-email');

const USER_CREDENTIALS_ERROR = new Error('Credentials error');
const PASSWORD_METADATA = {
  EMPTY_OR_INCORRECT_TYPE: 'password must be a non-empty string!',
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
const TEMP_TOKEN_EXPIRE_TIME_MS = 1000 * 60 * 60;

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
  tempToken: {
    type: String,
    required: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual('roleName', {
  ref: 'User-Role',
  localField: '_id',
  foreignField: 'owners',
});

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const token = getToken({ _id: user._id });

  user.tokens.push({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function (): IUser {
  const user = this.toObject();

  delete user.tokens;
  delete user.password;

  return user;
};

userSchema.methods.matchPassword = function (password: string): Promise<boolean> {
  return comparePasswords(password, this.password);
};

userSchema.methods.assignTempToken = function (): Promise<IUser> {
  this.tempToken = uuidv4();

  setTimeout(() => this.deleteTempToken(), TEMP_TOKEN_EXPIRE_TIME_MS);

  return this.save();
};

userSchema.methods.deleteTempToken = function (): Promise<IUser> {
  this.tempToken = undefined;
  return this.save();
};

userSchema.methods.confirmUser = function (): Promise<IUser> {
  this.isConfirmed = true;
  return this.save();
};

userSchema.statics.validatePassword = (password: any): string => {
  if (typeof password !== 'string') {
    return PASSWORD_METADATA.EMPTY_OR_INCORRECT_TYPE;
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

const UserModel = model<IUser>('User', userSchema);

export interface IUser extends Document {
  login: string;
  password: string;
  email: string;
  accountType: typeof ACCOUNT_TYPES[number];
  isConfirmed: boolean;
  tempToken?: string;
  tokens: Record<'token', string>[];
  generateAuthToken(): Promise<string>;
  toJSON(): IUser;
  matchPassword(password: string): Promise<boolean>;
  assignTempToken(): Promise<IUser>;
  deleteTempToken(): Promise<IUser>;
  confirmUser(): Promise<IUser>;

  // TODO: [TS] fix TS error related to non-static method
  //static validatePassword(password: any): string;
}

export default UserModel;
