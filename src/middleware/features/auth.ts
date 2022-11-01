import getLogger from '@commons/logger';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import fetch, { RequestInit, Response as FetchResponse } from 'node-fetch';
import { IUser, TUserRoleName, COLLECTION_NAMES } from '@database/models';
import { HTTP_STATUS_CODE } from '@src/types';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { getFromDB } from '@database/api';
import { dotEnv } from '@commons/dotEnvLoader';

const logger = getLogger(module.filename);
const SALT_ROUNDS = 8;

type TToken = { _id: number };

const comparePasswords = (password: string, passwordPattern: string) => {
  return compare(password, passwordPattern);
};

const hashPassword = (password: string) => {
  return hash(password, SALT_ROUNDS);
};

const getToken = (payloadObj: TToken) => {
  return sign(payloadObj, dotEnv.TOKEN_SECRET_KEY);
};

const verifyToken = (token: string) => {
  return verify(token, dotEnv.TOKEN_SECRET_KEY) as TToken;
};

const authMiddlewareFn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const BEARER_TOKEN_PREFIX = 'Bearer ';
    const authToken = req.header('Authorization');

    if (!authToken || typeof authToken !== 'string') {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Authorization token header has to be a non-empty string!',
      });
    } else if (!authToken.startsWith(BEARER_TOKEN_PREFIX)) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Auth token value has to start with '${BEARER_TOKEN_PREFIX}'!`,
      });
    }

    const bearerToken = authToken.replace(BEARER_TOKEN_PREFIX, '');

    if (!bearerToken) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Auth token has to contain bearer value!',
      });
    }

    const decodedToken = verifyToken(bearerToken);
    const user = await getFromDB(
      { modelName: COLLECTION_NAMES.User, population: 'accountType' },
      { _id: decodedToken._id.toString(), 'tokens.auth': { $exists: true, $eq: bearerToken } }
    );

    if (!user) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User to authorize not found!' });
    }

    req.user = user as IUser;
    req.token = bearerToken;

    return next();
  } catch (exception) {
    return next(exception);
  }
};

const userRoleMiddlewareFn = (roleName: TUserRoleName) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw Error('Property req.user is empty, which most likely is a fault of a previous middleware!');
      } else if (!req.user.populated('accountType') || roleName !== req.user.accountType?.roleName) {
        return wrapRes(res, HTTP_STATUS_CODE.FORBIDDEN, { error: `You don't have permissions!` });
      }

      return next();
    } catch (exception) {
      return next(exception);
    }
  };
};

const authToPayU: () => Promise<string | Error> = (() => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${dotEnv.PAYU_CLIENT_ID}&client_secret=${dotEnv.PAYU_CLIENT_SECRET}`,
  };

  interface IPayUToken {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    grant_type: 'client_credentials';
  }
  let token: IPayUToken | null = null;
  let tokenReceiveTimeInSec = 0;

  return function getToken(): Promise<string | Error> {
    if (isTokenValid()) {
      return Promise.resolve((token as unknown as IPayUToken).access_token);
    }

    logger.log('authToPayU /dotEnv.PAYU_AUTH_URL:', dotEnv.PAYU_AUTH_URL, ' /options:', options);

    return (
      fetch(dotEnv.PAYU_AUTH_URL, options)
        .then((response: FetchResponse) => response.json())
        .then((response: IPayUToken) => {
          token = response;
          tokenReceiveTimeInSec = getCurrentTimeInSec();

          logger.log('PayU auth token:', token);

          return token.access_token;
        })
        // TODO: handle error in a better way
        .catch((error: Error) => {
          logger.error('PayU token fetching error:', error);

          return error;
        })
    );
  };

  function isTokenValid(): boolean {
    return !!token && tokenReceiveTimeInSec + token.expires_in < getCurrentTimeInSec();
  }

  function getCurrentTimeInSec(): number {
    return Math.floor(Date.now() / 1000);
  }
})();

export { comparePasswords, hashPassword, getToken, verifyToken, authMiddlewareFn, userRoleMiddlewareFn, authToPayU };
