/**
 * Groups and re-exports lower level types and values related to working with database'es models.
 * @module
 */

import { ProductModel, IProduct } from './_product';
import { OrderModel, IOrder } from './_order';
import { UserModel, IUser } from './_user';
import { UserRoleModel, IUserRole } from './_userRole';
import { COLLECTION_NAMES, TCOLLECTION_NAMES } from './__core-and-commons';

const MODELS = {
  [COLLECTION_NAMES.Product]: ProductModel,
  [COLLECTION_NAMES.Order]: OrderModel,
  [COLLECTION_NAMES.User]: UserModel,
  [COLLECTION_NAMES.User_Role]: UserRoleModel,
} as const;

export const getModel = <T extends TCOLLECTION_NAMES>(modelName: T) => MODELS[modelName];
export type TDocuments = IProduct | IOrder | IUser | IUserRole;
export type TSort = { [key: string]: 1 | -1 };

/**
 * @group Re-export of database models and their related entities.
 */
export * from './_product';
export * from './_order';
export * from './_user';
export * from './_userRole';
export {
  COLLECTION_NAMES,
  TCOLLECTION_NAMES,
  USER_ROLES_MAP,
  TUserRoleName,
  MongooseDocument,
  ModelPopulateOptions,
  isValidObjectId,
  Schema,
} from './__core-and-commons';
