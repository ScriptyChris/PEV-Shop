import { PaginateModel, PaginateOptions } from 'mongoose';
import { TDocuments, TSort } from '@database/models';

// TODO: cache pagination for each user (for next/prev page navigation)
const getPaginatedItems = async (
  { Model, pagination, sort }: { Model: TPaginateModel; pagination: TPaginationConfig; sort?: TSort },
  itemQuery: Parameters<TPaginateModel['paginate']>[0],
  projection: NonNullable<Parameters<TPaginateModel['paginate']>[1]>['projection']
) => {
  const options: PaginateOptions = {
    page: pagination.page,
    limit: pagination.limit,
    customLabels: {
      docs: 'productsList',
      totalDocs: 'totalProducts',
    },
    projection,
    sort,
  };

  // TODO: delete unnecessary pagination props from returning object
  return Model.paginate(itemQuery, options);
};

export type TPaginationConfig = { page: number; limit: number };
export type TPaginateModel = PaginateModel<TDocuments>;

export default getPaginatedItems;
