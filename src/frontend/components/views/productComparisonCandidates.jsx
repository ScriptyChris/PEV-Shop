import '@frontend/assets/styles/views/productComparisonCandidates.scss';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

import { PEVButton, PEVIconButton, PEVLink, PEVParagraph, PEVImage } from '@frontend/components/utils/pevElements';
import { BalanceIcon } from '@frontend/components/svgIcons';
import storeService from '@frontend/features/storeService';
import Scroller from '@frontend/components/utils/scroller';
import { ROUTES } from '@frontend/components/pages/_routes';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { subscribeToBodyMutations, unSubscribeFromBodyMutations } from '@frontend/components/utils/bodyObserver';
import { ProductCardLink } from '@frontend/components/views/productCard';
import { COMMON_PERCEPTION_DELAY_TIME, ARRAY_FORMAT_SEPARATOR } from '@commons/consts';
import { possiblyReEncodeURI } from '@commons/uriReEncoder';

const translations = {
  addToCompare: 'Add to compare',
  removeFromCompare: 'Remove from compare',
  compareProductsLabel: 'products to compare',
  removeComparableProduct: 'Remove',
  showCandidatesList: 'Show comparison candidates list',
  hideCandidatesList: 'Hide comparison candidates list',
  proceedComparison: 'Compare products',
  clearComparableProducts: 'Clear',
  tooLittleProductsToCompare: 'At least 2 products needs to be selected to do a comparison.',
};

const bodyStyleUpdaters = Object.freeze({
  setMarginBottom(value) {
    document.body.style.marginBottom = value;
  },
  clearMarginBottom() {
    document.body.style.marginBottom = null;
  },
  setTransition() {
    document.body.style.transition = `margin-bottom ${COMMON_PERCEPTION_DELAY_TIME}ms`;
  },
  clearTransition() {
    document.body.style.transition = null;
  },
});

const useDOMRefs = () => {
  const containerRef = useRef();
  const getContainerRef = useCallback((containerNode) => {
    if (containerNode) {
      containerRef.current = containerNode;
    }
  }, []);

  const toggleBtnCSSLeftValVar = useRef();
  const toggleBtnRef = useRef();
  const getToggleBtnRef = useCallback((btnNode) => {
    if (btnNode) {
      toggleBtnRef.current = btnNode;
      toggleBtnCSSLeftValVar.current = window.getComputedStyle(btnNode).getPropertyValue('--toggle-expand-btn-left');
    }
  }, []);

  return {
    containerRef,
    getContainerRef,
    toggleBtnRef,
    getToggleBtnRef,
    toggleBtnCSSLeftValVar,
  };
};

