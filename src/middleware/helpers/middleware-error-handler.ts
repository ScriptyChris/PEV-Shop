/**
 * @module
 */

import type { Request, Response, NextFunction } from 'express';
import type { TLogger } from '@commons/logger';
import { HTTP_STATUS_CODE } from '@commons/types';
import { wrapRes } from './middleware-response-wrapper';

type TMiddlewareErrorHandler = (error: Error, req: Request, res: Response) => Pick<Response, 'json'>;

const GENERIC_ERROR_MESSAGE = 'An exception occured!';

export default function getMiddlewareErrorHandler(logger: TLogger): TMiddlewareErrorHandler {
  return function middlewareErrorHandler(
    error: Error,
    req: Request,
    res: Response,
    /* `next` is used just to indicate Express that this function is error handler middleware */
    next?: NextFunction
  ): Pick<Response, 'json'> {
    logger.error(`${GENERIC_ERROR_MESSAGE}\n/message:`, error.message, '\n/stack:', error.stack);

    return wrapRes(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, {
      exception: {
        message: error.message || GENERIC_ERROR_MESSAGE,
        // TODO: [SECURITY] disable exposing stack in production mode
        stack: error.stack,
      },
    });
  };
}
