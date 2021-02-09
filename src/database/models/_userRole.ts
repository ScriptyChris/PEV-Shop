import { model } from 'mongoose';
import userRoleSchema, { IUserRole } from '../schemas/userRole';

export { IUserRole }

export default model<IUserRole>('User-Role', userRoleSchema);
