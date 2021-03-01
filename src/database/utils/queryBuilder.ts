const isEmptyQueryObject = (query: Record<string, unknown>): boolean => {
  return typeof query === 'object' && !Object.keys(query).length;
};

const getPaginationConfig = (reqQuery: TPageLimit): { page: number; limit: number } | null => {
  if (!('page' in reqQuery) || !('limit' in reqQuery)) {
    return null;
  }

  return { page: Number(reqQuery.page), limit: Number(reqQuery.limit) };
};

const getIdListConfig = (reqQuery: TIdListReq): { _id: { $in: string[] } } | null => {
  if (typeof reqQuery.idList === 'string') {
    const commaSplitIdList = reqQuery.idList.split(',');
    return { _id: { $in: commaSplitIdList } };
  }

  return null;
};

const getProductsWithChosenCategories = (reqQuery: TProductsCategoriesReq): { category: { $in: string[] } } | null => {
  if (typeof reqQuery.productCategories === 'string') {
    const productCategories = reqQuery.productCategories.split(',');
    return { category: { $in: productCategories } };
  }

  return null;
};

export type TPageLimit = { page: number; limit: number };
export type TIdListReq = { idList: string };
export type TProductsCategoriesReq = { productCategories: string };

export { isEmptyQueryObject, getPaginationConfig, getIdListConfig, getProductsWithChosenCategories };
