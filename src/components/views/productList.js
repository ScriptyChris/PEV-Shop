import React from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';

// TODO: consider refactoring class based component to a function based one (and so use mobx-react-lite instead of mobx-react)
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productList: [],
    };
    this.translations = {
      lackOfProducts: 'Brak produktów...',
    };
    this.getProductList();
  }

  async getProductList() {
    const productList = await apiService.getProducts();
    console.log('productList', productList);

    this.setState({ productList });
  }

  render() {
    return (
      <ul className="product-list">
        {this.state.productList.length > 0
          ? this.state.productList.map((product) => {
              return (
                <li key={product.name}>
                  <ProductItem product={product} />
                </li>
              );
            })
          : this.translations.lackOfProducts}
      </ul>
    );
  }
}
