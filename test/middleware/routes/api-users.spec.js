const { getResMock } = require('../../mockUtils');
const { Router, _router } = jest.mock('express').requireMock('express');
const { authMiddlewareFn: authMiddlewareFnMock, hashPassword } = jest
  .mock('../../../src/middleware/features/auth')
  .requireMock('../../../src/middleware/features/auth');
const {
  getFromDB: getFromDBMock,
  saveToDB: saveToDBMock,
  updateOneModelInDB: updateOneModelInDBMock,
  ObjectId: ObjectIdMock,
} = jest.mock('../../../src/database/database-index').requireMock('../../../src/database/database-index');

describe('#api-users', () => {
  const authMiddlewareReturnedFn = () => {};
  let apiUsersRouter = null;

  beforeAll(() => {
    authMiddlewareFnMock
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn);

    apiUsersRouter = require('../../../src/middleware/routes/api-users');
  });

  afterAll(() => {
    Router.mockClear();
    Object.values(_router).forEach((httpMethod) => httpMethod.mockClear());
  });

  it('should call Router() once', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('should call router.post(..) and router.get(..) specific amount of times with correct params', () => {
    expect(apiUsersRouter.post).toHaveBeenCalledTimes(3);
    expect(apiUsersRouter.get).toHaveBeenCalledTimes(1);

    expect(apiUsersRouter.post).toHaveBeenNthCalledWith(1, '/api/users/', apiUsersRouter._updateUser);
    expect(apiUsersRouter.post).toHaveBeenNthCalledWith(2, '/api/users/login', apiUsersRouter._logInUser);
    expect(apiUsersRouter.post).toHaveBeenNthCalledWith(
      3,
      '/api/users/logout',
      authMiddlewareReturnedFn,
      apiUsersRouter._logOutUser
    );
    expect(apiUsersRouter.get).toHaveBeenCalledWith(
      '/api/users/:id',
      authMiddlewareReturnedFn,
      apiUsersRouter._getUser
    );
  });
});
