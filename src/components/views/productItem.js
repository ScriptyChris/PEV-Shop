import React from 'react';
import { Link } from 'react-router-dom';
import appStore from '../../features/appStore';

export default function ProductItem({ product }) {
  const translations = {
    productName: 'Name',
    productImage: 'Image of ',
    productUrl: 'URL',
    price: 'Price',
    detailsBtn: 'Check details!',
    addToCart: 'Add to cart!',
  };
  const { name, price } = product;

  const handleAddToCartClick = () => {
    appStore.updateUserCartState({ name, price });
  };

  return (
    <div className="product-list-item">
      {/*<img src={image} alt={`${translations.productImage}${name}`} className="product-list-item__image" />*/}

      <dl>
        <div className="product-list-item__metadata">
          <dt>{translations.productName}:</dt>
          <dd>{name}</dd>
        </div>

        {/*<div className="product-list-item__metadata">*/}
        {/*  <dt>{translations.productUrl}:</dt>*/}
        {/*  <dd>{url}</dd>*/}
        {/*</div>*/}

        <div className="product-list-item__metadata">
          <dt>{translations.price}:</dt>
          <dd>{price}</dd>
        </div>
      </dl>

      <button onClick={handleAddToCartClick}>{translations.addToCart}</button>

      <Link
        to={{
          pathname: `/shop/${name/*url*/}`,
          state: product,
        }}
      >
        {translations.detailsBtn}
      </Link>
    </div>
  );
}
