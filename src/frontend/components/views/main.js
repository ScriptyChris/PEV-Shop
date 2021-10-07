import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/home';
import Shop from '../pages/shop';
import { NewProduct, ModifyProduct } from '../pages/newProduct';
import LogIn from '../pages/logIn';
import Account from '../pages/account';
import Compare from '../pages/compare';

export default function Main() {
  return (
    <main className="main">
      Hello from PEV main!
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop">
          <Shop />
        </Route>
        <Route path="/compare">
          <Compare />
        </Route>
        <Route path="/add-new-product">
          <NewProduct />
        </Route>
        <Route path="/modify-product" component={ModifyProduct} />
        <Route path="/log-in">
          <LogIn />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
      </Switch>
    </main>
  );
}
