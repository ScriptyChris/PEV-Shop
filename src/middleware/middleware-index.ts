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
import { resolve, sep, join } from 'path';
import { existsSync } from 'fs';
import apiConfig from './routes/api-config';
import apiProducts from './routes/api-products';
import apiProductCategories from './routes/api-product-categories';
import apiUsers from './routes/api-users';
import apiUserRoles from './routes/api-user-roles';
import apiOrders from './routes/api-orders';
import { HTTP_STATUS_CODE } from '@commons/types';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { getPopulationState } from '@database/connector';
import { dotEnv } from '@commons/dotEnvLoader';
import { possiblyReEncodeURI } from '@commons/uriReEncoder';
import { IMAGES_ROOT_PATH } from '@root/commons/consts';

const logger = getLogger(module.filename);

// TODO: [SECURITY] https://expressjs.com/en/advanced/best-practice-security.html
const middleware = (app: Application): void => {
  const API_MIDDLEWARES = [apiConfig, apiProducts, apiProductCategories, apiUsers, apiUserRoles, apiOrders];

  app.use(json());
  app.use(API_MIDDLEWARES);
  app.get(...imageHandler());
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
    // TODO: inspect what's /sockjs-node/ path
    if (req.url.startsWith('/sockjs-node/')) {
      return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
    }

    logger.log('global (404?) req.url:', req.url);

    return res.sendFile(`${frontendPath}/index.html`);
  });
  app.listen(dotEnv.APP_PORT, () => logger.log(`Server is listening on port ${dotEnv.APP_PORT}`));
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

function imageHandler() {
  // TODO: change string type to probably ArrayBuffer
  const getImage = (() => {
    const imageCache: { [prop: string]: string } = {};
    const projectRoot = resolve(__dirname, rootRelativePath);
    const imagesFolder = join(projectRoot, IMAGES_ROOT_PATH);

    return async (fileName: string) => {
      const cachedImage = imageCache[fileName];

      if (cachedImage) {
        return cachedImage;
      }

      const [image] = await findFileRecursively(`${imagesFolder}/${fileName}`);
      imageCache[fileName] = image;

      return image;
    };
  })();

  return [
    `/${IMAGES_ROOT_PATH}/*`,
    (req: Request, res: Response) => {
      const imagePath = globalThis.decodeURIComponent(possiblyReEncodeURI(req.url.split('/').slice(3).join('/')));

      getImage(imagePath)
        .then((image) => res.sendFile(image))
        .catch((error) => {
          logger.log('Image searching error: ', error, ' /imagePath: ', imagePath);

          return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND).end();
        });
    },
  ] as const;
}

function findFileRecursively(fileName: string) {
  return new Promise<string[]>((resolve, reject) => {
    // TODO: wrap it with util.promisify and handle error case typing
    glob(fileName, (err: Error | null, files: string[]) => {
      if (err || !files.length) {
        reject(err || 'No files found!');
        return;
      }

      resolve(files);
    });
  });
}
