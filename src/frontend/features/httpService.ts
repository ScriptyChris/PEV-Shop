/**
 * Handles HTTP communication between frontend and backend.
 * @module
 */

import type { IUser, TUserPublic, TUserRegistrationCredentials, IProduct } from '@database/models';
import type {
  IEmbracedResponse,
  TSuccessfulHTTPStatusCodesToData,
  TClientErrorHTTPStatusCodesToData,
  TServerErrorHTTPStatusCodesToData,
} from '@middleware/helpers/middleware-response-wrapper';
import type { TProductTechnicalSpecs } from '@middleware/helpers/api-products-specs-mapper';
import { HTTP_STATUS_CODE, IOrderPayload, TPagination } from '@commons/types';
import storeService from '@frontend/features/storeService';
import { possiblyReEncodeURI } from '@commons/uriReEncoder';
import { routeHelpers } from '@frontend/components/pages/_routes';

type TResDataType<T> = T[keyof T];

/**
 * Handles (low level) HTTP actions as:
 * - setting appropriate headers,
 * - assembling requests regarding URL, params, payload, etc. according to used HTTP method and backend expectance,
 * - initially parsing responses,
 * - initially handling HTTP errors.
 */
class Ajax {
  /** @internal */
  _API_PATH_NAME: string;
  /** @internal */
  _BASE_API_URL: string;
  /** @internal */
  _AUTH_TOKEN: string | null;
  /** @internal */
  HTTP_METHOD_NAME = {
    GET: 'GET',
    PATCH: 'PATCH',
    POST: 'POST',
    DELETE: 'DELETE',
  } as const;
  /** @internal */
  _isGenericErrorHandlerActive: boolean;

  /** @internal */
  constructor() {
    this._API_PATH_NAME = 'api';
    this._BASE_API_URL = `${location.origin}/${this._API_PATH_NAME}`;
    this._AUTH_TOKEN = null;
    this._isGenericErrorHandlerActive = true;
  }

  /** @internal */
  get _BASE_API_URL_OBJECT() {
    const urlObject = new URL(location.origin);
    urlObject.pathname = `${this._API_PATH_NAME}/`;

    return urlObject;
  }

  /** @internal */
  _getContentTypeHeader(shouldSendAsFormData = false) {
    return shouldSendAsFormData
      ? undefined
      : {
          'Content-Type': 'application/json',
        };
  }

  /** @internal */
  _getAuthHeader() {
    return `Bearer ${this.getAuthToken() || ''}`;
  }

  /** @internal */
  getAuthToken() {
    return this._AUTH_TOKEN;
  }

  /** @internal */
  setAuthToken(authToken: this['_AUTH_TOKEN']) {
    this._AUTH_TOKEN = authToken;
  }

  /** @internal */
  disableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = false;

