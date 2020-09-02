import React from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productList: [],
    };
    this.getProductList();
  }

  async getProductList() {
    const products = await apiService.getProducts();
    console.log('products', products);

    this.setState({ products });
  }

  render() {
    const translations = {
      lackOfProducts: 'Brak produktów...',
    };

    return (
      <ul className="product-list">
        {this.state.productList.length > 0
          ? this.state.productList.map((product) => {
              return <ProductItem key={product.name} product={product} />;
            })
          : translations.lackOfProducts}
      </ul>
    );
  }
}
