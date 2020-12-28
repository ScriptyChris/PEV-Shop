import React from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';
import ReactPaginate from 'react-paginate';

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
    this.productsPerPageLimits = [15, 30, 60, Infinity];
    this.state = {
      productsList: [],
      productsCount: 0,
      totalPages: 0,
      currentProductPage: 1,
      // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
      currentProductsPerPageLimit: this.productsPerPageLimits[0]
    };
    this.updateProductsList().then();
  }

  async updateProductsList({ pageNumber = this.state.currentProductPage, productsPerPage = this.state.currentProductsPerPageLimit } = {}) {
    let productsList = this.state.productsList;
    let productsCount = this.state.productsCount;
    let totalPages = this.state.totalPages;
    const isHighestProductsPerPage = productsPerPage === this.productsPerPageLimits[this.productsPerPageLimits.length - 1];

    if (isHighestProductsPerPage) {
      productsList = await apiService.getProducts();
      productsCount = productsList.length;
      totalPages = 1;
    } else {
      const products = await apiService.getProducts({ pageNumber, productsPerPage });
      productsList = products.productsList;
      productsCount = products.totalProducts;
      totalPages = products.totalPages;

      console.log('paginated products:', products);
    }

    console.log('productsList:', productsList);

    this.setState({ productsList, currentProductsPerPageLimit: productsPerPage, productsCount, totalPages, currentProductPage: pageNumber });
  }

  onProductsPerPageLimitChange({target}) {
    const productsPerPage = Number(target.options[target.selectedIndex].value);
    console.log('[onProductsPerPageLimitChange] productsPerPage:', productsPerPage, ' /opt index: ', target.selectedIndex);

    this.updateProductsList({ pageNumber: 1, productsPerPage }).then();
  }

  onProductPageChange({ selected: currentPageIndex }) {
    console.log('currentPageIndex:', currentPageIndex);

    this.updateProductsList({ pageNumber: currentPageIndex + 1 }).then();
  }

  render() {
    return (
        <>
          <div>
            <label htmlFor="productsPerPageLimitSelect">
              {this.translations.productsPerPage}

              <select onChange={this.onProductsPerPageLimitChange.bind(this)} id="productsPerPageLimitSelect">
                {this.productsPerPageLimits.map((productsPerPageLimit, index) =>
                    <option value={productsPerPageLimit} key={`productsPerPageLimit-${index}`}>
                      {index === this.productsPerPageLimits.length - 1 ? this.translations.allProducts : productsPerPageLimit}
                    </option>
                )}
              </select>
            </label>
          </div>

          count??? {this.state.productsCount} <br/>
          range??? {this.state.totalPages}

          {/* TODO: move to separate component with styling included */}
          <ReactPaginate
              pageCount={this.state.totalPages}
              pageRangeDisplayed={1}
              marginPagesDisplayed={2}
              onPageChange={this.onProductPageChange.bind(this)}
              forcePage={this.state.currentProductPage - 1}
              containerClassName="pagination-container"
          />

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
