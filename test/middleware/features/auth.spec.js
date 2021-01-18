const getType = require('jest-get-type');
const mockedBcrypt = require('../../../__mocks__/bcrypt');
const mockedJwt = require('../../../__mocks__/jsonwebtoken');
const { getFromDB: mockedGetFromDB } = require('../../../__mocks__/database-index');

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

describe('auth', () => {
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
    const reqMock = {
      header() {
        return '';
      },
    };
    const resMock = {};
    const nextMock = jest.fn();

    it('should return a function, which returns a promise resolved to undefined', () => {
      const authMiddlewareFnResult = authMiddlewareFn(mockedGetFromDB);
      expect(getType(authMiddlewareFnResult)).toBe('function');

      const authMiddlewareFnResultPromise = authMiddlewareFnResult(reqMock, resMock, nextMock);

      expect(getType(authMiddlewareFnResultPromise)).toBe('object');
      expect(authMiddlewareFnResultPromise).resolves.toBe(undefined);
    });
  });
});
