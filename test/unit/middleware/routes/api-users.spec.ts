import { mockAndRequireModule, findAssociatedSrcModulePath } from '@unitTests/utils';
import { HTTP_STATUS_CODE } from '@src/types';
import { getResMock, getNextFnMock, TJestMock } from '@unitTests/inline-mocks';

const { ObjectId: ObjectIdMock } = mockAndRequireModule('mongodb');
const { Router, _router } = mockAndRequireModule('express');
const { authMiddlewareFn: authMiddlewareFnMock, hashPassword: hashPasswordMock } =
  mockAndRequireModule('src/middleware/features/auth');
const {
  getFromDB: getFromDBMock,
  saveToDB: saveToDBMock,
  updateOneModelInDB: updateOneModelInDBMock,
} = mockAndRequireModule('src/database/database-index');

// this should not be required?
mockAndRequireModule('src/database/models/_user');

describe('#api-users', () => {
  const authMiddlewareReturnedFn = () => undefined;
  const getReqMock = () => ({
    body: {
      login: 'user123',
      password: 'password123',
      roleName: 'role123',
    },
  });

  let apiUsersRouter: any = null;

  beforeAll(async () => {
    authMiddlewareFnMock
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockImplementationOnce(() => authMiddlewareReturnedFn);

    try {
      apiUsersRouter = (await import(findAssociatedSrcModulePath())).default;
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  afterAll(() => {
    Router.mockClear();
    Object.getOwnPropertyNames(_router).forEach((httpMethodName) => {
      const httpMethod: TJestMock = _router[httpMethodName];
      httpMethod.mockClear();
    });
  });

  it('should call Router() once', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('should call router.post(..) and router.get(..) specific amount of times with correct params', () => {
    expect(apiUsersRouter.post).toHaveBeenCalledTimes(10);
    expect(apiUsersRouter.patch).toHaveBeenCalledTimes(2);
    expect(apiUsersRouter.get).toHaveBeenCalledTimes(2);
    expect(apiUsersRouter.delete).toHaveBeenCalledTimes(3);

    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/add-product-to-observed',
      authMiddlewareReturnedFn,
      apiUsersRouter._addProductToObserved
    );
    expect(apiUsersRouter.delete).toHaveBeenCalledWith(
      '/api/users/remove-product-from-observed/:productId',
      authMiddlewareReturnedFn,
      apiUsersRouter._removeProductFromObserved
    );
    expect(apiUsersRouter.delete).toHaveBeenCalledWith(
      '/api/users/remove-all-products-from-observed',
      authMiddlewareReturnedFn,
      apiUsersRouter._removeAllProductsFromObserved
    );
    expect(apiUsersRouter.get).toHaveBeenCalledWith(
      '/api/users/observed-products',
      authMiddlewareReturnedFn,
      apiUsersRouter._getObservedProducts
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith('/api/users/register', apiUsersRouter._registerUser);
    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/confirm-registration',
      apiUsersRouter._confirmRegistration
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/resend-confirm-registration',
      apiUsersRouter._resendConfirmRegistration
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith('/api/users/login', apiUsersRouter._logInUser);
    expect(apiUsersRouter.post).toHaveBeenCalledWith('/api/users/reset-password', apiUsersRouter._resetPassword);
    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/resend-reset-password',
      apiUsersRouter._resendResetPassword
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/logout',
      authMiddlewareReturnedFn,
      apiUsersRouter._logOutUser
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith(
      '/api/users/logout-all',
      authMiddlewareReturnedFn,
      apiUsersRouter._logOutUserFromSessions
    );
    expect(apiUsersRouter.patch).toHaveBeenCalledWith('/api/users/set-new-password', apiUsersRouter._setNewPassword);
    expect(apiUsersRouter.patch).toHaveBeenCalledWith(
      '/api/users/change-password',
      authMiddlewareReturnedFn,
      apiUsersRouter._changePassword
    );
    expect(apiUsersRouter.post).toHaveBeenCalledWith('/api/users/', apiUsersRouter._updateUser);
    expect(apiUsersRouter.get).toHaveBeenCalledWith(
      '/api/users/:id',
      authMiddlewareReturnedFn,
      apiUsersRouter._getUser
    );
    expect(apiUsersRouter.use).toHaveBeenCalledWith(expect.any(Function));
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
          'UserRole'
        );
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiUsersRouter._updateUser(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ message: 'Success!' });
      });
    });

    describe('when failed', () => {
      it('should call next(..) if cannot read req.body.password', async () => {
        const nextFnMock = getNextFnMock();

        await apiUsersRouter._updateUser({}, getResMock(), nextFnMock);

        expect(nextFnMock).toBeCalledWith(TypeError(`Cannot read property 'password' of undefined`));
      });
    });
  });

  describe('logInUser(..)', () => {
    const { matchPassword: matchPasswordMock, generateAuthToken: generateAuthTokenMock } =
      getFromDBMock._succeededCall._clazz.prototype;

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

      it('should call next(..) with exception when req is empty', async () => {
        const resMock = getResMock();
        const nextFnMock = getNextFnMock();

        await apiUsersRouter._logInUser(null, resMock, nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'body' of null`));
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        // empty user
        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall.general);

        await apiUsersRouter._logInUser(getReqMock(), resMock, getNextFnMock());

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'Invalid credentials!',
        });

        resMock._jsonMethod.mockClear();

        // password not matched
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
        matchPasswordMock.mockImplementationOnce(matchPasswordMock._failedCall);

        await apiUsersRouter._logInUser(getReqMock(), resMock, getNextFnMock());

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'Invalid credentials!',
        });

        // user not confirmed
        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall.notConfirmed);
        matchPasswordMock.mockImplementationOnce(matchPasswordMock._succeededCall);

        await apiUsersRouter._logInUser(getReqMock(), resMock, getNextFnMock());

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'User registration is not confirmed!',
        });

        resMock._jsonMethod.mockClear();

        // all cases
        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(resMock.status).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('logOutUser(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => {
        const user = new getFromDBMock._succeededCall._clazz();
        user.tokens = {
          auth: ['some token from db'],
        };

        return {
          token: 'a token from req',
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

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ authToken: null });
      });
    });

    describe('when failed', () => {
      it('should call next(..) with exception when req.user is empty', async () => {
        const nextFnMock = getNextFnMock();

        await apiUsersRouter._logOutUser({}, getResMock(), nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'tokens' of undefined`));
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

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          payload: await getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall)(),
        });
      });
    });

    describe('when failed', () => {
      it('should call next(..) with an exceotion when req.params.id is undefined', async () => {
        const nextFnMock = getNextFnMock();

        await apiUsersRouter._getUser({}, getResMock(), nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'id' of undefined`));
      });

      it('should call res.status(..).json(..) with correct params when User was not found', async () => {
        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall.general);

        const emptyReqMock = {
          params: {
            id: 'test',
          },
        };
        const resMock = getResMock();

        await apiUsersRouter._getUser(emptyReqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'User not found!' });
      });
    });
  });
});
