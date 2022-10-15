import getLogger from '@root/commons/logger';
import { compare, hash } from 'bcrypt';
import { sign, verify, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config as dotenvConfig } from 'dotenv';
import fetch, { RequestInit, Response as FetchResponse } from 'node-fetch';
import { IUser, TRoleName, COLLECTION_NAMES } from '@database/models';
import { HTTP_STATUS_CODE } from '@src/types';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';

dotenvConfig();

const logger = getLogger(module.filename);
const SALT_ROUNDS = 8;
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as Secret;

type TToken = { _id: number };

const comparePasswords = (password: string, passwordPattern: string) => {
  return compare(password, passwordPattern);
};

const hashPassword = (password: string) => {
  return hash(password, SALT_ROUNDS);
};

const getToken = (payloadObj: TToken) => {
  return sign(payloadObj, TOKEN_SECRET_KEY);
};

const verifyToken = (token: string) => {
  return verify(token, TOKEN_SECRET_KEY) as TToken;
};

const authMiddlewareFn = (
  getFromDB: /* TODO: [DX] correct typing */ any
): ((...args: any) => Promise<Pick<Response, 'json'> | void>) => {
  return async (req: Request & { user: IUser; token: string }, res: Response, next: NextFunction) => {
    try {
      const BEARER_TOKEN_PREFIX = 'Bearer ';
      const authToken = req.header('Authorization');

      if (!authToken) {
        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
          error: 'Authorization token header is empty or not attached!',
        });
      } else if (!authToken.startsWith(BEARER_TOKEN_PREFIX)) {
        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
          error: `Auth token value does not start with '${BEARER_TOKEN_PREFIX}'!`,
        });
      }

      const bearerToken = authToken.replace(BEARER_TOKEN_PREFIX, '');

      if (!bearerToken) {
        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
          error: 'Auth token does not contain bearer value!',
        });
      }

      const decodedToken = verifyToken(bearerToken);
      const user = (await getFromDB(
        { _id: decodedToken._id.toString(), 'tokens.auth': { $exists: true, $eq: bearerToken } },
        COLLECTION_NAMES.User,
        { population: 'accountType' }
      )) as IUser | IUser[];

      if (!user || (user as IUser[]).length === 0) {
        return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User to authorize not found!' });
      }

      // TODO: [REFACTOR] normalize data returned by `getFromDB`
      req.user = Array.isArray(user) ? user[0] : user;
      req.token = bearerToken;

      return next();
    } catch (exception) {
      return next(exception);
    }
  };
};

const userRoleMiddlewareFn = (roleName: TRoleName): any => {
  return async (req: Request & { user: IUser }, res: Response, next: NextFunction) => {
    try {
      if (!req.user.populated('accountType') || roleName !== req.user.accountType?.roleName) {
        return wrapRes(res, HTTP_STATUS_CODE.FORBIDDEN, { error: `You don't have permissions!` });
      }

      return next();
    } catch (exception) {
      return next(exception);
    }
  };
};

const authToPayU: () => Promise<string | Error> = (() => {
  const clientId = process.env.PAYU_CLIENT_ID as string;
  const clientSecret = process.env.PAYU_CLIENT_SECRET as string;
  const PAYU_AUTH_URL = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
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

    logger.log('authToPayU /PAYU_AUTH_URL:', PAYU_AUTH_URL, ' /options:', options);

    return (
      fetch(PAYU_AUTH_URL, options)
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
