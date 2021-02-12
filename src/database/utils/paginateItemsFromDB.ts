import { PaginateResult, PaginateOptions } from 'mongoose'

// TODO: cache pagination for each user (for next/prev page navigation)
const getPaginatedItems = async (Model: any, itemQuery: string, paginationConfig: TPaginationConfig): Promise<TPaginateResult> => {
  const options: PaginateOptions = {
    page: paginationConfig.page,
    limit: paginationConfig.limit,
    customLabels: {
      docs: 'productsList',
      totalDocs: 'totalProducts',
    },
  };

  const paginatedItems: PaginateResult<any> = await Model.paginate(itemQuery, options);

  // TODO: delete unnecessary pagination props from returning object
  return paginatedItems;
};

export type TPaginationConfig = { page: number, limit: number };
export type TPaginateResult = Promise<PaginateResult<any>>

export default getPaginatedItems;
