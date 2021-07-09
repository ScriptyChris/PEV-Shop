//db.getCollection('products').find({},{_id:0, __v:0, technicalSpecs: 0, 'relatedProducts.id': 0, 'reviews._id': 0}).toArray()

// cross-env TS_NODE_PROJECT=../../../tsconfig.backend.json node --inspect-brk -r ts-node/register populate.ts -
// -products=trialProducts.json categoryGroups=categoryGroups.json singleProduct cleanAll

import getLogger from '../../../utils/logger';
import { connect, model, connection } from 'mongoose';
import productSchema, { IProduct } from '../schemas/product';
import { TGenericModel } from '../models/models-index';
import * as dotenv from 'dotenv';

// @ts-ignore
const envVar = dotenv.default.config({ path: '../../../.env' }); // ../

const logger = getLogger(module.filename);

const PARAMS: { CLEAN_ALL: string; PRODUCTS_JSON_FILE_PATH: string } = Object.freeze({
  CLEAN_ALL: 'cleanAll',
  PRODUCTS_JSON_FILE_PATH: 'productsJSONFilePath=',
});

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

  const Product: TGenericModel = getProductModel();

  if (getScriptParamValue(PARAMS.CLEAN_ALL)) {
    const removedProducts = await Product.deleteMany({});
    logger.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList = getSourceData() as TPopulatedData[];
  await populateProducts(Product, sourceDataList);

  logger.log('Products amount after population:', await Product.find({}).countDocuments());

  await assignIDsToRelatedProducts(Product);

  await connection.close();
})();

function connectToDB(): ReturnType<typeof connect> {
  return connect(process.env.DATABASE_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function getProductModel(): TGenericModel {
  return model('Product', productSchema);
}

function getSourceData(): TPopulatedData[] | ReferenceError {
  const sourceDataPath: string = getScriptParamValue(PARAMS.PRODUCTS_JSON_FILE_PATH);

  if (!sourceDataPath) {
    throw ReferenceError(`Path to data was not provided! You must pass "${PARAMS.PRODUCTS_JSON_FILE_PATH}" parameter.`);
  }

  const sourceDataFiles = /* eslint-disable-line  @typescript-eslint/no-var-requires */ require(sourceDataPath);
  // logger.log('Got sourceDataList from sourceDataPath:', sourceDataPath);

  if (Array.isArray(sourceDataFiles)) {
    return sourceDataFiles;
  }

  try {
    return JSON.parse(sourceDataFiles);
  } catch (parseError) {
    logger.error('parseError:', parseError, ' for data taken from sourceDataPath:', sourceDataPath);

    throw parseError;
  }
}

function populateProducts(ProductModel: TGenericModel, sourceDataList: TPopulatedData[]) {
  if (!Array.isArray(sourceDataList)) {
    sourceDataList = [sourceDataList];
  }

  return Promise.all(
    sourceDataList.map((data: any, index: number) => {
      const product = new ProductModel(data) as IProduct;

      // @ts-ignore
      return product.save().catch((err) => {
        logger.error('save err:', err, ' /data:', data);

        return err;
      });
    })
  );
}

async function assignIDsToRelatedProducts(Product: TGenericModel) {
  const productsHavingRelatedProducts = Product.find({ relatedProducts: { $ne: [] } });

  for await (const withRelated of productsHavingRelatedProducts) {
    // @ts-ignore
    for (const relatedProductToUpdate of withRelated.relatedProducts) {
      const relatedProduct = await Product.findOne(
        { url: relatedProductToUpdate.url, name: relatedProductToUpdate.name },
        ['url', '_id']
      );

      if (relatedProduct) {
        await Product.updateMany(
          // @ts-ignore
          { 'relatedProducts.url': relatedProduct.url },
          // @ts-ignore
          { $set: { 'relatedProducts.$.id': relatedProduct._id } }
        );
      }
    }
  }

  const amountOfAllProducts = await Product.find({}).countDocuments();
  const amountOfRelatedProductsWithID = await Product.find({
    'relatedProducts.id': { $exists: true },
  }).countDocuments();

  logger.log(
    'All done?:',
    amountOfAllProducts === amountOfRelatedProductsWithID,
    ' /amountOfAllProducts:',
    amountOfAllProducts,
    ' /amountOfRelatedProductsWithID:',
    amountOfRelatedProductsWithID
  );
}

function getScriptParamValue(param: string): string {
  const paramValue = process.argv.find((arg: string) => arg.includes(param));

  return paramValue ? (paramValue.split('=').pop() as string) : '';
}
