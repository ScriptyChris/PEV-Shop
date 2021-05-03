import React from 'react';
import appStore from '../../features/appStore';
import ProductDetails from '../views/productDetails';
import Scroller from '../utils/scroller';

export default function Compare() {
  return (
    <section className="compare-products">
      <Scroller
        render={(listRef) => (
          <ol ref={listRef} className="compare-products-list">
            {appStore.productComparisonState.map((product) => {
              return (
                <li key={product._id} className="compare-products-list__item">
                  <ProductDetails product={product} />
                </li>
              );
            })}
          </ol>
        )}
      />
    </section>
  );
}
