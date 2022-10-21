import { ProductModel, IProduct } from './_product';
import { UserModel, IUser } from './_user';
import { UserRoleModel, IUserRole } from './_userRole';
import { COLLECTION_NAMES, TCOLLECTION_NAMES } from './__core-and-commons';

const MODELS = {
  [COLLECTION_NAMES.Product]: ProductModel,
  [COLLECTION_NAMES.User]: UserModel,
  [COLLECTION_NAMES.User_Role]: UserRoleModel,
} as const;

export const getModel = <T extends TCOLLECTION_NAMES>(modelName: T) => MODELS[modelName];
export type TDocuments = IProduct | IUser | IUserRole;

export * from './_product';
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
