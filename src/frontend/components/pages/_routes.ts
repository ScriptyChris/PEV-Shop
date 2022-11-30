import queryString from 'query-string';
import type { useHistory } from 'react-router-dom';
import type { TStoreService } from '@frontend/features/storeService';

const ROUTE_GROUPS = Object.freeze({
  ROOT: '/',
  PAGES: '/pages',
  get PRODUCTS() {
    return `${this.PAGES}/products`;
  },
  get ACCOUNT() {
    return `${this.PAGES}/account`;
  },
});

export const ROUTES = Object.freeze({
  ROOT: ROUTE_GROUPS.ROOT,
  PAGES: ROUTE_GROUPS.PAGES,
  REGISTER: `${ROUTE_GROUPS.PAGES}/register`,
  CONFIRM_REGISTRATION: `${ROUTE_GROUPS.PAGES}/confirm-registration`,
  LOG_IN: `${ROUTE_GROUPS.PAGES}/log-in`,
  NOT_FOUND: `${ROUTE_GROUPS.PAGES}/not-found`,
  NOT_LOGGED_IN: `${ROUTE_GROUPS.PAGES}/not-logged-in`,
  NOT_AUTHORIZED: `${ROUTE_GROUPS.PAGES}/not-authorized`,
  RESET_PASSWORD: `${ROUTE_GROUPS.PAGES}/reset-password`,
  SET_NEW_PASSWORD: `${ROUTE_GROUPS.PAGES}/set-new-password`,
  // product related
  PRODUCTS: ROUTE_GROUPS.PRODUCTS,
  PRODUCTS__PRODUCT: `${ROUTE_GROUPS.PRODUCTS}/:productName`,
  PRODUCTS__COMPARE: `${ROUTE_GROUPS.PRODUCTS}/compare`,
  PRODUCTS__ADD_NEW_PRODUCT: `${ROUTE_GROUPS.PRODUCTS}/add-new-product`,
  get PRODUCTS__MODIFY_PRODUCT() {
    return `${this.PRODUCTS__PRODUCT}/modify-product`;
  },
  PRODUCTS__ORDER: `${ROUTE_GROUPS.PRODUCTS}/order`,
  // account related
  ACCOUNT: ROUTE_GROUPS.ACCOUNT,
  get ACCOUNT__USER_PROFILE() {
    return `${this.ACCOUNT}/user-profile`;
  },
  get ACCOUNT__SECURITY() {
    return `${this.ACCOUNT}/security`;
  },
  get ACCOUNT__OBSERVED_PRODUCTS() {
    return `${this.ACCOUNT}/observed-products`;
  },
  get ACCOUNT__ORDERS() {
    return `${this.ACCOUNT}/orders`;
  },
});

const QUERY_PARAMS_CONFIG = {
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: '|',
} as const;

export const routeHelpers = Object.freeze({
  createModifyProductUrl(productName: string) {
    return ROUTES.PRODUCTS__MODIFY_PRODUCT.replace(/:\w+/, productName);
  },
  extractProductUrlFromPathname(pathname: string) {
    const productUrlRegExpSource = ROUTES.PRODUCTS__PRODUCT.replace(/:.*?(?=\/|$)/, '(?<productUrl>[^/]*)');

    return (pathname.match(new RegExp(productUrlRegExpSource)) || { groups: { productUrl: '' } }).groups!.productUrl;
  },
  parseSearchParams(search: string) {
    return queryString.parse(search, {
      parseNumbers: true,
      parseBooleans: true,
      ...QUERY_PARAMS_CONFIG,
    });
  },
  stringifySearchParams(payload: Record<string, unknown>) {
    return queryString.stringify(payload, QUERY_PARAMS_CONFIG);
  },
  createProductsDashboardQueryUpdater(
    currentQueryParams: ReturnType<typeof queryString.parse>,
    pathname: string,
    history: ReturnType<typeof useHistory>
  ) {
    return (updates: { [key: string]: string | number | boolean } | null) => {
      updates = (updates === null ? {} : { ...currentQueryParams, ...updates }) as NonNullable<typeof updates>;

      history.push({
        pathname,
        search: this.stringifySearchParams(updates),
      });
    };
  },
});

export const useRoutesGuards = (storeService: TStoreService) => {
  return {
    isGuest() {
      return !storeService.userAccountState;
    },
    isUser() {
      return !!storeService.userAccountState;
    },
    isClient() {
      return storeService.userAccountState && storeService.userAccountState.accountType === 'client';
    },
    isSeller() {
      return storeService.userAccountState && storeService.userAccountState.accountType === 'seller';
    },
  };
};
