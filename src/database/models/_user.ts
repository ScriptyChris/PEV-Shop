import { model } from 'mongoose';
import userSchema, { IUser }  from '../schemas/user';

export { IUser };

export default model<IUser>('User', userSchema);
