const { readFileSync } = require('fs');
const glob = require('glob');
const bodyParser = require('body-parser');
const { saveToDB } = require('../database/index');

const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
const productList = getProductList();

const middleware = (app) => {
  app.use(bodyParser.json());

  app.get('/api/products', (req, res) => {
    res.json(productList);
  });

  app.get('/images/*', (req, res) => {
    const imagePath = req.url.split('/').pop();

    getImage(imagePath)
      .then((image) => {
        res.sendFile(image);
      })
      .catch((error) => {
        console.log('Image searching error: ', error, ' /imagePath: ', imagePath);

        res.status(404);
        res.end();
      });
  });

  app.post('/api/products', async (req, res) => {
    console.log('req.body', req.body);

    try {
      const savedProduct = await saveToDB(req.body, 'product');

      console.log('Product saved', savedProduct);
    } catch (exception) {
      console.error('Saving product exception:', exception);

      res.status(500);
      res.end(JSON.stringify({ exception }));
    }

    res.status(200);
    res.end();
  });
};

module.exports = middleware;

function getProductList() {
  const [firstCategory] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));

  return firstCategory.products.map(({ name, url, price, images }) => {
    const image = '/images/' + images[0].imageSrc.split('/').pop();

    return { name, url, price, image };
  });
}

function getImage(fileName) {
  const cachedImage = getImage.cache[fileName];

  if (!cachedImage) {
    return findFileRecursively(fileName).then(([image]) => {
      getImage.cache[fileName] = image;

      return image;
    });
  }

  return Promise.resolve(cachedImage);
}
getImage.cache = {};

function findFileRecursively(fileName) {
  return new Promise((resolve, reject) => {
    glob(`${databaseDirname}/web-scraped/images/**/${fileName}`, (err, files) => {
      if (err || !files.length) {
        reject(err || 'No files found!');
        return;
      }

      resolve(files);
    });
  });
}
