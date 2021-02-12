// @ts-ignore
import Express from 'express';
import { Application } from 'express';

import getLogger from '../../utils/logger';
// @ts-ignore
import glob from 'glob';
import * as bodyParser from 'body-parser';
import apiProducts from './routes/api-products';
import apiProductCategories from './routes/api-product-categories';
import apiUsers from './routes/api-users';
import apiUserRoles from './routes/api-user-roles';

const logger = getLogger(module.filename);
const databaseDirname: string = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

const middleware = (app: Application) => {
  app.use(bodyParser.json());
  app.use(apiProducts, apiProductCategories, apiUsers, apiUserRoles);

  app.get('/images/*', (req, res) => {
    const imagePath = (req.url.split('/').pop() as string);

    getImage(imagePath)
      .then((image) => {
        res.sendFile(image);
      })
      .catch((error) => {
        logger.log('Image searching error: ', error, ' /imagePath: ', imagePath);

        res.status(404).end();
      });
  });
};

// TODO: refactor to use ENV
if (process.env.BACKEND_ONLY === 'true') {
  const app: Application = Express();
  const port: number = 3000;

  middleware(app);
  app.listen(port, () => {
    logger.log(`Server is listening on port ${port}`);
  });
}

module.exports = middleware;

// TODO: change string type to probably ArrayBuffer
const getImage = (() => {
  const imageCache: { [prop: string]: string } = {};

  return (fileName: string): Promise<string> => {
    const cachedImage: any = imageCache[fileName];

    if (!cachedImage) {
      // @ts-ignore
      return findFileRecursively(fileName).then(([image]) => {
        imageCache[fileName] = image;

        return image;
      });
    }

    return Promise.resolve(cachedImage);
  }
})();

function findFileRecursively(fileName: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // TODO: wrap it with util.promisify
    glob(`${databaseDirname}/web-scraped/images/**/${fileName}`, (err: Error | null, files: string[]) => {
      if (err || !files.length) {
        reject(err || 'No files found!');
        return;
      }

      resolve(files);
    });
  });
}