    return this;
  }

  /** @internal */
  _enableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = true;

    return this;
  }

  /** @internal */
  _fetchBaseHandler(fetchResult: ReturnType<typeof fetch>) {
    const isGenericErrorHandlerActive = this._isGenericErrorHandlerActive;
    const fetchPromise = fetchResult
      .then((response) => {
        if (response.status === HTTP_STATUS_CODE.NO_CONTENT) {
          return { __NO_CONTENT: true };
        }

        return response.json();
      })
      .then((body) => {
        if (!body || typeof body !== 'object') {
          throw `Response body is empty! body: ${body}`;
        } else if (body.__NO_CONTENT) {
          return body as Pick<ICustomResExt, '__NO_CONTENT'>;
        } else if ('authToken' in body) {
          this.setAuthToken(body.authToken);
        } else if (body.error) {
          throw { error: body.error, isGenericErrorHandlerActive };
        } else if (body.exception) {
          throw body.exception;
        }

        return (body.payload || body.message || {}) as Pick<
          IEmbracedResponse,
          TResDataType<TSuccessfulHTTPStatusCodesToData>
        >;
      })
      .catch(
        (
          exception: Pick<
            IEmbracedResponse,
            TResDataType<TClientErrorHTTPStatusCodesToData> | TResDataType<TServerErrorHTTPStatusCodesToData>
          >
        ) => {
          console.error('(_fetchBaseHandler) caught an error:', exception);

          return httpServiceSubscriber.callSubscribers(
            httpServiceSubscriber.SUBSCRIPTION_TYPE.EXCEPTION,
            exception
          ) as Pick<ICustomResExt, '__ERROR_TO_HANDLE' | '__EXCEPTION_ALREADY_HANDLED'>;
        }
      );

    this._enableGenericErrorHandler();

    return fetchPromise;
  }

  /** @internal */
  _sendRequestWithPayload(
    methodName: string,
    apiEndpoint: string,
    data: unknown,
    useToken: boolean,
    shouldSendAsFormData = false
  ) {
    const headers = new Headers(this._getContentTypeHeader(shouldSendAsFormData));

    if (useToken) {
      headers.append('Authorization', this._getAuthHeader());
    }

    return this._fetchBaseHandler(
      fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
        method: methodName,
        headers,
        body: shouldSendAsFormData ? (data as FormData) : JSON.stringify(data || {}),
      })
    );
  }

  // TODO: fix creating URL by apiEndpoint
  /** @internal */
  getRequest(apiEndpoint: { url: string; searchParams: URLSearchParams | string } | string, useToken = false) {
    const url = this._BASE_API_URL_OBJECT;

    if (typeof apiEndpoint === 'object') {
      url.pathname += apiEndpoint.url;

      if (apiEndpoint.searchParams instanceof URLSearchParams) {
        apiEndpoint.searchParams.forEach((value, key) => {
          url.searchParams.append(key, value);
        });
      } else {
        url.search = apiEndpoint.searchParams;
      }
    } else {
      url.pathname += apiEndpoint;
    }

    const options = {} as RequestInit;

    if (useToken) {
      options.headers = {
        Authorization: this._getAuthHeader(),
      };
    }

    return this._fetchBaseHandler(fetch(url.toString(), options));
  }

  /** @internal */
  postRequest(apiEndpoint: string, data: unknown, useToken = false, shouldSendAsFormData = false) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.POST, apiEndpoint, data, useToken, shouldSendAsFormData);
  }

  /** @internal */
  patchRequest(apiEndpoint: string, data: unknown, useToken = false) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.PATCH, apiEndpoint, data, useToken);
  }

  /** @internal */
  deleteRequest(apiEndpoint: string, useToken = false) {
    const url = this._BASE_API_URL_OBJECT;
    url.pathname += apiEndpoint;

    const options = {
      method: this.HTTP_METHOD_NAME.DELETE,
    } as RequestInit;

    if (useToken) {
      options.headers = {
        Authorization: this._getAuthHeader(),
      };
    }

    return this._fetchBaseHandler(fetch(url.toString(), options));
  }
}

/**
 * Intermediates (high level) client actions meant to communicate with backend APIs.
 */
class HttpService extends Ajax {
  private URLS = {
    PRODUCTS: 'products',
    PRODUCT_CATEGORIES: 'productCategories',
    PRODUCTS_SPECS: 'products/specs',
    USERS: 'users',
    USER_ROLES: 'user-roles',
    ORDERS: 'orders',
  } as const;

  constructor() {
    super();
  }

  _preparePaginationParams(searchParams: URLSearchParams, pagination?: TPagination) {
    if (!pagination || !Object.keys(pagination).length) {
      return;
    } else if (!searchParams || !(searchParams instanceof URLSearchParams)) {
      throw ReferenceError('searchParams as an instance of URLSearchParams must be provided!');
    }

    searchParams.append('page', String(pagination.pageNumber));
    searchParams.append('limit', String(pagination.productsPerPage));
  }

  _getUserId() {
    const userId = storeService.userAccountState?._id;

    if (!userId) {
      throw Error(`Current user's id is not available! User is probably not logged in.`);
    }

    return userId;
  }

  /**
   * Adds a new product.
   */
  addProduct(product: IProduct) {
    return this.postRequest(this.URLS.PRODUCTS, product, true, true);
  }

  /**
   * Gets products according to optional constraints like: name, price, pagination etc.
   */
  getProducts(
    initialSearchParams: Partial<{
      name: IProduct['name'];
      price: [IProduct['price'], IProduct['price']];
      pagination: TPagination;
      productCategories: string;
      productTechnicalSpecs: string;
      sortBy: string;
    }>,
    customSearchParamsSerialization = false
  ) {
    let searchParams: ReturnType<typeof routeHelpers.stringifySearchParams> | URLSearchParams;

    if (customSearchParamsSerialization) {
      searchParams = routeHelpers.stringifySearchParams({
        ...initialSearchParams,
        page: initialSearchParams.pagination?.pageNumber,
        limit: initialSearchParams.pagination?.productsPerPage,
        pagination: undefined,
        getOnlyEssentialData: 'false',
      });
    } else {
      const { name, pagination, productCategories, productTechnicalSpecs } = initialSearchParams;
      searchParams = new URLSearchParams();

      this._preparePaginationParams(searchParams, pagination);

      if (name && name.length) {
        searchParams.append('name', name);
        searchParams.append('getOnlyEssentialData', 'false');
      }

      if (productCategories && productCategories.length) {
        searchParams.append('productCategories', productCategories);
      }

      if (productTechnicalSpecs && productTechnicalSpecs.length) {
        searchParams.append('productTechnicalSpecs', productTechnicalSpecs);
      }
    }

    return this.getRequest({ url: this.URLS.PRODUCTS, searchParams });
  }

