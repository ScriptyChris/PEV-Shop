/**
 * Populates database with indicated initial data, optionally doing a cleanup beforehand.
 * @module
 * @example <caption>npm usage</caption>
 * ```sh
 * npm run populate-db
 * ```
 * @example <caption>Manual CLI usage</caption>
 * ```sh
 * ts-node src/database/populate/populate.tspopulate.ts \
 *    executedFromCLI=true \
 *    products__InputPath=path/to/JSON/with/initial/products/data
 * ```
 */

// TODO: [DX] activate `moduleAliasesResolvers.js` beforehand, so module alias can be used here
import { COLLECTION_NAMES, TCOLLECTION_NAMES } from '../models/__core-and-commons';

type TUpperCasedPluralCollectionNames = `${Uppercase<TCOLLECTION_NAMES>}S`;
type TCapitalizedPluralCollectionsMap = {
  [CollectionName in TUpperCasedPluralCollectionNames]: CollectionName;
};

const CAPITALIZED_PLURAL_COLLECTION_NAMES = Object.fromEntries(
  Object.keys(COLLECTION_NAMES).map((name) => {
    const capitalPluralName = `${name.toUpperCase()}S`;
    return [capitalPluralName, capitalPluralName];
  })
) as TCapitalizedPluralCollectionsMap;

/**
 * Maps supported params passed via CLI.
 * @notExported
 */
const PARAMS = {
  EXECUTED_FROM_CLI: 'executedFromCLI',
  CLEAN_ALL_BEFORE: 'cleanAllBefore',
  JSON_FILE_PATH: {
    [CAPITALIZED_PLURAL_COLLECTION_NAMES.PRODUCTS]: 'products__InputPath',
    [CAPITALIZED_PLURAL_COLLECTION_NAMES.ORDERS]: 'orders__InputPath',
    [CAPITALIZED_PLURAL_COLLECTION_NAMES.USERS]: 'users__InputPath',
    [CAPITALIZED_PLURAL_COLLECTION_NAMES.USER_ROLES]: 'user_roles__InputPath',
  },
  PRODUCT_IMAGES: 'product_images__FolderPath',
} as const;
/**
 * Maps default params, which are applied when regarding individual params are not provided via CLI.
 * @notExported
 */
const DEFAULT_PARAMS = {
  [PARAMS.CLEAN_ALL_BEFORE]: 'true',
  [PARAMS.JSON_FILE_PATH.PRODUCTS]: './initialData/products.json',
  [PARAMS.JSON_FILE_PATH.ORDERS]: './initialData/orders.json',
  [PARAMS.JSON_FILE_PATH.USERS]: './initialData/users.json',
  [PARAMS.JSON_FILE_PATH.USER_ROLES]: './initialData/user_roles.json',
  [PARAMS.PRODUCT_IMAGES]: './initialData/product-images',
} as const;

if (getScriptParamStringValue(PARAMS.EXECUTED_FROM_CLI)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenvConfig = require('dotenv').config;
  dotenvConfig();

  // TODO: [DX] that might need to be refactored to avoid unnecessary CJS usage and relative path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../../commons/moduleAliasesResolvers.js').backend();
}

import { copyFileSync, readdirSync, mkdirSync, rmdirSync } from 'fs';
import { join, relative } from 'path';
import { IMAGES__PRODUCTS_ROOT_PATH, IMAGES__PRODUCTS_TMP_FOLDER } from '@commons/consts';
import getLogger from '@commons/logger';
import { hashPassword } from '@middleware/features/auth';
import { connectWithDB } from '@database/connector';
import {
  ProductModel,
  OrderModel,
  UserModel,
  UserRoleModel,
  IProduct,
  TProductToPopulate,
  IOrder,
  TOrderToPopulate,
  IUser,
  TUserToPopulate,
  IUserRole,
  TUserRoleToPopulate,
} from '@database/models';

