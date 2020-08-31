import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductItem({ product }) {
  const translations = {
    productName: 'Name',
    productImage: 'Image of ',
    productUrl: 'URL',
    price: 'Price',
    detailsBtn: 'Check details!',
  };

  const { name, url, image, price, details } = product;

  return (
    <li className="product-list-item">
      <img src={image} alt={`${translations.productImage}${name}`} className="product-list-item__image" />

      <dl>
        <div className="product-list-item__metadata">
          <dt>{translations.productName}:</dt>
          <dd>{image}</dd>
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

      <Link
        to={{
          pathname: `/shop/${url}`,
          state: { name, details },
        }}
      >
        {translations.detailsBtn}
      </Link>
    </li>
  );
}
