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
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';

const translations = {
  addToCompare: 'Add to compare',
  removeFromCompare: 'Remove from compare',
  compareProductsLabel: 'products to compare',
  removeComparableProduct: 'Remove',
  proceedComparison: 'Compare products',
  clearComparableProducts: 'Clear',
  tooLittleProductsToCompare: 'At least 2 products needs to be selected to do a comparison.',
};

function ComparisonCandidatesCounter({ amount }) {
  const [isAmountBlinking, setIsAmountBlinking] = useState(true);

  useEffect(() => {
    setIsAmountBlinking(false);
    window.requestAnimationFrame(() => setIsAmountBlinking(true));
  }, [amount]);

  const removeAmountBlinking = () => setIsAmountBlinking(false);

  return (
    <small className="product-comparison-candidates__list-counter" id="compareProductCandidatesListCounter">
      {amount > 0 && (
        <>
          <output
            onAnimationEnd={removeAmountBlinking}
            className={classNames({ 'product-comparison-candidates__list-counter--blinking': isAmountBlinking })}
          >
            {amount}
          </output>
          &nbsp;
          {translations.compareProductsLabel}
        </>
      )}
    </small>
  );
}

export const ProductComparisonCandidatesList = observer(function CompareProducts() {
  const isMobileLayout = useMobileLayout();
  const [popupData, setPopupData] = useState(null);
  const CandidatesWrapper = isMobileLayout ? Collapse : Zoom;

  const handleRemoveComparableProduct = (productIndex) => {
    storeService.updateProductComparisonState({ remove: { index: productIndex } });
  };

  const handleClearCompareProducts = () => {
    storeService.clearProductComparisonState();
  };

  const showOptionalWarning = (event) => {
    if (storeService.productComparisonState.length < 2) {
      event.preventDefault();
      setPopupData({
        type: POPUP_TYPES.NEUTRAL,
        message: translations.tooLittleProductsToCompare,
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }
  };

  return (
    <CandidatesWrapper
      in={storeService.productComparisonState.length > 0}
      className={classNames({ 'product-comparison-candidates-pc-wrapper': !isMobileLayout })}
    >
      <Paper className="product-comparison-candidates-container">
        <div className="product-comparison-candidates">
          <Scroller
            scrollerBaseValueMeta={{
              selector: '.product-comparison-candidates, .product-comparison',
              varName: '--product-list-item-width',
            }}
            forwardProps={{ trackedChanges: toJS(storeService.productComparisonState) }}
            render={({ elementRef, forwardProps: { trackedChanges: productComparisonState } }) => (
              <div /* this `div` is hooked with a `ref` by Scroller component */>
                <ol
                  ref={elementRef}
                  className="product-comparison-candidates__list vertically-centered"
                  // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                  aria-labelledby="compareProductCandidatesListCounter"
                >
                  {productComparisonState.map((product, index) => (
                    <li className="product-comparison-candidates__list-item" key={product._id}>
                      <p>{product.name}</p>
                      <IconButton
                        onClick={() => handleRemoveComparableProduct(index)}
                        className="product-comparison-candidates__list-item-remove-button"
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

          <div className="product-comparison-candidates__actions">
            <MUILink
              to={{ pathname: ROUTES.COMPARE }}
              onClick={showOptionalWarning}
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
        {popupData && <Popup {...popupData} />}
      </Paper>
    </CandidatesWrapper>
  );
});

export const ProductComparisonCandidatesToggler = observer(function ToggleProductComparable({ product }) {
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
      className="product-comparison-candidate-toggler"
      control={<Checkbox checked={isProductComparable} onChange={handleComparableToggle} color="primary" />}
      label={isProductComparable ? translations.removeFromCompare : translations.addToCompare}
    />
  );
});
