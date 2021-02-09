import getLogger from '../../utils/logger'
import { connect, model, connection } from 'mongoose';
import productSchema from './schemas/product';
import { TGenericModel } from './models/models-index';
import { sep } from 'path';
import { promisify } from 'util';
import * as G from 'glob';

const glob = promisify(G.glob);
const logger = getLogger(module.filename);

let { readFile, readFileSync } = require('fs');
readFile = promisify(readFile);

const PARAMS: { CLEAN_ALL: string, GROUP_CATEGORIES: string } = {
  CLEAN_ALL: 'cleanAll=true',
  GROUP_CATEGORIES: 'categoriesGroupPath=',
};

logger.log('process.argv:', process.argv);

(async () => {
  await connectToDB();

  const Product: TGenericModel = getProductModel();

  if (getScriptParamValue(PARAMS.CLEAN_ALL)) {
    const removedProducts = await Product.deleteMany({});
    logger.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList: Object[] = await getSourceData();

  await populateProducts(Product, sourceDataList);
  await assignIDsToRelatedProducts(Product);

  await connection.close();
})();

function connectToDB() {
  // TODO: move to ENV
  const databaseURL = 'mongodb://localhost:27017';

  return connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function getProductModel(): TGenericModel {
  return model('Product', productSchema);
}

async function getSourceData(): Promise<Object[]> {
  const path: string = process.argv[2];

  if (!path) {
    return Promise.reject('Path to source data must be provided as a first argument!');
  }

  const fileName: string = process.argv[3];
  const isFileInPath = path.endsWith('.json');

  if (!isFileInPath && (!fileName || fileName === PARAMS.CLEAN_ALL)) {
    return Promise.reject(
      'If file name is not included in path as first argument, it must be provided separately - as second argument!'
    );
  }

  const sourceDataPath: string = isFileInPath ? path : `${path}${sep}**${sep}${fileName}.json`;
  const sourceDataFiles: string[] = await glob(sourceDataPath) as string[];
  const sourceDataList: Object[] = await Promise.all(
    sourceDataFiles.map(async (filePath: string) => JSON.parse(await readFile(filePath, { encoding: 'utf8' })))
  );

  logger.log('Got sourceDataList from sourceDataPath:', sourceDataPath);

  return sourceDataList;
}

async function populateProducts(ProductModel: TGenericModel, sourceDataList: Object[]) {
  type TCategoryNameGrouper = (categoryName: string) => string
  type TNormalizersObj = { category: TCategoryNameGrouper }

  const normalizersObj: TNormalizersObj = {
    category: categoryNameGrouper(),
  };

  return Promise.all(
    sourceDataList.map((data) => {
      const product = new ProductModel(normalizeData(data, normalizersObj));
      // @ts-ignore
      return product.save();
    })
  );

  function normalizeData(data: any, normalizersObj: TNormalizersObj) {
    const normalizedData = {
      ...data,
      category: normalizersObj.category(data.category),
    };

    const isAnyReview = data.reviews[0] !== null;

    normalizedData.reviews = {
      summary: isAnyReview ? data.reviews[0] : { summary: '', reviewsAmount: 0 },
      list: isAnyReview ? data.reviews.slice(1) : [],
    };

    return normalizedData;
  }

  function categoryNameGrouper(): TCategoryNameGrouper {
    type CustomRegExp = RegExp & { matcher: string, replacer: string };

    const categoriesGroupPath: string = getScriptParamValue(PARAMS.GROUP_CATEGORIES, true);
    const categoryRegExps: CustomRegExp[] = JSON.parse(readFileSync(categoriesGroupPath.split('=').pop(), { encoding: 'utf8' }));

    if (categoriesGroupPath) {
      return (categoryName: string) => {
        const matchedRegExp: CustomRegExp | undefined = categoryRegExps.find(
          (regExp ) => typeof regExp.matcher === 'string' && new RegExp(regExp.matcher).test(categoryName)
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

      await Product.updateMany(
          // @ts-ignore
        { 'relatedProducts.url': relatedProduct.url },
          // @ts-ignore
        { $set: { 'relatedProducts.$.id': relatedProduct._id } }
      );
    }
  }

  const amountOfAllProducts = await Product.find({}).countDocuments();
  const amountOfRelatedProductsWithID = await Product.find({
    'relatedProducts.id': { $exists: true },
  }).countDocuments();

  logger.log('All done?', amountOfAllProducts === amountOfRelatedProductsWithID);
}

function getScriptParamValue(param: string, lenientSearch: boolean = false): string {
  return process.argv.find((arg: string) => {
    if (lenientSearch) {
      return arg.includes(param);
    }

    return arg === param;
  }) || '';
}
