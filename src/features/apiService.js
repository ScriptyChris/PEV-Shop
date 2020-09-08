class Ajax {
  constructor() {
    this._BASE_API_URL = 'http://localhost:8080/api';
  }

  getRequest(apiEndpoint) {
    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`).then((response) => response.json());
  }

  postRequest(apiEndpoint, data) {
    return fetch(`${this._BASE_API_URL}/${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.text());
  }
}

const apiService = new (class ApiService extends Ajax {
  constructor() {
    super();

    this.PRODUCTS_URL = 'products';
  }

  getProducts() {
    return this.getRequest(this.PRODUCTS_URL);
  }

  addProduct(product) {
    return this.postRequest(this.PRODUCTS_URL, product);
  }
})();

export default apiService;
