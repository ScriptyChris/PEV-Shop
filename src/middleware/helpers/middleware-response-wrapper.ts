import type { Response } from 'express';

interface IEmbracedResponse {
  // TODO: [REFACTOR] 'authToken' could be always paired with 'payload' prop or be contained by it
  authToken: string | null;
  payload: Record<string, unknown> | unknown[];
  message: string;
  error: string;
  exception: Error | { message: string; stack?: string };
}

const HTTP_STATUS_CODES = Object.freeze({
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
    511: 511,
  },
});

type TypeOfHTTPStatusCodes = typeof HTTP_STATUS_CODES;

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
  511: 'SERVER_ERROR',
});

type TSuccessfulHTTPStatusCodesToData = {
  [SuccessfulStatus in keyof TypeOfHTTPStatusCodes['SUCCESSFUL']]: 'payload' | 'message';
};
type TClientErrorHTTPStatusCodesToData = {
  [ClientErrorStatus in keyof TypeOfHTTPStatusCodes['CLIENT_ERROR']]: 'error';
};
type TServerErrorHTTPStatusCodesToData = {
  [ServerErrorStatus in keyof TypeOfHTTPStatusCodes['SERVER_ERROR']]: 'exception';
};

type THTTPStatusCodeToData = TSuccessfulHTTPStatusCodesToData &
  TClientErrorHTTPStatusCodesToData &
  TServerErrorHTTPStatusCodesToData;

function responseWrapper<
  Status extends keyof typeof mappedHTTPStatusCode,
  DataKey extends keyof IEmbracedResponse extends infer K
    ? K extends keyof IEmbracedResponse
      ? K extends THTTPStatusCodeToData[Status]
        ? K
        : never
      : never
    : never
>(res: Response, status: Status, data: Record<DataKey, IEmbracedResponse[DataKey]>) {
  return res.status(status).json(data);
}

export const embraceResponse = <Key extends keyof IEmbracedResponse>(response: Record<Key, IEmbracedResponse[Key]>) =>
  response;

export const normalizePayloadType = <Type>(payload: Type) => payload as Record<keyof Type, Type[keyof Type]>;
