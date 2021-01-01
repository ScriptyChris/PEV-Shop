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
  if (reqQuery.idList) {
    const commaSplitIdList = reqQuery.idList.split(',');
    return { _id: { $in: commaSplitIdList } };
  }

  return null;
};

const getProductsWithChosenCategories = (reqQuery) => {
  if (reqQuery.chosenCategories) {
    const chosenCategories = reqQuery.chosenCategories.split(',');
    return { category: { $in: chosenCategories } };
  }

  return null;
};

module.exports = {
  isEmptyQueryObject,
  getPaginationConfig,
  getIdListConfig,
  getProductsWithChosenCategories,
};
