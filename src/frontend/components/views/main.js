import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import appStore, { USER_SESSION_STATES } from '../../features/appStore';

import Home from '../pages/home';
import Shop from '../pages/shop';
import { NewProduct, ModifyProduct } from '../pages/newProduct';
import Register from '../pages/register';
import NotLoggedIn from '../pages/notLoggedIn';
import LogIn from '../pages/logIn';
import Account from '../pages/account';
import Compare from '../pages/compare';
import Order from '../pages/order';
import ConfirmRegistration from '../pages/confirmRegistration';
import * as RecoverAccount from '../pages/recoverAccount';
import { GenericErrorPopup } from '../utils/popup';

export default observer(function Main() {
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
        <Route path="/not-logged-in">
          <NotLoggedIn />
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
          <RecoverAccount.ResetPassword />
        </Route>
        <Route path="/set-new-password">
          <RecoverAccount.SetNewPassword />
        </Route>
        <Route path="/account">
          {appStore.userSessionState === USER_SESSION_STATES.LOGGED_IN ? <Account /> : <Redirect to="/not-logged-in" />}
        </Route>
        <Route path="/order">
          <Order />
        </Route>
      </Switch>

      <GenericErrorPopup />
    </main>
  );
});
