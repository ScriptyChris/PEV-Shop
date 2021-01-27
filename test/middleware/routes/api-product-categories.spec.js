const { getResMock } = require('../../commonMocks');
const { getFromDB } = jest
  .mock('../../../src/database/database-index')
  .requireMock('../../../src/database/database-index');
const { Router } = jest.mock('express').requireMock('express');
const { get: apiProductCategoriesRouterGet } = require('../../../src/middleware/routes/api-product-categories');
const routerGetCallback = apiProductCategoriesRouterGet.mock.calls[0][1];

describe('#api-product-categories', () => {
  afterAll(() => {
    Router.mockClear();
    Object.values(Router()).forEach((httpMethod) => httpMethod.mockClear());
  });

  it('should call Router() once', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('should call router.get(..) once with correct params', () => {
    const routerGet = Router().get;

    expect(routerGet).toHaveBeenCalledTimes(1);
    expect(routerGet).toHaveBeenCalledWith('/api/productCategories', expect.any(Function));
  });

  describe('router.get()', () => {
    const reqMock = Object.freeze({ param: null });

    afterEach(() => {
      Object.values(Router()).forEach((httpMethod) => httpMethod.mockClear());
      getFromDB.mockClear();
    });

    it('should call getFromDB(..) with correct params', async () => {
      getFromDB.mockImplementationOnce(() => []);

      await routerGetCallback(reqMock, getResMock());

      expect(getFromDB).toHaveBeenCalledWith('category', 'Product', { isDistinct: true });
    });

    it('should call res.status(..).json(..) with correct params in case of succeeded and failed result from getFromDB(..)', async () => {
      const resMock = getResMock();

      // succeeded case
      const nonEmptyProductCategories = ['test category'];
      getFromDB.mockImplementationOnce(() => nonEmptyProductCategories);

      await routerGetCallback(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock._jsonMethod).toHaveBeenCalledWith(nonEmptyProductCategories);

      // inline mocks cleanup
      resMock.status.mockClear();
      resMock._jsonMethod.mockClear();

      //failed case
      const emptyProductCategories = null;
      getFromDB.mockImplementationOnce(() => emptyProductCategories);

      await routerGetCallback(reqMock, resMock);

      const exception = new TypeError("Cannot read property 'forEach' of null");

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ exception });
    });
  });
});
