const { getMockImplementationError } = require('../../../../test/mockUtils');

const authMiddlewareFn = jest.fn((getFromDB) => {
  throw getMockImplementationError('authMiddlewareFn');
});
authMiddlewareFn._succeededCall = async (req, res, next) => {
  req.token = 'test token';
  req.user = { _id: 'user id' };

  next();
};
authMiddlewareFn._failedCall = async (req, res, next) => null;

const hashPassword = jest.fn((password) => {
  throw getMockImplementationError('hashPassword');
});
hashPassword._succeededCall = (password) => Promise.resolve(password);
hashPassword._failedCall = (password) => Promise.reject(Error('hashing failed'));

// const matchPassword = jest.fn((password) => {
//   throw getMockImplementationError('matchPassword')
// })
// matchPassword._succeededCall = (password) => Promise.resolve(true)
// matchPassword._failedCall = (password) => Promise.resolve(false);

module.exports = { authMiddlewareFn };
