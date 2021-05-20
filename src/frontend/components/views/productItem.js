import React from 'react';
import { Link } from 'react-router-dom';
import appStore from '../../features/appStore';
import CompareProduct from './compareProducts';

const translations = {
  productName: 'Name',
  productImage: 'Image of ',
  productUrl: 'URL',
  price: 'Price',
  detailsBtn: 'Check details!',
  addToCart: 'Add to cart!',
};

export function ProductItemLink({ productData }) {
  // TODO: maybe state should be just index or prop name of the element and target component should get it from store?

  return (
    <Link
      to={{
        pathname: `/shop/${productData.url}`,
        state: productData,
      }}
    >
      {translations.detailsBtn}
    </Link>
  );
}

export default function ProductItem({ product }) {
  const { name, price, _id } = product;

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

      <ProductItemLink productData={product} />

      <CompareProduct.Toggler product={product} />
    </div>
  );
}
