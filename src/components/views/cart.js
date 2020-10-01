import React, { useState } from 'react';
import { observer } from 'mobx-react';
import appStore from '../../features/appStore';

export default observer(function Cart() {
  const [cartVisibility, updateCartVisibility] = useState(false);

  const translations = {
    header: 'Cart',
    productNameHeader: 'Product',
    productCountHeader: 'Count',
    productPriceHeader: 'Price',
    lackOfProducts: 'No products yet...',
    productsTotalPrice: 'Total price',
  };

  const handleTogglingCart = () => {
    updateCartVisibility(!cartVisibility);
  };

  return (
    <>
      <button className="cart-button" onClick={handleTogglingCart}>
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
              <th>{translations.productsTotalPrice}</th>
              <td>{appStore.userCartPriceSum}</td>
            </tr>
          </tfoot>
        </table>
      </section>
    </>
  );
});
