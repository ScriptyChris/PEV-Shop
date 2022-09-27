import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import TableContainer from '@material-ui/core/TableContainer';
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { PEVButton, PEVIconButton, PEVHeading } from '@frontend/components/utils/pevElements';
import storageService from '@frontend/features/storageService';
import storeService from '@frontend/features/storeService';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = {
  addToCartBtn: 'Add to cart',
  header: 'Cart',
  cartLabel: 'cart',
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

export function AddToCartButton({ productInfoForCart, startOrEndIcon = null, className }) {
  if (!productInfoForCart.name || !productInfoForCart.price || !productInfoForCart._id) {
    throw TypeError(
      `productInfoForCart must be an object containing: 'name', 'price', and '_id'! 
      Received: '${JSON.stringify(productInfoForCart)}'.`
    );
  } else if (startOrEndIcon !== null && !(startOrEndIcon === 'startIcon' || startOrEndIcon === 'endIcon')) {
    throw TypeError(
      `startOrEndIcon must have value of either 'startIcon' or 'endIcon'! 
      Received: '${JSON.stringify(startOrEndIcon)}'.`
    );
  }

  const ButtonTag = startOrEndIcon ? PEVButton : PEVIconButton;

  const handleAddToCartClick = () => {
    storeService.addProductToUserCartState(productInfoForCart /* TODO: [TS] `as IUserCart['products']` */);
  };

  return (
    // TODO: [UX] add list of product's amount to be added to cart (defaulted to 1) with an option to type custom amount
    // TODO: [UX] add info tooltip after product is added to cart
    <ButtonTag
      onClick={handleAddToCartClick}
      a11y={translations.addToCartBtn}
      className={className}
      {...{ [startOrEndIcon]: startOrEndIcon ? <AddShoppingCart /> : null }}
      variant={startOrEndIcon ? 'contained' : null}
      data-cy="button:add-product-to-cart"
    >
      {startOrEndIcon ? translations.addToCartBtn : <AddShoppingCart />}
    </ButtonTag>
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
    history.push(ROUTES.ORDER);
    handleCloseCart();
  };

  return (
    <>
      <PEVIconButton
        color="inherit"
        onClick={handleOpenCart}
        a11y={translations.cartLabel}
        data-cy="button:toggle-cart"
      >
        <ShoppingCart />
      </PEVIconButton>

      <Drawer anchor="right" open={isCartOpen} onClose={handleCloseCart}>
        <section className="cart pev-flex pev-flex--columned" data-cy="container:cart">
          <header className="cart__header">
            <PEVHeading className="pev-centered-padded-text" level={3}>
              {translations.header}
            </PEVHeading>

            <PEVIconButton onClick={handleCloseCart} className="cart__back-btn" a11y={translations.goBackLabel}>
              <CloseIcon />
            </PEVIconButton>
          </header>

          <TableContainer className="cart__table">
            <Table size="small" aria-label={translations.cartLabel}>
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
                      <TableCell data-cy="label:cart-product-price">{productItem.price}</TableCell>
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
                    <strong>{storeService.userCartTotalPrice}</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <footer className="cart__action-buttons">
            <PEVButton onClick={handleCartSubmission} data-cy="button:submit-cart" disabled={isCartEmpty}>
              {translations.submitCart}
            </PEVButton>
            <PEVButton onClick={handleCartCleanup} disabled={isCartEmpty}>
              {translations.cleanupCart}
            </PEVButton>
          </footer>
        </section>
      </Drawer>
    </>
  );
});
