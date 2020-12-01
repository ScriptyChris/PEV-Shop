const { connect, model, connection } = require('mongoose');
const productSchema = require('./schemas/product');
const { sep } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const readFile = promisify(require('fs').readFile);

console.log('process.argv', process.argv);

(async () => {
  await connectToDB();
  const Product = getProductModel();

  if (shouldCleanAllProductsBeforePopulation()) {
    const removedProducts = await Product.remove();
    console.log(`Cleaning done - removed ${removedProducts.deletedCount} products.`);
  }

  const sourceDataList = await getSourceData();
  // console.log('sourceData', sourceDataList);

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
  return model('Full-Product', productSchema);
}

async function getSourceData() {
  const path = process.argv[2];

  if (!path) {
    return Promise.reject('Path to source data must be provided as a first argument!');
  }

  const fileName = process.argv[3];
  const isFileInPath = path.endsWith('.json');

  if (!isFileInPath && !fileName) {
    return Promise.reject('If file name is not included in path as first argument, it must be provided separately - as second argument!');
  }

  const sourceDataPath = isFileInPath ? path : `${path}${sep}**${sep}${fileName}.json`;
  const sourceDataFiles = (await glob(sourceDataPath)/**/).slice(22, 33);
  const sourceDataList = await Promise.all(
      sourceDataFiles.map(async filePath => JSON.parse(await readFile(filePath, { encoding: 'utf8' })))
  );

  return sourceDataList;
}

function shouldCleanAllProductsBeforePopulation() {
  return process.argv.includes('cleanAll=true');
}

async function populateProducts(ProductModel, sourceDataList) {
  return Promise.all(
      sourceDataList.map((data) => {
        const product = new ProductModel(normalizeData(data));
        return product.save();
      })
  );

  function normalizeData(data) {
    const normalizedData = {
      ...data,
      name: data.nameAndCategory.name,
      category: data.nameAndCategory.category.name,
    };

    delete normalizedData.nameAndCategory;

    if (data.reviews[0] === null) {
      normalizedData.reviews = {
        summary: {},
        list: []
      }
    } else {
      normalizedData.reviews = {
        summary: data.reviews[0],
        list: data.reviews.slice(1)
      }
    }

    return normalizedData;
  }
}
