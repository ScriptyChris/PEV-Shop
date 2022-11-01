/*
  This module is located under `/dist` folder at runtime, but at "author time" (TypeScript compilation) 
  no `/dist` wrapper is up there - during unit tests, this module is ran as TypeScript by Jest. 
  Thus, two possible "root climbs" occur and such root relative path needs to be dynamically calculated. 
  Because ESM doesn't support synchronous static paths from variables, CJS `require(..)` is used. 
  Root relative path is calculated using `path.relative(..)`.
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rootRelativePath = require('path').relative(__dirname, process.env.INIT_CWD);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`${rootRelativePath}/commons/moduleAliasesResolvers`).backend();

import Express, { Request, Response, NextFunction, Application, json } from 'express';
import getLogger from '@commons/logger';
import glob from 'glob';
import { resolve, sep } from 'path';
import { existsSync } from 'fs';
import apiConfig from './routes/api-config';
import apiProducts from './routes/api-products';
import apiProductCategories from './routes/api-product-categories';
import apiUsers from './routes/api-users';
import apiUserRoles from './routes/api-user-roles';
import apiOrders from './routes/api-orders';
import { HTTP_STATUS_CODE } from '@src/types';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { getPopulationState } from '@database/connector';
import { dotEnv } from '@commons/dotEnvLoader';

const logger = getLogger(module.filename);
const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

// TODO: [SECURITY] https://expressjs.com/en/advanced/best-practice-security.html
const middleware = (app: Application): void => {
  app.use(json());
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
    logger.error(`App's frontend is not available! Build it first.`);
  }

  wrappedMiddleware();
}

export default middleware;

function wrappedMiddleware(): void {
  const frontendPath = getFrontendPath();

  const app: Application = Express();
  app.use(getDatabaseReadinessHandler(), Express.static(frontendPath));

  middleware(app);

  // TODO: [REFACTOR] this probably should detect what resource the URL wants and maybe not always return index.html
  app.use('/', (req: Request, res: Response) => {
    logger.log('global (404?) req.url:', req.url);

    return res.sendFile(`${frontendPath}/index.html`);
  });
  app.listen(dotEnv.APP_PORT, () => {
    logger.log(`Server is listening on port ${dotEnv.APP_PORT}`);
  });
}

function getDatabaseReadinessHandler() {
  let isDatabaseReady = false;

  return async function handleDatabaseReadiness(req: Request, res: Response, next: NextFunction) {
    if (!isDatabaseReady) {
      isDatabaseReady = await getPopulationState();
      logger.log('handleDatabaseReadiness() isDatabaseReady:', isDatabaseReady);

      if (isDatabaseReady) {
        return next();
      }

      if (req.url !== '/api/populate-db') {
        return res.status(HTTP_STATUS_CODE.SERVICE_UNAVAILABLE).send(
          `
            <p><strong>Database is not ready yet!</strong></p>
            <p>Data population process should happen automatically at app's first startup (if you launch it via Docker) and lasts just a moment.</p>
            <p>If you still see this error after a longer while, perhaps you need to run population manually? Check for <code>populate-db</code> npm script.</p>
          `.trim()
        );
      }
    }

    return next();
  };
}

function getFrontendPath(): string {
  const relativeDist = __dirname.includes(`${sep}dist${sep}`) ? '' : 'dist/';
  return resolve(__dirname, `../../${relativeDist}src/frontend`);
}

// TODO: change string type to probably ArrayBuffer
const getImage = (() => {
  const imageCache: { [prop: string]: string } = {};

  return (fileName: string) => {
    const cachedImage = imageCache[fileName];

    if (!cachedImage) {
      return findFileRecursively(fileName).then(([image]) => {
        imageCache[fileName] = image;

        return image;
      });
    }

    return Promise.resolve(cachedImage);
  };
})();

function findFileRecursively(fileName: string) {
  return new Promise<string[]>((resolve, reject) => {
    // TODO: wrap it with util.promisify and handle error case typing
    glob(`${databaseDirname}/web-scraped/images/**/${fileName}`, (err: Error | null, files: string[]) => {
      if (err || !files.length) {
        reject(err || 'No files found!');
        return;
      }

      resolve(files);
    });
  });
}
