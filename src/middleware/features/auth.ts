import getLogger from '../../../utils/logger';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

// @ts-ignore
dotenv.default.config();

const {
  // @ts-ignore
  default: { compare, hash },
} = bcrypt;
const {
  // @ts-ignore
  default: { sign, verify },
} = jwt;
const logger = getLogger(module.filename);
const SALT_ROUNDS = 8;

type TToken = { _id: number };

const comparePasswords = (password: string, passwordPattern: string): Promise<boolean> => {
  return compare(password, passwordPattern);
};

const hashPassword = (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS);
};

const getToken = (payloadObj: TToken): string => {
  return sign(payloadObj, process.env.SECRET_KEY);
};

const verifyToken = (token: string): TToken => {
  return verify(token, process.env.SECRET_KEY) as TToken;
};

const authMiddlewareFn = (getFromDB: /* TODO: correct typing */ any): ((...args: any) => Promise<void>) => {
  return async (req: Request & { token: string; user: any }, res: Response, next: NextFunction) => {
    try {
      const token: string = (req.header('Authorization') as string).replace('Bearer ', '');
      const decodedToken: TToken = verifyToken(token);
      const user: any = await getFromDB({ _id: decodedToken._id.toString(), 'tokens.token': token }, 'User');

      if (!user) {
        throw new Error('Auth failed!');
      }

      req.token = token;
      req.user = user;

      next();
    } catch (exception) {
      logger.error('authMiddleware exception', exception);
      res.status(401).json({ error: 'You are unauthorized!' });
    }
  };
};

const userRoleMiddlewareFn = (roleName: string): any => {
  return async (req: Request & { user: any; userPermissions: string[] }, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('No user provided - probably forgot to do auth first.');
      }

      // TODO: improve selecting data while populating
      await req.user.execPopulate({
        path: 'roleName',
        match: { roleName },
      });

      req.userPermissions = req.user.roleName[0].permissions;

      next();
    } catch (exception) {
      logger.error('userRoleMiddlewareFn exception', exception);
      res.status(403).json({ error: "You don't have permissions!" });
    }
  };
};

export { comparePasswords, hashPassword, getToken, verifyToken, authMiddlewareFn, userRoleMiddlewareFn };
