// TODO: create kind of symlinks to test/ folder to avoid using relative paths
import { findAssociatedSrcModulePath } from '../../test-index';

describe('#queryBuilder', () => {
  let isEmptyQueryObject: any, getPaginationConfig: any, getIdListConfig: any, getProductsWithChosenCategories: any;

  beforeAll(async () => {
    ({ isEmptyQueryObject, getPaginationConfig, getIdListConfig, getProductsWithChosenCategories } = await import(
      findAssociatedSrcModulePath()
    ));
  });

  describe('isEmptyQueryObject()', () => {
    it('should return true if an empty object literal is passed', () => {
      expect(isEmptyQueryObject({})).toBe(true);
    });

    it('should return false if a non empty object literal is passed', () => {
      expect(isEmptyQueryObject({ key: 'value' })).toBe(false);
    });

    // TODO: guard target function not to throw error in such case
    it('should throw a TypeError if null is passed', () => {
      expect(() => isEmptyQueryObject(null)).toThrow(TypeError);
    });
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
});
