// @ts-ignore
import Express from 'express';
import { Application } from 'express';
import getLogger from '../../utils/logger';
// @ts-ignore
import glob from 'glob';
// @ts-ignore
import bodyParser from 'body-parser';
import { resolve, sep } from 'path';
import { existsSync } from 'fs';
import apiProducts from './routes/api-products';
import apiProductCategories from './routes/api-product-categories';
import apiUsers from './routes/api-users';
import apiUserRoles from './routes/api-user-roles';
import apiOrders from './routes/api-orders';
import * as dotenv from 'dotenv';

// @ts-ignore
dotenv.default.config();

const logger = getLogger(module.filename);
const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

const middleware = (app: Application): void => {
  app.use(bodyParser.json());
  app.use(apiProducts, apiProductCategories, apiUsers, apiUserRoles, apiOrders);

  app.get('/images/*', (req, res) => {
    const imagePath = req.url.split('/').pop() as string;

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

if (process.env.BACKEND_ONLY === 'true') {
  if (!existsSync(getFrontendPath())) {
    console.error(`App's frontend is not available! Build it first.`);
  }

  wrappedMiddleware();
}

export default middleware;

function wrappedMiddleware(): void {
  const frontendPath = getFrontendPath();

  const app: Application = Express();
  app.use(Express.static(frontendPath));

  middleware(app);

  // TODO: [REFACTOR] this probably should detect what resource the URL wants and maybe not always return index.html
  app.use('/', (req, res) => {
    console.log('global (404?) req.url:', req.url);

    res.sendFile(`${frontendPath}/index.html`);
  });
  app.listen(process.env.PORT, () => {
    logger.log(`Server is listening on port ${process.env.PORT}`);
  });
}

function getFrontendPath(): string {
  const relativeDist = __dirname.includes(`${sep}dist${sep}`) ? '' : 'dist/';
  return resolve(__dirname, `../../${relativeDist}src/frontend`);
}

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
  };
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
