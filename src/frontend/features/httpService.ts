import type { IUser, IUserPublic, TUserRegistrationCredentials } from '../../database/models/_user';
import type { IProduct } from '../../database/models/_product';
import type {
  IEmbracedResponse,
  TSuccessfulHTTPStatusCodesToData,
  TClientErrorHTTPStatusCodesToData,
  TServerErrorHTTPStatusCodesToData,
} from '../../middleware/helpers/middleware-response-wrapper';
import type { TProductTechnicalSpecs } from '../../middleware/helpers/api-products-specs-mapper';
import { HTTP_STATUS_CODE, IUserCart, TPagination } from '../../types';

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
  PRODUCTS_URL: string;
  PRODUCT_CATEGORIES_URL: string;
  PRODUCTS_SPECS_URL: string;
  USERS_URL: string;
  ORDERS_URL: string;

  constructor() {
    super();

    this.PRODUCTS_URL = 'products';
    this.PRODUCT_CATEGORIES_URL = 'productCategories';
    this.PRODUCTS_SPECS_URL = 'products/specs';
    this.USERS_URL = 'users';
    this.ORDERS_URL = 'orders';
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
    return this.postRequest(this.PRODUCTS_URL, product);
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

    return this.getRequest({ url: this.PRODUCTS_URL, searchParams });
  }

  getProductsById(idList: string[]) {
    return this.getRequest(`${this.PRODUCTS_URL}?idList=${idList}`);
  }

  getProductsByNames(nameList: string[]) {
    const searchParams = new URLSearchParams({ nameList: JSON.stringify(nameList) });

    return this.getRequest({
      url: this.PRODUCTS_URL,
      searchParams,
    });
  }

  getProductsByName(name: string, caseSensitive = 'false', pagination: TPagination) {
    const searchParams = new URLSearchParams();
    searchParams.append('name', name);
    searchParams.append('caseSensitive', caseSensitive);

    this._preparePaginationParams(searchParams, pagination);

    return this.getRequest({ url: this.PRODUCTS_URL, searchParams });
  }

  // getProduct(id) {
  //   return this.getRequest(`${this.PRODUCTS_URL}/${id}`);
  // }

  getProductCategories() {
    return this.getRequest(this.PRODUCT_CATEGORIES_URL);
  }

  getProductsSpecifications() {
    return this.getRequest(this.PRODUCTS_SPECS_URL) as Promise<
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
    return this.patchRequest(this.PRODUCTS_URL, modifiedProductData);
  }

  addProductReview(productName: IProduct['name'], productReview: IProduct['reviews']) {
    return this.patchRequest(`${this.PRODUCTS_URL}/${productName}/add-review`, productReview);
  }

  deleteProduct(productName: IProduct['name']) {
    return this.deleteRequest(`${this.PRODUCTS_URL}/${productName}`);
  }

  getUser() {
    const userId = '5f5a8dce154f830fd840dc7b';
    return this.getRequest(`${this.USERS_URL}/${userId}`, true);
  }

  makeOrder(cart: IUserCart['products']) {
    return this.postRequest(this.ORDERS_URL, { products: cart });
  }

  loginUser(loginCredentials: { login: IUser['login']; password: IUser['password'] }) {
    return this.postRequest(`${this.USERS_URL}/login`, loginCredentials) as Promise<
      IUserPublic | Pick<ICustomResExt, '__EXCEPTION_ALREADY_HANDLED'>
    >;
  }

  resetPassword(email: IUser['email']) {
    return this.postRequest(`${this.USERS_URL}/reset-password`, { email });
  }

  resendResetPassword(email: IUser['email']) {
    return this.postRequest(`${this.USERS_URL}/resend-reset-password`, { email });
  }

  logoutUser() {
    return this.postRequest(`${this.USERS_URL}/logout`, null, true);
  }

  logOutUserFromSessions(preseveCurrentSession = false) {
    return this.postRequest(`${this.USERS_URL}/logout-all`, { preseveCurrentSession }, true);
  }

  registerUser(registrationCredentials: TUserRegistrationCredentials) {
    return this.postRequest(`${this.USERS_URL}/register`, registrationCredentials);
  }

  confirmRegistration(token: NonNullable<IUser['tokens']['confirmRegistration']>) {
    return this.postRequest(`${this.USERS_URL}/confirm-registration`, { token });
  }

  resendConfirmRegistration(email: IUser['email']) {
    return this.postRequest(`${this.USERS_URL}/resend-confirm-registration`, { email });
  }

  setNewPassword(newPassword: IUser['password'], token: NonNullable<IUser['tokens']['auth']>[number]) {
    return this.patchRequest(`${this.USERS_URL}/set-new-password`, { newPassword, token });
  }

  changePassword(password: IUser['password'], newPassword: IUser['password']) {
    return this.patchRequest(`${this.USERS_URL}/change-password`, { password, newPassword }, true);
  }

  addProductToObserved(productId: string) {
    return this.postRequest(`${this.USERS_URL}/add-product-to-observed`, { productId }, true);
  }

  removeProductFromObserved(productId: string) {
    return this.deleteRequest(`${this.USERS_URL}/remove-product-from-observed/${productId}`, true);
  }

  removeAllProductsFromObserved() {
    return this.deleteRequest(`${this.USERS_URL}/remove-all-products-from-observed`, true);
  }

  getObservedProducts() {
    return this.getRequest(`${this.USERS_URL}/observed-products`, true);
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
