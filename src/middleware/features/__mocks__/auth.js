const { getMockImplementationError } = require('../../../../test/commonMocks');

const authMiddlewareFn = jest.fn((getFromDB) => {
  throw getMockImplementationError('authMiddlewareFn');
});
authMiddlewareFn._succeededCall = async (req, res, next) => {
  req.token = 'test token';
  req.user = { _id: 'user id' };

  next();
};
authMiddlewareFn._failedCall = async (req, res, next) => null;

module.exports = { authMiddlewareFn };
