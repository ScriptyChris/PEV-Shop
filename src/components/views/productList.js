import React from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';

// TODO: consider refactoring class based component to a function based one (and so use mobx-react-lite instead of mobx-react)
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.translations = {
      lackOfProducts: 'Brak produktów...',
      productsPerPage: 'Liczba produktów na stronie:',
      allProducts: 'Wszystkie produkty'
    };
    // TODO: setup this on backend and pass via some initial config to frontend
    this.paginationRanges = [15, 30, 60, Infinity];
    this.state = {
      productsList: [],
      currentPaginationPage: 1,
      // TODO: set initial pagination range based on device that runs app (f.e. mobile should have lowest range and PC highest)
      currentPaginationRange: this.paginationRanges[0]
    };
    this.updateProductList(this.state.currentPaginationRange);
  }

  getProducts(pagination) {
    if (pagination) {
      return apiService.getProducts(pagination);
    }

    return apiService.getProducts();
  }

  updatePaginationNavigation() {
    
  }

  async updateProductList(productsPerPage) {
    let productsList = [];
    const isHighestPaginationRange = productsPerPage === this.paginationRanges[this.paginationRanges.length - 1];

    if (isHighestPaginationRange) {
      productsList = await this.getProducts();
    } else {
      const products = await this.getProducts({ pageNumber: this.state.currentPaginationPage, productsPerPage });
      productsList = products.productsList;

      this.updatePaginationNavigation();

      console.log('paginated products:', products);
    }

    console.log('productsList:', productsList);

    this.setState({ productsList });
  }

  updatePaginationRange({target}) {
    const productsPerPage = Number(target.options[target.selectedIndex].value);
    console.log('[updatePaginationRange] productsPerPage:', productsPerPage, ' /opt index: ', target.selectedIndex);

    this.updateProductList(productsPerPage);
  }

  render() {
    return (
        <>
          <div>
            <label htmlFor="productListRangeSelect">
              {this.translations.productsPerPage}

              <select onChange={this.updatePaginationRange.bind(this)} id="productListRangeSelect">
                {this.paginationRanges.map((paginationRange, index) =>
                    <option value={paginationRange} key={`paginationRange-${index}`}>
                      {index === this.paginationRanges.length - 1 ? this.translations.allProducts : paginationRange}
                    </option>
                )}
              </select>
            </label>
          </div>

          <ul className="product-list">
            {this.state.productsList.length > 0
              ? this.state.productsList.map((product) => {
                  return (
                    <li key={product.name}>
                      <ProductItem product={product} />
                    </li>
                  );
                })
              : this.translations.lackOfProducts}
          </ul>
        </>
    );
  }
}
