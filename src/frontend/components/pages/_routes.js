const ROUTE_GROUPS = Object.freeze({
  ROOT: '/',
  PAGES: '/pages',
  get SHOP() {
    return `${this.PAGES}/shop`;
  },
});

export const ROUTES = Object.freeze({
  ROOT: ROUTE_GROUPS.ROOT,
  PAGES: ROUTE_GROUPS.PAGES,
  SHOP: ROUTE_GROUPS.SHOP,
  PRODUCT: `${ROUTE_GROUPS.SHOP}/product`,
  REGISTER: `${ROUTE_GROUPS.PAGES}/register`,
  CONFIRM_REGISTRATION: `${ROUTE_GROUPS.PAGES}/confirm-registration`,
  LOG_IN: `${ROUTE_GROUPS.PAGES}/log-in`,
  NOT_LOGGED_IN: `${ROUTE_GROUPS.PAGES}/not-logged-in`,
  RESET_PASSWORD: `${ROUTE_GROUPS.PAGES}/reset-password`,
  SET_NEW_PASSWORD: `${ROUTE_GROUPS.PAGES}/set-new-password`,
  ACCOUNT: `${ROUTE_GROUPS.PAGES}/account`,
  COMPARE: `${ROUTE_GROUPS.SHOP}/compare`,
  ADD_NEW_PRODUCT: `${ROUTE_GROUPS.SHOP}/add-new-product`,
  MODIFY_PRODUCT: `${ROUTE_GROUPS.SHOP}/modify-product`,
  ORDER: `${ROUTE_GROUPS.SHOP}/order`,
});
