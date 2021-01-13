// const { it, expect } = require('jest');
// TODO: create kind of symlinks to test/ folder to avoid using relative paths
const { findAssociatedSrcModulePath } = require('../../index')
const {
  isEmptyQueryObject,
  getPaginationConfig,
  getIdListConfig,
  getProductsWithChosenCategories,
} = require(findAssociatedSrcModulePath());

console.log('queryBuilder obj:',
    isEmptyQueryObject,
    getPaginationConfig,
    getIdListConfig,
    getProductsWithChosenCategories
);

describe('queryBuilder', () => {
  describe('isEmptyQueryObject', () => {
    it ('should be true', () => {
      expect(true).toBe(true)
    });
  })
});
