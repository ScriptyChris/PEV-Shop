const { getResMock } = require('../../mockUtils');
const { Router, _router } = jest.mock('express').requireMock('express');
const { authMiddlewareFn: authMiddlewareFnMock, hashPassword: hashPasswordMock } = jest
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
  const getReqMock = () => ({
    body: {
      login: 'user123',
      password: 'password123',
      roleName: 'role123',
    },
  });

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

  describe('updateUser(..)', () => {
    beforeEach(() => {
      hashPasswordMock.mockImplementationOnce(hashPasswordMock._succeededCall);
      saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
      updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
    });

    afterEach(() => {
      hashPasswordMock.mockClear();
      saveToDBMock.mockClear();
      updateOneModelInDBMock.mockClear();
    });

    describe('when succeeded', () => {
      it('should call hashPassword(..) with correct param', async () => {
        await apiUsersRouter._updateUser(getReqMock(), getResMock());
        expect(hashPasswordMock).toHaveBeenCalledWith(getReqMock().body.password);
      });

      it('should call saveToDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiUsersRouter._updateUser(reqMock, getResMock());

        expect(saveToDBMock).toHaveBeenCalledWith(reqMock.body, 'User');
      });

      it('should call updateOneModelInDB(..) with correct params', async () => {
        const reqMock = getReqMock();
        saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);

        await apiUsersRouter._updateUser(reqMock, getResMock());

        expect(updateOneModelInDBMock).toHaveBeenCalledWith(
          { roleName: reqMock.body.roleName },
          {
            action: 'addUnique',
            data: {
              owners: new ObjectIdMock(await saveToDBMock(reqMock.body)._id),
            },
          },
          'User-Role'
        );
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiUsersRouter._updateUser(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ msg: 'Success!' });
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', () => {
        const resMock = getResMock();
        const rejectionReason = TypeError(`Cannot read property 'password' of undefined`);

        apiUsersRouter._updateUser({}, resMock).catch(() => {
          expect(resMock.status).toHaveBeenCalledWith(500);
          expect(resMock._jsonMethod).toHaveBeenCalledWith({ exception: rejectionReason });
        });
      });
    });
  });

  describe('logInUser(..)', () => {
    const {
      matchPassword: matchPasswordMock,
      generateAuthToken: generateAuthTokenMock,
    } = getFromDBMock._succeededCall._clazz.prototype;

    describe('when succeeded', () => {
      beforeEach(() => {
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
        matchPasswordMock.mockImplementationOnce(matchPasswordMock._succeededCall);
      });

      afterEach(() => {
        getFromDBMock.mockClear();
        matchPasswordMock.mockClear();
      });

      it('should call getFromDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiUsersRouter._logInUser(reqMock, getResMock());

        expect(getFromDBMock).toHaveBeenCalledWith({ login: reqMock.body.login }, 'User');
      });

      it('should call user.matchPassword(..) with correct param', async () => {
        const reqMock = getReqMock();

        await apiUsersRouter._logInUser(reqMock, getResMock());

        expect(matchPasswordMock).toHaveBeenCalledWith(reqMock.body.password);
      });

      it('should call user.generateAuthToken() without params', async () => {
        await apiUsersRouter._logInUser(getReqMock(), getResMock());

        expect(generateAuthTokenMock).toHaveBeenCalledWith();
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiUsersRouter._logInUser(reqMock, getResMock());

        expect(generateAuthTokenMock).toHaveBeenCalledWith();
      });
    });

    describe('when failed', () => {
      afterAll(() => {
        getFromDBMock.mockClear();
        matchPasswordMock.mockClear();
      });

      it('should not call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();
        getFromDBMock.mockImplementation(getFromDBMock._succeededCall);

        // first case
        await apiUsersRouter._logInUser({}, resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'login' of undefined`),
        });

        resMock._jsonMethod.mockClear();

        // second case
        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall);

        await apiUsersRouter._logInUser(getReqMock(), resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'matchPassword' of null`),
        });

        // third case
        matchPasswordMock.mockImplementationOnce(matchPasswordMock._failedCall);

        await apiUsersRouter._logInUser(getReqMock(), resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({ exception: Error(`Invalid credentials`) });

        // all cases
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.status).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('logOutUser(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => {
        const user = new getFromDBMock._succeededCall._clazz();
        user.tokens = ['some token'];

        return {
          token: 'a token',
          user,
        };
      };

      it('should call req.user.save()', async () => {
        await apiUsersRouter._logOutUser(getReqMock(), getResMock());

        expect(getFromDBMock._succeededCall._clazz.prototype.save).toHaveBeenCalledWith();
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiUsersRouter._logOutUser(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: 'Logged out!' });
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        // empty req case
        const emptyReqMock = {};

        await apiUsersRouter._logOutUser(emptyReqMock, resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'tokens' of undefined`),
        });

        // empty req.user case
        const reqMockWithEmptyUser = {
          user: {},
        };

        await apiUsersRouter._logOutUser(reqMockWithEmptyUser, resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'tokens' of undefined`),
        });

        // all cases
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.status).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getUser(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => ({
        params: {
          id: 'test',
        },
      });

      beforeEach(() => {
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      });

      afterEach(() => {
        getFromDBMock.mockClear();
      });

      it('should call getFromDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiUsersRouter._getUser(reqMock, getResMock());

        expect(getFromDBMock).toHaveBeenCalledWith(reqMock.params.id, 'User');
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiUsersRouter._getUser(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          payload: await getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall)(),
        });
      });
    });

    describe('when failed', () => {
      it('should return promise rejected with correct reason', () => {
        const emptyReqMock = {};
        const resMock = getResMock();

        return apiUsersRouter._getUser(emptyReqMock, resMock).catch((error) => {
          expect(error).toEqual(TypeError(`Cannot read property 'id' of undefined`));
        });
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall);

        const emptyReqMock = {
          params: {
            id: 'test',
          },
        };
        const resMock = getResMock();

        await apiUsersRouter._getUser(emptyReqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: null });
      });
    });
  });
});
