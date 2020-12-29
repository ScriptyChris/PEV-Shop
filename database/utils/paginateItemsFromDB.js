// TODO: cache pagination for each user (for next/prev page navigation)
const getPaginatedItems = async (Model, itemQuery, paginationConfig) => {
  const options = {
    page: paginationConfig.page,
    limit: paginationConfig.limit,
    customLabels: {
      docs: 'productsList',
      totalDocs: 'totalProducts',
    },
  };

  const paginatedItems = await Model.paginate(itemQuery, options);

  // TODO: delete unnecessary pagination props from returning object
  return paginatedItems;
};

module.exports = getPaginatedItems;
