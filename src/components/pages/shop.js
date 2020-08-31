import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProductList from '../views/productList';
import ProductDetails from '../views/productDetails';

export default function Shop() {
  return (
    <>
      <div>Shop!!!</div>

      <Switch>
        <Route path="/shop" exact>
          <ProductList />
        </Route>
        <Route path="/shop/:productName">
          <ProductDetails />
        </Route>
      </Switch>
    </>
  );
}
