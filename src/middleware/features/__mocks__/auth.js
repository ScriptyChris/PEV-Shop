const authMiddlewareFn = jest.fn((getFromDB) => {
  throw Error('Need to mock the authMiddlewareFn(..) implementation for unit test first!');
});

const _succeededAuthMiddlewareFn = async (req, res, next) => {
  req.token = 'test token';
  req.user = { _id: 'user id' };

  next();
};

const _failedAuthMiddlewareFn = async (req, res, next) => null;

module.exports = {
  authMiddlewareFn,
  _succeededAuthMiddlewareFn,
  _failedAuthMiddlewareFn,
};
