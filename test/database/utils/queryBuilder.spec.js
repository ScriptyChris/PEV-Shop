// TODO: create kind of symlinks to test/ folder to avoid using relative paths
const { findAssociatedSrcModulePath } = require('../../index')
const {
  isEmptyQueryObject,
  getPaginationConfig,
  getIdListConfig,
  getProductsWithChosenCategories,
} = require(findAssociatedSrcModulePath());

console.log('queryBuilder obj::',
    isEmptyQueryObject,
    getPaginationConfig,
    getIdListConfig,
    getProductsWithChosenCategories
);
