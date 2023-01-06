/**
 * Custom wrapper to secure consistent usage of a few {@link https://expressjs.com/en/4x/api.html#res|`Express#res`} methods.
 * @module MiddlewareResponseWrapper
 */

import type { Response } from 'express';
import { HTTP_STATUS_CODE } from '@src/types';

export interface IEmbracedResponse<PayloadType = never> {
  // TODO: [REFACTOR] 'authToken' could be always paired with 'payload' prop or be contained by it
  authToken: string | null;
  payload: PayloadType | Record<string, unknown> | unknown[];
  message: string;
  error: string;
  exception: Error | { message: string; stack?: string };
}

// TODO: [REFACTOR] automate each code group creation
const GROUPED_HTTP_STATUS_CODES = Object.freeze({
  SUCCESSFUL: {
    200: 200,
    201: 201,
    204: 204,
  },
  CLIENT_ERROR: {
    400: 400,
    401: 401,
    403: 403,
    404: 404,
    409: 409,
  },
  SERVER_ERROR: {
    500: 500,
    503: 503,
    511: 511,
  },
} as const);

export type TypeOfHTTPStatusCodes = typeof GROUPED_HTTP_STATUS_CODES;

// TODO: [REFACTOR] automate each code creation
const mappedHTTPStatusCode = Object.freeze({
  200: 'SUCCESSFUL',
  201: 'SUCCESSFUL',
  204: 'SUCCESSFUL',
  400: 'CLIENT_ERROR',
  401: 'CLIENT_ERROR',
  403: 'CLIENT_ERROR',
  404: 'CLIENT_ERROR',
  409: 'CLIENT_ERROR',
  500: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  511: 'SERVER_ERROR',
} as const);

export type TSuccessfulHTTPStatusCodesToData = {
  [SuccessfulStatus in keyof TypeOfHTTPStatusCodes['SUCCESSFUL']]: Extract<
    keyof IEmbracedResponse,
    'payload' | 'message' | 'authToken'
  >;
};
export type TClientErrorHTTPStatusCodesToData = {
  [ClientErrorStatus in keyof TypeOfHTTPStatusCodes['CLIENT_ERROR']]: Extract<keyof IEmbracedResponse, 'error'>;
};
export type TServerErrorHTTPStatusCodesToData = {
  [ServerErrorStatus in keyof TypeOfHTTPStatusCodes['SERVER_ERROR']]: Extract<keyof IEmbracedResponse, 'exception'>;
};

type THTTPStatusCodeToData = TSuccessfulHTTPStatusCodesToData &
  TClientErrorHTTPStatusCodesToData &
  TServerErrorHTTPStatusCodesToData;

type TKeyofMappedStatusCode = keyof typeof mappedHTTPStatusCode;
// Discord's TypeScript Community: https://discord.com/channels/508357248330760243/753055735423827998/909189680388534312
type TDataKeyExt<Status extends TKeyofMappedStatusCode> = keyof IEmbracedResponse extends infer K
  ? K extends keyof IEmbracedResponse
    ? K extends THTTPStatusCodeToData[Status]
      ? K
      : never
    : never
  : never;

function wrapRes(
  res: Response,
  status: typeof HTTP_STATUS_CODE.NO_CONTENT | typeof HTTP_STATUS_CODE.NOT_FOUND
): Response;
function wrapRes<
  Payload,
  Status extends Exclude<TKeyofMappedStatusCode, typeof GROUPED_HTTP_STATUS_CODES.SUCCESSFUL[204]>,
  DataKey extends TDataKeyExt<Status>
>(res: Response, status: Status, data: Record<DataKey, IEmbracedResponse[DataKey]>): Response;
/**
 * It asserts that used `HTTP_STATUS_CODE` is adequate to provided optional payload shape (regarding it's key/label).
 * @param {Response} res
 * @param {HTTP_STATUS_CODE} status
 * @param {Object} [data]
 * @returns {Response}
 * @example <caption>Without payload</caption>
 * wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
 * @example <caption>With payload</caption>
 * wrapRes(res, HTTP_STATUS_CODE.OK, { payload: someResourceValue });
 * wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Resource created!' });
 * wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Resource not found!' });
 */
function wrapRes<Payload, Status extends TKeyofMappedStatusCode, DataKey extends TDataKeyExt<Status>>(
  res: Response,
  status: Status,
  data?: Record<DataKey, IEmbracedResponse[DataKey]>
): Response {
  if (data === undefined) {
    if (status === HTTP_STATUS_CODE.NOT_FOUND) {
      return res.status(status);
    }

    return res.sendStatus(status);
  }

  return res.status(status).json(data);
}

export { wrapRes };
