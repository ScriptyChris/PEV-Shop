import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../../types';
import getMiddlewareErrorHandler from '../helpers/middleware-error-handler';
import { wrapRes } from '../helpers/middleware-response-wrapper';
import { execSync } from 'child_process';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;

const logger = getLogger(module.filename);
const router: any = Router();

router.get('/api/populate-db', populateDB);
router.use(getMiddlewareErrorHandler(logger));

// expose for unit tests
router._populateDB = populateDB;

function populateDB(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: [SECURITY] restrict access to localhost and probably require a password

    logger.log('[<>] Starting the population');
    const populationResult = execSync('npm run populate-db').toString();
    logger.log('[<>] populationResult:', populationResult);

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}

export default router;
