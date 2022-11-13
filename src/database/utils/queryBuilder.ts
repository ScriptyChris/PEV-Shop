import type { Request } from 'express';
import getLogger from '@commons/logger';

type TReqQuery = Request['query'];

const logger = getLogger(module.filename);

const getSearchByNameConfig = (reqQuery: TReqQuery) => {
  if (!reqQuery.name) {
    return null;
  }

  const caseSensitiveFlag = reqQuery.caseSensitive === 'true' ? '' : 'i';
  const nameQuery = new RegExp(reqQuery.name as string, caseSensitiveFlag);

  return { name: nameQuery };
};

const getSearchByUrlConfig = (reqQuery: TReqQuery) => {
  if (!reqQuery.url) {
    return null;
  }

  return { url: reqQuery.url };
};

const getPaginationConfig = (reqQuery: TReqQuery) => {
  if (!('page' in reqQuery) || !('limit' in reqQuery)) {
    return null;
  }

  return { page: Number(reqQuery.page), limit: Number(reqQuery.limit) };
};

const getIdListConfig = (reqQuery: TReqQuery) => {
  if (typeof reqQuery.idList === 'string') {
    const commaSplitIdList = reqQuery.idList.split(',');
    return { _id: { $in: commaSplitIdList } };
  }

  return null;
};

const getNameListConfig = (reqQuery: TReqQuery) => {
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

const getProductsWithChosenCategories = (reqQuery: TReqQuery) => {
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
const getFilters = (reqQuery: TReqQuery) => {
  if (typeof reqQuery.productsFilters === 'string') {
    const specsList = reqQuery.productsFilters.split(',').map(getFilters.mapQuery);

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
} as const);
getFilters.getQueryDataKey = (subKey = '') => {
  return subKey ? `technicalSpecs.data.${subKey}` : getFilters.DATA_BASE_KEY;
};
getFilters.mapQuery = (filter: string) => {
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
          [getFilters.MIN_MAX_MAP[minOrMaxValue.toLowerCase() as keyof typeof getFilters.MIN_MAX_MAP]]: parsedValue,
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

  const filterQueryHeading: TFilterQueryHeading = {
    [filterQueryTemplateObj.heading.key]: filterQueryTemplateObj.heading.value,
  };
  const filterQueryData: TFilterQueryData = {
    [filterQueryTemplateObj.data.key]: filterQueryTemplateObj.data.value,
  };

  return [filterQueryHeading, filterQueryData] as const;
};

export const queryBuilder = {
  getSearchByNameConfig,
  getPaginationConfig,
  getIdListConfig,
  getNameListConfig,
  getSearchByUrlConfig,
  getProductsWithChosenCategories,
  getFilters,
};