  getProductsById(idList: IProduct['_id'][]) {
    if (!idList || !idList.length) {
      return Promise.resolve([]);
    }

    return this.getRequest(`${this.URLS.PRODUCTS}?idList=${idList}`);
  }

  /**
   * Gets products by list of names - mostly useful for retrieving related products of a single one.
   */
  getProductsByNames(nameList: IProduct['name'][]) {
    if (!nameList || !nameList.length) {
      return Promise.resolve([]);
    }

    const searchParams = new URLSearchParams({ nameList: JSON.stringify(nameList) });

    return this.getRequest({
      url: this.URLS.PRODUCTS,
      searchParams,
    });
  }

  /**
   * Gets products by a single name - mostly useful for search feature.
   */
  getProductsByName(name: IProduct['name'], pagination: TPagination, getOnlyEssentialData = true) {
    const searchParams = new URLSearchParams();
    searchParams.append('name', name);
    searchParams.append('getOnlyEssentialData', String(getOnlyEssentialData));

    this._preparePaginationParams(searchParams, pagination);

    return this.getRequest({ url: this.URLS.PRODUCTS, searchParams });
  }

  /**
   * Gets product by it's URL - mostly useful for retrieving product from browser's address bar.
   */
  getProductByUrl(url: IProduct['url']) {
    const searchParams = new URLSearchParams();

    url = possiblyReEncodeURI(url);
    searchParams.append('url', url);

    return this.getRequest({ url: this.URLS.PRODUCTS, searchParams });
  }

  // getProduct(id) {
  //   return this.getRequest(`${this.URLS.PRODUCTS}/${id}`);
  // }

  /**
   * Gets categories of all products.
   */
  getProductCategories() {
    return this.getRequest(this.URLS.PRODUCT_CATEGORIES);
  }

  /**
   * Gets technical specifications of all products.
   */
  getProductsSpecifications() {
    return this.getRequest(this.URLS.PRODUCTS_SPECS) as Promise<
      TProductTechnicalSpecs | Pick<ICustomResExt, '__EXCEPTION_ALREADY_HANDLED'>
    >;
  }

  /**
   * Modifies product.
   */
  modifyProduct(productName: IProduct['name'], productModifications: Partial<IProduct>) {
    const modifiedProductData = {
      name: productName,
      modifications: {
        action: 'modify',
        data: productModifications,
      },
    };
    return this.patchRequest(this.URLS.PRODUCTS, modifiedProductData, true);
  }

  /**
   * Adds a new review to chosen product.
   */
  addProductReview(productUrl: IProduct['url'], productReview: IProduct['reviews']) {
    return this.patchRequest(`${this.URLS.PRODUCTS}/${productUrl}/add-review`, productReview, true);
  }

  /**
   * Delets a product via it's name.
   */
  deleteProduct(productUrl: IProduct['url']) {
    return this.deleteRequest(`${this.URLS.PRODUCTS}/${productUrl}`, true);
  }

  /**
   * Gets info about currently logged in user via it's ID taken from app's state.
   */
  getCurrentUser() {
    return this.getRequest(`${this.URLS.USERS}/${this._getUserId()}`, true);
  }

  /**
   * Gets orders of currently logged in client user.
   */
  getCurrentUserOrders() {
    return this.getRequest(`${this.URLS.ORDERS}/current-user`, true);
  }

  /**
   * Gets orders of all client users.
   */
  getAllOrders() {
    return this.getRequest(`${this.URLS.ORDERS}/all`, true);
  }

  /**
   * Starts the process of making a new purchase according to given order details.
   */
  makeOrder(orderDetails: IOrderPayload) {
    return this.postRequest(this.URLS.ORDERS, orderDetails, true);
  }

  /**
   * Logs in user based on their login and password credentials.
   */
  loginUser(loginCredentials: { login: IUser['login']; password: IUser['password'] }) {
    return this.postRequest(`${this.URLS.USERS}/login`, loginCredentials) as Promise<
      TUserPublic | Pick<ICustomResExt, '__EXCEPTION_ALREADY_HANDLED'>
    >;
  }

