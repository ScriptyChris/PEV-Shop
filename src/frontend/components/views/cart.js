import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { USER_CART_STATE } from '../../features/storageApi';
import appStore from '../../features/appStore';

export default observer(function Cart() {
  const [cartVisibility, updateCartVisibility] = useState(false);
  const history = useHistory();

  const translations = {
    header: 'Cart',
    productNameHeader: 'Product',
    productCountHeader: 'Count',
    productPriceHeader: 'Price',
    lackOfProducts: 'No products yet...',
    productsTotals: 'Totals',
    submitCart: 'Submit cart',
    cleanupCart: 'Cleanup cart',
  };

  useEffect(() => {
    appStore.replaceUserCartState(USER_CART_STATE.getFromStorage());

    window.addEventListener(
      'beforeunload',
      () => {
        USER_CART_STATE.updateStorage(appStore.userCartState);
      },
      { once: true }
    );
  }, []);

  const handleTogglingCart = () => {
    updateCartVisibility(!cartVisibility);
  };

  const handleCartCleanup = () => {
    appStore.clearUserCartState();
  };

  const handleCartSubmission = () => {
    history.push('/order');
  };

  return (
    <>
      <button className="cart-toggle-button" onClick={handleTogglingCart}>
        $$$
      </button>

      <section className={`cart-container ${cartVisibility ? 'cart-container--visible' : ''}`}>
        {translations.header}

        <table>
          <thead>
            <tr>
              <th>{translations.productNameHeader}</th>
              <th>{translations.productCountHeader}</th>
              <th>{translations.productPriceHeader}</th>
            </tr>
          </thead>

          <tbody>
            {appStore.userCartProducts.length ? (
              appStore.userCartProducts.map((productItem) => {
                return (
                  <tr key={productItem.name}>
                    <td>{productItem.name}</td>
                    <td>{productItem.count}</td>
                    <td>{productItem.price}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>{translations.lackOfProducts}</td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <th>{translations.productsTotals}</th>
              <td>{appStore.userCartProductsCount}</td>
              <td>{appStore.userCartTotalPrice}</td>
            </tr>
          </tfoot>
        </table>

        <button className="cart-cleanup-button" onClick={handleCartCleanup}>
          {translations.cleanupCart}
        </button>
        <button className="cart-submit-button" onClick={handleCartSubmission}>
          {translations.submitCart}
        </button>
      </section>
    </>
  );
});
