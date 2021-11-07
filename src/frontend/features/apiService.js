class Ajax {
  constructor() {
    this._API_PATH_NAME = 'api';
    this._BASE_API_URL = `${location.origin}/${this._API_PATH_NAME}`;
    this._AUTH_TOKEN = '';
    this.HTTP_METHOD_NAME = Object.freeze({
      GET: 'GET',
      PATCH: 'PATCH',
      POST: 'POST',
      DELETE: 'DELETE',
    });
    this.HTTP_RESPONSE_STATUS = Object.freeze({
      NO_CONTENT: 204,
    });
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
    return `Bearer ${this._AUTH_TOKEN}`;
  }

  disableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = false;

    return this;
  }

  _enableGenericErrorHandler() {
    this._isGenericErrorHandlerActive = true;

    return this;
  }

  _fetchBaseHandler(fetchResult) {
    const isGenericErrorHandlerActive = this._isGenericErrorHandlerActive;
    const fetchPromise = fetchResult
      .then((response) => {
        if (response.status === this.HTTP_RESPONSE_STATUS.NO_CONTENT) {
          return { __IS_OK_WITHOUT_CONTENT: true };
        }

        return response.json();
      })
      .then((body) => {
        if (body.__IS_OK_WITHOUT_CONTENT) {
          return body;
        } else if (body.token) {
          this._AUTH_TOKEN = body.token;
        } else if (body.error) {
          throw { error: body.error, isGenericErrorHandlerActive };
        } else if (body.exception) {
          throw body.exception;
        }

        return (body && body.payload) || body.message;
      })
      .catch((exception) => {
        console.error('(_fetchBaseHandler) caught an error:', exception);

        return apiServiceSubscriber.callSubscribers(apiServiceSubscriber.SUBSCRIPTION_TYPE.EXCEPTION, exception);
      });

    this._enableGenericErrorHandler();

    return fetchPromise;
  }

  _sendRequestWithPayload(methodName, apiEndpoint, data, useToken) {
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
  getRequest(apiEndpoint, useToken) {
    const url = this._BASE_API_URL_OBJECT;

    if (typeof apiEndpoint === 'object') {
      url.pathname += apiEndpoint.url;

      apiEndpoint.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    } else {
      url.pathname += apiEndpoint;
    }

    const options = {};

    if (useToken) {
      options.headers = {
        Authorization: this._getAuthHeader(),
      };
    }

    return this._fetchBaseHandler(fetch(url.toString(), options));
  }

  postRequest(apiEndpoint, data, useToken) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.POST, apiEndpoint, data, useToken);
  }

  patchRequest(apiEndpoint, data, useToken) {
    return this._sendRequestWithPayload(this.HTTP_METHOD_NAME.PATCH, apiEndpoint, data, useToken);
  }

  deleteRequest(apiEndpoint, useToken) {
    const url = this._BASE_API_URL_OBJECT;
    url.pathname += apiEndpoint;

    const options = {
      method: this.HTTP_METHOD_NAME.DELETE,
    };

    if (useToken) {
      options.headers = {
        Authorization: this._getAuthHeader(),
      };
    }

    return this._fetchBaseHandler(fetch(url.toString(), options));
  }
}