  /**
   * Resets user password via it's email.
   */
  resetPassword(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/reset-password`, { email });
  }

  /**
   * Resends (repeats) resetting user password via it's email.
   */
  resendResetPassword(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/resend-reset-password`, { email });
  }

  /**
   * Loggs out user from current session.
   */
  logoutUser() {
    return this.postRequest(`${this.URLS.USERS}/logout`, null, true);
  }

  /**
   * Loggs out user from all sessions; current session can be preserved if `preseveCurrentSession` param is true.
   */
  logOutUserFromSessions(preseveCurrentSession = false) {
    return this.postRequest(`${this.URLS.USERS}/logout-all`, { preseveCurrentSession }, true);
  }

  /**
   * Gets all user roles.
   */
  getUserRoles() {
    return this.getRequest(`${this.URLS.USER_ROLES}`);
  }

  /**
   * Registers a new user according to provided credentials.
   */
  registerUser(registrationCredentials: TUserRegistrationCredentials) {
    return this.postRequest(`${this.URLS.USERS}/register`, registrationCredentials);
  }

  /**
   * Confirms a newly registered user via token received on their email.
   */
  confirmRegistration(token: NonNullable<IUser['tokens']['confirmRegistration']>) {
    return this.postRequest(`${this.URLS.USERS}/confirm-registration`, { token });
  }

  /**
   * Resends registration confirmation email.
   */
  resendConfirmRegistration(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/resend-confirm-registration`, { email });
  }

  /**
   * Sets a new password for user - mostly after reseting password.
   */
  setNewPassword(newPassword: IUser['password'], token: NonNullable<IUser['tokens']['auth']>[number]) {
    return this.patchRequest(`${this.URLS.USERS}/set-new-password`, { newPassword, token });
  }

  /**
   * Changes user's current password to a new one.
   */
  changePassword(password: IUser['password'], newPassword: IUser['password']) {
    return this.patchRequest(`${this.URLS.USERS}/change-password`, { password, newPassword }, true);
  }

  /**
   * Adds product to observed by user, so they can more conveniently find it later.
   */
  addProductToObserved(productId: string) {
    return this.postRequest(`${this.URLS.USERS}/add-product-to-observed`, { productId }, true);
  }

  /**
   * Removes product from observed by user.
   */
  removeProductFromObserved(productId: string) {
    return this.deleteRequest(`${this.URLS.USERS}/remove-product-from-observed/${productId}`, true);
  }

  /**
   * Removes all products from observed by user.
   */
  removeAllProductsFromObserved() {
    return this.deleteRequest(`${this.URLS.USERS}/remove-all-products-from-observed`, true);
  }

  /**
   * Retrieves all observed products by user.
   */
  getObservedProducts() {
    return this.getRequest(`${this.URLS.USERS}/observed-products`, true);
  }
}

/**
 * Keeps track of {@link HttpService} subscribers, which want to externally hook into any request
 * that returns certain status.
 */
const httpServiceSubscriber = (() => {
  const _subscribers: Record<string, TSubCallback | null> = {
    EXCEPTION: null,
  };

  type TSubCallback = (...args: unknown[]) => unknown;
  type TSubKey = keyof typeof _subscribers;

  return {
    SUBSCRIPTION_TYPE: Object.freeze(Object.fromEntries(Object.keys(_subscribers).map((key) => [key, key]))),

    callSubscribers(type: TSubKey, value: unknown) {
      return (_subscribers[type] as TSubCallback)(value);
    },

    subscribe(type: TSubKey, callback: TSubCallback) {
      if (typeof _subscribers[type] === 'function') {
        throw Error(`'${type}' is already subscribing!`);
      }

      _subscribers[type] = callback;
    },

    unSubscribe(type: TSubKey) {
      if (typeof _subscribers[type] !== 'function') {
        throw ReferenceError(`'${type}' is not subscribing!`);
      }

      _subscribers[type] = null;
    },
  };
})();

/**
 * Recognize HTTP responses kinds.
 */
const CUSTOM_RES_EXT_DICT = Object.freeze({
  __NO_CONTENT: '__NO_CONTENT',
  __ERROR_TO_HANDLE: '__ERROR_TO_HANDLE',
  __EXCEPTION_ALREADY_HANDLED: '__EXCEPTION_ALREADY_HANDLED',
} as const);

interface ICustomResExt {
  [CUSTOM_RES_EXT_DICT.__NO_CONTENT]: true;
  [CUSTOM_RES_EXT_DICT.__ERROR_TO_HANDLE]: Pick<IEmbracedResponse, TResDataType<TClientErrorHTTPStatusCodesToData>>;
  [CUSTOM_RES_EXT_DICT.__EXCEPTION_ALREADY_HANDLED]: true;
}

export { httpServiceSubscriber, CUSTOM_RES_EXT_DICT };

export default new HttpService();
