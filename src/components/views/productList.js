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
    return (
      <ul>
        {this.state.productList.length > 0
          ? this.state.productList.map(({ name, url, price, image }) => {
              return (
                <li key={name}>
                  <span>Name: {name}</span> |<span>URL: {url}</span> |<span>Price: {price}</span>
                  <img src={image} alt={`Image of "${name}"`} />
                </li>
              );
            })
          : 'Brak produktów...'}
      </ul>
    );
  }
}
