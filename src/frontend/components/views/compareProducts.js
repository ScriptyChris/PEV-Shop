import React, { useEffect, useState } from 'react';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import storeService from '../../features/storeService';
import { Link } from 'react-router-dom';
import Scroller from '../utils/scroller';
import { ROUTES } from '../pages/_routes';

const List = observer(function CompareProducts() {
  const translations = {
    compareProducts: 'Compare',
    removeComparableProduct: 'Remove',
    clearComparableProducts: 'Clear',
  };

  const handleRemoveComparableProduct = (productIndex) => {
    storeService.updateProductComparisonState({ remove: { index: productIndex } });
  };

  const handleClearCompareProducts = () => {
    storeService.clearProductComparisonState();
  };

  return storeService.productComparisonState.length ? (
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
        forwardProps={{ trackedChanges: toJS(storeService.productComparisonState) }}
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
        <Link to={{ pathname: ROUTES.COMPARE }}> {translations.compareProducts}</Link>
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

  useEffect(() =>
    reaction(
      () => storeService.productComparisonState.some((comparableProduct) => comparableProduct._id === product._id),
      (isComparable) => {
        if (isProductComparable !== isComparable) {
          setIsProductComparable(isComparable);
        }
      },
      { fireImmediately: true }
    )
  );

  const handleComparableToggle = ({ target }) => {
    if (target.checked) {
      storeService.updateProductComparisonState({ add: product });
    } else {
      storeService.updateProductComparisonState({ remove: { _id: product._id } });
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
