import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import TableContainer from '@material-ui/core/TableContainer';
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { PEVButton, PEVIconButton, PEVHeading, PEVPopover, PEVParagraph } from '@frontend/components/utils/pevElements';
import storageService from '@frontend/features/storageService';
import storeService from '@frontend/features/storeService';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import Price from '@frontend/components/views/price';

const translations = {
  addToCartBtn: 'Add to cart',
  productAddedToCart: 'Product added to cart!',
  addingToCartAuthFailure: 'Adding product to cart is not available for your account type.',
  header: 'Cart',
  emptyCart: "You haven't added any product to cart yet!",
  goBackLabel: 'go back',
  productNameHeader: 'Product',
  productCountHeader: 'Count',
  productPriceHeader: 'Price',
  lackOfProducts: 'No products yet...',
  actions: 'Actions',
  removeProductFromCart: 'remove from cart',
  productsTotals: 'Totals',
  submitCart: 'Submit',
  cleanupCart: 'Cleanup',
};

export function AddToCartButton({ productInfoForCart, isSmallIcon, className }) {
  if (!productInfoForCart.name || !productInfoForCart.price || !productInfoForCart._id) {
    throw TypeError(
      `productInfoForCart must be an object containing: 'name', 'price', and '_id'! 
      Received: '${JSON.stringify(productInfoForCart)}'.`
    );
  }

  const [popupData, setPopupData] = useState(null);
  const routesGuards = useRoutesGuards(storeService);
  const cartButtonAnchorSetterRef = useRef(null);

  const handleAddToCartClick = ({ target }) => {
    if (!routesGuards.isGuest() && !routesGuards.isClient()) {
      return setPopupData({
        type: POPUP_TYPES.FAILURE,
        message: translations.addingToCartAuthFailure,
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }

    storeService.addProductToUserCartState(productInfoForCart /* TODO: [TS] `as IUserCart['products']` */);
    cartButtonAnchorSetterRef.current(target.closest('[data-cy="button:add-product-to-cart"]'));
  };

  // TODO: [UX] add list of product's amount to be added to cart (defaulted to 1) with an option to type custom amount
  // TODO: [UX] set different color for button depending on it's usage availability
  return (
    <>
      <PEVButton
        onClick={handleAddToCartClick}
        a11y={translations.addToCartBtn}
        className={classNames('add-to-cart-btn', className)}
        size={isSmallIcon ? 'small' : undefined}
        startIcon={<AddShoppingCart />}
        variant="contained"
        data-cy="button:add-product-to-cart"
      >
        {translations.addToCartBtn}
      </PEVButton>
      <PEVPopover anchorSetterRef={cartButtonAnchorSetterRef} dataCy="popup:add-to-cart-confirmation">
        {translations.productAddedToCart}
      </PEVPopover>

      <Popup {...popupData} />
    </>
  );
}

export default observer(function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const history = useHistory();
  const isCartEmpty = storeService.userCartProducts?.length === 0;

  useEffect(() => {
    storeService.replaceUserCartState(storageService.userCart.get());

    window.addEventListener(
      'beforeunload',
      () => {
        storageService.userCart.update(storeService.userCartState);
      },
      { once: true }
    );
  }, []);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleRemoveProductFromCart = ({ name, price, _id }) =>
    storeService.removeProductFromUserCartState(
      {
        price,
        name,
        _id,
      } /* TODO: [TS] `as IUserCart['products']` */
    );

  const handleCartCleanup = () => {
    storeService.clearUserCartState();
  };

  const handleCartSubmission = () => {
    history.push(ROUTES.PRODUCTS__ORDER);
    handleCloseCart();
  };

  return (
    <>
      <PEVIconButton
        className="cart-toggler-btn"
        color="inherit"
        onClick={handleOpenCart}
        a11y={translations.header}
        data-cy="button:toggle-cart"
      >
        <ShoppingCartIcon fontSize="inherit" />
      </PEVIconButton>

      <Drawer anchor="right" open={isCartOpen} onClose={handleCloseCart}>
        <section className="cart pev-flex pev-flex--columned" data-cy="container:cart">
          <header className="cart__header">
            <PEVHeading className="pev-centered-padded-text" level={3}>
              {translations.header}
            </PEVHeading>

            <PEVIconButton
              onClick={handleCloseCart}
              className="cart__back-btn"
              a11y={translations.goBackLabel}
              autoFocus
            >
              <CloseIcon />
            </PEVIconButton>
          </header>

          {storeService.userCartProducts.length ? (
            <>
              <TableContainer className="cart__table">
                <Table size="small" aria-label={translations.header}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{translations.productNameHeader}</TableCell>
                      <TableCell>{translations.productCountHeader}</TableCell>
                      <TableCell>{translations.productPriceHeader}</TableCell>
                      <TableCell>{translations.actions}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isCartEmpty ? (
                      <TableRow>
                        <TableCell>{translations.lackOfProducts}</TableCell>
                      </TableRow>
                    ) : (
                      storeService.userCartProducts.map((productItem) => (
                        <TableRow key={productItem.name}>
                          <TableCell data-cy="label:cart-product-name">{productItem.name}</TableCell>
                          <TableCell>{productItem.count}</TableCell>
                          <TableCell data-cy="label:cart-product-price">
                            <Price valueInUSD={productItem.price}>{({ currencyAndPrice }) => currencyAndPrice}</Price>
                          </TableCell>
                          <TableCell>
                            <PEVIconButton
                              onClick={() => handleRemoveProductFromCart(productItem)}
                              a11y={translations.removeProductFromCart}
                            >
                              <DeleteIcon />
                            </PEVIconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      <TableCell component="th">
                        <strong>{translations.productsTotals}</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{storeService.userCartProductsCount}</strong>
                      </TableCell>
                      <TableCell>
                        <strong>
                          <Price valueInUSD={storeService.userCartTotalPrice}>
                            {({ currencyAndPrice }) => currencyAndPrice}
                          </Price>
                        </strong>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

              <footer className="cart__action-buttons">
                <PEVButton
                  onClick={handleCartSubmission}
                  className="cart__action-buttons-submit"
                  data-cy="button:submit-cart"
                  disabled={isCartEmpty}
                >
                  {translations.submitCart}
                </PEVButton>
                <PEVButton onClick={handleCartCleanup} disabled={isCartEmpty}>
                  {translations.cleanupCart}
                </PEVButton>
              </footer>
            </>
          ) : (
            <PEVParagraph className="cart--empty__info">{translations.emptyCart}</PEVParagraph>
          )}
        </section>
      </Drawer>
    </>
  );
});
