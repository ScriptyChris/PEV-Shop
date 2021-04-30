import React from 'react';
import appStore from '../../features/appStore';

export default function Compare() {
  return (
    <section>
      <ol>
        {appStore.productComparisonState.map((product) => {
          return (
            <li key={product._id} className="compare-products__list-item">
              <span>{product.name}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
