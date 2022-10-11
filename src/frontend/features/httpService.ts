import type { IUser, TUserPublic, TUserRegistrationCredentials } from '@database/models/_user';
import type { IProduct } from '@database/models/_product';
import type {
  IEmbracedResponse,
  TSuccessfulHTTPStatusCodesToData,
  TClientErrorHTTPStatusCodesToData,
  TServerErrorHTTPStatusCodesToData,
} from '@middleware/helpers/middleware-response-wrapper';
import type { TProductTechnicalSpecs } from '@middleware/helpers/api-products-specs-mapper';
import { HTTP_STATUS_CODE, IOrder, TPagination } from '@src/types';

type TResDataType<T> = T[keyof T];

class Ajax {
  _API_PATH_NAME: string;
  _BASE_API_URL: string;
  _AUTH_TOKEN: string | null;
  HTTP_METHOD_NAME = {
    GET: 'GET',
    PATCH: 'PATCH',
    POST: 'POST',
    DELETE: 'DELETE',
  } as const;
  _isGenericErrorHandlerActive: boolean;

  constructor() {
    this._API_PATH_NAME = 'api';
    this._BASE_API_URL = `${location.origin}/${this._API_PATH_NAME}`;
    this._AUTH_TOKEN = null;
    this._isGenericErrorHandlerActive = true;
  }

  get _BASE_API_URL_OBJECT() {
    const urlObject = new URL(location.origin);
    urlObject.pathname = `${this._API_PATH_NAME}/`;

    return urlObject;
  }

  _getContentTypeHeader() {
    return {
      'Content-Type': 'application/json',
    };
  }

  _getAuthHeader() {
    return `Bearer ${this.getAuthToken() || ''}`;
  }

  getAuthToken() {
    return this._AUTH_TOKEN;
  }

  setAuthToken(authToken: this['_AUTH_TOKEN']) {
    this._AUTH_TOKEN = authToken;
  }

  disableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = false;

    return this;
  }

  _enableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = true;

    return this;
  }

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

  _sendRequestWithPayload(methodName: string, apiEndpoint: string, data: unknown, useToken: boolean) {
    const headers = new Headers(this._getContentTypeHeader());

    if (useToken) {
      headers.append('Authorization', this._getAuthHeader());
    }

    return this._fetchBaseHandler(
      fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
        method: methodName,
        headers,
        body: JSON.stringify(data || {}),
      })
    );
  }

  // TODO: fix creating URL by apiEndpoint
  getRequest(apiEndpoint: { url: string; searchParams: URLSearchParams } | string, useToken = false) {
    const url = this._BASE_API_URL_OBJECT;

    if (typeof apiEndpoint === 'object') {
      url.pathname += apiEndpoint.url;

      apiEndpoint.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
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

  postRequest(apiEndpoint: string, data: unknown, useToken = false) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.POST, apiEndpoint, data, useToken);
  }

  patchRequest(apiEndpoint: string, data: unknown, useToken = false) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.PATCH, apiEndpoint, data, useToken);
  }

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

