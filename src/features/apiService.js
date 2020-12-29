class Ajax {
  constructor() {
    this._BASE_API_URL = `${location.origin}/api`;
    this._AUTH_TOKEN = '';
  }

  _getContentTypeHeader() {
    return {
      'Content-Type': 'application/json',
    };
  }

  _getAuthHeader() {
    return `Bearer ${this._AUTH_TOKEN}`;
  }

  getRequest(apiEndpoint, useToken) {
    const options = {};

    if (useToken) {
      options.headers = {
        Authorization: this._getAuthHeader(),
      };
    }

    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`, options).then((response) => response.json());
  }

  postRequest(apiEndpoint, data, useToken) {
    const headers = new Headers(this._getContentTypeHeader());

    if (useToken) {
      headers.append('Authorization', this._getAuthHeader());
    }

    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data || {}),
    })
      .then((response) => {
        console.warn('POST response headers', response.headers);

        return response.json();
      })
      .then((body) => {
        if (body.token) {
          this._AUTH_TOKEN = body.token;
        }

        return body.payload;
      });
  }
}

const apiService = new (class ApiService extends Ajax {
  constructor() {
    super();

    this.PRODUCTS_URL = 'products';
    this.USERS_URL = 'users';
  }

  addProduct(product) {
    return this.postRequest(this.PRODUCTS_URL, product);
  }

  getProducts(pagination) {
    if (pagination) {
      return this.getRequest(`${this.PRODUCTS_URL}?page=${pagination.pageNumber}&limit=${pagination.productsPerPage}`);
    }

    return this.getRequest(this.PRODUCTS_URL);
  }

  getProductsById(idList) {
    return this.getRequest(`${this.PRODUCTS_URL}?idList=${idList}`);
  }

  // getProduct(id) {
  //   return this.getRequest(`${this.PRODUCTS_URL}/${id}`);
  // }

  getUser() {
    const userId = '5f5a8dce154f830fd840dc7b';
    return this.getRequest(`${this.USERS_URL}/${userId}`, true);
  }

  loginUser(credentials) {
    return this.postRequest(`${this.USERS_URL}/login`, credentials);
  }

  logoutUser() {
    return this.postRequest(`${this.USERS_URL}/logout`, null, true);
  }
})();

export default apiService;
