/**
 * @module
 */

import getLogger from '@commons/logger';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import { resolve, join, relative } from 'path';
import { HTTP_STATUS_CODE, TAppSetup } from '@commons/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { executeDBPopulation } from '@database/populate/populate';
import { getPreviousAppResetTimestamp, getRemainingTimestampToNextAppReset } from '@commons/cyclicAppReset';
import { dotEnv } from '@commons/dotEnvLoader';

const logger = getLogger(module.filename);
const router: Router & Partial<{ _populateDB: typeof populateDB }> = Router();

router.get('/api/config/populate-db', populateDB);
router.get('/api/config/setup-data', getSetupData);
router.get('/api/config/welcome-data', getWelcomeDataHandler());
router.use(getMiddlewareErrorHandler(logger));

// expose for unit tests
router._populateDB = populateDB;

async function populateDB(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: [SECURITY] restrict access to localhost and probably require a password

    const dbPopulationResult = await executeDBPopulation(true);

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    console.error('populateDB() /exception:', exception);

    return next(exception);
  }
}

function getSetupData(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: TAppSetup = {
      emailServicePort: Number(dotEnv.EMAIL_HTTP_PORT),
      previousAppResetTimestamp: getPreviousAppResetTimestamp(),
      remainingTimestampToNextAppReset: getRemainingTimestampToNextAppReset(),
    };
    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload });
  } catch (exception) {
    return next(exception);
  }
}

function getWelcomeDataHandler() {
  type TTestUserCredentials = Partial<{ login: string; password: string }>[];
  let _exception: Error | undefined, disclaimerHTMLFile: string, testUsersCredentials: TTestUserCredentials;

  try {
    const rootRelativePath = relative(__dirname, String(process.env.INIT_CWD));
    const PROJECT_ROOT_ABSOLUTE_PATH = resolve(__dirname, rootRelativePath);

    disclaimerHTMLFile = readFileSync(
      join(PROJECT_ROOT_ABSOLUTE_PATH, '/src/frontend/assets/embedded/DISCLAIMER.html'),
      { encoding: 'utf8' }
    );
    testUsersCredentials = (
      JSON.parse(
        readFileSync(join(PROJECT_ROOT_ABSOLUTE_PATH, 'src/database/populate/initialData/users.json'), {
          encoding: 'utf8',
        })
      ) as TTestUserCredentials
    ).map(({ login, password }) => ({ login, password }));
  } catch (exception) {
    _exception = exception;
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (_exception) {
      return next(_exception);
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: {
        disclaimer: disclaimerHTMLFile,
        testUsersCredentials,
      },
    });
  };
}

export default router;
