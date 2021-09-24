import { model } from 'mongoose';
import { Schema, Document } from 'mongoose';
import { getToken, comparePasswords } from '../../middleware/features/auth';

const USER_CREDENTIALS_ERROR = new Error('Unable to login');

const userSchema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
  tokens: string[];
  generateAuthToken(): Promise<string>;
  toJSON(): IUser;
  matchPassword(password: string): Promise<boolean>;
}

export default UserModel;
