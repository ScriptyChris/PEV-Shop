import { mockAndRequireModule, findAssociatedSrcModulePath, mockAndRequireDBModelsModules } from '@unitTests/utils';

mockAndRequireDBModelsModules();

import { getResMock, TJestMock } from '@unitTests/inline-mocks';
import { IUser, COLLECTION_NAMES } from '@database/models';
import { HTTP_STATUS_CODE } from '@commons/types';
import getType from 'jest-get-type';

const { getFromDB: getFromDBMock } = mockAndRequireModule('src/database/api');
const { _succeededCall: mockedSucceededGetFromDB, _failedCall: mockedFailedGetFromDB } = getFromDBMock;

// rename exported variable
const { bcrypt: mockedBcrypt } = {
  bcrypt: mockAndRequireModule('__mocks__/bcrypt'),
};
// rename exported variable
const { jwt: mockedJwt } = {
  jwt: mockAndRequireModule('__mocks__/jsonwebtoken'),
};

import { dotEnv } from '@commons/dotEnvLoader';

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

      expect(mockedJwt.sign).toHaveBeenCalledWith(payloadObj, dotEnv.TOKEN_SECRET_KEY);
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

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, dotEnv.TOKEN_SECRET_KEY);
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
    const getReqMock: (mockedReturn?: unknown) => { header: () => unknown; token?: string; user?: IUser } = (
      mockedReturn = 'Bearer test-token'
    ) => ({
      header() {
        return mockedReturn;
      },
    });
    const getNextMock = () => jest.fn();

    describe('when authToken is incorrect', () => {
      it('should call res.status(..).json(..) with appropriate params when authToken is not a non-empty string', async () => {
        // for empty string
        {
          const reqMockEmptyString = getReqMock('');
          const resMockForEmptyString = getResMock();

          await authMiddlewareFn(reqMockEmptyString, resMockForEmptyString);

          expect(resMockForEmptyString.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
          expect(resMockForEmptyString._jsonMethod).toBeCalledWith({
            error: 'Authorization token header has to be a non-empty string!',
          });
        }

        // for null
        {
          const reqMockNull = getReqMock(null);
          const resMockForNull = getResMock();

          await authMiddlewareFn(reqMockNull, resMockForNull);

          expect(resMockForNull.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
          expect(resMockForNull._jsonMethod).toBeCalledWith({
            error: 'Authorization token header has to be a non-empty string!',
          });
        }
      });

      it(`should call res.status(..).json(..) with appropriate params when authToken doesn't start with a prefix`, async () => {
        const reqMock = getReqMock('Not prefixed with "Bearer "');
        const resMock = getResMock();

        await authMiddlewareFn(reqMock, resMock);

        expect(resMock.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock._jsonMethod).toBeCalledWith({
          error: `Auth token value has to start with 'Bearer '!`,
        });
      });

      it(`should call res.status(..).json(..) with appropriate params when authToken doesn't contain a bearer value`, async () => {
        const reqMock = getReqMock('Bearer ');
        const resMock = getResMock();

        await authMiddlewareFn(reqMock, resMock);

        expect(resMock.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock._jsonMethod).toBeCalledWith({
          error: 'Auth token has to contain bearer value!',
        });
      });
    });

    describe('when found user in database', () => {
      it('should call getFromDB(..) with proper params', async () => {
        const reqMock = getReqMock();
        const getFromDBSucceededMock = jest.fn(mockedSucceededGetFromDB);
        getFromDBMock.mockImplementationOnce(getFromDBSucceededMock);

        await authMiddlewareFn(reqMock, getResMock(), getNextMock());

        expect(getFromDBSucceededMock).toHaveBeenCalledWith(
          { modelName: COLLECTION_NAMES.User, population: 'accountType' },
          {
            _id: expect.any(String),
            'tokens.auth': { $exists: true, $eq: 'test-token' },
          }
        );
      });

      it('should assign found user prop to req object', async () => {
        const reqMock = getReqMock();

        expect(reqMock).toEqual(expect.not.objectContaining({ user: expect.any(String) }));

        getFromDBMock.mockImplementationOnce(mockedSucceededGetFromDB);

        await authMiddlewareFn(reqMock, getResMock(), getNextMock());

        expect(reqMock.user instanceof mockedSucceededGetFromDB._clazz).toBe(true);
      });

      it('should assign processed token prop to req object', async () => {
        const reqMock = getReqMock();

        expect(reqMock).toEqual(expect.not.objectContaining({ token: expect.any(String) }));

        getFromDBMock.mockImplementationOnce(mockedSucceededGetFromDB);

        await authMiddlewareFn(reqMock, getResMock(), getNextMock());

        expect(reqMock.token).toBe('test-token');
      });

      it('should call next() function', async () => {
        const nextMock = getNextMock();
        getFromDBMock.mockImplementationOnce(mockedSucceededGetFromDB);

        await authMiddlewareFn(getReqMock(), getResMock(), nextMock);
        expect(nextMock).toHaveBeenCalled();
      });
    });

    describe("when didn't find user in database", () => {
      it('should call res.status(..).json(..) with appropriate params', async () => {
        const resMock = getResMock();
        getFromDBMock.mockImplementationOnce(mockedFailedGetFromDB.general);

        await authMiddlewareFn(getReqMock(), resMock, getNextMock());
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

    it('should return a function, which returns a promise resolved to undefined', async () => {
      // for success case
      const succeededUserRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
      const succeededUserRoleMiddlewareFnResultPromise = succeededUserRoleMiddlewareFnResult(
        getReqMock(),
        getResMock(),
        getNextMock()
      );

      expect(getType(succeededUserRoleMiddlewareFnResult)).toBe('function');
      expect(getType(succeededUserRoleMiddlewareFnResultPromise)).toBe('object');
      await expect(succeededUserRoleMiddlewareFnResultPromise).resolves.toBe(undefined);

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
      await expect(failedUserRoleMiddlewareFnResultPromise).resolves.toBe(undefined);
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
        expect(nextMock).toHaveBeenCalledWith(
          new TypeError('Property req.user is empty, which most likely is a fault of a previous middleware!')
        );
      });
    });
  });
});
