import { ProductModel, IProduct } from './_product';
import { UserModel, IUser } from './_user';
import { UserRoleModel, IUserRole } from './_userRole';

const MODELS = {
  Product: ProductModel,
  User: UserModel,
  'User-Role': UserRoleModel,
} as const;

export type IModel = IProduct | IUser | IUserRole;
export type TModelType = keyof typeof MODELS;

export function getModel(modelType: TModelType): typeof MODELS[TModelType] {
  return MODELS[modelType];
}
