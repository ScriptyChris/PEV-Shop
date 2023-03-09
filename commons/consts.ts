export const CATEGORY_DEPTH_SEPARATOR = ':';
export const FILTER_RANGE_SEPARATOR = ':';
export const ARRAY_FORMAT_SEPARATOR = '|';

export const MAX_IMAGES_AMOUNT = 3;
export const ICONS_ROOT_PATH = 'public/icons';
export const IMAGES_ROOT_PATH = 'public/images';
export const IMAGES__PRODUCTS_ROOT_PATH = `${IMAGES_ROOT_PATH}/products` as const;
export const IMAGES__PRODUCTS_TMP_FOLDER = '__form-parsing-tmp';

export const MINOR_INFO_AUTO_CLOSE_TIME = 5000;
export const COMMON_PERCEPTION_DELAY_TIME = 250;

export const REVIEW_RATING_MIN_VALUE = 0;
export const REVIEW_RATING_MAX_VALUE = 5;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  BLIK: 'blik',
} as const;
export const SHIPMENT_METHODS = {
  IN_PERSON: 'inPerson',
  HOME: 'home',
  PARCEL_LOCKER: 'parcelLocker',
} as const;
export const SHIPMENT_METHODS_TO_COSTS = {
  [SHIPMENT_METHODS.IN_PERSON]: 0,
  [SHIPMENT_METHODS.HOME]: 5,
  [SHIPMENT_METHODS.PARCEL_LOCKER]: 2,
} as const;

// TODO: [UX] get it from backend - seller should be able to configure it
export const SHOP_ADDRESS = ['PEV Shop', 'ul. Testable 1', '12-345 Testland'] as const;

export const MIN_PRODUCT_UNITS = 0;
export const MAX_PRODUCT_UNITS = 999;
