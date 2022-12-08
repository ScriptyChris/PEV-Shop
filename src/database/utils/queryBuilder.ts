import type { Request } from 'express';
import getLogger from '@commons/logger';

type TReqQuery = Request['query'];

const logger = getLogger(module.filename);

const getSearchByNameConfig = (reqQuery: TReqQuery) => {
  if (!reqQuery.name) {
    return null;
  } else if (!(reqQuery.getOnlyEssentialData === 'true' || reqQuery.getOnlyEssentialData === 'false')) {
    throw TypeError(
      `getOnlyEssentialData should be either "true" or "false"! Received: "${reqQuery.getOnlyEssentialData}".`
    );
  }

  const nameQuery = new RegExp(reqQuery.name as string, 'i');
  const projection = reqQuery.getOnlyEssentialData === 'true' ? { name: true, url: true, price: true } : {};

  return { query: { name: nameQuery }, projection };
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
  let productCategories = null;

  if (typeof reqQuery.productCategories === 'string') {
    productCategories = reqQuery.productCategories.split(',');
  } else if (
    Array.isArray(reqQuery.productCategories) &&
    reqQuery.productCategories &&
    typeof reqQuery.productCategories[0] === 'string' &&
    reqQuery.productCategories[0].length
  ) {
    // TODO: [DX] unify search params interface
    productCategories = reqQuery.productCategories[0].split('|');
  }

  return productCategories && { category: { $in: productCategories } };
};

type TFilterQueryHeading = {
  [key: string]: string;
};
type TFilterQueryData = {
  [key: string]: number | string | string[] | boolean | { [key: string]: number | string[] };
};
const getTechnicalSpecs = (reqQuery: TReqQuery) => {
  let specsList = null;

  if (typeof reqQuery.productTechnicalSpecs === 'string') {
    specsList = reqQuery.productTechnicalSpecs.split(',').map(getTechnicalSpecs.mapQuery);
  } else if (
    Array.isArray(reqQuery.productTechnicalSpecs) &&
    reqQuery.productTechnicalSpecs &&
    typeof reqQuery.productTechnicalSpecs[0] === 'string' &&
    reqQuery.productTechnicalSpecs[0].length
  ) {
    // TODO: [DX] unify search params interface
    specsList = reqQuery.productTechnicalSpecs[0].split('|').map(getTechnicalSpecs.mapQuery);
  }

  return (
    specsList && {
      $and: specsList.map(([heading, data]) => ({
        $and: [heading, data],
      })),
    }
  );
};
getTechnicalSpecs.HEADING_KEY = 'technicalSpecs.heading' as const;
getTechnicalSpecs.DATA_BASE_KEY = 'technicalSpecs.data' as const;
getTechnicalSpecs.MIN_MAX_SEPARATOR = '--' as const;
getTechnicalSpecs.PIPE_SEPARATOR = '|' as const;
getTechnicalSpecs.SPACE = ' ' as const;
getTechnicalSpecs.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX = /(?<!_)(_)(?!_)/g;
getTechnicalSpecs.DOUBLE_UNDERSCORE_KEY_SEPARATOR = '__' as const;
getTechnicalSpecs.BOOLEAN_VALUES = {
  TRUE: 'true',
  FALSE: 'false',
} as const;
getTechnicalSpecs.MIN_MAX_MAP = Object.freeze({
  min: '$gte',
  max: '$lte',
} as const);
getTechnicalSpecs.getQueryDataKey = (subKey = '') => {
  return subKey ? `technicalSpecs.data.${subKey}` : getTechnicalSpecs.DATA_BASE_KEY;
};
getTechnicalSpecs.mapQuery = (filter: string) => {
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
      key: getTechnicalSpecs.HEADING_KEY,
      value: headingName
        .toLowerCase()
        .replace(getTechnicalSpecs.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getTechnicalSpecs.SPACE),
    },
    data: {
      key: getTechnicalSpecs.getQueryDataKey(),
      value: value
        .toLowerCase()
        .replace(getTechnicalSpecs.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getTechnicalSpecs.SPACE),
    },
  };

  if (!Number.isNaN(Number(value))) {
    const [wholeHeading, minOrMaxValue] = filterQueryTemplateObj.heading.value.split(
      getTechnicalSpecs.MIN_MAX_SEPARATOR
    );
    const [baseHeading, optionalNestedData = ''] = wholeHeading.split(
      getTechnicalSpecs.DOUBLE_UNDERSCORE_KEY_SEPARATOR
    );

    filterQueryTemplateObj.heading.value = baseHeading;
    filterQueryTemplateObj.data.key = getTechnicalSpecs.getQueryDataKey(optionalNestedData.toLowerCase());

    const parsedValue = Number(value);

    filterQueryTemplateObj.data.value = minOrMaxValue
      ? {
          [getTechnicalSpecs.MIN_MAX_MAP[minOrMaxValue.toLowerCase() as keyof typeof getTechnicalSpecs.MIN_MAX_MAP]]:
            parsedValue,
        }
      : parsedValue;
  } else if (value.includes(getTechnicalSpecs.PIPE_SEPARATOR)) {
    const parsedValue = value
      .split(getTechnicalSpecs.PIPE_SEPARATOR)
      .map((val) =>
        val.toLowerCase().replace(getTechnicalSpecs.UNDERSCORE_AS_SPACE_SEPARATOR_REGEX, getTechnicalSpecs.SPACE)
      );
    filterQueryTemplateObj.data.value = {
      $all: parsedValue,
    };
  } else if (value === getTechnicalSpecs.BOOLEAN_VALUES.TRUE || value === getTechnicalSpecs.BOOLEAN_VALUES.FALSE) {
    filterQueryTemplateObj.data.value = value === getTechnicalSpecs.BOOLEAN_VALUES.TRUE;
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
  getTechnicalSpecs,
};
