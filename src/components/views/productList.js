import React from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';
import Pagination from '../utils/pagination';

// TODO: consider refactoring class based component to a function based one (and so use mobx-react-lite instead of mobx-react)
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.translations = {
      lackOfProducts: 'Brak produktów...',
    };
    this.paginationTranslations = {
      itemsPerPageSuffix: 'produktów',
      allItems: 'Wszystkie produkty',
    };

    // TODO: setup this on backend and pass via some initial config to frontend
    this.productsPerPageLimits = [15, 30, 60, Infinity];
    this.state = {
      productsList: [],
      productsCount: 0,
      totalPages: 0,
      currentProductPage: 1,
      // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
      currentProductsPerPageLimit: this.productsPerPageLimits[0],
    };

    this.updateProductsList().then();
  }

  async updateProductsList({
    pageNumber = this.state.currentProductPage,
    productsPerPage = this.state.currentProductsPerPageLimit,
  } = {}) {
    let productsList = this.state.productsList;
    let productsCount = this.state.productsCount;
    let totalPages = this.state.totalPages;
    const isHighestProductsPerPage =
      productsPerPage === this.productsPerPageLimits[this.productsPerPageLimits.length - 1];

    if (isHighestProductsPerPage) {
      productsList = await apiService.getProducts();
      productsCount = productsList.length;
      totalPages = 1;
    } else {
      const products = await apiService.getProducts({ pageNumber, productsPerPage });
      productsList = products.productsList;
      productsCount = products.totalProducts;
      totalPages = products.totalPages;

      // console.log('paginated products:', products, ' /totalPages:', totalPages);
    }

    // console.log('productsList:', productsList);

    this.setState({
      productsList,
      currentProductsPerPageLimit: productsPerPage,
      productsCount,
      totalPages,
      currentProductPage: pageNumber,
    });
  }

  onProductsPerPageLimitChange({ target }) {
    const productsPerPage = Number(target.options[target.selectedIndex].value);

    this.updateProductsList({ pageNumber: 1, productsPerPage }).then();
  }

  onProductPageChange({ selected: currentPageIndex }) {
    this.updateProductsList({ pageNumber: currentPageIndex + 1 }).then();
  }

  render() {
    return (
      <>
        <Pagination
          itemsName="product"
          translations={this.paginationTranslations}
          currentItemPageIndex={this.state.currentProductPage - 1}
          totalPages={this.state.totalPages}
          itemLimitsPerPage={this.productsPerPageLimits}
          onItemsPerPageLimitChange={this.onProductsPerPageLimitChange.bind(this)}
          onItemPageChange={this.onProductPageChange.bind(this)}
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
