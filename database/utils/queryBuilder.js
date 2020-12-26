const isEmptyQueryObject = (query) => {
  return typeof query === 'object' && !Object.keys(query).length;
};

const getPaginationConfig = (reqQuery) => {
  if (!('skip' in reqQuery) || !('limit' in reqQuery)) {
    // when no pagination params are provided, then do pagination by default
    return { skip: 0, limit: 10 };
  }

  return { skip: Number(reqQuery.skip), limit: Number(reqQuery.limit) };
};

const getIdListConfig = (reqQuery) => {
  if (reqQuery.idList) {
    const commaSplitIdList = reqQuery.idList.split(',');
    return { _id: { $in: commaSplitIdList } };
  }

  return {};
};

module.exports = {
  isEmptyQueryObject,
  getPaginationConfig,
  getIdListConfig,
};
