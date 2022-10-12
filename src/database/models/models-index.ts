import { ProductModel, IProduct } from './_product';
import { UserModel, IUser } from './_user';
import { UserRoleModel, IUserRole } from './_userRole';

const MODELS = {
  Product: ProductModel,
  User: UserModel,
  UserRole: UserRoleModel,
} as const;

export type TModel = IProduct | IUser | IUserRole;
export type TModelName = keyof typeof MODELS;

export function getModel(modelName: TModelName) {
  return MODELS[modelName];
}
