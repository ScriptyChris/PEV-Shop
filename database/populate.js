const { connect, model, connection } = require('mongoose');
const productSchema = require('./schemas/product');
const { sep } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

let { readFile, readFileSync } = require('fs');
readFile = promisify(readFile);

const PARAMS = {
  CLEAN_ALL: 'cleanAll=true',
  GROUP_CATEGORIES: 'categoriesGroupPath=',
};

console.log('process.argv:', process.argv);

(async () => {
  await connectToDB();
  const Product = getProductModel();

  if (getScriptParamValue(PARAMS.CLEAN_ALL)) {
    const removedProducts = await Product.deleteMany();
    console.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList = await getSourceData();

  await populateProducts(Product, sourceDataList);

  connection.close();
})();

function connectToDB() {
  // TODO: move to ENV
  const databaseURL = 'mongodb://localhost:27017';

  return connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function getProductModel() {
  return model('Product', productSchema);
}

async function getSourceData() {
  const path = process.argv[2];

  if (!path) {
    return Promise.reject('Path to source data must be provided as a first argument!');
  }

  const fileName = process.argv[3];
  const isFileInPath = path.endsWith('.json');

  if (!isFileInPath && (!fileName || fileName === PARAMS.CLEAN_ALL)) {
    return Promise.reject(
      'If file name is not included in path as first argument, it must be provided separately - as second argument!'
    );
  }

  const sourceDataPath = isFileInPath ? path : `${path}${sep}**${sep}${fileName}.json`;
  const sourceDataFiles = await glob(sourceDataPath);
  const sourceDataList = await Promise.all(
    sourceDataFiles.map(async (filePath) => JSON.parse(await readFile(filePath, { encoding: 'utf8' })))
  );

  console.log('Got sourceDataList from sourceDataPath:', sourceDataPath);

  return sourceDataList;
}

async function populateProducts(ProductModel, sourceDataList) {
  const normalizersObj = {
    category: categoryNameGrouper(),
  };

  return Promise.all(
    sourceDataList.map((data) => {
      const product = new ProductModel(normalizeData(data, normalizersObj));
      return product.save();
    })
  );

  function normalizeData(data, normalizersObj) {
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

  function categoryNameGrouper() {
    const categoriesGroupPath = getScriptParamValue(PARAMS.GROUP_CATEGORIES, true);
    const categoryRegExps = JSON.parse(readFileSync(categoriesGroupPath.split('=').pop(), { encoding: 'utf8' }));

    if (categoriesGroupPath) {
      return (categoryName) => {
        const matchedRegExp = categoryRegExps.find(
          (regExp) => typeof regExp.matcher === 'string' && new RegExp(regExp.matcher).test(categoryName)
        );

        if (matchedRegExp) {
          return categoryName.replace(new RegExp(matchedRegExp.matcher), matchedRegExp.replacer);
        }

        return categoryName;
      };
    }

    return (categoryName) => categoryName;
  }
}

function getScriptParamValue(param, lenientSearch) {
  return process.argv.find((arg) => {
    if (lenientSearch) {
      return arg.includes(param);
    }

    return arg === param;
  });
}
