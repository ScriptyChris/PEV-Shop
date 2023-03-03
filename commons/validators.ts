import { FILTER_RANGE_SEPARATOR } from './consts';

const VALIDATOR_SCHEMAS = {
  PRODUCT_PRICE: (() => {
    const PRICE_MODIFIERS = ['min', 'max'] as const;
    const regExps = PRICE_MODIFIERS.map((modifier) => new RegExp(`${modifier}${FILTER_RANGE_SEPARATOR}(\\d+)`, 'i'));

    return { regExps, PRICE_MODIFIERS };
  })(),
  PRODUCT_SORTING: (() => {
    const SORTING_MODIFIERS = ['name', 'price', 'reviews.ratingScore'] as const;
    const SORTING_ORDER_MAP = {
      Asc: 'Asc',
      Desc: 'Desc',
    } as const;
    const regExps = new RegExp(
      `(?<field>${SORTING_MODIFIERS.join('|')})(?<orderAsText>${Object.keys(SORTING_ORDER_MAP).join('|')})`
    );

    return { regExps, SORTING_MODIFIERS, SORTING_ORDER_MAP };
  })(),
} as const;

export const productPriceRangeValidator = (productPrice: string[]) => {
  const priceRange: [any, any] = [null, null];
  let error = '';

  if (!Array.isArray(productPrice) || !productPrice.length) {
    return;
  }

  VALIDATOR_SCHEMAS.PRODUCT_PRICE.regExps.forEach((priceRegExp, index) => {
    for (const price of productPrice) {
      if (typeof price !== 'string') {
        error += `Price input should be a string! Received: "${price}".`;
        continue;
      }

      const priceValue = price.match(priceRegExp)?.[1];
      if (!priceValue) {
        error += `Price should be in "${priceRegExp.source}" format! Received: "${price}".`;
        continue;
      }

      priceRange[index] = Number(priceValue);
    }
  });

  return { priceRange, error };
};

export const productSortingValidator = (sortBy: string) => {
  if (!sortBy) {
    return null;
  }

  const { field, orderAsText } = sortBy.match(VALIDATOR_SCHEMAS.PRODUCT_SORTING.regExps)?.groups || {};

  if (!field || !orderAsText) {
    return null;
  }

  const order = orderAsText === VALIDATOR_SCHEMAS.PRODUCT_SORTING.SORTING_ORDER_MAP.Asc ? 1 : -1;

  return { [field]: order } as const;
};

export const imageSizeValidator = (currentImgSize: number) => {
  const mbToByteMultiplier = 1024000;
  const maxImgSizeInMB = 1;

  return {
    isValidSize: currentImgSize <= maxImgSizeInMB * mbToByteMultiplier,
    currentImgSizeInMB: currentImgSize / mbToByteMultiplier,
    maxImgSizeInMB,
  };
};
