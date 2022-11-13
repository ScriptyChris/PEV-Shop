import { getMockImplementationError } from '@unitTests/inline-mocks';

export const queryBuilder = (() => {
  const _queryBuilder: any = {
    getIdListConfig: jest.fn(() => {
      throw getMockImplementationError('getIdListConfig');
    }),
    getNameListConfig: jest.fn(() => {
      throw getMockImplementationError('getNameListConfig');
    }),
    getProductsWithChosenCategories: jest.fn(() => {
      throw getMockImplementationError('getProductsWithChosenCategories');
    }),
    getPaginationConfig: jest.fn(() => {
      throw getMockImplementationError('getPaginationConfig');
    }),
    getSearchByNameConfig: jest.fn(() => {
      throw getMockImplementationError('getSearchByNameConfig');
    }),
    getSearchByUrlConfig: jest.fn(() => {
      throw getMockImplementationError('getSearchByUrlConfig');
    }),
    getFilters: jest.fn(() => {
      throw getMockImplementationError('getFilters');
    }),
  };
  _queryBuilder.getIdListConfig._succeededCall = () => ({
    _id: { $in: ['123'] },
  });
  _queryBuilder.getIdListConfig._failedCall = () => null;

  _queryBuilder.getNameListConfig._succeededCall = () => ({
    name: { $in: ['first', 'second', 'third'] },
  });
  _queryBuilder.getNameListConfig._failedCall = () => null;

  _queryBuilder.getProductsWithChosenCategories._succeededCall = () => ({
    category: {
      $in: ['test category'],
    },
  });
  _queryBuilder.getProductsWithChosenCategories._failedCall = () => null;

  _queryBuilder.getPaginationConfig._succeededCall = () => ({
    page: 1,
    limit: 10,
  });
  _queryBuilder.getPaginationConfig._failedCall = () => null;

  _queryBuilder.getSearchByNameConfig._succeededCall = () => ({
    name: /test/,
  });
  _queryBuilder.getSearchByNameConfig._failedCall = () => null;

  _queryBuilder.getSearchByUrlConfig._succeededCall = () => ({
    name: /some-test-product/,
  });
  _queryBuilder.getSearchByUrlConfig._failedCall = () => null;

  _queryBuilder.getFilters._succeededCall = () => ({
    $and: [
      {
        $and: ['test heading', 'test data'],
      },
    ],
  });
  _queryBuilder.getFilters._failedCall = () => null;

  return Object.freeze(_queryBuilder);
})();
