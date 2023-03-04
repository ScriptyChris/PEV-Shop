import { findAssociatedSrcModulePath, mockAndRequireModule, mockAndRequireDBModelsModules } from '@unitTests/utils';

mockAndRequireDBModelsModules();
mockAndRequireModule('src/middleware/helpers/form-data-handler');

import { HTTP_STATUS_CODE } from '@commons/types';
import { getNextFnMock, getResMock, TJestMock } from '@unitTests/inline-mocks';
import { COLLECTION_NAMES, USER_ROLES_MAP } from '@database/models';

const { Router, _router } = mockAndRequireModule('express');
const { authMiddlewareFn: authMiddlewareFnMock, userRoleMiddlewareFn: userRoleMiddlewareMock } =
  mockAndRequireModule('src/middleware/features/auth');
const { queryBuilder: queryBuilderMock } = mockAndRequireModule('src/database/utils/queryBuilder');
const {
  getFromDB: getFromDBMock,
  saveToDB: saveToDBMock,
  updateOneModelInDB: updateOneModelInDBMock,
  deleteFromDB: deleteFromDBMock,
} = mockAndRequireModule('src/database/api');

describe('#api-products', () => {
  let apiProductsRouter: any = null;

  beforeAll(async () => {
    userRoleMiddlewareMock
      .mockImplementationOnce(userRoleMiddlewareMock._succeededCall)
      .mockImplementationOnce(userRoleMiddlewareMock._succeededCall)
      .mockImplementationOnce(userRoleMiddlewareMock._succeededCall)
      .mockImplementationOnce(userRoleMiddlewareMock._succeededCall);

    try {
      apiProductsRouter = (await import(findAssociatedSrcModulePath())).default;
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
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
    expect(apiProductsRouter.post).toHaveBeenCalledWith(
      '/api/products',
      authMiddlewareFnMock,
      expect.any(Function),
      apiProductsRouter._addProduct
    );
    expect(userRoleMiddlewareMock.mock.calls[0][0]).toBe(USER_ROLES_MAP.seller);
    expect(apiProductsRouter.patch).toHaveBeenCalledWith(
      '/api/products/:url/add-review',
      authMiddlewareFnMock,
      expect.any(Function),
      apiProductsRouter._addReview
    );
    expect(userRoleMiddlewareMock.mock.calls[1][0]).toBe(USER_ROLES_MAP.client);
    expect(apiProductsRouter.patch).toHaveBeenCalledWith(
      '/api/products/',
      authMiddlewareFnMock,
      expect.any(Function),
      apiProductsRouter._modifyProduct
    );
    expect(userRoleMiddlewareMock.mock.calls[2][0]).toBe(USER_ROLES_MAP.seller);
    expect(apiProductsRouter.delete).toHaveBeenCalledWith(
      '/api/products/:url',
      authMiddlewareFnMock,
      expect.any(Function),
      apiProductsRouter._deleteProduct
    );
    expect(userRoleMiddlewareMock.mock.calls[3][0]).toBe(USER_ROLES_MAP.seller);
    expect(apiProductsRouter.use).toHaveBeenCalledWith(expect.any(Function));
  });

  describe('getProducts(..)', () => {
    const getReqMock = () => ({
      query: 'test query',
    });

    describe('when succeeded', () => {
      beforeEach(() => {
        queryBuilderMock.getIdListConfig.mockImplementationOnce(queryBuilderMock.getIdListConfig._succeededCall);
        queryBuilderMock.getNameListConfig.mockImplementationOnce(queryBuilderMock.getNameListConfig._succeededCall);
        queryBuilderMock.getPriceConfig.mockImplementationOnce(queryBuilderMock.getPriceConfig._succeededCall);
        queryBuilderMock.getSortingConfig.mockImplementationOnce(queryBuilderMock.getSortingConfig._succeededCall);
        queryBuilderMock.getProductsWithChosenCategories.mockImplementationOnce(
          queryBuilderMock.getProductsWithChosenCategories._succeededCall
        );
        queryBuilderMock.getPaginationConfig.mockImplementationOnce(
          queryBuilderMock.getPaginationConfig._succeededCall
        );
        queryBuilderMock.getSearchByNameConfig.mockImplementationOnce(
          queryBuilderMock.getSearchByNameConfig._succeededCall
        );
        queryBuilderMock.getSearchByUrlConfig.mockImplementationOnce(
          queryBuilderMock.getSearchByUrlConfig._succeededCall
        );
        queryBuilderMock.getTechnicalSpecs.mockImplementationOnce(queryBuilderMock.getTechnicalSpecs._succeededCall);
        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);
      });

      afterEach(() => {
        queryBuilderMock.getIdListConfig.mockClear();
        queryBuilderMock.getPriceConfig.mockClear();
        queryBuilderMock.getSortingConfig.mockClear();
        queryBuilderMock.getProductsWithChosenCategories.mockClear();
        queryBuilderMock.getPaginationConfig.mockClear();
        queryBuilderMock.getTechnicalSpecs.mockClear();
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
        const projection = {};
        await apiProductsRouter._getProducts(getReqMock(), getResMock());

        queryBuilderMock.getIdListConfig.mockImplementationOnce(queryBuilderMock.getIdListConfig._succeededCall);
        queryBuilderMock.getPaginationConfig.mockImplementationOnce(
          queryBuilderMock.getPaginationConfig._succeededCall
        );
        queryBuilderMock.getSortingConfig.mockImplementationOnce(queryBuilderMock.getSortingConfig._succeededCall);

        expect(getFromDBMock).toHaveBeenCalledWith(
          {
            modelName: COLLECTION_NAMES.Product,
            pagination: queryBuilderMock.getPaginationConfig(),
            sort: queryBuilderMock.getSortingConfig(),
            findMultiple: true,
          },
          queryBuilderMock.getIdListConfig(),
          projection
        );
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProducts(getReqMock(), resMock);

        const getPaginatedProducts = getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await getPaginatedProducts() });
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
    //     expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
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

        expect(getFromDBMock).toHaveBeenCalledWith({ modelName: COLLECTION_NAMES.Product }, reqMock.params._id);
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProductById(getReqMock(), resMock);

        getFromDBMock.mockImplementationOnce(getFromDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: await getFromDBMock() });
      });
    });

    describe('when failed', () => {
      it('should call next(..) when req is empty', async () => {
        const nextFnMock = getNextFnMock();

        await apiProductsRouter._getProductById(null, getResMock(), nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'params' of null`));
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._getProductById({}, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'Id params is empty or not attached!',
        });
      });
    });
  });

  // TODO: [unit tests] cover image files upload
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

        expect(saveToDBMock).toHaveBeenCalledWith(COLLECTION_NAMES.Product, {
          images: [],
          name: 'fields plainData mock',
        });
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();
        const newProductUrlMock = 'new-product-url';
        saveToDBMock.mockReset().mockImplementationOnce(async () => {
          const mockResult = await saveToDBMock._succeededCall();
          mockResult.url = newProductUrlMock;

          return mockResult;
        });

        await apiProductsRouter._addProduct(getReqMock(), resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: { productUrl: newProductUrlMock } });
      });
    });

    describe('when failed', () => {
      it('should call next(..) when req is empty', async () => {
        const nextFnMock = getNextFnMock();

        await apiProductsRouter._addProduct(null, getResMock(), nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'body' of null`));
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._addProduct({}, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'Product data is empty or not attached!',
        });
      });
    });
  });

  describe('addReview(..)', () => {
    const getReqMock = () => ({
      params: {
        url: 'test-product',
      },
      body: {
        author: 'Anonymous',
        rating: 3.5,
        content: 'some text',
        isAuthorAnonymous: false,
      },
      user: {
        login: 'Test Client',
      },
    });

    describe('when succeeded', () => {
      const getReviewsMock = () => ({
        reviews: {
          list: [],
        },
        save: getFromDBMock._succeededCall._clazz.prototype.save,
        validateReviewDuplicatedAuthor: jest.fn(() => false),
        addReview: jest.fn(),
      });

      afterEach(() => {
        getFromDBMock.mockClear();
      });

      it('should call getFromDB(..) with correct params', async () => {
        const reqMock = getReqMock();
        const reviewsMock = getReviewsMock();

        getFromDBMock.mockImplementationOnce(() => reviewsMock);
        await apiProductsRouter._addReview(reqMock, getResMock());

        expect(getFromDBMock).toBeCalledWith({ modelName: COLLECTION_NAMES.Product }, { url: reqMock.params.url });
      });

      it('should call .save(..) with correct params', async () => {
        const reqMock = getReqMock();
        const reviewsMock = getReviewsMock();

        getFromDBMock.mockImplementationOnce(() => reviewsMock);
        await apiProductsRouter._addReview(reqMock, getResMock());

        expect(reviewsMock.save).toBeCalled();
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();
        const reviewsMock = getReviewsMock();

        getFromDBMock.mockImplementationOnce(() => reviewsMock);
        await apiProductsRouter._addReview(getReqMock(), resMock);

        expect(resMock.status).toBeCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toBeCalledWith({ payload: reviewsMock.reviews });
      });
    });

    describe('when failed', () => {
      it('should call res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: String }) if validation failed', async () => {
        await Promise.all(
          [
            {
              ...getReqMock(),
              body: {
                ...getReqMock().body,
                rating: 'not a number',
              },
              __error: 'a number',
            },
            {
              ...getReqMock(),
              body: {
                ...getReqMock().body,
                rating: -1,
              },
              __error: 'greater than',
            },
            {
              ...getReqMock(),
              body: {
                ...getReqMock().body,
                rating: 6,
              },
              __error: 'less than',
            },
            {
              ...getReqMock(),
              body: {
                ...getReqMock().body,
                rating: 1.25,
              },
              __error: 'integer or .5 (a half)',
            },
            {
              ...getReqMock(),
              body: {
                ...getReqMock().body,
                isAuthorAnonymous: null,
              },
              __error: 'value must be a boolean!',
            },
          ].map(async (reqMock) => {
            const resMock = getResMock();

            await apiProductsRouter._addReview(reqMock, resMock, getNextFnMock());

            expect(resMock.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
            expect(resMock._jsonMethod).toBeCalledWith({ error: expect.stringContaining(reqMock.__error) });
          })
        );
      });

      it(`should call res.status(..).json(..) when getFromDB didn't find any product for review`, async () => {
        const resMock = getResMock();

        getFromDBMock.mockImplementationOnce(getFromDBMock._failedCall.general);
        await apiProductsRouter._addReview(getReqMock(), resMock);

        expect(resMock.status).toBeCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock._jsonMethod).toBeCalledWith({ error: 'Reviewed product not found!' });
      });
    });
  });

  describe('addReview.isNumber(..)', () => {
    it('should return true when passed number and false otherwise', () => {
      expect(apiProductsRouter._addReview.isNumber(1)).toBe(true);
      expect(apiProductsRouter._addReview.isNumber(0.5)).toBe(true);
      expect(apiProductsRouter._addReview.isNumber('a')).toBe(false);
      expect(apiProductsRouter._addReview.isNumber(null)).toBe(false);
      expect(apiProductsRouter._addReview.isNumber(undefined)).toBe(false);
    });
  });

  describe('addReview.isIntOrDecimalHalf(..)', () => {
    it('should return true when passed number is integer or decimal-half and false otherwise', () => {
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(0)).toBe(true);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(1)).toBe(true);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(0.5)).toBe(true);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(1.5)).toBe(true);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(0.25)).toBe(false);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(1.25)).toBe(false);
      expect(apiProductsRouter._addReview.isIntOrDecimalHalf(4.75)).toBe(false);
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

      it('should call updateOneModelInDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._modifyProduct(reqMock, getResMock());

        expect(updateOneModelInDBMock).toHaveBeenCalledWith(
          COLLECTION_NAMES.Product,
          reqMock.body.productId,
          reqMock.body.modifications
        );
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._modifyProduct(getReqMock(), resMock);

        updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._succeededCall);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: updateOneModelInDBMock() });
      });
    });

    describe('when failed', () => {
      it('should call next(..) with an exception if req is empty', async () => {
        const nextFnMock = getNextFnMock();

        await apiProductsRouter._modifyProduct(null, getResMock(), nextFnMock);

        expect(nextFnMock).toHaveBeenCalledWith(TypeError(`Cannot read property 'body' of null`));
      });

      it('should call res.status(..).json(..) with correct params', async () => {
        const resMock = getResMock();

        // null req.body case
        await apiProductsRouter._modifyProduct({ body: null }, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({
          error: 'Request body is empty or not attached!',
        });

        // product to modify not found
        updateOneModelInDBMock.mockImplementationOnce(updateOneModelInDBMock._failedCall);
        await apiProductsRouter._modifyProduct({ userPermissions: true, body: {} }, resMock);

        expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'Product to modify not found!' });
      });
    });
  });

  describe('deleteProduct(..)', () => {
    const getReqMock = () => ({
      userPermissions: true,
      params: {
        url: 'test-product',
      },
    });

    describe('when succeeded', () => {
      beforeEach(() => {
        deleteFromDBMock.mockImplementationOnce(deleteFromDBMock._succeededCall);
      });

      afterEach(() => {
        deleteFromDBMock.mockClear();
      });

      it('should call deleteFromDB(..) with correct params', async () => {
        const reqMock = getReqMock();

        await apiProductsRouter._deleteProduct(reqMock, getResMock());

        expect(deleteFromDBMock).toBeCalledWith(COLLECTION_NAMES.Product, reqMock.params.url);
      });

      it('should call res.sendStatus(..) with correct params', async () => {
        const resMock = getResMock();

        await apiProductsRouter._deleteProduct(getReqMock(), resMock);

        expect(resMock.sendStatus).toBeCalledWith(HTTP_STATUS_CODE.NO_CONTENT);
      });
    });

    describe('when failed', () => {
      it('should call res.status(..).json(..) with correct params', async () => {
        const reqMock = getReqMock();

        const resMock0 = getResMock();
        await apiProductsRouter._deleteProduct({}, resMock0);
        expect(resMock0.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(resMock0._jsonMethod).toBeCalledWith({ error: 'Url param is empty or not attached!' });

        const resMock1 = getResMock();
        deleteFromDBMock.mockImplementationOnce(deleteFromDBMock._failedCall.general);
        await apiProductsRouter._deleteProduct(reqMock, resMock1);
        expect(resMock1.status).toBeCalledWith(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(resMock1._jsonMethod).toBeCalledWith({
          exception: { message: expect.stringContaining('Failed to delete the product - ') },
        });

        const resMock2 = getResMock();
        deleteFromDBMock.mockImplementationOnce(deleteFromDBMock._failedCall.nothingFound);
        await apiProductsRouter._deleteProduct(reqMock, resMock2);
        expect(resMock2.status).toBeCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
        expect(resMock2._jsonMethod).toBeCalledWith({ error: 'Could not find product to delete!' });
      });
    });
  });
});