const logger = getLogger(module.filename);
logger.log('process.argv:', process.argv);

// Explanation for using root relative path is at the top of `src/middleware/middleware-index.ts` module.
const rootRelativePath = relative(__dirname, process.env.INIT_CWD as string);
const RELATIVE_IMAGES_PRODUCTS_PATH = join(__dirname, rootRelativePath, IMAGES__PRODUCTS_ROOT_PATH);

let relatedProductsErrors = 0;

// TODO: [REFACTOR] move to product or category schema
// const CATEGORY_TO_SPEC_MAP: { [key: string]: Record<string, [number, number]> } = Object.freeze({
//   'Accessories': {
//     'Weight': [1, 10],
//     'Colour': [0, NaN],
//     'Dimensions': [1, 15]
//   },
//   'Electric Scooters & eBikes': {
//     'Range': [3, 40],
//     'Cruising Speed': [5, 30]
//   },
//   'Advanced Electric Wheels': {
//     'Range': [10, 70],
//     'Cruising Speed': [15, 40]
//   },
// })

type TDataToPopulate = TUserRoleToPopulate | TUserToPopulate | TProductToPopulate | TOrderToPopulate;
const COLLECTIONS_TO_REMOVE = [
  { name: CAPITALIZED_PLURAL_COLLECTION_NAMES.PRODUCTS, ctor: ProductModel },
  { name: CAPITALIZED_PLURAL_COLLECTION_NAMES.ORDERS, ctor: OrderModel },
  { name: CAPITALIZED_PLURAL_COLLECTION_NAMES.USERS, ctor: UserModel },
  { name: CAPITALIZED_PLURAL_COLLECTION_NAMES.USER_ROLES, ctor: UserRoleModel },
] as const;

if (!getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS)) {
  throw ReferenceError(`CLI argument "${PARAMS.JSON_FILE_PATH.PRODUCTS}" must be provided as non empty string!`);
} else if (!getScriptParamStringValue(PARAMS.PRODUCT_IMAGES)) {
  throw ReferenceError(`CLI argument "${PARAMS.PRODUCT_IMAGES}" must be provided as non empty string!`);
}

/**
 * Executes database population. May be called from other module or it's automatically called when this script is run from CLI.
 * @param shouldCleanupAll - Decides whether do database cleanup. Passing `PARAMS.CLEAN_ALL_BEFORE` via CLI is an alternative way to do cleanup.
 */
const executeDBPopulation = async (shouldCleanupAll = false) => {
  logger.log('executeDBPopulation() called.');

  const dbConnection = await connectWithDB();

  if (!dbConnection || dbConnection instanceof Error) {
    throw TypeError(`Database Population is not possible due to a problem with connection: \n${dbConnection}\n.`);
  } else {
    logger.log('`dbConnection` is ok.');
  }

  if (getScriptParamStringValue(PARAMS.CLEAN_ALL_BEFORE) === 'true' || shouldCleanupAll) {
    await cleanDatabase();
  }

  const userRolesPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH.USER_ROLES);
  if (userRolesPath) {
    const userRolesSourceDataList = getSourceData<TUserRoleToPopulate>(userRolesPath);
    await populateUserRoles(userRolesSourceDataList);
  }

  const usersPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH.USERS);
  if (usersPath) {
    const usersSourceDataList = getSourceData<TUserToPopulate>(usersPath);
    await populateUsers(usersSourceDataList);
  }

  const productsPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS);
  if (productsPath) {
    const productsSourceDataList = getSourceData<TProductToPopulate>(productsPath);
    await populateProducts(productsSourceDataList);
    await updateRelatedProductsNames(productsSourceDataList);
    relocateProductImages(productsSourceDataList);
  }

  const ordersPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH.ORDERS);
  if (ordersPath) {
    const ordersSourceDataList = getSourceData<TOrderToPopulate>(ordersPath);
    await populateOrders(ordersSourceDataList);
  }

  const populationResults = {
    productsAmount: await ProductModel.find({}).countDocuments(),
    ordersAmount: await OrderModel.find({}).countDocuments(),
    usersAmount: await UserModel.find({}).countDocuments(),
    userRolesAmount: await UserRoleModel.find({}).countDocuments(),
  };

  // TODO: [DX] logging should be automated based on collections, which were actually indicated to be populated
  logger.log(
    'Population results:',
    '\n\t- products amount:',
    populationResults.productsAmount,
    '\n\t\t- relatedProductsErrors:',
    relatedProductsErrors,
    '\n\t- users amount:',
    populationResults.usersAmount,
    '\n\t- orders amount:',
    populationResults.ordersAmount,
    '\n\t- user roles amount:',
    populationResults.userRolesAmount
  );

  /*
    TODO: [DataBase - optimalization] ensure if it's necessary to close a connection after data population.
    If closure is done on the same connection instance as the app relies on, 
    then at least connection initiator should be checked before deciding whether to close it, 
    to avoid closing connection for the entire app.
  */
  if (getScriptParamStringValue(PARAMS.EXECUTED_FROM_CLI)) {
    await dbConnection.close();
  }

  return Object.values(populationResults).every(Boolean);
};

