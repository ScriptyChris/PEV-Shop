import { mockAndRequireModule, findAssociatedSrcModulePath } from '@unitTests/utils';
import { getResMock, TJestMock } from '@unitTests/inline-mocks';
import type { IUser } from '@database/models/_user';
import { HTTP_STATUS_CODE } from '@src/types';
import getType from 'jest-get-type';
import { getFromDB } from '@database/__mocks__/database-index';

// rename exported variable
const { bcrypt: mockedBcrypt } = {
  bcrypt: mockAndRequireModule('__mocks__/bcrypt'),
};
// rename exported variable
const { jwt: mockedJwt } = {
  jwt: mockAndRequireModule('__mocks__/jsonwebtoken'),
};

const { _succeededCall: mockedSucceededGetFromDB, _failedCall: mockedFailedGetFromDB } = getFromDB;

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

describe('#auth', () => {
  let comparePasswords: any,
    hashPassword: any,
    getToken: any,
    verifyToken: any,
    authMiddlewareFn: any,
    userRoleMiddlewareFn: any;

  beforeAll(async () => {
    try {
      ({ comparePasswords, hashPassword, getToken, verifyToken, authMiddlewareFn, userRoleMiddlewareFn } = await import(
        findAssociatedSrcModulePath()
      ));
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  describe('comparePasswords()', () => {
    it('should call bcrypt.compare method passing through provided params', () => {
      comparePasswords('a', 'b');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('a', 'b');
    });

    it('should return result returned by bcrypt.compare, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedBcrypt.compare.mockImplementationOnce(() => null).mockImplementationOnce(() => null);

      const innerResult = mockedBcrypt.compare();
      const outerResult = comparePasswords();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('hashPassword()', () => {
    it('should call bcrypt.hash method passing through provided param', () => {
      const password = 'secret password';
      // this is auth's module private variable
      const SALT_ROUNDS = 8;

      hashPassword(password);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, SALT_ROUNDS);
    });

    it('should return result returned by bcrypt.hash, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedBcrypt.hash.mockImplementationOnce(() => null).mockImplementationOnce(() => null);

      const innerResult = mockedBcrypt.hash();
      const outerResult = hashPassword();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('getToken()', () => {
    it('should call jwt.sign method passing through provided param', () => {
      const payloadObj = {};

      getToken(payloadObj);

      expect(mockedJwt.sign).toHaveBeenCalledWith(payloadObj, process.env.TOKEN_SECRET_KEY);
    });

    it('should return result returned by jwt.sign, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedJwt.sign.mockImplementationOnce(() => null).mockImplementationOnce(() => null);

      const innerResult = mockedJwt.sign();
      const outerResult = getToken();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('verifyToken()', () => {
    it('should call jwt.verify method passing through provided param', () => {
      const token = 'test';

      verifyToken(token);

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, process.env.TOKEN_SECRET_KEY);
    });

    it('should return result returned by jwt.verify, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedJwt.verify.mockImplementationOnce(() => null).mockImplementationOnce(() => null);

      const innerResult = mockedJwt.verify();
      const outerResult = verifyToken();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('authMiddlewareFn()', () => {
    // TODO: consider moving below mocks to separate file/module
    const getReqMock: () => { header: () => string; token?: string; user?: IUser } = () => ({
      header() {
        return 'Bearer test-token';
      },
    });
    const getNextMock = () => jest.fn();

    it('should return a function, which returns a promise resolved to undefined', () => {
      // for success case
      const succeededAuthMiddlewareFnResult = authMiddlewareFn(mockedSucceededGetFromDB);
      const succeededAuthMiddlewareFnResultPromise = succeededAuthMiddlewareFnResult(
        getReqMock(),
        getResMock(),
        getNextMock()
      );

      expect(getType(succeededAuthMiddlewareFnResult)).toBe('function');
      expect(getType(succeededAuthMiddlewareFnResultPromise)).toBe('object');
      expect(succeededAuthMiddlewareFnResultPromise).resolves.toBe(undefined);

      // for caught error case
      const failedAuthMiddlewareFnResult = authMiddlewareFn(mockedFailedGetFromDB.general);
      const failedAuthMiddlewareFnResultPromise = failedAuthMiddlewareFnResult(
        getReqMock(),
        getResMock(),
        getNextMock()
      );

      expect(getType(failedAuthMiddlewareFnResult)).toBe('function');
      expect(getType(failedAuthMiddlewareFnResultPromise)).toBe('object');
      expect(failedAuthMiddlewareFnResultPromise).resolves.toBe(undefined);
    });

    describe('when found user in database', () => {
      it('should call getFromDB(..) with proper params', async () => {
        const reqMock = getReqMock();
        const getFromDBSucceededMock = jest.fn(mockedSucceededGetFromDB);
        const authMiddlewareFnResult = authMiddlewareFn(getFromDBSucceededMock);

        await authMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(getFromDBSucceededMock).toHaveBeenCalledWith(
          {
            _id: expect.any(String),
            'tokens.auth': { $exists: true, $eq: 'test-token' },
          },
          'User',
          { population: 'accountType' }
        );
      });

      it('should assign found user prop to req object', async () => {
        const reqMock = getReqMock();

        expect('user' in reqMock).toBe(false);

        const authMiddlewareFnResult = authMiddlewareFn(mockedSucceededGetFromDB);

        await authMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock.user instanceof mockedSucceededGetFromDB._clazz).toBe(true);
      });

      it('should assign processed token prop to req object', async () => {
        const reqMock = getReqMock();

        const authMiddlewareFnResult = authMiddlewareFn(mockedSucceededGetFromDB);

        await authMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock.token).toBe('test-token');
      });

      it('should call next() function', async () => {
        const nextMock = getNextMock();
        const authMiddlewareFnResult = authMiddlewareFn(mockedSucceededGetFromDB);

        await authMiddlewareFnResult(getReqMock(), getResMock(), nextMock);
        expect(nextMock).toHaveBeenCalled();
      });
    });

    describe("when didn't find user in database", () => {
      it('should call res.status(..).json(..) with appropriate params', async () => {
        const resMock = getResMock();
        const authMiddlewareFnResult = authMiddlewareFn(mockedFailedGetFromDB.general);

        await authMiddlewareFnResult(getReqMock(), resMock, getNextMock());
        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'User to authorize not found!' });
      });
    });
  });

  describe('userRoleMiddlewareFn()', () => {
    type TReqUser = { populated?: TJestMock; accountType?: { roleName: string } };
    // TODO: consider moving below mocks to separate file/module
    const getReqMock = () => {
      const req: { user?: TReqUser } = {
        user: {},
      };
      (req.user as TReqUser).populated = jest.fn(async () => {
        (req.user as TReqUser).accountType = { roleName: 'test account type' };
      });

      return req;
    };
    const getNextMock = () => jest.fn();
    const ROLE_NAME = 'test account type';

    it('should return a function, which returns a promise resolved to undefined', () => {
      // for success case
      const succeededUserRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
      const succeededUserRoleMiddlewareFnResultPromise = succeededUserRoleMiddlewareFnResult(
        getReqMock(),
        getResMock(),
        getNextMock()
      );

      expect(getType(succeededUserRoleMiddlewareFnResult)).toBe('function');
      expect(getType(succeededUserRoleMiddlewareFnResultPromise)).toBe('object');
      expect(succeededUserRoleMiddlewareFnResultPromise).resolves.toBe(undefined);

      // for caught error case
      const reqMock = getReqMock();
      delete reqMock.user;

      const failedUserRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
      const failedUserRoleMiddlewareFnResultPromise = failedUserRoleMiddlewareFnResult(
        reqMock,
        getResMock(),
        getNextMock()
      );

      expect(getType(failedUserRoleMiddlewareFnResult)).toBe('function');
      expect(getType(failedUserRoleMiddlewareFnResultPromise)).toBe('object');
      expect(failedUserRoleMiddlewareFnResultPromise).resolves.toBe(undefined);
    });

    describe('when req.user property is provided', () => {
      it('should call req.user.populated(..) with a string argument', async () => {
        const reqMock = getReqMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);

        await userRoleMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect((reqMock.user as TReqUser).populated).toHaveBeenCalledWith('accountType');
      });

      it('should assign accountType prop to req.user object', async () => {
        const reqMock = getReqMock();

        expect('accountType' in reqMock).toBe(false);

        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
        await userRoleMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock).toHaveProperty('user.accountType.roleName', ROLE_NAME);
      });

      it('should call next() function', async () => {
        const nextMock = getNextMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);

        await userRoleMiddlewareFnResult(getReqMock(), getResMock(), nextMock);
        expect(nextMock).toHaveBeenCalled();
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct args when `roleName` is not equal to req.user.accountType.roleName', async () => {
        const resMock = getResMock();

        const reqMock = getReqMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn('different role name');

        await userRoleMiddlewareFnResult(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.FORBIDDEN);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: `You don't have permissions!` });
      });

      it("should call next with exception when req doesn't have `user` prop", async () => {
        const reqMock = getReqMock();
        delete reqMock.user;

        const resMock = getResMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
        const nextMock = getNextMock();

        await userRoleMiddlewareFnResult(reqMock, resMock, nextMock);
        expect(nextMock).toHaveBeenCalledWith(new TypeError("Cannot read property 'populated' of undefined"));
      });
    });
  });
});
