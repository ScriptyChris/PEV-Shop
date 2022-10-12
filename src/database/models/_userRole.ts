import { Schema, Document, model } from 'mongoose';

// TODO: [feature] add `admin` role
const ROLE_NAMES = ['client', 'seller'] as const;
type TRoleName = typeof ROLE_NAMES[number];

const userRoleSchema = new Schema<IUserRole>({
  roleName: {
    type: String,
    required: true,
    validate(value: TRoleName) {
      return ROLE_NAMES.includes(value);
    },
  },
  owners: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
});

userRoleSchema.methods.toJSON = function () {
  const userRole = this.toObject();

  delete userRole._id;
  delete userRole.__v;

  return userRole;
};

export const UserRoleModel = model<IUserRole>('UserRole', userRoleSchema);

export interface IUserRole extends Document {
  roleName: TRoleName;
  owners: Schema.Types.ObjectId[];
}

export type TUserRoleToPopulate = Omit<IUserRole, keyof Document>;
