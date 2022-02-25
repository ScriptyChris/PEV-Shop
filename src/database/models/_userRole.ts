import { Schema, Document, model } from 'mongoose';

const userRoleSchema = new Schema<IUserRole>({
  roleName: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
    // TODO: use validation in all other database Schemas
    validate(value: /* TODO: declare more strict type than string */ string[]) {
      return Array.isArray(value) && value.length > 0;
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

  if (userRole.owners?.login) {
    userRole.owners = userRole.owners.login;
  }

  return userRole;
};

export const UserRoleModel = model<IUserRole>('User-Role', userRoleSchema);

export interface IUserRole extends Document {
  roleName: string;
  permissions: string[];
  owners: Schema.Types.ObjectId[];
}
