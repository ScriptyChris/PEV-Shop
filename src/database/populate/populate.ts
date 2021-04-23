// cross-env TS_NODE_PROJECT=../../../tsconfig.backend.json node --inspect-brk -r ts-node/register populate.ts -
// -products=trialProducts.json categoryGroups=categoryGroups.json singleProduct cleanAll

import getLogger from '../../../utils/logger';
import { connect, model, connection } from 'mongoose';
import productSchema from '../schemas/product';
import { TGenericModel } from '../models/models-index';
import { promisify } from 'util';
import * as G from 'glob';
import { readFile, readFileSync } from 'fs';
import * as dotenv from 'dotenv';

// @ts-ignore
const envVar = dotenv.default.config({ path: '../../../../.env' });

const glob = promisify(G.glob);
const logger = getLogger(module.filename);
const promisifiedReadFile = promisify(readFile);

const PARAMS: { CLEAN_ALL: string; PRODUCTS: string; SINGLE_PRODUCT: string; CATEGORY_GROUPS: string } = {
  CLEAN_ALL: 'cleanAll',
  PRODUCTS: 'products=',
  SINGLE_PRODUCT: 'singleProduct',
  CATEGORY_GROUPS: 'categoryGroups=',
};

type TPopulatedData = Record<any, unknown>;

logger.log('process.argv:', process.argv);
// @ts-ignore
logger.log(
  '? envVar:',
  envVar,
  ' /__dirname:',
  __dirname,
  ' /INIT_CWD:',
  process.env.INIT_CWD,
  ' /require.main.filename:',
  require && require.main && require.main.filename
);

(async () => {
  await connectToDB();

  const Product: TGenericModel = getProductModel();

  if (getScriptParamValue(PARAMS.CLEAN_ALL)) {
    const removedProducts = await Product.deleteMany({});
    logger.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList = await getSourceData();

  await populateProducts(Product, sourceDataList);

  logger.log('products after population:', await Product.find({}).countDocuments());

  await assignIDsToRelatedProducts(Product);

  await connection.close();
})();

function connectToDB() /*: Promise<void>*/ {
  logger.log('???? process.env.DATABASE_URL:', process.env.DATABASE_URL);

  return connect(process.env.DATABASE_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function getProductModel(): TGenericModel {
  return model('Product', productSchema);
}

async function getSourceData(): Promise<TPopulatedData | TPopulatedData[]> {
  const sourceDataPath: string = getScriptParamValue(PARAMS.PRODUCTS);

  if (!sourceDataPath) {
    return Promise.reject(`Path to data was not provided! You must pass "${PARAMS.PRODUCTS}" parameter.`);
  }

  // if (/*!isFileInPath && */(!fileName || fileName === PARAMS.CLEAN_ALL)) {
  //     return Promise.reject(
  //         'If file name is not included in path as first argument, it must be provided separately - as second argument!'
  //     );
  // }

  //const sourceDataPath: string =  // isFileInPath ? path : `${path}${sep}**${sep}${fileName}.json`;
  logger.log('Got sourceDataList from sourceDataPath:', sourceDataPath);
  const sourceDataFiles = (await glob(sourceDataPath)) as string[];

  if (getScriptParamValue(PARAMS.SINGLE_PRODUCT)) {
    return JSON.parse(await promisifiedReadFile(sourceDataFiles[0], { encoding: 'utf8' })) as TPopulatedData;
  }

  const sourceDataList: Promise<TPopulatedData>[] = sourceDataFiles.map(async (filePath: string) =>
    JSON.parse(await promisifiedReadFile(filePath, { encoding: 'utf8' }))
  );

  return Promise.all(sourceDataList);
}

async function populateProducts(ProductModel: TGenericModel, sourceDataList: TPopulatedData | TPopulatedData[]) {
  type TCategoryNameGrouper = (categoryName: string) => string;
  type TNormalizersObj = { category: TCategoryNameGrouper };

  const normalizersObj: TNormalizersObj = {
    category: categoryNameGrouper(),
  };

  if (!Array.isArray(sourceDataList)) {
    sourceDataList = [sourceDataList];
  }

  return Promise.all(
    sourceDataList.map((data: any) => {
      const product = new ProductModel(normalizeData(data, normalizersObj));
      // @ts-ignore
      return product.save().catch((err) => {
        // console.error('save err:', err, ' /data:', data);

        return err;
      });
    })
  );

  function normalizeData(data: any, normalizersObj: TNormalizersObj) {
    const normalizedData = {
      ...data,
      category: normalizersObj.category(data.category),
    };

    if (Array.isArray(data.reviews)) {
      const isAnyReview = data.reviews && data.reviews[0] !== null;
      normalizedData.reviews = {
        summary: isAnyReview ? data.reviews[0] : { rating: '', reviewsAmount: 0 },
        list: isAnyReview ? data.reviews.slice(1) : [],
      };
    } else {
      normalizedData.reviews = data.reviews;
    }

    return normalizedData;
  }

  function categoryNameGrouper(): TCategoryNameGrouper {
    type CustomRegExp = RegExp & { matcher: string; replacer: string };

    const categoriesGroupPath: string = getScriptParamValue(PARAMS.CATEGORY_GROUPS);
    const categoryRegExps: CustomRegExp[] = JSON.parse(readFileSync(categoriesGroupPath, { encoding: 'utf8' }));

    if (categoriesGroupPath) {
      return (categoryName: string) => {
        const matchedRegExp: CustomRegExp | undefined = categoryRegExps.find(
          (regExp) => typeof regExp.matcher === 'string' && new RegExp(regExp.matcher).test(categoryName)
        );

        if (matchedRegExp) {
          return categoryName.replace(new RegExp(matchedRegExp.matcher), matchedRegExp.replacer);
        }

        return categoryName;
      };
    }

    return (categoryName: string) => categoryName;
  }
}

async function assignIDsToRelatedProducts(Product: TGenericModel) {
  // temp1.forEach(product => {
  //   product.relatedProducts.every(rp => temp1.find(p => p.url === rp.url && p.name === rp.name)) && prods.push(product)
  // })

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
    'All done?',
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
