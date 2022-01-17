import getLogger from '../../../utils/logger';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../../types';
import getMiddlewareErrorHandler from '../helpers/middleware-error-handler';
import { wrapRes } from '../helpers/middleware-response-wrapper';
import { execSync } from 'child_process';

const logger = getLogger(module.filename);
const router: Router & Partial<{ _populateDB: typeof populateDB }> = Router();

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