if (getScriptParamStringValue(PARAMS.EXECUTED_FROM_CLI)) {
  executeDBPopulation().then(() => {
    logger.log('Exiting from populate.ts initiated via CLI...');
    return process.exit(0);
  });
}

async function cleanDatabase() {
  const removedData = await Promise.all(
    COLLECTIONS_TO_REMOVE.map(async ({ name, ctor }) => {
      const deletionRes = await ctor.deleteMany({});
      return `\n\t-${name}: ${deletionRes.deletedCount}`;
    })
  );

  const matchedProductImagesFolders = readdirSync(RELATIVE_IMAGES_PRODUCTS_PATH).filter(
    (path) => path !== IMAGES__PRODUCTS_TMP_FOLDER
  );

  for (const productImagesFolder of matchedProductImagesFolders) {
    rmdirSync(join(RELATIVE_IMAGES_PRODUCTS_PATH, productImagesFolder), { recursive: true });
  }

  logger.log(
    `Cleaning done. Removed: ${removedData}\n\t-matchedProductImagesFolders: ${matchedProductImagesFolders.length}`
  );
}
function getSourceData<T extends TDataToPopulate>(sourceDataPath: string): T[] {
  logger.log('getSourceData() /sourceDataPath:', sourceDataPath);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sourceDataFiles = require(sourceDataPath);

  if (Array.isArray(sourceDataFiles)) {
    return sourceDataFiles;
  }

  try {
    const parsedSourceDataFiles = JSON.parse(sourceDataFiles);

    return Array.isArray(parsedSourceDataFiles) ? parsedSourceDataFiles : [parsedSourceDataFiles];
  } catch (parseError) {
    logger.error('parseError:', parseError, ' for data taken from sourceDataPath:', sourceDataPath);

    throw parseError;
  }
}

function populateProducts(productsSourceDataList: TProductToPopulate[]): Promise<IProduct[]> {
  return Promise.all(
    productsSourceDataList.map((productData) => {
      const product = new ProductModel(productData);
      product.set('relatedProductsNames', undefined);
      product.reviews.list.forEach((review) => (review.isAuthorAnonymous = false));

      return product.save().catch((productSaveError) => {
        logger.error('productSaveError:', productSaveError, ' /productData:', productData);

        return productSaveError;
      });
    })
  );
}

