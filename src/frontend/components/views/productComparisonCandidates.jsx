import React, { useEffect, useState } from 'react';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import Collapse from '@material-ui/core/Collapse';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

import { PEVButton, PEVIconButton, PEVLink } from '@frontend/components/utils/pevElements';
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

function CompareIcon({ isChecked }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames('product-comparison-candidates-toggle-icon', {
        'product-comparison-candidates-toggle-icon--checked': isChecked,
      })}
    >
      <path d="M13 7.83c.85-.3 1.53-.98 1.83-1.83H18l-3 7c0 1.66 1.57 3 3.5 3s3.5-1.34 3.5-3l-3-7h2V4h-6.17c-.41-1.17-1.52-2-2.83-2s-2.42.83-2.83 2H3v2h2l-3 7c0 1.66 1.57 3 3.5 3S9 14.66 9 13L6 6h3.17c.3.85.98 1.53 1.83 1.83V19H2v2h20v-2h-9V7.83zM20.37 13h-3.74l1.87-4.36L20.37 13zm-13 0H3.63L5.5 8.64 7.37 13zM12 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

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

export const ProductComparisonCandidatesList = observer(function CompareProducts({
  collapsibleAnimation,
  forceHideWhenEmpty,
  compensateOuterTopMargin,
}) {
  const isMobileLayout = useMobileLayout();
  const [popupData, setPopupData] = useState(null);
  const CandidatesWrapper = isMobileLayout || collapsibleAnimation ? Collapse : Zoom;

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
      style={{ marginTop: compensateOuterTopMargin ? '-0.5rem' : null }}
      className={classNames({
        'product-comparison-candidates-pc-wrapper': !isMobileLayout,
        'product-comparison-candidates--hidden': forceHideWhenEmpty && storeService.productComparisonState.length === 0,
      })}
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
              // TODO: [UX] adjust element's width according to children count (and container free space)
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
                      <PEVIconButton
                        onClick={() => handleRemoveComparableProduct(index)}
                        className="product-comparison-candidates__list-item-remove-button"
                        a11y={translations.removeComparableProduct}
                      >
                        <DeleteIcon />
                      </PEVIconButton>
                    </li>
                  ))}
                </ol>
                <ComparisonCandidatesCounter amount={storeService.productComparisonState.length} />
              </div>
            )}
          />

          <div className="product-comparison-candidates__actions">
            <PEVLink
              to={{ pathname: ROUTES.COMPARE }}
              onClick={showOptionalWarning}
              aria-label={translations.proceedComparison}
              title={translations.proceedComparison}
            >
              <DoneIcon />
            </PEVLink>

            <Divider orientation="vertical" flexItem />

            <PEVIconButton
              onClick={handleClearCompareProducts}
              size="small"
              a11y={translations.clearComparableProducts}
            >
              <ClearIcon />
            </PEVIconButton>
          </div>
        </div>

        <Popup {...popupData} />
      </Paper>
    </CandidatesWrapper>
  );
});

export const ProductComparisonCandidatesToggler = observer(function ToggleProductComparable({
  product,
  buttonVariant,
}) {
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

  const handleComparableToggle = () => {
    const newStoreProductComparisonState = isProductComparable ? { remove: { _id: product._id } } : { add: product };
    storeService.updateProductComparisonState(newStoreProductComparisonState);
  };

  return (
    <PEVButton
      onClick={handleComparableToggle}
      variant={buttonVariant}
      size="small"
      startIcon={<CompareIcon isChecked={isProductComparable} />}
    >
      {isProductComparable ? translations.removeFromCompare : translations.addToCompare}
    </PEVButton>
  );
});
