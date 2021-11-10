import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import storeService from '../../features/storeService';
import userSessionService from '../../features/userSessionService';

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
import { SetNewPassword, ResetPassword } from '../views/password';
import { GenericErrorPopup } from '../utils/popup';

export default observer(function Main() {
  /*
    TODO: [UX] save user session to storage when page is unloaded (like by reloading or closing it).
    It may be done via window's 'beforeunload' event, but it's better to use Page Lifecycle (API)
    https://developers.google.com/web/updates/2018/07/page-lifecycle-api#observing-page-lifecycle-states-in-code
  */
  useEffect(userSessionService.restoreSession, []);

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
          <ResetPassword />
        </Route>
        <Route path="/set-new-password">
          <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_OUT} />
        </Route>
        <Route path="/account">
          {
            /* TODO: [BUG] show loader for the time `storeService.userAccountState` is updated by MobX 
            to prevent redirecting when user indeed has session */
            storeService.userAccountState ? <Account /> : <Redirect to="/not-logged-in" />
          }
        </Route>
        <Route path="/order">
          <Order />
        </Route>
      </Switch>

      <GenericErrorPopup />
    </main>
  );
});
