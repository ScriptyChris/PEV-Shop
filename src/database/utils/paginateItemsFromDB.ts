import { PaginateModel, PaginateOptions } from 'mongoose';
import { TDocuments } from '@database/models';

// TODO: cache pagination for each user (for next/prev page navigation)
const getPaginatedItems = async (
  Model: TPaginateModel,
  itemQuery: Parameters<TPaginateModel['paginate']>[0],
  paginationConfig: TPaginationConfig
) => {
  const options: PaginateOptions = {
    page: paginationConfig.page,
    limit: paginationConfig.limit,
    customLabels: {
      docs: 'productsList',
      totalDocs: 'totalProducts',
    },
  };

  // TODO: delete unnecessary pagination props from returning object
  return Model.paginate(itemQuery, options);
};

export type TPaginationConfig = { page: number; limit: number };
export type TPaginateModel = PaginateModel<TDocuments>;

export default getPaginatedItems;
