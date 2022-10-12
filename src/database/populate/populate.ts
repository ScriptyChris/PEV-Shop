const PARAMS = Object.freeze({
  EXECUTED_FROM_CLI: 'executedFromCLI',
  CLEAN_ALL_BEFORE: 'cleanAllBefore',
  JSON_FILE_PATH: {
    PRODUCTS: 'productsInputPath',
    USERS: 'usersInputPath',
    USER_ROLES: 'userRolesInputPath',
  },
});
const DEFAULT_PARAMS = Object.freeze({
  [PARAMS.CLEAN_ALL_BEFORE]: 'true',
  [PARAMS.JSON_FILE_PATH.PRODUCTS]: './initial-products.json',
  [PARAMS.JSON_FILE_PATH.USERS]: './initial-users.json',
  [PARAMS.JSON_FILE_PATH.USER_ROLES]: './initial-user-roles.json',
});

if (getScriptParamStringValue(PARAMS.EXECUTED_FROM_CLI)) {
  // TODO: [DX] that might need to be refactored to avoid unnecessary CJS usage and relative path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../../commons/moduleAliasesResolvers.js').backend();
}

import getLogger from '@commons/logger';
import { model } from 'mongoose';
import { ProductModel, IProduct, TProductToPopulate } from '@database/models/_product';
import { UserModel, IUser, TUserToPopulate } from '@database/models/_user';
import { UserRoleModel, IUserRole, TUserRoleToPopulate } from '@database/models/_userRole';
import { hashPassword } from '@middleware/features/auth';
import { connectWithDB } from '@database/connector';

const logger = getLogger(module.filename);
logger.log('process.argv:', process.argv);

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

type TDataToPopulate = TUserRoleToPopulate | TUserToPopulate | TProductToPopulate;
type TProductModel = typeof ProductModel;
type TUserModel = typeof UserModel;
type TUserRoleModel = typeof UserRoleModel;

if (!getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS)) {
  throw ReferenceError(`CLI argument "${PARAMS.JSON_FILE_PATH.PRODUCTS}" must be provided as non empty string`);
}

const executeDBPopulation = async (shouldCleanupAll = false) => {
  logger.log('executeDBPopulation() called.');

  const dbConnection = await connectWithDB();

  if (!dbConnection || dbConnection instanceof Error) {
    throw TypeError(`Database Population is not possible due to a problem with connection: \n${dbConnection}\n.`);
  } else {
    logger.log('`dbConnection` is ok.');
  }

  if (getScriptParamStringValue(PARAMS.CLEAN_ALL_BEFORE) === 'true' || shouldCleanupAll) {
    const removedData = await Promise.all(
      [
        { name: 'products', ctor: ProductModel },
        { name: 'users', ctor: UserModel },
        { name: 'userRoles', ctor: UserRoleModel },
      ].map(async ({ name, ctor }) => {
        const deletionRes = await ctor.deleteMany({});
        return `\n\t-${name}: ${deletionRes.deletedCount}`;
      })
    );

    logger.log(`Cleaning done. Removed: ${removedData}`);
  }

  if (getScriptParamStringValue(PARAMS.JSON_FILE_PATH.USER_ROLES)) {
    const userRolesSourceDataList = getSourceData<TUserRoleToPopulate>('USER_ROLES');
    await populateUserRoles(UserRoleModel, userRolesSourceDataList);
  }

  if (getScriptParamStringValue(PARAMS.JSON_FILE_PATH.USERS)) {
    const usersSourceDataList = getSourceData<TUserToPopulate>('USERS');
    await populateUsers(UserModel, usersSourceDataList);
  }

  if (getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS)) {
    const productsSourceDataList = getSourceData<TProductToPopulate>('PRODUCTS');
    await populateProducts(ProductModel, productsSourceDataList);
    await updateRelatedProductsNames(ProductModel, productsSourceDataList);
  }

  const populationResults = {
    productsAmount: await ProductModel.find({}).countDocuments(),
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
  executeDBPopulation();
}

function getSourceData<T = keyof TDataToPopulate>(modelName: keyof typeof PARAMS.JSON_FILE_PATH): T[] {
  const sourceDataPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH[modelName]);

  if (!sourceDataPath) {
    throw ReferenceError(
      `Path to data for "${modelName}" was not provided! You must pass "${PARAMS.JSON_FILE_PATH[modelName]}" parameter.`
    );
  }

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

function populateProducts(
  ProductModel: TProductModel,
  productsSourceDataList: TProductToPopulate[]
): Promise<IProduct[]> {
  return Promise.all(
    productsSourceDataList.map((productData) => {
      const product = new ProductModel(productData);
      product.set('relatedProductsNames', undefined);

      return product.save().catch((err) => {
        logger.error('product save err:', err, ' /productData:', productData);

        return err;
      });
    })
  );
}

function populateUsers(UserModel: TUserModel, usersSourceDataList: TUserToPopulate[]): Promise<IUser[]> {
  return Promise.all(
    usersSourceDataList.map(async (userDataToPopulate) => {
      userDataToPopulate.password = await hashPassword(userDataToPopulate.password);
      const user = new UserModel(userDataToPopulate);

      // assign User to UserRole indicated by `__accountType`
      await model('UserRole')
        .updateOne({ roleName: userDataToPopulate.__accountType }, { $push: { owners: user._id } })
        .exec();

      return user.save().catch((err) => {
        logger.error('user save err:', err, ' /userDataToPopulate:', userDataToPopulate);

        return err;
      });
    })
  );
}

function populateUserRoles(
  UserRoleModel: TUserRoleModel,
  userRolesSourceDataList: TUserRoleToPopulate[]
): Promise<IUserRole[]> {
  return Promise.all(
    userRolesSourceDataList.map(async (userRoleData) => {
      const userRole = new UserRoleModel(userRoleData);

      return userRole.save().catch((err) => {
        logger.error('userRole save err:', err, ' /userRoleData:', userRoleData);

        return err;
      });
    })
  );
}

function updateRelatedProductsNames(
  ProductModel: TProductModel,
  sourceDataList: TProductToPopulate[]
): Promise<Array<IProduct | void>> {
  return Promise.all(
    sourceDataList.map((productData) => {
      return ProductModel.updateOne(
        { name: productData.name },
        { relatedProductsNames: productData.relatedProductsNames },
        { runValidators: true }
      ).catch((error) => {
        logger.error('updating related product names error:', error, ' /productData:', productData);
        relatedProductsErrors++;
      });
    })
  );
}

function getScriptParamStringValue(paramName: string) {
  const paramValue = process.argv.find((arg) => arg.includes(paramName)) ?? DEFAULT_PARAMS[paramName];

  // not using `logger`, because this function might be called before `logger` initialization (to resolve module aliases)
  console.log('[getScriptParamValue()] /paramName:', paramName, '/paramValue:', paramValue);

  return paramValue ? paramValue.split('=').pop() : '';
}

export { executeDBPopulation };
