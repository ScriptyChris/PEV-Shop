import { Model } from 'mongoose';
import { default as Product, IProduct } from './_product'
import { default as User, IUser } from './_user'
import { default as UserRole, IUserRole } from './_userRole'

const MODELS = {
  Product: Product,
  User: User,
  'User-Role': UserRole,
};

export type IModel = IProduct | IUser | IUserRole;
export type TModels = typeof MODELS;
export type TModelType = keyof typeof MODELS;
export type TGenericModel = Model<IModel>

export default (modelType: TModelType): TGenericModel => MODELS[modelType];
