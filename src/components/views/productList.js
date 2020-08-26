import React from 'react';
import apiService from '../../features/apiService';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productList: [],
    };
    this.getProductList();
  }

  async getProductList() {
    const productList = await apiService.getProductList();
    console.log('productList', productList);

    this.setState({ productList });
  }

  render() {
    const translations = {
      lackOfProducts: 'Brak produktów...',
      productName: 'Name',
      productImage: 'Image of ',
      productUrl: 'URL',
      price: 'Price',
    };

    return (
      <ul className="product-list">
        {this.state.productList.length > 0
          ? this.state.productList.map(({ name, url, price, image }) => {
              return (
                <li key={name} className="product-list-item">
                  <img src={image} alt={`${translations.productImage}${name}`} className="product-list-item__image" />

                  <dl>
                    <div className="product-list-item__metadata">
                      <dt>{translations.productName}:</dt>
                      <dd>{name}</dd>
                    </div>

                    <div className="product-list-item__metadata">
                      <dt>{translations.productUrl}:</dt>
                      <dd>{url}</dd>
                    </div>

                    <div className="product-list-item__metadata">
                      <dt>{translations.price}:</dt>
                      <dd>{price}</dd>
                    </div>
                  </dl>
                </li>
              );
            })
          : translations.lackOfProducts}
      </ul>
    );
  }
}
