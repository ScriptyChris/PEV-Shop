import React, { useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import appStore from '../../features/appStore';
import { Link } from 'react-router-dom';
import Scroller from '../utils/scroller';

const List = observer(function CompareProducts() {
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

  return appStore.productComparisonState.length ? (
    /** TODO:
     * - shrink/collapse widget to an expandable button on mobile
     * - mobile should have full width widget probably sticked to viewport's top
     */
    <aside className="compare-products-candidates">
      <Scroller
        scrollerBaseValueMeta={{
          selector: '.compare-products-candidates, .compare-products',
          varName: '--product-list-item-width',
        }}
        forwardProps={{ trackedChanges: toJS(appStore.productComparisonState) }}
        render={({ elementRef, forwardProps: { trackedChanges: productComparisonState } }) => (
          <div>
            <ol ref={elementRef} className="compare-products-candidates__list">
              {productComparisonState.map((product, index) => (
                <li className="compare-products-candidates__list-item" key={product._id}>
                  <span>{product.name}</span>
                  <button onClick={() => handleRemoveComparableProduct(index)}>
                    {translations.removeComparableProduct}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      />

      <div className="compare-products-candidates__actions">
        <Link to={{ pathname: `/compare` }}> {translations.compareProducts}</Link>
        <button onClick={handleClearCompareProducts}>{translations.clearComparableProducts}</button>
      </div>
    </aside>
  ) : (
    ''
  );
});

const Toggler = observer(function ToggleProductComparable({ product }) {
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

export default { List, Toggler };
