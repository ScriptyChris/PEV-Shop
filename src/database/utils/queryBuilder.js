const isEmptyQueryObject = (query) => {
  return typeof query === 'object' && !Object.keys(query).length;
};

const getPaginationConfig = (reqQuery) => {
  if (!('page' in reqQuery) || !('limit' in reqQuery)) {
    return null;
  }

  return { page: Number(reqQuery.page), limit: Number(reqQuery.limit) };
};

const getIdListConfig = (reqQuery) => {
  if (typeof reqQuery.idList === 'string') {
    const commaSplitIdList = reqQuery.idList.split(',');
    return { _id: { $in: commaSplitIdList } };
  }

  return null;
};

const getProductsWithChosenCategories = (reqQuery) => {
  if (typeof reqQuery.productCategories === 'string') {
    const productCategories = reqQuery.productCategories.split(',');
    return { category: { $in: productCategories } };
  }

  return null;
};

module.exports = {
  isEmptyQueryObject,
  getPaginationConfig,
  getIdListConfig,
  getProductsWithChosenCategories,
};
