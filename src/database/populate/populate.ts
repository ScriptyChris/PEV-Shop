//db.getCollection('products').find({},{_id:0, __v:0, technicalSpecs: 0, 'relatedProducts.id': 0, 'reviews._id': 0}).toArray()

// cross-env TS_NODE_PROJECT=../../../tsconfig.backend.json node --inspect-brk -r ts-node/register populate.ts -
// -products=trialProducts.json categoryGroups=categoryGroups.json singleProduct cleanAll

import getLogger from '../../../utils/logger';
import { connect, connection } from 'mongoose';
import { IProduct } from '../models/_product';
import getModel, { TGenericModel } from '../models/models-index';
import * as dotenv from 'dotenv';

// @ts-ignore
const envVar = dotenv.default.config({ path: '../../../.env' }); // ../
const logger = getLogger(module.filename);
const PARAMS: { CLEAN_ALL: string; PRODUCTS_JSON_FILE_PATH: string } = Object.freeze({
  CLEAN_ALL: 'cleanAll',
  PRODUCTS_JSON_FILE_PATH: 'productsJSONFilePath=',
});

let relatedProductsErrors = 0;

// TODO: move to product or category schema
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
// @ts-ignore
logger.log(
  'envVar:',
  envVar,
  ' /__dirname:',
  __dirname,
  ' /INIT_CWD:',
  process.env.INIT_CWD,
  ' /require.main.filename:',
  require && require.main && require.main.filename
);

if (!getScriptParamValue(PARAMS.PRODUCTS_JSON_FILE_PATH)) {
  throw ReferenceError(`CLI argument ${PARAMS.PRODUCTS_JSON_FILE_PATH} must be provided as non empty string`);
}

(async () => {
  await connectToDB();

  const Product: TGenericModel = getModel('Product');

  if (getScriptParamValue(PARAMS.CLEAN_ALL)) {
    const removedProducts = await Product.deleteMany({});
    logger.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList = getSourceData() as TPopulatedData[];
  await populateProducts(Product, sourceDataList);
  await updateRelatedProductsNames(Product, sourceDataList);

  logger.log(
    'Products amount after population:',
    await Product.find({}).countDocuments(),
    ' /relatedProductsErrors:',
    relatedProductsErrors
  );

  await connection.close();
})();

function connectToDB(): ReturnType<typeof connect> {
  return connect(process.env.DATABASE_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function getSourceData(): TPopulatedData[] | ReferenceError {
  const sourceDataPath: string = getScriptParamValue(PARAMS.PRODUCTS_JSON_FILE_PATH);

  if (!sourceDataPath) {
    throw ReferenceError(`Path to data was not provided! You must pass "${PARAMS.PRODUCTS_JSON_FILE_PATH}" parameter.`);
  }

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

function populateProducts(ProductModel: TGenericModel, sourceDataList: TPopulatedData[]): Promise<IProduct[]> {
  return Promise.all(
    sourceDataList.map((data: TPopulatedData) => {
      const product = new ProductModel(data) as IProduct;
      product.set('relatedProductsNames', undefined);

      return product.save().catch((err) => {
        logger.error('save err:', err, ' /data:', data);

        return err;
      });
    })
  );
}

function updateRelatedProductsNames(
  ProductModel: TGenericModel,
  sourceDataList: TPopulatedData[]
): Promise<Array<IProduct | void>> {
  return Promise.all(
    sourceDataList.map((data: TPopulatedData) => {
      return ProductModel.updateOne(
        { name: data.name },
        { relatedProductsNames: data.relatedProductsNames },
        { runValidators: true }
      ).catch((error) => {
        logger.error(error);
        relatedProductsErrors++;
      });
    })
  );
}

function getScriptParamValue(param: string): string {
  const paramValue = process.argv.find((arg: string) => arg.includes(param));

  return paramValue ? (paramValue.split('=').pop() as string) : '';
}
