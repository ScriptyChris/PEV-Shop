import getLogger from '@commons/logger';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '@src/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { executeDBPopulation } from '@database/populate/populate';

const logger = getLogger(module.filename);
const router: Router & Partial<{ _populateDB: typeof populateDB }> = Router();

router.get('/api/populate-db', populateDB);
router.use(getMiddlewareErrorHandler(logger));

// expose for unit tests
router._populateDB = populateDB;

async function populateDB(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: [SECURITY] restrict access to localhost and probably require a password

    console.log('populateDB() pre executeDBPopulation()');
    const dbPopulationResult = await executeDBPopulation();
    console.log('populateDB() post executeDBPopulation()/dbPopulationResult:', dbPopulationResult);

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    console.error('populateDB() /exception:', exception);

    return next(exception);
  }
}

export default router;