function ToggleExpandBtnDirectionIcon({ isDown }) {
  if (typeof isDown !== 'boolean') {
    throw TypeError(`isDown prop must be a boolean! Received "${isDown}}".`);
  }

  return isDown ? <KeyboardArrowDownIcon size="small" /> : <KeyboardArrowUpIcon size="small" />;
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
            data-cy="counter:product-comparison-candidates__list-counter"
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

export const ProductComparisonCandidatesList = observer(function ProductComparisonCandidatesList() {
  const MIN_COMPARISON_CANDIDATES_AMOUNT = 2;
  const [popupData, setPopupData] = useState(null);
  const [isContainerExpanded, setIsContainerExpanded] = useState(true);

  const handleRemoveComparableProduct = (productIndex) => {
    storeService.updateProductComparisonState({ remove: { index: productIndex } });
  };

  const handleClearCompareProducts = () => {
    storeService.clearProductComparisonState();
  };

  const handleProceedComparison = (event) => {
    if (storeService.productComparisonState.length < MIN_COMPARISON_CANDIDATES_AMOUNT) {
      event.preventDefault();
      setPopupData({
        type: POPUP_TYPES.NEUTRAL,
        message: translations.tooLittleProductsToCompare,
        buttons: [getClosePopupBtn(setPopupData)],
      });
    } else {
      collapseOnExit();
      collapseOnExited();
    }
  };

  const { containerRef, getContainerRef, toggleBtnRef, getToggleBtnRef, toggleBtnCSSLeftValVar } = useDOMRefs();
  const onBodyMutation = useRef(({ paddingRight }) => {
    const containerTargetElement = containerRef.current.querySelector('.product-comparison-candidates');
    const currentTargetElementMarginRight = Number.parseFloat(
      window.getComputedStyle(containerTargetElement).marginRight
    );
    const paddingRightAsNumber = Number.parseFloat(paddingRight);

    containerTargetElement.style.marginRight = paddingRightAsNumber
      ? `${currentTargetElementMarginRight + paddingRightAsNumber / 2}px`
      : null;
    toggleBtnRef.current.style.left = paddingRightAsNumber
      ? `calc(${toggleBtnCSSLeftValVar.current} - ${paddingRightAsNumber / 2}px)`
      : null;
  });

  useEffect(() => {
    const subscriptionID = subscribeToBodyMutations(onBodyMutation.current);

    return () => unSubscribeFromBodyMutations(subscriptionID);
  }, []);

  const handleBodySpaceCompensation = (collapserNode) => {
    if (areComparableProductsReady) {
      const containerHeight = window.getComputedStyle(collapserNode).height;
      bodyStyleUpdaters.setMarginBottom(containerHeight);
    }
  };

  const handleCompareExpandedToggle = () => setIsContainerExpanded((prevVisibility) => !prevVisibility);

  const collapseOnExit = () => bodyStyleUpdaters.setMarginBottom(0);
  const collapseOnExited = () => {
    bodyStyleUpdaters.clearMarginBottom();
    bodyStyleUpdaters.clearTransition();
  };

  const areComparableProductsReady = storeService.productComparisonState.length > 0;
  const toggleExpandBtnA11y = isContainerExpanded ? translations.hideCandidatesList : translations.showCandidatesList;
  const productsNamesToCompareQueryParam = `?productsNames[]=${storeService.productComparisonState
    .map(({ name }) => possiblyReEncodeURI(name))
    .join(ARRAY_FORMAT_SEPARATOR)}`;

  return (
    <Collapse
      in={areComparableProductsReady && isContainerExpanded}
      ref={getContainerRef}
      className="product-comparison-candidates-container"
      onEnter={bodyStyleUpdaters.setTransition}
      onEntered={handleBodySpaceCompensation}
      onExit={collapseOnExit}
      onExited={collapseOnExited}
    >
      <Paper component="aside" elevation={1} className="product-comparison-candidates">
        <PEVButton
          className={classNames('product-comparison-candidates__toogle-expand-btn MuiFab-primary', {
            'product-comparison-candidates__toogle-expand-btn--force-visibility': areComparableProductsReady,
          })}
          onClick={handleCompareExpandedToggle}
          size="small"
          a11y={toggleExpandBtnA11y}
          ref={getToggleBtnRef}
        >
          <ToggleExpandBtnDirectionIcon isDown={isContainerExpanded} />
          {toggleExpandBtnA11y}
          <ToggleExpandBtnDirectionIcon isDown={isContainerExpanded} />
        </PEVButton>

        <Scroller
          scrollerBaseValueMeta={{
            selector: '.product-comparison-candidates, .product-comparison',
            varName: '--product-list-item-width',
          }}
          forwardProps={{ trackedChanges: toJS(storeService.productComparisonState) }}
          render={({ ScrollerHookingParent, forwardProps: { trackedChanges: productComparisonState } }) => (
            <div className="pev-flex pev-flex--columned product-comparison-candidates__scroller">
              {/* TODO: [UX] adjust element's width according to children count (and container free space) */}
              <ScrollerHookingParent>
                <ol
                  className="product-comparison-candidates__list vertically-centered"
                  // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                  aria-labelledby="compareProductCandidatesListCounter"
                  data-cy="container:product-comparison-candidates__list"
                >
                  {productComparisonState.map((product, index) => (
                    <li className="product-comparison-candidates__list-item" key={product._id}>
                      <ProductCardLink className="product-comparison-candidates__list-item-link" productData={product}>
                        <PEVImage
                          image={product.images[0]}
                          className="product-comparison-candidates__list-item-image"
                          width={100}
                        />
                        <PEVParagraph
                          className="product-comparison-candidates__list-item-content"
                          data-cy="label:product-comparison-candidates__list-item-name"
                        >
                          {product.name}
                        </PEVParagraph>
                      </ProductCardLink>
                      <PEVIconButton
                        onClick={() => handleRemoveComparableProduct(index)}
                        className="product-comparison-candidates__list-item-remove-button"
                        a11y={translations.removeComparableProduct}
                        data-cy={`button:product-comparison-candidates__list-item-remove-btn--${index}`}
                      >
                        <DeleteIcon />
                      </PEVIconButton>
                    </li>
                  ))}
                </ol>
              </ScrollerHookingParent>
              <ComparisonCandidatesCounter amount={storeService.productComparisonState.length} />
            </div>
          )}
        />

        <div className="product-comparison-candidates__actions">
          <PEVLink
            to={{
              pathname: ROUTES.PRODUCTS__COMPARE,
              search: productsNamesToCompareQueryParam,
            }}
            onClick={handleProceedComparison}
            a11y={translations.proceedComparison}
            data-cy="link:product-comparison-candidates__actions-proceed"
          >
            <DoneIcon />
          </PEVLink>

          <Divider orientation="vertical" flexItem />

          <PEVIconButton
            onClick={handleClearCompareProducts}
            size="small"
            a11y={translations.clearComparableProducts}
            data-cy="button:product-comparison-candidates__actions-clear"
          >
            <ClearIcon />
          </PEVIconButton>
        </div>

        <Popup {...popupData} />
      </Paper>
    </Collapse>
  );
});

export const ProductComparisonCandidatesToggler = observer(function ToggleProductComparable({ product }) {
  const [isProductComparable, setIsProductComparable] = useState(false);
  const btnDataCy = isProductComparable ? 'button:remove-product-from-comparison' : 'button:add-product-to-comparison';

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
      color="primary"
      variant="contained"
      size="small"
      startIcon={<BalanceIcon />}
      data-cy={btnDataCy}
    >
      {isProductComparable ? translations.removeFromCompare : translations.addToCompare}
    </PEVButton>
  );
});
