import getLogger from '../../../utils/logger';
import { Model } from 'mongoose';
import { ProductModel, IProduct } from '../models/_product';
import { UserModel, IUser } from '../models/_user';
import { TModelType } from '../models/models-index';
import { hashPassword } from '../../middleware/features/auth';
import { getDBConnection } from '../connector';

const logger = getLogger(module.filename);
const PARAMS = Object.freeze({
  EXECUTED_FROM_CLI: 'executedFromCLI',
  CLEAN_ALL_BEFORE: 'cleanAllBefore',
  JSON_FILE_PATH: {
    PRODUCTS: 'productsInputPath',
    USERS: 'usersInputPath',
  },
});
const DEFAULT_PARAMS = Object.freeze({
  [PARAMS.CLEAN_ALL_BEFORE]: 'true',
  [PARAMS.JSON_FILE_PATH.PRODUCTS]: './initial-products.json',
  [PARAMS.JSON_FILE_PATH.USERS]: './initial-users.json',
});

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

type TPopulatedData = Record<string, unknown>;

logger.log('process.argv:', process.argv);

if (!getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS)) {
  throw ReferenceError(`CLI argument "${PARAMS.JSON_FILE_PATH.PRODUCTS}" must be provided as non empty string`);
}

const doPopulate = async () => {
  const dbConnection = await getDBConnection();

  if (!dbConnection || dbConnection instanceof Error) {
    throw TypeError(`Database Population is not possible due to a problem with connection: \n${dbConnection}\n.`);
  }

  if (getScriptParamStringValue(PARAMS.CLEAN_ALL_BEFORE) === 'true') {
    const removedData = await Promise.all(
      [
        { name: 'products', ctor: ProductModel },
        { name: 'users', ctor: UserModel },
      ].map(async ({ name, ctor }) => {
        // @ts-ignore
        const deletionRes = await ctor.deleteMany({});
        return `\n-${name}: ${deletionRes.deletedCount}`;
      })
    );

    logger.log(`Cleaning done. Removed: ${removedData}`);
  }

  if (getScriptParamStringValue(PARAMS.JSON_FILE_PATH.PRODUCTS)) {
    const productsSourceDataList = getSourceData('Product');
    await populateProducts(ProductModel, productsSourceDataList);
    await updateRelatedProductsNames(ProductModel, productsSourceDataList);
  }

  if (getScriptParamStringValue(PARAMS.JSON_FILE_PATH.USERS)) {
    const usersSourceDataList = getSourceData('User');
    await populateUsers(UserModel, usersSourceDataList);
  }

  const populationResults = {
    productsAmount: await ProductModel.find({}).countDocuments(),
    usersAmount: await UserModel.find({}).countDocuments(),
  };

  logger.log(
    'Population results:',
    '\n\t- products amount:',
    populationResults.productsAmount,
    '\n\t\t- relatedProductsErrors:',
    relatedProductsErrors,
    '\n\t- users amount:',
    populationResults.usersAmount
  );

  /*
    TODO: [DataBase - optimalization] ensure if it's necessary to close a connection after data population.
    If closure is done on the same connection instance as the app relies on, 
    then at least connection initiator should be checked before deciding whether to close it, 
    to avoid closing connection for the entire app.
  */
  // await dbConnection.close();

  return Object.values(populationResults).every(Boolean);
};

if (getScriptParamStringValue(PARAMS.EXECUTED_FROM_CLI)) {
  doPopulate();
}

function getSourceData(modelType: TModelType): TPopulatedData[] {
  const normalizedModelType = `${modelType.toUpperCase()}S` as `${Uppercase<Exclude<TModelType, 'User-Role'>>}S`;
  const sourceDataPath = getScriptParamStringValue(PARAMS.JSON_FILE_PATH[normalizedModelType]);

  if (!sourceDataPath) {
    throw ReferenceError(
      `Path to data for "${modelType}" was not provided! You must pass "${PARAMS.JSON_FILE_PATH[normalizedModelType]}" parameter.`
    );
  }

  console.log('[getSourceData()] /sourceDataPath:', sourceDataPath);
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
  ProductModel: Model<IProduct>,
  productsSourceDataList: TPopulatedData[]
): Promise<IProduct[]> {
  return Promise.all(
    productsSourceDataList.map((data: TPopulatedData) => {
      const product = new ProductModel(data) as IProduct;
      product.set('relatedProductsNames', undefined);

      return product.save().catch((err) => {
        logger.error('product save err:', err, ' /data:', data);

        return err;
      });
    })
  );
}

function populateUsers(UserModel: Model<IUser>, usersSourceDataList: TPopulatedData[]): Promise<IUser[]> {
  return Promise.all(
    usersSourceDataList.map(async (data: TPopulatedData) => {
      data.password = await hashPassword(data.password as string);
      const user = new UserModel(data) as IUser;

      return user.save().catch((err) => {
        logger.error('user save err:', err, ' /data:', data);

        return err;
      });
    })
  );
}

function updateRelatedProductsNames(
  ProductModel: Model<IProduct>,
  sourceDataList: TPopulatedData[]
): Promise<Array<IProduct | void>> {
  return Promise.all(
    sourceDataList.map((data: TPopulatedData) => {
      return ProductModel.updateOne(
        { name: data.name as string },
        { relatedProductsNames: data.relatedProductsNames as string[] },
        { runValidators: true }
      ).catch((error) => {
        logger.error(error);
        relatedProductsErrors++;
      });
    })
  );
}

function getScriptParamStringValue(paramName: string) {
  const paramValue = process.argv.find((arg: string) => arg.includes(paramName)) ?? DEFAULT_PARAMS[paramName];

  console.log('[getScriptParamValue()] /paramName:', paramName, '/paramValue:', paramValue);

  return paramValue ? paramValue.split('=').pop() : '';
}

export { doPopulate };
