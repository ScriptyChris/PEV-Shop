const authMiddlewareFn = jest.fn((getFromDB) => {
  throw Error('Need to mock the authMiddlewareFn(..) implementation for unit test first!');
});
authMiddlewareFn._succeededAuthMiddlewareFn = async (req, res, next) => {
  req.token = 'test token';
  req.user = { _id: 'user id' };

  next();
};
authMiddlewareFn._failedAuthMiddlewareFn = async (req, res, next) => null;

module.exports = { authMiddlewareFn };
