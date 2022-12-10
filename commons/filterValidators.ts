import { FILTER_RANGE_SEPARATOR } from '@commons/consts';

const FILTER_SCHEMAS = {
  PRODUCT_PRICE: [
    new RegExp(`min${FILTER_RANGE_SEPARATOR}(\\d+)`, 'i'),
    new RegExp(`max${FILTER_RANGE_SEPARATOR}(\\d+)`, 'i'),
  ],
} as const;

export const productPriceRangeValidator = (productPrice: string[]) => {
  const priceRange: [any, any] = [null, null];
  let error = '';

  if (!Array.isArray(productPrice) || !productPrice.length) {
    return;
  }

  FILTER_SCHEMAS.PRODUCT_PRICE.forEach((priceRegExp, index) => {
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
