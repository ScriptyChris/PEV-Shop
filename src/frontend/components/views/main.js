import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/home';
import Shop from '../pages/shop';
import { NewProduct, ModifyProduct } from '../pages/newProduct';
import Register from '../pages/register';
import LogIn from '../pages/logIn';
import Account from '../pages/account';
import Compare from '../pages/compare';
import Order from '../pages/order';
import ConfirmRegistration from '../pages/confirmRegistration';
import * as AdHocUserUpdate from '../pages/adHocUserUpdate';

export default function Main() {
  return (
    <main className="main">
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
        <Route path="/modify-product">
          <ModifyProduct />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/confirm-registration">
          <ConfirmRegistration />
        </Route>
        <Route path="/log-in">
          <LogIn />
        </Route>
        <Route path="/reset-password">
          <AdHocUserUpdate.ResetPassword />
        </Route>
        <Route path="/set-new-password">
          <AdHocUserUpdate.SetNewPassword />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/order">
          <Order />
        </Route>
      </Switch>
    </main>
  );
}
