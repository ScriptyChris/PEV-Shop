const getType = require('jest-get-type');
const mockedBcrypt = require('../../../__mocks__/bcrypt');
const mockedJwt = require('../../../__mocks__/jsonwebtoken');
const {
  succeededGetFromDB: mockedSucceededGetFromDB,
  failedGetFromDB: mockedFailedGetFromDB,
} = require('../../../src/database/__mocks__/database-index');

// TODO: create kind of symlinks to test/ folder to avoid using relative paths
const { findAssociatedSrcModulePath } = require('../../index');
const {
  comparePasswords,
  hashPassword,
  getToken,
  verifyToken,
  authMiddlewareFn,
  userRoleMiddlewareFn,
} = require(findAssociatedSrcModulePath());

describe('#auth', () => {
  describe('comparePasswords()', () => {
    it('should call bcrypt.compare method passing through provided params', () => {
      comparePasswords('a', 'b');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('a', 'b');
    });

    it('should return result returned by bcrypt.compare, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedBcrypt.compare
        .mockImplementationOnce((password, passwordPattern) => null)
        .mockImplementationOnce((password, passwordPattern) => null);

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
      mockedBcrypt.hash
        .mockImplementationOnce((password, SALT_ROUNDS) => null)
        .mockImplementationOnce((password, SALT_ROUNDS) => null);

      const innerResult = mockedBcrypt.hash();
      const outerResult = hashPassword();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('getToken()', () => {
    it('should call jwt.sign method passing through provided param', () => {
      const payloadObj = {};

      getToken(payloadObj);

      // this is auth's module private variable
      const SECRET_KEY = 'secret-key';

      expect(mockedJwt.sign).toHaveBeenCalledWith(payloadObj, SECRET_KEY);
    });

    it('should return result returned by jwt.sign, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedJwt.sign
        .mockImplementationOnce((payloadObj, SECRET_KEY) => null)
        .mockImplementationOnce((payloadObj, SECRET_KEY) => null);

      const innerResult = mockedJwt.sign();
      const outerResult = getToken();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('verifyToken()', () => {
    it('should call jwt.verify method passing through provided param', () => {
      const token = 'test';

      verifyToken(token);

      // this is auth's module private variable
      const SECRET_KEY = 'secret-key';

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, SECRET_KEY);
    });

    it('should return result returned by jwt.verify, cause this is its internal implementation', () => {
      // mock returning same value twice: first for direct mock fn call; second for indirect call by intermediate function
      mockedJwt.verify
        .mockImplementationOnce((token, SECRET_KEY) => null)
        .mockImplementationOnce((token, SECRET_KEY) => null);

      const innerResult = mockedJwt.verify();
      const outerResult = verifyToken();

      expect(outerResult).toBe(innerResult);
    });
  });

  describe('authMiddlewareFn()', () => {
    // TODO: consider moving below mocks to separate file/module
    const getReqMock = () => ({
      header() {
        return 'some token';
      },
    });
    const getResMock = () => {
      const jsonMethod = jest.fn((errorObj) => {});
      const statusMethod = jest.fn((code) => ({ json: jsonMethod }));

      return {
        status: statusMethod,
        _jsonMethod: jsonMethod,
      };
    };
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
      const failedAuthMiddlewareFnResult = authMiddlewareFn(mockedFailedGetFromDB);
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
      it('should assign proper token and user props to req object', async () => {
        const reqMock = getReqMock();

        expect('token' in reqMock).toBe(false);
        expect('user' in reqMock).toBe(false);

        const token = reqMock.header();
        const authMiddlewareFnResult = authMiddlewareFn(mockedSucceededGetFromDB);

        await authMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock.token).toBe(token);
        expect(reqMock.user instanceof mockedSucceededGetFromDB._clazz).toBe(true);
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
        const authMiddlewareFnResult = authMiddlewareFn(mockedFailedGetFromDB);

        await authMiddlewareFnResult(getReqMock(), resMock, getNextMock());
        expect(resMock.status).toHaveBeenCalledWith(401);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'You are unauthorized!' });
      });
    });
  });

  describe('userRoleMiddlewareFn()', () => {
    // TODO: consider moving below mocks to separate file/module
    const getReqMock = () => {
      const req = {
        user: {},
      };
      req.user.execPopulate = jest.fn(async (obj) => {
        req.user.roleName = [
          {
            permissions: [],
          },
        ];
      });

      return req;
    };
    const getResMock = () => {
      const jsonMethod = jest.fn((errorObj) => {});
      const statusMethod = jest.fn((code) => ({ json: jsonMethod }));

      return {
        status: statusMethod,
        _jsonMethod: jsonMethod,
      };
    };
    const getNextMock = () => jest.fn();
    const ROLE_NAME = '';

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
      it('should call req.user.execPopulate(..) with an object param', async () => {
        const reqMock = getReqMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);

        await userRoleMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock.user.execPopulate).toHaveBeenCalledWith({
          path: 'roleName',
          match: { roleName: ROLE_NAME },
        });
      });

      it('should assign userPermissions prop to req object', async () => {
        const reqMock = getReqMock();

        expect('userPermissions' in reqMock).toBe(false);

        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);
        await userRoleMiddlewareFnResult(reqMock, getResMock(), getNextMock());

        expect(reqMock.userPermissions).toStrictEqual([]);
      });

      it('should call next() function', async () => {
        const nextMock = getNextMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);

        await userRoleMiddlewareFnResult(getReqMock(), getResMock(), nextMock);
        expect(nextMock).toHaveBeenCalled();
      });
    });

    describe('when user is not provided in req param', () => {
      it('should call res.status(..).json(..) with appropriate params', async () => {
        const reqMock = getReqMock();
        delete reqMock.user;

        const resMock = getResMock();
        const userRoleMiddlewareFnResult = userRoleMiddlewareFn(ROLE_NAME);

        await userRoleMiddlewareFnResult(reqMock, resMock, getNextMock());
        expect(resMock.status).toHaveBeenCalledWith(403);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: "You don't have permissions!" });
      });
    });
  });
});
