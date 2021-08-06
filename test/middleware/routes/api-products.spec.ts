import { TJestMock } from '../../../src/types';
import { getResMock } from '../../mockUtils';

const { Router, _router } = jest.mock('express').requireMock('express').default;
const { authMiddlewareFn: authMiddlewareFnMock, userRoleMiddlewareFn: userRoleMiddlewareMock } = jest
  .mock('../../../src/middleware/features/auth')
  .requireMock('../../../src/middleware/features/auth');
const {
  getFromDB: getFromDBMock,
  saveToDB: saveToDBMock,
  updateOneModelInDB: updateOneModelInDBMock,
  queryBuilder: queryBuilderMock,
} = jest.mock('../../../src/database/database-index').requireMock('../../../src/database/database-index');

describe('#api-products', () => {
  let apiProductsRouter: any = null;

  beforeAll(async () => {
    authMiddlewareFnMock.mockImplementationOnce(authMiddlewareFnMock._succeededCall);
    userRoleMiddlewareMock.mockImplementationOnce(userRoleMiddlewareMock._succeededCall);

    apiProductsRouter = (await import('../../../src/middleware/routes/api-products')).default;
  });

  afterAll(() => {
    authMiddlewareFnMock.mockClear();
    userRoleMiddlewareMock.mockClear();

    Router.mockClear();
    Object.getOwnPropertyNames(_router).forEach((httpMethodName) => {
      const httpMethod: TJestMock = _router[httpMethodName];
      httpMethod.mockClear();
    });
  });

  it('should call Router() once', () => {
    expect(Router).toHaveBeenCalledTimes(1);
    expect(Router).toHaveBeenCalledWith();
  });

  it('should call router HTTP methods with correct params', () => {
    expect(apiProductsRouter.get).toHaveBeenCalledWith('/api/products', apiProductsRouter._getProducts);
    expect(apiProductsRouter.get).toHaveBeenCalledWith('/api/products/:id', apiProductsRouter._getProductById);
    expect(apiProductsRouter.post).toHaveBeenCalledWith('/api/products', apiProductsRouter._addProduct);
    expect(apiProductsRouter.patch).toHaveBeenCalledWith(
      '/api/products/',
      expect.any(Function),
      expect.any(Function),
      apiProductsRouter._modifyProduct
    );
  });

  describe('getProducts(..)', () => {
    const getReqMock = () => ({
      query: 'test query',
    });

    describe('when succeeded', () => {
      beforeEach(() => {
        queryBuilderMock.getIdListConfig.mockImplementationOnce(queryBuilderMock.getIdListConfig._succeededCall);
        queryBuilderMock.getProductsWithChosenCategories.mockImplementationOnce(
          queryBuilderMock.getProductsWithChosenCategories._succeededCall
        );
        queryBuilderMock.getPaginationConfig.mockImplementationOnce(
          queryBuilderMock.getPaginationConfig._succeededCall
        );
        queryBuilderMock.getSearchByNameConfig.mockImplementationOnce(
          queryBuilderMock.getSearchByNameConfig._succeededCall
        );
        queryBuilderMock.getFilters.mockImplementationOnce(queryBuilderMock.getFilters._succeededCall);
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      });

      afterEach(() => {
        queryBuilderMock.getIdListConfig.mockClear();
        queryBuilderMock.getProductsWithChosenCategories.mockClear();
        queryBuilderMock.getPaginationConfig.mockClear();
        queryBuilderMock.getFilters.mockClear();
        getFromDBMock.mockClear();
      });

      it('should call queryBuilder.getIdListConfig(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._getProducts(reqMock, getResMock());

        expect(queryBuilderMock.getIdListConfig).toHaveBeenCalledWith(reqMock.query);
      });

      it('should call queryBuilder.getProductsWithChosenCategories(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._getProducts(reqMock, getResMock());

        expect(queryBuilderMock.getProductsWithChosenCategories).toHaveBeenCalledWith(reqMock.query);
      });

      it('should call queryBuilder.getPaginationConfig(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._getProducts(reqMock, getResMock());

        expect(queryBuilderMock.getPaginationConfig).toHaveBeenCalledWith(reqMock.query);
      });

      it('should call getFromDB(..) with correct params', async () => {
        await apiProductsRouter._getProducts(getReqMock(), getResMock());

        queryBuilderMock.getIdListConfig.mockImplementationOnce(queryBuilderMock.getIdListConfig._succeededCall);
        queryBuilderMock.getPaginationConfig.mockImplementationOnce(
          queryBuilderMock.getPaginationConfig._succeededCall
        );

        expect(getFromDBMock).toHaveBeenCalledWith(queryBuilderMock.getIdListConfig(), 'Product', {
          pagination: queryBuilderMock.getPaginationConfig(),
        });
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProducts(getReqMock(), resMock);

        const getPaginatedProducts = getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock._jsonMethod).toHaveBeenCalledWith(await getPaginatedProducts());
      });
    });

    // TODO: add unit tests for failed case
    //describe('when failed', () => {
    //   it('should call res.status(..).json(..) with correct params', async () => {
    //     queryBuilderMock.getIdListConfig.mockImplementationOnce(queryBuilderMock.getIdListConfig._failedCall);
    //     queryBuilderMock.getProductsWithChosenCategories.mockImplementationOnce(
    //       queryBuilderMock.getProductsWithChosenCategories._failedCall
    //     );
    //     queryBuilderMock.getPaginationConfig.mockImplementationOnce(queryBuilderMock.getPaginationConfig._failedCall);
    //     getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall);
    //
    //     const resMock = getResMock();
    //
    //     await apiProductsRouter._getProducts(getReqMock(), resMock);
    //
    //     expect(resMock.status).toHaveBeenCalledWith(500);
    //     expect(resMock._jsonMethod).toHaveBeenCalledWith();
    //   });
    // });
  });

  describe('getProductById(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => ({
        params: {
          _id: 'test id',
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

        await apiProductsRouter._getProductById(reqMock, getResMock());

        expect(getFromDBMock).toHaveBeenCalledWith(reqMock.params._id, 'Product');
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProductById(getReqMock(), resMock);

        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock._jsonMethod).toHaveBeenCalledWith(await getFromDBMock());
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProductById({}, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property '_id' of undefined`),
        });
      });
    });
  });

  describe('addProduct(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => ({
        body: 'test body',
      });

      beforeEach(() => {
        saveToDBMock.mockImplementationOnce(saveToDBMock._succeededCall);
      });

      afterEach(() => {
        saveToDBMock.mockClear();
      });

      it('should call saveToDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._addProduct(reqMock, getResMock());

        expect(saveToDBMock).toHaveBeenCalledWith(reqMock.body, 'Product');
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._addProduct(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ msg: 'Success!' });
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._addProduct(null, resMock);

        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'body' of null`),
        });
      });
    });
  });

  describe('modifyProduct(..)', () => {
    describe('when succeeded', () => {
      const getReqMock = () => ({
        userPermissions: true,
        body: {
          productId: 123,
          modifications: {
            modA: true,
            modB: false,
          },
        },
      });

      beforeEach(() => {
        updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);
      });

      afterEach(() => {
        updateOneModelInDBMock.mockClear();
      });

      it('should call updateOneModelInDB(..) with correct params', () => {
        const reqMock = getReqMock();

        apiProductsRouter._modifyProduct(reqMock, getResMock());

        expect(updateOneModelInDBMock).toHaveBeenCalledWith(
          reqMock.body.productId,
          reqMock.body.modifications,
          'Product'
        );
      });

      it('should call res.status(..).json(..) with correct params', () => {
        const resMock = getResMock();

        apiProductsRouter._modifyProduct(getReqMock(), resMock);

        updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: updateOneModelInDBMock() });
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', () => {
        const resMock = getResMock();

        // no user permissions case
        apiProductsRouter._modifyProduct({ userPermissions: false }, resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({ exception: Error('User has no permissions!') });

        // null req.body case
        apiProductsRouter._modifyProduct({ userPermissions: true, body: null }, resMock);

        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          exception: TypeError(`Cannot read property 'productId' of null`),
        });

        // all cases
        expect(resMock.status).toHaveBeenCalledWith(403);
        expect(resMock.status).toHaveBeenCalledTimes(2);
      });
    });
  });
});
