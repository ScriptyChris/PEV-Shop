const { getMockImplementationError } = require('../../../../test/mockUtils');

const authMiddlewareFn = jest.fn((getFromDB) => {
  throw getMockImplementationError('authMiddlewareFn');
});
authMiddlewareFn._succeededCall = (getFromDB) => {
  return async (req, res, next) => {};
};
authMiddlewareFn._failedCall = (getFromDB) => null;

const hashPassword = jest.fn((password) => {
  throw getMockImplementationError('hashPassword');
});
hashPassword._succeededCall = (password) => Promise.resolve(Buffer.from(password).toString('base64'));
hashPassword._failedCall = (password) => Promise.reject(Error('hashing failed'));

const userRoleMiddlewareFn = jest.fn(() => {
  throw getMockImplementationError('userRoleMiddlewareFn');
});
userRoleMiddlewareFn._succeededCall = jest.fn((roleName) => {
  return async (req, res, next) => {};
});
userRoleMiddlewareFn._failedCall = jest.fn((roleName) => {
  return (req, res, next) => Promise.reject(false);
});

module.exports = { authMiddlewareFn, hashPassword, userRoleMiddlewareFn };
