const { getResMock } = require('../../commonMocks');
const { Router, _router } = jest.mock('express').requireMock('express');
const { authMiddlewareFn: authMiddlewareFnMock } = jest
  .mock('../../../src/middleware/features/auth')
  .requireMock('../../../src/middleware/features/auth');
const { getFromDB: getFromDBMock, saveToDB: saveToDBMock, updateOneModelInDB: updateOneModelInDBMock } = jest
  .mock('../../../src/database/database-index')
  .requireMock('../../../src/database/database-index');

describe('#api-user-roles', () => {
  const routerPostLastCbMock = jest.fn().mockName('postLastCallback');
  const routerPatchLastCbMock = jest.fn().mockName('patchLastCallback');
  const routerGetLastCbMock = jest.fn().mockName('getLastCallback');

  const authMiddlewareReturnedFn = () => {};
  let routerPostHTTPMethod = () => {};
  let routerPatchHTTPMethod = () => {};
  let routerGetHTTPMethod = () => {};

  let apiUserRolesRouter = null;
  let originalLastCallbacks = {};

  const reqMock = Object.freeze({
    body: {
      roleName: '',
      permissions: [],
    },
    params: {
      roleName: '',
    },
  });

  beforeAll(() => {
    originalLastCallbacks = interceptLastCallbacksFromMockedHTTPMethods([
      routerPostLastCbMock,
      routerPatchLastCbMock,
      routerGetLastCbMock,
    ]);

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

    expect(apiUserRolesRouter.post).toHaveBeenCalledWith(
      '/api/user-roles',
      authMiddlewareReturnedFn,
      routerPostLastCbMock
    );
    expect(apiUserRolesRouter.patch).toHaveBeenCalledWith(
      '/api/user-roles',
      authMiddlewareReturnedFn,
      routerPatchLastCbMock
    );
    expect(apiUserRolesRouter.get).toHaveBeenCalledWith(
      '/api/user-roles/:roleName',
      authMiddlewareReturnedFn,
      routerGetLastCbMock
    );
  });

  describe('router.post(..) last callback', () => {
    beforeEach(() => {
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
    });

    afterEach(() => {
      saveToDBMock.mockClear();
    });

    it('should call saveToDB(..) once with correct params', async () => {
      await originalLastCallbacks.post(reqMock, getResMock());

      expect(saveToDBMock).toHaveBeenCalledTimes(1);
      expect(saveToDBMock).toHaveBeenCalledWith(
        { roleName: reqMock.body.roleName, permissions: reqMock.body.permissions },
        'User-Role'
      );
    });

    it('should call .save(..)', async () => {
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
      const saveMock = (await saveToDBMock()).save
        // clear mock from results of above call
        .mockClear();

      await originalLastCallbacks.post(reqMock, getResMock());

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith();
    });

    it('should call res.status(..).json(..) with correct params', async () => {
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
      const resMock = getResMock();

      await originalLastCallbacks.post(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await saveToDBMock() });
    });
  });

  describe('router.patch(..) last callback', () => {
    beforeEach(() => {
      updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
    });

    afterEach(() => {
      updateOneModelInDBMock.mockClear();
    });

    it('should call updateOneModelInDB(..) once with correct params', async () => {
      await originalLastCallbacks.patch(reqMock, getResMock());

      expect(updateOneModelInDBMock).toHaveBeenCalledTimes(1);
      expect(updateOneModelInDBMock).toHaveBeenCalledWith(
        { roleName: reqMock.body.roleName },
        reqMock.body.permissions,
        'User-Role'
      );
    });

    it('should call res.status(..).json(..) with correct params', async () => {
      updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
      const resMock = getResMock();

      await originalLastCallbacks.patch(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await updateOneModelInDBMock() });
    });
  });

  describe('router.get(..) last callback', () => {
    beforeEach(() => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
    });

    afterEach(() => {
      getFromDBMock.mockClear();
    });

    it('should call getFromDB(..) once with correct params', async () => {
      await originalLastCallbacks.get(reqMock, getResMock());

      expect(getFromDBMock).toHaveBeenCalledTimes(1);
      expect(getFromDBMock).toHaveBeenCalledWith({ roleName: reqMock.params.roleName }, 'User-Role');
    });

    it('should call .execPopulate(..) once with correct param', async () => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      const execPopulateMock = (await getFromDBMock()).execPopulate
        // clear mock from results of above call
        .mockClear();

      await originalLastCallbacks.get(reqMock, getResMock());

      expect(execPopulateMock).toHaveBeenCalledTimes(1);
      expect(execPopulateMock).toHaveBeenCalledWith('owners');
    });

    it('should call res.status(..).json(..) with correct params', async () => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      const resMock = getResMock();

      await originalLastCallbacks.get(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await getFromDBMock() });
    });
  });
});

function interceptLastCallbacksFromMockedHTTPMethods(mockedCallbacks) {
  const originalLastCallbacks = {};

  [
    ['post', mockedCallbacks[0]],
    ['patch', mockedCallbacks[1]],
    ['get', mockedCallbacks[2]],
  ].forEach(([httpMethodName, mockedCallback]) => {
    const mockHTTPMethod = _router[httpMethodName];

    mockHTTPMethod.mockImplementationOnce(
      // use Proxy to intercept mockHTTPMethod call and change the last callback passed to it to be mock
      new Proxy(() => {}, {
        apply(target, thisArg, argumentsList) {
          const argsExceptLast = argumentsList.slice(0, -1);
          originalLastCallbacks[httpMethodName] = argumentsList[argumentsList.length - 1];

          // clear before calling it via proxy
          mockHTTPMethod.mockClear();

          mockHTTPMethod(...argsExceptLast, mockedCallback);
        },
      })
    );
  });

  return originalLastCallbacks;
}
