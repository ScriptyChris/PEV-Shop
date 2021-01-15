const mockedBcrypt = require('../../../__mocks__/bcrypt');

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
      comparePasswords('password', 'passwordPattern');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password', 'passwordPattern');
    });
  });
});
