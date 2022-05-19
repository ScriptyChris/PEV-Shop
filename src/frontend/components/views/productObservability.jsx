import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import RemoveFromQueueIcon from '@material-ui/icons/RemoveFromQueue';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { useMobileLayout } from '@frontend/contexts/mobile-layout.tsx';
import { ROUTES } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import storageService from '@frontend/features/storageService';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import ProductCard, { PRODUCT_CARD_LAYOUT_TYPES } from '@frontend/components/views/productCard';

const translations = {
  observeProduct: 'Observe',
  unObserveProduct: 'Unobserve',
  unobserveAllProducts: 'Unobserve all',
  unobserveProduct: 'Unobserve product',
  unobserveAllProductsFailedMsg: 'Failed to unobserve all products :(',
  observingProductFailed: 'Failed adding product to observed!',
  unObservingProductFailed: 'Failed removing product from observed!',
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  goTologIn: 'Log in',
};

export const ProductObservabilityToggler = observer(({ productId, getCustomButton = null }) => {
  if (!productId) {
    throw TypeError(`productId '${productId}' is not provided!'`);
  } else if (getCustomButton !== null && typeof getCustomButton !== 'function') {
    throw TypeError(`getCustomButton '${getCustomButton}' should be null or function!'`);
  }

  const [popupData, setPopupData] = useState(null);
  // TODO: [BUG] update `isProductObserved` when component is re-rendered due to `product` prop param change
  const [isProductObserved, setIsProductObserved] = useState(() => {
    return (storeService.userAccountState?.observedProductsIDs || []).some(
      (observedProductID) => observedProductID === productId
    );
  });
  const buttonContent = isProductObserved ? translations.unObserveProduct : translations.observeProduct;

  const toggleProductObserve = (event, shouldObserve) => {
    if (!storeService.userAccountState) {
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
        <Button
          size="small"
          startIcon={isProductObserved ? <RemoveFromQueueIcon /> : <AddToQueueIcon />}
          onClick={toggleProductObserve}
          aria-label={buttonContent}
          title={buttonContent}
        >
          {buttonContent}
        </Button>
      )}

      <Popup {...popupData} />
    </>
  );
});

export default observer(function ObservedProducts() {
  const isMobileLayout = useMobileLayout();
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
    httpService.getObservedProducts().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setCanUnobserveAllProducts(!!res.length);
      setObservedProducts(res);
    });
  }, []);

  const getUnobserveProductHandler = (toggleProductObserve) => {
    return (event) => {
      event.stopPropagation();
      toggleProductObserve(event, false);
    };
  };

  return (
    <section className="account__menu-tab" data-cy="section:observed-products">
      {/* TODO: [UX] add searching and filtering for observed products */}

      <Button
        onClick={unobserveAllProducts}
        disabled={!canUnobserveAllProducts}
        variant="outlined"
        aria-label={translations.unobserveAllProducts}
        title={translations.unobserveAllProducts}
      >
        {translations.unobserveAllProducts}
      </Button>

      <List component="ol" className="account__menu-tab-observed-products-list" disablePadding={isMobileLayout}>
        {observedProducts.length
          ? observedProducts.map((product, index) => (
              <ListItem
                key={product.name}
                disableGutters={isMobileLayout}
                divider={index < observedProducts.length - 1}
              >
                <ProductObservabilityToggler
                  productId={product._id}
                  getCustomButton={(toggleProductObserve) => (
                    <IconButton
                      onClick={getUnobserveProductHandler(toggleProductObserve)}
                      onFocus={(event) => event.stopPropagation()}
                      aria-label={translations.unobserveProduct}
                      title={translations.unobserveProduct}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                />
                <ProductCard product={product} layoutType={PRODUCT_CARD_LAYOUT_TYPES.DETAILED} />
              </ListItem>
            ))
          : translations.lackOfData}
      </List>

      <Popup {...popupData} />
    </section>
  );
});
