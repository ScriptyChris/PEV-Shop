class Ajax {
  constructor() {
    this._BASE_API_URL = 'http://localhost:8080/api';
    this._AUTH_TOKEN = '';
  }

  _getAuthHeader() {
    return `Bearer ${this._AUTH_TOKEN}`;
  }

  getRequest(apiEndpoint, useToken) {
    const options = useToken
      ? {
          headers: {
            Authorization: this._getAuthHeader(),
          },
        }
      : null;

    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`, options).then((response) => response.json());
  }

  postRequest(apiEndpoint, data) {
    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

  getProducts() {
    return this.getRequest(this.PRODUCTS_URL);
  }

  getUser() {
    const userId = '5f5a8dce154f830fd840dc7b';
    return this.getRequest(`${this.USERS_URL}/${userId}`, true);
  }

  loginUser() {
    const userData = { nickName: 'test user1' };
    return this.postRequest(`${this.USERS_URL}/login`, userData);
  }
})();

export default apiService;
