class Ajax {
  constructor() {
    this._API_PATH_NAME = 'api';
    this._BASE_API_URL = `${location.origin}/${this._API_PATH_NAME}`;
    this._AUTH_TOKEN = '';
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

    return fetch(url.toString(), options).then((response) => response.json());
  }

  postRequest(apiEndpoint, data, useToken) {
    const headers = new Headers(this._getContentTypeHeader());

    if (useToken) {
      headers.append('Authorization', this._getAuthHeader());
    }

    return (
      fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data || {}),
      })
        .then((response) => {
          console.warn('POST response headers', ...response.headers);

          return response.json();
        })
        // TODO: handle error cases (like 401)
        .then((body) => {
          if (body.token) {
            this._AUTH_TOKEN = body.token;
          }

          return body.payload;
        })
    );
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

  // TODO: switch mock to real API data
  getProductsSpecifications() {
    return this.getRequest(this.PRODUCTS_SPECS_URL);

    // return {
    //   specs: [
    //     { name: 'Weight', values: [[1, 15]], type: 'inputNumber' },
    //     { name: 'Colour', values: ['Lime Green', 'Black', 'Blue', 'Red'], type: 'inputCheckbox' },
    //     {
    //       name: 'Dimensions',
    //       descriptions: ['Length', 'Width', 'Height'],
    //       values: [
    //         [5, 20],
    //         [5, 20],
    //         [1, 7],
    //       ],
    //       type: 'inputNumber',
    //     },
    //     { name: 'Range', values: [[5, 45]], type: 'inputNumber' },
    //     { name: 'Cruising Speed', values: [[10, 35]], type: 'inputNumber' },
    //   ],
    //   categoryToSpecs: [
    //     {
    //       category: 'Accessories',
    //       specs: ['Weight', 'Colour', 'Dimensions'],
    //     },
    //     {
    //       category: 'Electric Scooters & eBikes',
    //       specs: ['Range', 'Cruising Speed'],
    //     },
    //     {
    //       category: 'Advanced Electric Wheels',
    //       specs: ['Range', 'Cruising Speed'],
    //     },
    //   ],
    // };
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

  logoutUser() {
    return this.postRequest(`${this.USERS_URL}/logout`, null, true);
  }
})();

export default apiService;
