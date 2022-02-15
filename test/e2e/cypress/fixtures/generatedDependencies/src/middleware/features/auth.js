import getLogger from '../../../utils/logger';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { config as dotenvConfig } from 'dotenv';
import fetch from 'node-fetch';
import { HTTP_STATUS_CODE } from '../../types';
import { wrapRes } from '../helpers/middleware-response-wrapper';
dotenvConfig();
const logger = getLogger(module.filename);
const SALT_ROUNDS = 8;
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const comparePasswords = (password, passwordPattern) => {
    return compare(password, passwordPattern);
};
const hashPassword = (password) => {
    return hash(password, SALT_ROUNDS);
};
const getToken = (payloadObj) => {
    return sign(payloadObj, TOKEN_SECRET_KEY);
};
const verifyToken = (token) => {
    return verify(token, TOKEN_SECRET_KEY);
};
const authMiddlewareFn = (getFromDB) => {
    return async (req, res, next) => {
        try {
            const BEARER_TOKEN_PREFIX = 'Bearer ';
            const authToken = req.header('Authorization');
            if (!authToken) {
                return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
                    error: 'Authorization token header is empty or not attached!',
                });
            }
            else if (!authToken.startsWith(BEARER_TOKEN_PREFIX)) {
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
            const user = (await getFromDB({ _id: decodedToken._id.toString(), 'tokens.auth': { $exists: true, $eq: bearerToken } }, 'User'));
            if (!user || user.length === 0) {
                return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User to authorize not found!' });
            }
            // TODO: [REFACTOR] normalize data returned by `getFromDB`
            req.user = Array.isArray(user) ? user[0] : user;
            req.token = bearerToken;
            return next();
        }
        catch (exception) {
            return next(exception);
        }
    };
};
const userRoleMiddlewareFn = (roleName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return wrapRes(res, HTTP_STATUS_CODE.FORBIDDEN, { error: `You don't have permissions!` });
            }
            // TODO: improve selecting data while populating
            await req.user.execPopulate({
                path: 'roleName',
                match: { roleName },
            });
            req.userPermissions = req.user.roleName[0].permissions;
            return next();
        }
        catch (exception) {
            return next(exception);
        }
    };
};
const authToPayU = (() => {
    const clientId = process.env.PAYU_CLIENT_ID;
    const clientSecret = process.env.PAYU_CLIENT_SECRET;
    const PAYU_AUTH_URL = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };
    let token = null;
    let tokenReceiveTimeInSec = 0;
    return function getToken() {
        if (isTokenValid()) {
            return Promise.resolve(token.access_token);
        }
        logger.log('authToPayU /PAYU_AUTH_URL:', PAYU_AUTH_URL, ' /options:', options);
        return (fetch(PAYU_AUTH_URL, options)
            .then((response) => response.json())
            .then((response) => {
            token = response;
            tokenReceiveTimeInSec = getCurrentTimeInSec();
            logger.log('PayU auth token:', token);
            return token.access_token;
        })
            // TODO: handle error in a better way
            .catch((error) => {
            logger.error('PayU token fetching error:', error);
            return error;
        }));
    };
    function isTokenValid() {
        return !!token && tokenReceiveTimeInSec + token.expires_in < getCurrentTimeInSec();
    }
    function getCurrentTimeInSec() {
        return Math.floor(Date.now() / 1000);
    }
})();
export { comparePasswords, hashPassword, getToken, verifyToken, authMiddlewareFn, userRoleMiddlewareFn, authToPayU };
