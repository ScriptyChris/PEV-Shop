const getPaginatedItems = async (Model, itemQuery, paginationConfig) => {
  const paginatedItems = await Model.paginate(itemQuery, {
    offset: paginationConfig.skip,
    // page: 1,
    limit: paginationConfig.limit,
    // useEstimatedCount: true,
    customLabels: {
      docs: 'products',
    },
  });

  console.log('paginatedItems:', paginatedItems);

  return paginatedItems;
};

module.exports = getPaginatedItems;