const httpService = new (class HttpService extends Ajax {
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

  addProduct(product: IProduct) {
    return this.postRequest(this.URLS.PRODUCTS, product, true);
  }

  getProducts({
    pagination,
    productCategories,
    productsFilters,
  }: Partial<{
    pagination: TPagination;
    productCategories: string;
    productsFilters: string[];
  }> = {}) {
    const searchParams = new URLSearchParams();

    this._preparePaginationParams(searchParams, pagination);

    if (productCategories && productCategories.length) {
      searchParams.append('productCategories', productCategories);
    }

    if (productsFilters && productsFilters.length) {
      searchParams.append('productsFilters', productsFilters as unknown as string);
    }

    return this.getRequest({ url: this.URLS.PRODUCTS, searchParams });
  }

  getProductsById(idList: string[]) {
    return this.getRequest(`${this.URLS.PRODUCTS}?idList=${idList}`);
  }

  getProductsByNames(nameList: string[]) {
    const searchParams = new URLSearchParams({ nameList: JSON.stringify(nameList) });

    return this.getRequest({
      url: this.URLS.PRODUCTS,
      searchParams,
    });
  }

  getProductsByName(name: string, caseSensitive = 'false', pagination: TPagination) {
    const searchParams = new URLSearchParams();
    searchParams.append('name', name);
    searchParams.append('caseSensitive', caseSensitive);

    this._preparePaginationParams(searchParams, pagination);

    return this.getRequest({ url: this.URLS.PRODUCTS, searchParams });
  }

  // getProduct(id) {
  //   return this.getRequest(`${this.URLS.PRODUCTS}/${id}`);
  // }

  getProductCategories() {
    return this.getRequest(this.URLS.PRODUCT_CATEGORIES);
  }

  getProductsSpecifications() {
    return this.getRequest(this.URLS.PRODUCTS_SPECS) as Promise<
      TProductTechnicalSpecs | Pick<ICustomResExt, '__EXCEPTION_ALREADY_HANDLED'>
    >;
  }

  modifyProduct(productName: IProduct['name'], productModifications: Partial<IProduct>) {
    const modifiedProductData = {
      name: productName,
      modifications: {
        action: 'modify',
        data: productModifications,
      },
    };
    return this.patchRequest(this.URLS.PRODUCTS, modifiedProductData);
  }

  addProductReview(productName: IProduct['name'], productReview: IProduct['reviews']) {
    return this.patchRequest(`${this.URLS.PRODUCTS}/${productName}/add-review`, productReview);
  }

  deleteProduct(productName: IProduct['name']) {
    return this.deleteRequest(`${this.URLS.PRODUCTS}/${productName}`, true);
  }

  getUser() {
    const userId = '5f5a8dce154f830fd840dc7b';
    return this.getRequest(`${this.URLS.USERS}/${userId}`, true);
  }

  makeOrder(orderDetails: IOrder) {
    return this.postRequest(this.URLS.ORDERS, orderDetails);
  }

  loginUser(loginCredentials: { login: IUser['login']; password: IUser['password'] }) {
    return this.postRequest(`${this.URLS.USERS}/login`, loginCredentials) as Promise<
      TUserPublic | Pick<ICustomResExt, '__EXCEPTION_ALREADY_HANDLED'>
    >;
  }

  resetPassword(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/reset-password`, { email });
  }

  resendResetPassword(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/resend-reset-password`, { email });
  }

  logoutUser() {
    return this.postRequest(`${this.URLS.USERS}/logout`, null, true);
  }

  logOutUserFromSessions(preseveCurrentSession = false) {
    return this.postRequest(`${this.URLS.USERS}/logout-all`, { preseveCurrentSession }, true);
  }

  getUserRoles() {
    return this.getRequest(`${this.URLS.USER_ROLES}`);
  }

  registerUser(registrationCredentials: TUserRegistrationCredentials) {
    return this.postRequest(`${this.URLS.USERS}/register`, registrationCredentials);
  }

  confirmRegistration(token: NonNullable<IUser['tokens']['confirmRegistration']>) {
    return this.postRequest(`${this.URLS.USERS}/confirm-registration`, { token });
  }

  resendConfirmRegistration(email: IUser['email']) {
    return this.postRequest(`${this.URLS.USERS}/resend-confirm-registration`, { email });
  }

  setNewPassword(newPassword: IUser['password'], token: NonNullable<IUser['tokens']['auth']>[number]) {
    return this.patchRequest(`${this.URLS.USERS}/set-new-password`, { newPassword, token });
  }

  changePassword(password: IUser['password'], newPassword: IUser['password']) {
    return this.patchRequest(`${this.URLS.USERS}/change-password`, { password, newPassword }, true);
  }

  addProductToObserved(productId: string) {
    return this.postRequest(`${this.URLS.USERS}/add-product-to-observed`, { productId }, true);
  }

  removeProductFromObserved(productId: string) {
    return this.deleteRequest(`${this.URLS.USERS}/remove-product-from-observed/${productId}`, true);
  }

  removeAllProductsFromObserved() {
    return this.deleteRequest(`${this.URLS.USERS}/remove-all-products-from-observed`, true);
  }

  getObservedProducts() {
    return this.getRequest(`${this.URLS.USERS}/observed-products`, true);
  }
})();

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

export default httpService;