function populateUsers(usersSourceDataList: TUserToPopulate[]): Promise<IUser[]> {
  return Promise.all(
    usersSourceDataList.map(async (userDataToPopulate) => {
      userDataToPopulate.password = await hashPassword(userDataToPopulate.password);
      const user = new UserModel(userDataToPopulate);

      // assign User to UserRole indicated by `__accountType`
      await UserRoleModel.updateOne(
        { roleName: userDataToPopulate.__accountType },
        { $push: { owners: user._id } }
      ).exec();

      return user.save().catch((userSaveError) => {
        logger.error('userSaveError:', userSaveError, ' /userDataToPopulate:', userDataToPopulate);

        return userSaveError;
      });
    })
  );
}

function populateOrders(ordersSourceDataList: TOrderToPopulate[]): Promise<IOrder[]> {
  return Promise.all(
    ordersSourceDataList.map(async (orderData) => {
      const regardingUserId = (await UserModel.findOne({ login: orderData.__regardingUser }, { _id: 1 }))!._id;
      const matchedRegardingProducts = await ProductModel.find({
        name: orderData.regardingProducts.map(({ __name }: typeof orderData.regardingProducts[number]) => __name, {
          _id: 1,
          price: 1,
        }),
      });

      const order = new OrderModel({
        ...orderData,
        timestamp: Date.now(),
        regardingUser: regardingUserId,
        regardingProducts: orderData.regardingProducts.map((product, index) => ({
          ...product,
          id: matchedRegardingProducts[index]._id,
          unitPrice: matchedRegardingProducts[index].price,
        })),
      });

      return order.save().catch((orderSaveError) => {
        logger.error('orderSaveError:', orderSaveError, ' /orderData:', orderData);

        return orderSaveError;
      });
    })
  );
}

function populateUserRoles(userRolesSourceDataList: TUserRoleToPopulate[]): Promise<IUserRole[]> {
  return Promise.all(
    userRolesSourceDataList.map(async (userRoleData) => {
      const userRole = new UserRoleModel(userRoleData);

      return userRole.save().catch((userRoleSaveError) => {
        logger.error('userRoleSaveError:', userRoleSaveError, ' /userRoleData:', userRoleData);

        return userRoleSaveError;
      });
    })
  );
}

function updateRelatedProductsNames(sourceDataList: TProductToPopulate[]): Promise<(IProduct | void)[]> {
  return Promise.all(
    sourceDataList.map((productData) => {
      return ProductModel.updateOne(
        { name: productData.name },
        { relatedProductsNames: productData.relatedProductsNames },
        { runValidators: true }
      ).catch((relatedProductUpdateError) => {
        logger.error('relatedProductUpdateError:', relatedProductUpdateError, ' /productData:', productData);
        relatedProductsErrors++;
      });
    })
  );
}

function relocateProductImages(productsSourceDataList: TProductToPopulate[]) {
  const productInitialImagesPath = getScriptParamStringValue(PARAMS.PRODUCT_IMAGES)!;
  // Based on https://stackoverflow.com/a/52562541/4983840
  const copyDirSync = (src: string, dest: string) => {
    const dirEntries = readdirSync(src, { withFileTypes: true });
    mkdirSync(dest);

    for (const dirEntry of dirEntries) {
      const srcPath = join(src, dirEntry.name);
      const destPath = join(dest, dirEntry.name);

      if (dirEntry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  };

  productsSourceDataList.forEach(({ url }, i) => {
    const srcPath = join(__dirname, productInitialImagesPath, url);
    const destPath = join(RELATIVE_IMAGES_PRODUCTS_PATH, url);

    copyDirSync(srcPath, destPath);
  });
}

function getScriptParamStringValue(paramName: string) {
  const paramValue =
    process.argv.find((arg) => arg.includes(paramName)) ?? DEFAULT_PARAMS[paramName as keyof typeof DEFAULT_PARAMS];

  // not using `logger`, because this function might be called before `logger` initialization (to resolve module aliases)
  console.log('[getScriptParamValue()] /paramName:', paramName, '/paramValue:', paramValue);

  return paramValue ? paramValue.split('=').pop() : '';
}

export { executeDBPopulation };
