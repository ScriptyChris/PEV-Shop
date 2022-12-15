import { mockAndRequireModule, findAssociatedSrcModulePath, mockAndRequireDBModelsModules } from '@unitTests/utils';

mockAndRequireDBModelsModules();

import { getResMock, TJestMock } from '@unitTests/inline-mocks';
import { HTTP_STATUS_CODE } from '@src/types';
import { COLLECTION_NAMES } from '@database/models';

const { getFromDB } = mockAndRequireModule('src/database/api');
const { Router } = mockAndRequireModule('express');

describe('#api-product-categories', () => {
  let apiProductCategoriesRouterGet: any;
  let routerGetCallback: any;

  beforeAll(async () => {
    try {
      apiProductCategoriesRouterGet = (await import(findAssociatedSrcModulePath())).default.get;
      routerGetCallback = apiProductCategoriesRouterGet.mock.calls[0][1];
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  afterAll(() => {
    Router.mockClear();

    const router = Router();

    Object.getOwnPropertyNames(router).forEach((httpMethodName) => {
      const httpMethod: TJestMock = router[httpMethodName];
      httpMethod.mockClear();
    });
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
      const router = Router();
      Object.getOwnPropertyNames(router).forEach((httpMethodName) => {
        const httpMethod: TJestMock = router[httpMethodName];
        httpMethod.mockClear();
      });

      getFromDB.mockClear();
    });

    it('should call getFromDB(..) with correct params', async () => {
      getFromDB.mockImplementationOnce(() => []);

      await routerGetCallback(reqMock, getResMock());

      expect(getFromDB).toHaveBeenCalledWith({ modelName: COLLECTION_NAMES.Product, isDistinct: true }, 'category');
    });

    it('should call res.status(..).json(..) with correct params in case of succeeded and failed result from getFromDB(..)', async () => {
      // succeeded case
      const categoriesInputAndOutput = [
        {
          input: ['test category'],
          output: [
            {
              categoryName: 'test category',
            },
          ],
        },
        {
          input: ['parent category:test category'],
          output: [{ categoryName: 'parent category', childCategories: [{ categoryName: 'test category' }] }],
        },
      ];

      await Promise.all(
        categoriesInputAndOutput.map(async (value) => {
          const resMock = getResMock();
          getFromDB.mockImplementationOnce(() => value.input);

          await routerGetCallback(reqMock, resMock).catch(console.error);

          expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
          expect(resMock._jsonMethod).toHaveBeenCalledWith({ payload: value.output });

          // inline mocks cleanup
          resMock.status.mockClear();
          resMock._jsonMethod.mockClear();
        })
      );

      // failed case
      const resMock = getResMock();
      const emptyProductCategories = null;
      getFromDB.mockImplementationOnce(() => emptyProductCategories);

      await routerGetCallback(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(resMock._jsonMethod).toHaveBeenCalledWith({ error: 'Product categories not found!' });
    });
  });
});
