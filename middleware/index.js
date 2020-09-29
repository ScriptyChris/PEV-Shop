const glob = require('glob');
const bodyParser = require('body-parser');
const apiProducts = require('./routes/api-products');
const apiUsers = require('./routes/api-users');

const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

const middleware = (app) => {
  app.use(bodyParser.json());
  app.use(apiProducts, apiUsers);

  app.get('/images/*', (req, res) => {
    const imagePath = req.url.split('/').pop();

    getImage(imagePath)
      .then((image) => {
        res.sendFile(image);
      })
      .catch((error) => {
        console.log('Image searching error: ', error, ' /imagePath: ', imagePath);

        res.status(404).end();
      });
  });
};

// TODO: refactor to use ENV
if (process.env.NODE_ONLY === 'true') {
  const app = require('express')();
  const port = 3000;

  middleware(app);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

module.exports = middleware;

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
