import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import appStore from '../../features/appStore';
import { Link } from 'react-router-dom';

export const CompareProductsList = observer(function CompareProducts() {
  const translations = {
    compareProducts: 'Compare',
    removeComparableProduct: 'Remove',
    clearComparableProducts: 'Clear',
  };

  const handleRemoveComparableProduct = (productIndex) => {
    appStore.updateProductComparisonState({ remove: { index: productIndex } });
  };

  const handleClearCompareProducts = () => {
    appStore.clearProductComparisonState();
  };

  return (
    <aside className="compare-products-candidates">
      <ol className="compare-products-candidates__list">
        {appStore.productComparisonState.map((product, index) => {
          console.log('product to compare...:', product);

          return (
            <li key={product._id} className="compare-products-candidates__list-item">
              <span>{product.name}</span>
              <button onClick={() => handleRemoveComparableProduct(index)}>
                {translations.removeComparableProduct}
              </button>
            </li>
          );
        })}
      </ol>

      <Link to={{ pathname: `/compare` }}> {translations.compareProducts}</Link>
      <button onClick={handleClearCompareProducts}>{translations.clearComparableProducts}</button>
    </aside>
  );
});

export const ComparableProductToggler = observer(function ToggleProductComparable({ product }) {
  const [isProductComparable, setIsProductComparable] = useState(false);

  const translations = {
    addToCompare: 'Add to compare',
  };

  autorun(() => {
    const isComparable = appStore.productComparisonState.some(
      (comparableProduct) => comparableProduct._id === product._id
    );

    if (isProductComparable !== isComparable) {
      setIsProductComparable(isComparable);
    }
  });

  const handleComparableToggle = ({ target }) => {
    if (target.checked) {
      appStore.updateProductComparisonState({ add: product });
    } else {
      appStore.updateProductComparisonState({ remove: { _id: product._id } });
    }
  };

  return (
    <label className="product-list-item__toggle-comparable">
      <span>{translations.addToCompare}</span>
      <input type="checkbox" onChange={handleComparableToggle} checked={isProductComparable} />
    </label>
  );
});
