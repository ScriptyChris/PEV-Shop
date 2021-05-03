import React from 'react';
import { Link } from 'react-router-dom';
import appStore from '../../features/appStore';
import CompareProduct from './compareProducts';

export default function ProductItem({ product }) {
  const translations = {
    productName: 'Name',
    productImage: 'Image of ',
    productUrl: 'URL',
    price: 'Price',
    detailsBtn: 'Check details!',
    addToCart: 'Add to cart!',
  };
  const { name, price, url, _id } = product;

  const handleAddToCartClick = () => {
    appStore.updateUserCartState({ name, price, _id });
  };

  return (
    <div className="product-list-item">
      {/*<img src={image} alt={`${translations.productImage}${name}`} className="product-list-item__image" />*/}

      <dl>
        <div className="product-list-item__metadata">
          <dt>{translations.productName}:</dt>
          <dd>{name}</dd>
        </div>

        <div className="product-list-item__metadata">
          <dt>{translations.price}:</dt>
          <dd>{price}</dd>
        </div>
      </dl>

      <button onClick={handleAddToCartClick}>{translations.addToCart}</button>

      <Link
        to={{
          pathname: `/shop/${url}`,
          state: product,
        }}
      >
        {translations.detailsBtn}
      </Link>

      <CompareProduct.Toggler product={product} />
    </div>
  );
}
