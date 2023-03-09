import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import RemoveFromQueueIcon from '@material-ui/icons/RemoveFromQueue';

import { PEVButton, PEVIconButton, PEVParagraph } from '@frontend/components/utils/pevElements';
import { useRWDLayout } from '@frontend/contexts/rwd-layout.tsx';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import storageService from '@frontend/features/storageService';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import ProductCard, { PRODUCT_CARD_LAYOUT_TYPES } from '@frontend/components/views/productCard';

const translations = {
  lackOfObservedProducts: "You don't oberve any product yet.",
  observeProduct: 'Observe',
  unObserveProduct: 'Unobserve',
  unobserveAllProducts: 'Unobserve all',
  unobserveProduct: 'Unobserve product',
  unobserveAllProductsFailedMsg: 'Failed to unobserve all products :(',
  observingProductFailed: 'Failed adding product to observed!',
  unObservingProductFailed: 'Failed removing product from observed!',
  promptToLoginBeforeProductObserveToggling: 'You need to log in as a client to toggle product observing state.',
  goTologIn: 'Log in',
};

export const ProductObservabilityToggler = observer(({ productId, getCustomButton = null }) => {
  if (!productId) {
    throw TypeError(`productId '${productId}' is not provided!'`);
  } else if (getCustomButton !== null && typeof getCustomButton !== 'function') {
    throw TypeError(`getCustomButton '${getCustomButton}' should be null or function!'`);
  }

  const routesGuards = useRoutesGuards(storeService);
  const history = useHistory();

  const [popupData, setPopupData] = useState(null);
  // TODO: [BUG] update `isProductObserved` when component is re-rendered due to `product` prop param change
  const [isProductObserved, setIsProductObserved] = useState(() => {
    return (storeService.userAccountState?.observedProductsIDs || []).some(
      (observedProductID) => observedProductID === productId
    );
  });
  const buttonContent = isProductObserved ? translations.unObserveProduct : translations.observeProduct;
  // TODO: [BUG] change data-cy and fix auth issue
  const buttonDataCy = `button:product-${isProductObserved ? 'remove-from-compare' : 'add-to-compare'}`;

  const toggleProductObserve = (event, shouldObserve) => {
    if (routesGuards.isGuest()) {
      return setPopupData({
        type: POPUP_TYPES.NEUTRAL,
        message: translations.promptToLoginBeforeProductObserveToggling,
        buttons: [
          {
            text: translations.goTologIn,
            onClick: () => history.push(ROUTES.LOG_IN),
          },
          getClosePopupBtn(setPopupData),
        ],
      });
    }

    const shouldObserveOrUnobserve = typeof shouldObserve === 'boolean' ? shouldObserve : !isProductObserved;
    const observeOrUnobserveProductMethodName = shouldObserveOrUnobserve
      ? 'addProductToObserved'
      : 'removeProductFromObserved';

    httpService
      .disableGenericErrorHandler() /* eslint-disable-next-line no-unexpected-multiline */
      [observeOrUnobserveProductMethodName](productId)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          const message = isProductObserved
            ? translations.unObservingProductFailed
            : translations.observingProductFailed;

          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setIsProductObserved(!isProductObserved);
          storeService.updateProductObservedState(res);
          storageService.userAccount.update({ ...storeService.userAccountState, observedProductsIDs: res });
        }
      });
  };

  return (
    <>
      {getCustomButton ? (
        getCustomButton(toggleProductObserve)
      ) : (
        <PEVButton
          size="small"
          color="primary"
          variant="contained"
          startIcon={isProductObserved ? <RemoveFromQueueIcon /> : <AddToQueueIcon />}
          onClick={toggleProductObserve}
          data-cy={buttonDataCy}
        >
          {buttonContent}
        </PEVButton>
      )}

      <Popup {...popupData} />
    </>
  );
});

export default observer(function ObservedProducts() {
  const { isMobileLayout } = useRWDLayout();
  const [observedProducts, setObservedProducts] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [canUnobserveAllProducts, setCanUnobserveAllProducts] = useState(false);

  const unobserveAllProducts = () => {
    httpService
      .disableGenericErrorHandler()
      .removeAllProductsFromObserved()
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: translations.unobserveAllProductsFailedMsg,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setCanUnobserveAllProducts(false);
          setObservedProducts(res);
          storeService.updateProductObservedState(res);
          storageService.userAccount.update({ ...storeService.userAccountState, observedProductsIDs: res });
        }
      });
  };

  useEffect(() => {
    let _isComponentMounted = true;

    httpService.getObservedProducts().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED || !_isComponentMounted) {
        return;
      }

      // TODO: [BUG] fix "Can't perform a React state update on an unmounted component" error
      setCanUnobserveAllProducts(!!res.length);
      setObservedProducts(res);
    });

    return () => (_isComponentMounted = false);
  }, []);

  const getUnobserveProductHandler = (toggleProductObserve) => {
    return (event) => {
      event.stopPropagation();
      toggleProductObserve(event, false);
    };
  };

  return (
    <section
      className="account__menu-tab observed-products pev-flex pev-flex--columned"
      data-cy="section:observed-products"
    >
      {/* TODO: [UX] add searching and filtering for observed products */}

      <PEVButton onClick={unobserveAllProducts} disabled={!canUnobserveAllProducts}>
        {translations.unobserveAllProducts}
      </PEVButton>

      {observedProducts.length ? (
        <List
          component="ol"
          className="observed-products__list pev-flex pev-flex--columned"
          disablePadding={isMobileLayout}
        >
          {observedProducts.map((product, index) => (
            <ListItem key={product.name} disableGutters={isMobileLayout}>
              <ProductObservabilityToggler
                productId={product._id}
                getCustomButton={(toggleProductObserve) => (
                  <PEVIconButton
                    onClick={getUnobserveProductHandler(toggleProductObserve)}
                    onFocus={(event) => event.stopPropagation()}
                    a11y={translations.unobserveProduct}
                  >
                    <RemoveFromQueueIcon />
                  </PEVIconButton>
                )}
              />
              <ProductCard product={product} entryNo={index} layoutType={PRODUCT_CARD_LAYOUT_TYPES.DETAILED} />
            </ListItem>
          ))}
        </List>
      ) : (
        <PEVParagraph className="observed-products__empty-info">{translations.lackOfObservedProducts}</PEVParagraph>
      )}

      <Popup {...popupData} />
    </section>
  );
});
