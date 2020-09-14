import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/home';
import Shop from '../pages/shop';
import NewProduct from '../pages/newProduct';
import LogIn from '../pages/logIn';
import Account from '../pages/account';

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
        <Route path="/add-new-product">
          <NewProduct />
        </Route>
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