const apiService = new (class ApiService extends Ajax {
  constructor() {
    super();

    this.PRODUCTS_URL = 'products';
    this.PRODUCT_CATEGORIES_URL = 'productCategories';
    this.PRODUCTS_SPECS_URL = 'products/specs';
    this.USERS_URL = 'users';
    this.ORDERS_URL = 'orders';
  }

  _preparePaginationParams(searchParams, pagination) {
    if (!pagination || !Object.keys(pagination).length) {
      return;
    } else if (!searchParams || !(searchParams instanceof URLSearchParams)) {
      throw ReferenceError('searchParams as an instance of URLSearchParams must be provided!');
    }

    searchParams.append('page', pagination.pageNumber);
    searchParams.append('limit', pagination.productsPerPage);
  }

  addProduct(product) {
    return this.postRequest(this.PRODUCTS_URL, product);
  }

  getProducts({ pagination, productCategories, productsFilters } = {}) {
    const searchParams = new URLSearchParams();

    this._preparePaginationParams(searchParams, pagination);

    if (productCategories && productCategories.length) {
      searchParams.append('productCategories', productCategories);
    }

    if (productsFilters && productsFilters.length) {
      searchParams.append('productsFilters', productsFilters);
      console.log('??? searchParams:', [...searchParams]);
    }

    return this.getRequest({ url: this.PRODUCTS_URL, searchParams });
  }

  getProductsById(idList) {
    return this.getRequest(`${this.PRODUCTS_URL}?idList=${idList}`);
  }

  getProductsByNames(nameList) {
    const searchParams = new URLSearchParams({ nameList: JSON.stringify(nameList) });

    return this.getRequest({
      url: this.PRODUCTS_URL,
      searchParams,
    });
  }

  getProductsByName(name, caseSensitive = 'false', pagination) {
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
    return this.getRequest(this.PRODUCTS_SPECS_URL);
  }

  modifyProduct(productName, productModifications) {
    const modifiedProductData = {
      name: productName,
      modifications: {
        action: 'modify',
        data: productModifications,
      },
    };
    return this.patchRequest(this.PRODUCTS_URL, modifiedProductData);
  }

  addProductReview(productName, productReview) {
    return this.patchRequest(`${this.PRODUCTS_URL}/${productName}/add-review`, productReview);
  }

  deleteProduct(productName) {
    return this.deleteRequest(`${this.PRODUCTS_URL}/${productName}`);
  }

  getUser() {
    const userId = '5f5a8dce154f830fd840dc7b';
    return this.getRequest(`${this.USERS_URL}/${userId}`, true);
  }

  submitCart(cart) {
    return this.postRequest(this.ORDERS_URL, { products: cart });
  }

  loginUser(credentials) {
    return this.postRequest(`${this.USERS_URL}/login`, credentials);
  }

  resetPassword(email) {
    return this.postRequest(`${this.USERS_URL}/reset-password`, { email });
  }

  resendResetPassword(email) {
    return this.postRequest(`${this.USERS_URL}/resend-reset-password`, { email });
  }

  logoutUser() {
    return this.postRequest(`${this.USERS_URL}/logout`, null, true);
  }

  logOutUserFromAllSessions(preseveCurrentSession = false) {
    return this.postRequest(`${this.USERS_URL}/logout-all`, { preseveCurrentSession }, true);
  }

  registerUser(registrationData) {
    return this.postRequest(`${this.USERS_URL}/register`, registrationData);
  }

  confirmRegistration(token) {
    return this.postRequest(`${this.USERS_URL}/confirm-registration`, { token });
  }

  resendConfirmRegistration(email) {
    return this.postRequest(`${this.USERS_URL}/resend-confirm-registration`, { email });
  }

  setNewPassword(newPassword, token) {
    return this.patchRequest(`${this.USERS_URL}/set-new-password`, { newPassword, token });
  }

  changePassword(password, newPassword) {
    return this.patchRequest(`${this.USERS_URL}/change-password`, { password, newPassword }, true);
  }
})();

const apiServiceSubscriber = (() => {
  const _subscribers = {
    EXCEPTION: null,
  };

  return {
    SUBSCRIPTION_TYPE: Object.freeze(Object.fromEntries(Object.keys(_subscribers).map((key) => [key, key]))),

    callSubscribers(type, value) {
      return _subscribers[type](value);
    },

    subscribe(type, callback) {
      if (_subscribers[type] === 'function') {
        throw Error(`'${type}' is already subscribing!`);
      }

      _subscribers[type] = callback;
    },

    unSubscribe(type) {
      if (_subscribers[type] !== 'function') {
        throw ReferenceError(`'${type}' is not subscribing!`);
      }

      _subscribers[type] = null;
    },
  };
})();

export { apiServiceSubscriber };

export default apiService;
