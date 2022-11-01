import { findAssociatedSrcModulePath, mockAndRequireModule, mockAndRequireDBModelsModules } from '@unitTests/utils';

mockAndRequireDBModelsModules();

import { getResMock, TJestMock } from '@unitTests/inline-mocks';
import { HTTP_STATUS_CODE } from '@src/types';
import { COLLECTION_NAMES } from '@database/models';

const { Router, _router } = mockAndRequireModule('express');
const { authMiddlewareFn: authMiddlewareFnMock } = mockAndRequireModule('src/middleware/features/auth');
const {
  getFromDB: getFromDBMock,
  // saveToDB: saveToDBMock,
  // updateOneModelInDB: updateOneModelInDBMock,
} = mockAndRequireModule('src/database/api');

describe('#api-user-roles', () => {
  const authMiddlewareReturnedFn = () => undefined;
  const reqMock = Object.freeze({
    body: {
      roleName: '[body] test role',
    },
    params: {
      roleName: '[params] test role',
    },
  });

  let apiUserRolesRouter: any = null;

  beforeAll(async () => {
    authMiddlewareFnMock
      // .mockImplementationOnce(() => authMiddlewareReturnedFn)
      // .mockName('postFirstCallback')
      // .mockImplementationOnce(() => authMiddlewareReturnedFn)
      // .mockName('patchFirstCallback')
      .mockImplementationOnce(() => authMiddlewareReturnedFn)
      .mockName('getFirstCallback');

    try {
      apiUserRolesRouter = (await import(findAssociatedSrcModulePath())).default;
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

  it('should call router.get(..) with correct params', () => {
    // expect(apiUserRolesRouter.post).toHaveBeenCalledTimes(1);
    // expect(apiUserRolesRouter.patch).toHaveBeenCalledTimes(1);
    expect(apiUserRolesRouter.get).toHaveBeenCalledTimes(1);

    // expect(apiUserRolesRouter.post).toHaveBeenCalledWith(
    //   '/api/user-roles',
    //   authMiddlewareReturnedFn,
    //   apiUserRolesRouter._saveUserRole
    // );
    // expect(apiUserRolesRouter.patch).toHaveBeenCalledWith(
    //   '/api/user-roles',
    //   authMiddlewareReturnedFn,
    //   apiUserRolesRouter._updateUserRole
    // );
    expect(apiUserRolesRouter.get).toHaveBeenCalledWith('/api/user-roles', apiUserRolesRouter._getUserRoles);
  });

  // describe('router.post(..) callback saveUserRole(..)', () => {
  //   beforeEach(() => {
  //     saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
  //   });

  //   afterEach(() => {
  //     saveToDBMock.mockClear();
  //   });

  //   it('should call saveToDB(..) once with correct params', async () => {
  //     await apiUserRolesRouter._saveUserRole(reqMock, getResMock());

  //     expect(saveToDBMock).toHaveBeenCalledTimes(1);
  //     expect(saveToDBMock).toHaveBeenCalledWith(
  //       { roleName: reqMock.body.roleName, permissions: reqMock.body.permissions },
  //       'UserRole'
  //     );
  //   });

  //   it('should call .save(..)', async () => {
  //     saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
  //     const saveMock = (await saveToDBMock()).save
  //       // clear mock from results of above call
  //       .mockClear();

  //     await apiUserRolesRouter._saveUserRole(reqMock, getResMock());

  //     expect(saveMock).toHaveBeenCalledTimes(1);
  //     expect(saveMock).toHaveBeenCalledWith();
  //   });

  //   it('should call res.status(..).json(..) with correct params', async () => {
  //     saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
  //     const resMock = getResMock();

  //     await apiUserRolesRouter._saveUserRole(reqMock, resMock);

  //     expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
  //     expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await saveToDBMock() });
  //   });
  // });

  // describe('router.patch(..) callback updateUserRole(..)', () => {
  //   beforeEach(() => {
  //     updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
  //   });

  //   afterEach(() => {
  //     updateOneModelInDBMock.mockClear();
  //   });

  //   it('should call updateOneModelInDB(..) once with correct params', async () => {
  //     await apiUserRolesRouter._updateUserRole(reqMock, getResMock());

  //     expect(updateOneModelInDBMock).toHaveBeenCalledTimes(1);
  //     expect(updateOneModelInDBMock).toHaveBeenCalledWith(
  //       { roleName: reqMock.body.roleName },
  //       reqMock.body.permissions,
  //       'UserRole'
  //     );
  //   });

  //   it('should call res.status(..).json(..) with correct params', async () => {
  //     updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
  //     const resMock = getResMock();

  //     await apiUserRolesRouter._updateUserRole(reqMock, resMock);

  //     expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
  //     expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: updateOneModelInDBMock() });
  //   });
  // });

  describe('router.get(..) callback getUserRoles(..)', () => {
    describe('when userRoles were found', () => {
      it('should call getFromDB(..) once with correct params', async () => {
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);

        await apiUserRolesRouter._getUserRoles(reqMock, getResMock());

        expect(getFromDBMock).toHaveBeenCalledTimes(1);
        expect(getFromDBMock).toHaveBeenCalledWith(
          { modelName: COLLECTION_NAMES.User_Role, findMultiple: true },
          {},
          { roleName: true }
        );
        getFromDBMock.mockClear();
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const mockedCustomReturn = [{ roleName: 'first' }, { roleName: 'second' }];
        getFromDBMock.mockReturnValueOnce(mockedCustomReturn);
        const resMock = getResMock();

        await apiUserRolesRouter._getUserRoles(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: ['first', 'second'] });
      });
    });

    describe('when userRoles were not found', () => {
      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();
        getFromDBMock.mockReturnValueOnce([]);

        await apiUserRolesRouter._getUserRoles(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'User roles not found!' });
      });
    });
  });
});
