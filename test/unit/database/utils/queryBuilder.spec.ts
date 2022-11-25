// TODO: create kind of symlinks to test/ folder to avoid using relative paths
import { findAssociatedSrcModulePath } from '@unitTests/utils';

describe('#queryBuilder', () => {
  let getPaginationConfig: any, getIdListConfig: any, getProductsWithChosenCategories: any, getSearchByNameConfig: any;

  beforeAll(async () => {
    try {
      ({
        queryBuilder: { getPaginationConfig, getIdListConfig, getProductsWithChosenCategories, getSearchByNameConfig },
      } = await import(findAssociatedSrcModulePath()));
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  describe('getPaginationConfig()', () => {
    it('should return null when passed object without "page" or "limit" props', () => {
      expect(getPaginationConfig({})).toBe(null);
      expect(getPaginationConfig({ page: 0 })).toBe(null);
      expect(getPaginationConfig({ limit: 0 })).toBe(null);
    });

    it('should return an object with "page" and "limit" props containing passed param as number', () => {
      expect(getPaginationConfig({ page: '123', limit: '321' })).toStrictEqual({ page: 123, limit: 321 });
    });
  });

  describe('getIdListConfig()', () => {
    // TODO: guard target function not to throw error in such case
    it('should throw TypeError when no param passed ', () => {
      expect(() => getIdListConfig()).toThrow(TypeError);
    });

    it('should return null when passed param does not contain an Array', () => {
      expect(getIdListConfig({})).toBe(null);
    });

    it('should return null when passed param does not contain "idList" prop', () => {
      expect(getIdListConfig({ notIdList: 'value' })).toBe(null);
    });

    it('should return object with "_id" prop containing object with "$in" prop containing Array with comma split values equal to passed "idList" param', () => {
      const getIdListConfigResult = getIdListConfig({ idList: '123,321' });

      expect(Array.isArray(getIdListConfigResult._id.$in)).toBe(true);
      expect(getIdListConfigResult._id.$in).toStrictEqual(['123', '321']);
    });
  });

  describe('getProductsWithChosenCategories()', () => {
    // TODO: guard target function not to throw error in such case
    it('should throw TypeError when no param passed', () => {
      expect(() => getProductsWithChosenCategories()).toThrow(TypeError);
    });

    it('should return null when passed param does not contain an Array', () => {
      expect(getIdListConfig({})).toBe(null);
    });

    it('should return null when passed param does not contain "productCategories" prop', () => {
      expect(getIdListConfig({ notProductCategories: 'value' })).toBe(null);
    });

    it('should return object with "category" prop containing object with "$in" prop containing Array with comma split values equal to passed "productCategories" param', () => {
      const getIdListConfigResult = getIdListConfig({ idList: 'hello,world' });

      expect(Array.isArray(getIdListConfigResult._id.$in)).toBe(true);
      expect(getIdListConfigResult._id.$in).toStrictEqual(['hello', 'world']);
    });
  });

  describe('getSearchByNameConfig()', () => {
    it('should return null when passed object with falsy "name" prop', () => {
      expect(getSearchByNameConfig({})).toBeNull();
      expect(getSearchByNameConfig({ name: '' })).toBeNull();
      expect(getSearchByNameConfig({ name: 0 })).toBeNull();
      expect(getSearchByNameConfig({ name: false })).toBeNull();
      expect(getSearchByNameConfig({ name: null })).toBeNull();
      expect(getSearchByNameConfig({ name: undefined })).toBeNull();
    });

    it(`should return an object with "query.name" prop containing query as RegExp with "i" flag 
      and "projection" property based on "getOnlyEssentialData" param`, () => {
      expect(getSearchByNameConfig({ name: 'test', getOnlyEssentialData: 'false' })).toStrictEqual({
        query: { name: /test/i },
        projection: {},
      });
      expect(getSearchByNameConfig({ name: 'test', getOnlyEssentialData: 'true' })).toStrictEqual({
        query: { name: /test/i },
        projection: { name: true, url: true, price: true },
      });
    });

    it('should throw a TypeError when "reqQuery.getOnlyEssentialData" props is invalid', () => {
      expect(() => getSearchByNameConfig({ name: 'test' })).toThrow(
        TypeError(`getOnlyEssentialData should be either "true" or "false"! Received: "undefined".`)
      );
      expect(() => getSearchByNameConfig({ name: 'test', getOnlyEssentialData: null })).toThrow(
        TypeError(`getOnlyEssentialData should be either "true" or "false"! Received: "null".`)
      );
      expect(() => getSearchByNameConfig({ name: 'test', getOnlyEssentialData: 'true' })).not.toThrow();
      expect(() => getSearchByNameConfig({ name: 'test', getOnlyEssentialData: 'false' })).not.toThrow();
    });
  });
});
