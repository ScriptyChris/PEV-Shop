import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import TableContainer from '@material-ui/core/TableContainer';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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

  const ButtonTag = startOrEndIcon ? Button : IconButton;

  const handleAddToCartClick = () => {
    storeService.addProductToUserCartState(productInfoForCart /* TODO: [TS] `as IUserCart['products']` */);
  };

  return (
    // TODO: [UX] add list of product's amount to be added to cart (defaulted to 1) with an option to type custom amount
    // TODO: [UX] add info tooltip after product is added to cart
    <ButtonTag
      onClick={handleAddToCartClick}
      aria-label={translations.addToCartBtn}
      title={translations.addToCartBtn}
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

  const handleTogglingCart = () => setIsCartOpen(!isCartOpen);

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
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleTogglingCart}
        aria-label={translations.cartLabel}
        title={translations.cartLabel}
        data-cy="button:toggle-cart"
      >
        <ShoppingCart />
      </IconButton>

      <Drawer anchor="right" open={isCartOpen} onClose={handleTogglingCart}>
        <section data-cy="container:cart">
          <IconButton
            onClick={handleTogglingCart}
            className="MuiButton-fullWidth"
            aria-label={translations.goBackLabel}
            title={translations.goBackLabel}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="h3" component="h3">
            {translations.header}
          </Typography>

          <TableContainer component={Paper}>
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
                        <IconButton
                          onClick={() => handleRemoveProductFromCart(productItem)}
                          aria-label={translations.removeProductFromCart}
                          title={translations.removeProductFromCart}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell component="th">{translations.productsTotals}</TableCell>
                  <TableCell>{storeService.userCartProductsCount}</TableCell>
                  <TableCell>{storeService.userCartTotalPrice}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <div className="cart-action-buttons">
            <Button
              onClick={handleCartSubmission}
              disabled={isCartEmpty}
              aria-label={translations.submitCart}
              title={translations.submitCart}
            >
              {translations.submitCart}
            </Button>
            <Button
              onClick={handleCartCleanup}
              disabled={isCartEmpty}
              aria-label={translations.cleanupCart}
              title={translations.cleanupCart}
            >
              {translations.cleanupCart}
            </Button>
          </div>
        </section>
      </Drawer>
    </>
  );
});
