import React from 'react';

export default function ProductItem({ product }) {
  const translations = {
    productName: 'Name',
    productImage: 'Image of ',
    productUrl: 'URL',
    price: 'Price',
  };

  const { name, url, image, price } = product;

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
    </li>
  );
}
