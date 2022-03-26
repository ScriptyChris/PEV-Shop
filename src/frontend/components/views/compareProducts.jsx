import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import Collapse from '@material-ui/core/Collapse';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import MUILink from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import storeService from '@frontend/features/storeService';
import Scroller from '@frontend/components/utils/scroller';
import { ROUTES } from '@frontend/components/pages/_routes';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  addToCompare: 'Add to compare',
  removeFromCompare: 'Remove from compare',
  compareProductsLabel: 'products to compare',
  removeComparableProduct: 'Remove',
  proceedComparison: 'Compare products',
  clearComparableProducts: 'Clear',
};

function ComparisonCandidatesCounter({ amount }) {
  const [isAmountBlinking, setIsAmountBlinking] = useState(true);

  useEffect(() => {
    setIsAmountBlinking(false);
    window.requestAnimationFrame(() => setIsAmountBlinking(true));
  }, [amount]);

  const removeAmountBlinking = () => setIsAmountBlinking(false);

  return (
    <small className="compare-products-candidates__list-counter" id="compareProductCandidatesListCounter">
      {amount > 0 && (
        <>
          <output
            onAnimationEnd={removeAmountBlinking}
            className={classNames({ 'compare-products-candidates__list-counter--blinking': isAmountBlinking })}
          >
            {amount}&nbsp;
          </output>
          {translations.compareProductsLabel}
        </>
      )}
    </small>
  );
}

const List = observer(function CompareProducts() {
  const isMobileLayout = useMobileLayout();
  const CandidatesWrapper = isMobileLayout ? Collapse : Zoom;

  const handleRemoveComparableProduct = (productIndex) => {
    storeService.updateProductComparisonState({ remove: { index: productIndex } });
  };

  const handleClearCompareProducts = () => {
    storeService.clearProductComparisonState();
  };

  return (
    <CandidatesWrapper
      in={!!storeService.productComparisonState.length}
      className={classNames({ 'compare-products-candidates-pc-wrapper': !isMobileLayout })}
    >
      <Paper className="compare-products-candidates-container">
        <div className="compare-products-candidates">
          <Scroller
            scrollerBaseValueMeta={{
              selector: '.compare-products-candidates, .compare-products',
              varName: '--product-list-item-width',
            }}
            forwardProps={{ trackedChanges: toJS(storeService.productComparisonState) }}
            render={({ elementRef, forwardProps: { trackedChanges: productComparisonState } }) => (
              <div>
                <ol
                  ref={elementRef}
                  className="compare-products-candidates__list vertically-centered"
                  // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                  aria-labelledby="compareProductCandidatesListCounter"
                >
                  {productComparisonState.map((product, index) => (
                    <li className="compare-products-candidates__list-item" key={product._id}>
                      <span>{product.name}</span>
                      <IconButton
                        onClick={() => handleRemoveComparableProduct(index)}
                        className="compare-products-candidates__list-item-remove-button"
                        aria-label={translations.removeComparableProduct}
                        title={translations.removeComparableProduct}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  ))}
                </ol>
                <ComparisonCandidatesCounter amount={storeService.productComparisonState.length} />
              </div>
            )}
          />

          <div className="compare-products-candidates__actions">
            <MUILink
              to={{ pathname: ROUTES.COMPARE }}
              component={Link}
              color="inherit"
              aria-label={translations.proceedComparison}
              title={translations.proceedComparison}
            >
              <DoneIcon />
            </MUILink>

            <Divider orientation="vertical" flexItem />

            <IconButton
              onClick={handleClearCompareProducts}
              size="small"
              aria-label={translations.clearComparableProducts}
              title={translations.clearComparableProducts}
            >
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
    </CandidatesWrapper>
  );
});

const Toggler = observer(function ToggleProductComparable({ product }) {
  const [isProductComparable, setIsProductComparable] = useState(false);

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
    <FormControlLabel
      className="product-item-compare-toggler"
      control={<Checkbox checked={isProductComparable} onChange={handleComparableToggle} color="primary" />}
      label={isProductComparable ? translations.removeFromCompare : translations.addToCompare}
    />
  );
});

export default { List, Toggler };
