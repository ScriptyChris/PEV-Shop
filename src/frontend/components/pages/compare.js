import React from 'react';
import appStore from '../../features/appStore';
import ProductDetails from '../views/productDetails';

export default function Compare() {
  return (
    <ol className="compare-products-list">
      {appStore.productComparisonState.map((product) => {
        return (
          <li key={product._id} className="compare-products-list__item">
            <ProductDetails product={product} />
          </li>
        );
      })}
    </ol>
  );
}
