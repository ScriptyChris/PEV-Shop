// @ts-ignore
import Express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { Application } from 'express';
import getLogger from '../../utils/logger';
// @ts-ignore
import glob from 'glob';
// @ts-ignore
import bodyParser from 'body-parser';
import { resolve, sep } from 'path';
import { existsSync } from 'fs';
import apiConfig from './routes/api-config';
import apiProducts from './routes/api-products';
import apiProductCategories from './routes/api-product-categories';
import apiUsers from './routes/api-users';
import apiUserRoles from './routes/api-user-roles';
import apiOrders from './routes/api-orders';
import * as dotenv from 'dotenv';
import { HTTP_STATUS_CODE } from '../types';
import { wrapRes } from '../middleware/helpers/middleware-response-wrapper';
import { getPopulationState } from '../database/connector';

// @ts-ignore
dotenv.default.config();

const logger = getLogger(module.filename);
const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

// TODO: [SECURITY] https://expressjs.com/en/advanced/best-practice-security.html
const middleware = (app: Application): void => {
  app.use(bodyParser.json());
  app.use(apiConfig, apiProducts, apiProductCategories, apiUsers, apiUserRoles, apiOrders);

  app.get('/images/*', (req: Request, res: Response) => {
    const imagePath = req.url.split('/').pop() as string;

    getImage(imagePath)
      .then((image) => res.sendFile(image))
      .catch((error) => {
        logger.log('Image searching error: ', error, ' /imagePath: ', imagePath);

        return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND).end();
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
  app.use(function handleDatabaseReadiness(req: Request, res: Response, next: NextFunction) {
    const isDatabaseReady = getPopulationState();

    if (!isDatabaseReady && req.url !== '/api/populate-db') {
      return res.status(HTTP_STATUS_CODE.SERVICE_UNAVAILABLE).send(
        `
          <p><strong>Database is not ready yet!</strong></p>
          <p>Data population process should happen automatically at app's first startup (if you launch it via Docker) and lasts just a moment.</p>
          <p>If you still see this error after a longer while, perhaps you need to run population manually? Check for <code>populate-db</code> npm script.</p>
        `.trim()
      );
    }

    next();
  }, Express.static(frontendPath));

  middleware(app);

  // TODO: [REFACTOR] this probably should detect what resource the URL wants and maybe not always return index.html
  app.use('/', (req: Request, res: Response) => {
    console.log('global (404?) req.url:', req.url);

    return res.sendFile(`${frontendPath}/index.html`);
  });
  app.listen(process.env.APP_PORT, () => {
    logger.log(`Server is listening on port ${process.env.APP_PORT}`);
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
