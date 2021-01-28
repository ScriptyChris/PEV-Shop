const { getResMock } = require('../../mockUtils');
const { Router, _router } = jest.mock('express').requireMock('express');
const { authMiddlewareFn: authMiddlewareFnMock } = jest
  .mock('../../../src/middleware/features/auth')
  .requireMock('../../../src/middleware/features/auth');
const { getFromDB: getFromDBMock, saveToDB: saveToDBMock, updateOneModelInDB: updateOneModelInDBMock } = jest
  .mock('../../../src/database/database-index')
  .requireMock('../../../src/database/database-index');

describe('#api-user-roles', () => {
  const authMiddlewareReturnedFn = () => {};
  const reqMock = Object.freeze({
    body: {
      roleName: '',
      permissions: [],
    },
    params: {
      roleName: '',
    },
  });

  let apiUserRolesRouter = null;

  beforeAll(() => {
    authMiddlewareFnMock
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('postFirstCallback')
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('patchFirstCallback')
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('getFirstCallback');

    apiUserRolesRouter = require('../../../src/middleware/routes/api-user-roles');
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
      apiUserRolesRouter._saveUserRole
    );
    expect(apiUserRolesRouter.patch).toHaveBeenCalledWith(
      '/api/user-roles',
      authMiddlewareReturnedFn,
      apiUserRolesRouter._updateUserRole
    );
    expect(apiUserRolesRouter.get).toHaveBeenCalledWith(
      '/api/user-roles/:roleName',
      authMiddlewareReturnedFn,
      apiUserRolesRouter._getUserRole
    );
  });

  describe('router.post(..) callback saveUserRole(..)', () => {
    beforeEach(() => {
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
    });

    afterEach(() => {
      saveToDBMock.mockClear();
    });

    it('should call saveToDB(..) once with correct params', async () => {
      await apiUserRolesRouter._saveUserRole(reqMock, getResMock());

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

      await apiUserRolesRouter._saveUserRole(reqMock, getResMock());

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith();
    });

    it('should call res.status(..).json(..) with correct params', async () => {
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
      const resMock = getResMock();

      await apiUserRolesRouter._saveUserRole(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await saveToDBMock() });
    });
  });

  describe('router.patch(..) callback updateUserRole(..)', () => {
    beforeEach(() => {
      updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
    });

    afterEach(() => {
      updateOneModelInDBMock.mockClear();
    });

    it('should call updateOneModelInDB(..) once with correct params', async () => {
      await apiUserRolesRouter._updateUserRole(reqMock, getResMock());

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

      await apiUserRolesRouter._updateUserRole(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await updateOneModelInDBMock() });
    });
  });

  describe('router.get(..) callback getUserRole(..)', () => {
    beforeEach(() => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
    });

    afterEach(() => {
      getFromDBMock.mockClear();
    });

    it('should call getFromDB(..) once with correct params', async () => {
      await apiUserRolesRouter._getUserRole(reqMock, getResMock());

      expect(getFromDBMock).toHaveBeenCalledTimes(1);
      expect(getFromDBMock).toHaveBeenCalledWith({ roleName: reqMock.params.roleName }, 'User-Role');
    });

    it('should call .execPopulate(..) once with correct param', async () => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      const execPopulateMock = (await getFromDBMock()).execPopulate
        // clear mock from results of above call
        .mockClear();

      await apiUserRolesRouter._getUserRole(reqMock, getResMock());

      expect(execPopulateMock).toHaveBeenCalledTimes(1);
      expect(execPopulateMock).toHaveBeenCalledWith('owners');
    });

    it('should call res.status(..).json(..) with correct params', async () => {
      getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      const resMock = getResMock();

      await apiUserRolesRouter._getUserRole(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await getFromDBMock() });
    });
  });
});
