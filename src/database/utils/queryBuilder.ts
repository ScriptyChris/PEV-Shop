import getLogger from '../../../utils/logger';

const logger = getLogger(module.filename);

const isEmptyQueryObject = (query: Record<string, unknown>): boolean => {
  return typeof query === 'object' && !Object.keys(query).length;
};

const getSearchByNameConfig = (reqQuery: TProductNameReq): { name: RegExp } | null => {
  if (!reqQuery.name) {
    return null;
  }

  const caseSensitiveFlag: string = reqQuery.caseSensitive === 'true' ? '' : 'i';
  const nameQuery = new RegExp(reqQuery.name, caseSensitiveFlag);

  return { name: nameQuery };
};

const getPaginationConfig = (reqQuery: TPageLimit): TPageLimit | null => {
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

const getNameListConfig = (reqQuery: TNameListReq): { name: { $in: string[] } } | null => {
  if (typeof reqQuery.nameList === 'string') {
    try {
      const commaSplitIdList = JSON.parse(reqQuery.nameList);
      return { name: { $in: commaSplitIdList } };
    } catch (parseException) {
      logger.error('(getNameListConfig) parseException:', parseException);

      return null;
    }
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

type TFilterQueryHeading = {
  [key: string]: string;
};
type TFilterQueryData = {
  [key: string]: number | string | string[] | boolean | { [key: string]: number | string[] };
};
const getFilters = (reqQuery: TProductFiltersReq) => {
  if (typeof reqQuery.productsFilters === 'string') {
    const specsList: Array<[TFilterQueryHeading, TFilterQueryData]> = reqQuery.productsFilters
      .split(',')
      .map(getFilters.mapQuery);

    return {
      $and: specsList.map(([heading, data]) => ({
        $and: [heading, data],
      })),
    };
  }

  return null;
};
getFilters.HEADING_KEY = 'technicalSpecs.heading' as const;
getFilters.DATA_BASE_KEY = 'technicalSpecs.data' as const;
getFilters.MIN_MAX_SEPARATOR = '--' as const;
getFilters.PIPE_SEPARATOR = '|' as const;
getFilters.SPACE = ' ' as const;
getFilters.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX = /(?<!_)(_)(?!_)/g;
getFilters.DOUBLE_UNDERSCORE_KEY_SEPARATOR = '__' as const;
getFilters.BOOLEAN_VALUES = {
  TRUE: 'true',
  FALSE: 'false',
} as const;
getFilters.MIN_MAX_MAP = Object.freeze({
  min: '$gte',
  max: '$lte',
} as { [key: string]: string });
getFilters.getQueryDataKey = (subKey = ''): string => {
  return subKey ? `technicalSpecs.data.${subKey}` : getFilters.DATA_BASE_KEY;
};
getFilters.mapQuery = (filter: string): [TFilterQueryHeading, TFilterQueryData] => {
  type TFilterBlueprintQuery = {
    heading: {
      key: string;
      value: string;
    };
    data: {
      key: string;
      value: number | string | string[] | boolean | { [key: string]: number | string[] };
    };
  };

  const [headingName, value] = filter.split(':');
  const filterQueryTemplateObj: TFilterBlueprintQuery = {
    heading: {
      key: getFilters.HEADING_KEY,
      value: headingName.toLowerCase().replace(getFilters.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getFilters.SPACE),
    },
    data: {
      key: getFilters.getQueryDataKey(),
      value: value.toLowerCase().replace(getFilters.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getFilters.SPACE),
    },
  };

  if (!Number.isNaN(Number(value))) {
    const [wholeHeading, minOrMaxValue] = filterQueryTemplateObj.heading.value.split(getFilters.MIN_MAX_SEPARATOR);
    const [baseHeading, optionalNestedData = ''] = wholeHeading.split(getFilters.DOUBLE_UNDERSCORE_KEY_SEPARATOR);

    filterQueryTemplateObj.heading.value = baseHeading;
    filterQueryTemplateObj.data.key = getFilters.getQueryDataKey(optionalNestedData.toLowerCase());

    const parsedValue = Number(value);

    filterQueryTemplateObj.data.value = minOrMaxValue
      ? {
          [getFilters.MIN_MAX_MAP[minOrMaxValue.toLowerCase()]]: parsedValue,
        }
      : parsedValue;
  } else if (value.includes(getFilters.PIPE_SEPARATOR)) {
    const parsedValue = value
      .split(getFilters.PIPE_SEPARATOR)
      .map((val) => val.toLowerCase().replace(getFilters.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getFilters.SPACE));
    filterQueryTemplateObj.data.value = {
      $all: parsedValue,
    };
  } else if (value === getFilters.BOOLEAN_VALUES.TRUE || value === getFilters.BOOLEAN_VALUES.FALSE) {
    filterQueryTemplateObj.data.value = value === getFilters.BOOLEAN_VALUES.TRUE;
  }

  const filterQueryHeading = {
    [filterQueryTemplateObj.heading.key]: filterQueryTemplateObj.heading.value,
  };
  const filterQueryData = {
    [filterQueryTemplateObj.data.key]: filterQueryTemplateObj.data.value,
  };

  return [filterQueryHeading, filterQueryData];
};

export type TPageLimit = { page: number; limit: number };
export type TIdListReq = { idList: string };
export type TNameListReq = { nameList: string };
export type TProductsCategoriesReq = { productCategories: string };
export type TProductNameReq = { name: string; caseSensitive: string | boolean };
export type TProductFiltersReq = { productsFilters: string };

export {
  isEmptyQueryObject,
  getSearchByNameConfig,
  getPaginationConfig,
  getIdListConfig,
  getNameListConfig,
  getProductsWithChosenCategories,
  getFilters,
};
