const apiService = (() => {
  const BASE_URL = 'http://localhost:8080';

  const getProductList = () => {
    /*Promise.resolve([{name: 'test', price: 123, url: BASE_URL}])*/
    return fetch(`${BASE_URL}/getProductList`).then((response) => response.json());
  };

  return {
    getProductList,
  };
})();

export default apiService;
