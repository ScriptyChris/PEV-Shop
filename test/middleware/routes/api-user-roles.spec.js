const { Router, _router } = jest.mock('express').requireMock('express');
const { authMiddlewareFn: authMiddlewareFnMock, _succeededAuthMiddlewareFn, _failedAuthMiddlewareFn } = jest
  .mock('../../../src/middleware/features/auth')
  .requireMock('../../../src/middleware/features/auth');
const { getFromDB } = jest
  .mock('../../../src/database/database-index')
  .requireMock('../../../src/database/database-index');

describe('#api-user-roles', () => {
  const routerPostLastCb = jest.fn().mockName('postLastCallback');
  const routerPatchLastCb = jest.fn().mockName('patchLastCallback');
  const routerGetLastCb = jest.fn().mockName('getLastCallback');

  const authMiddlewareReturnedFn = () => {};
  let routerPostHTTPMethod = () => {};
  let routerPatchHTTPMethod = () => {};
  let routerGetHTTPMethod = () => {};

  let apiUserRolesRouter = null;

  beforeAll(() => {
    prepareMockHTTPMethodsInterception([routerPostLastCb, routerPatchLastCb, routerGetLastCb]);

    authMiddlewareFnMock
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('postFirstCallback')
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('patchFirstCallback')
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('getFirstCallback');

    apiUserRolesRouter = require('../../../src/middleware/routes/api-user-roles');

    routerPostHTTPMethod = apiUserRolesRouter.post.mock.calls[0][2];
    routerPatchHTTPMethod = apiUserRolesRouter.patch.mock.calls[0][2];
    routerGetHTTPMethod = apiUserRolesRouter.get.mock.calls[0][2];
  });

  afterAll(() => {
    Router.mockClear();
    Object.values(_router).forEach((httpMethod) => httpMethod.mockClear());
  });

  it('should call Router() once', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('should call router.post(..), router.patch(..) and router.get(..) with correct params', () => {
    expect(apiUserRolesRouter.post).toHaveBeenCalledTimes(1);
    expect(apiUserRolesRouter.patch).toHaveBeenCalledTimes(1);
    expect(apiUserRolesRouter.get).toHaveBeenCalledTimes(1);

    expect(apiUserRolesRouter.post).toHaveBeenCalledWith('/api/user-roles', authMiddlewareReturnedFn, routerPostLastCb);
    expect(apiUserRolesRouter.patch).toHaveBeenCalledWith(
      '/api/user-roles',
      authMiddlewareReturnedFn,
      routerPatchLastCb
    );
    expect(apiUserRolesRouter.get).toHaveBeenCalledWith(
      '/api/user-roles/:roleName',
      authMiddlewareReturnedFn,
      routerGetLastCb
    );
  });

  describe('router.post() second callback', () => {
    it('should call saveToDB(..) with correct params', () => {
      // routerPostHTTPMethod
    });
  });
});

function prepareMockHTTPMethodsInterception(callbacks) {
  [
    [_router.post, callbacks[0]],
    [_router.patch, callbacks[1]],
    [_router.get, callbacks[2]],
  ].forEach(([mockHTTPMethod, callback]) => {
    mockHTTPMethod.mockImplementationOnce(
      // use Proxy to intercept mockHTTPMethod call and change the last callback passed to it to be mock
      new Proxy(() => {}, {
        apply(target, thisArg, argumentsList) {
          const argsExceptLast = argumentsList.slice(0, -1);

          // clear before calling it via proxy
          mockHTTPMethod.mockClear();

          mockHTTPMethod(...argsExceptLast, callback);
        },
      })
    );
  });
}
