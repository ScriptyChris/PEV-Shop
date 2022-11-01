import {
  Schema,
  model,
  Document,
  USER_ROLES_MAP,
  TUserRoleName,
  COLLECTION_NAMES,
} from '@database/models/__core-and-commons';

const userRoleSchema = new Schema<IUserRole>({
  roleName: {
    type: String,
    required: true,
    validate(value: TUserRoleName) {
      return Object.keys(USER_ROLES_MAP).includes(value);
    },
  },
  owners: {
    type: [Schema.Types.ObjectId],
    ref: COLLECTION_NAMES.User,
  },
});

userRoleSchema.methods.toJSON = function () {
  const userRole = this.toObject();

  delete userRole._id;
  delete userRole.__v;

  return userRole;
};

export const UserRoleModel = model<IUserRole>(COLLECTION_NAMES.User_Role, userRoleSchema);
export type TUserRoleModel = typeof UserRoleModel;

export interface IUserRole extends Document {
  roleName: TUserRoleName;
  owners: Schema.Types.ObjectId[];
}

export type TUserRoleToPopulate = Omit<IUserRole, keyof Document>;
