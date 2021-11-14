import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import storeService from '../../features/storeService';
import userSessionService from '../../features/userSessionService';

import { ROUTES } from '../pages/_routes';
import Home from '../pages/home';
import Shop from '../pages/shop';
import Register from '../pages/register';
import NotLoggedIn from '../pages/notLoggedIn';
import LogIn from '../pages/logIn';
import Account from '../pages/account';
import ConfirmRegistration from '../pages/confirmRegistration';
import { SetNewPassword, ResetPassword } from '../views/password';
import NotFound from '../pages/notFound';
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
        <Route path={ROUTES.ROOT} exact>
          <Home />
        </Route>

        <Route path={ROUTES.PAGES}>
          <Route path={ROUTES.SHOP}>
            <Shop />
          </Route>
          <Route path={ROUTES.REGISTER}>
            <Register />
          </Route>
          <Route path={ROUTES.CONFIRM_REGISTRATION}>
            <ConfirmRegistration />
          </Route>
          <Route path={ROUTES.LOG_IN}>
            <LogIn />
          </Route>
          <Route path={ROUTES.NOT_LOGGED_IN}>
            <NotLoggedIn />
          </Route>
          <Route path={ROUTES.RESET_PASSWORD}>
            <ResetPassword />
          </Route>
          <Route path={ROUTES.SET_NEW_PASSWORD}>
            <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_OUT} />
          </Route>
          <Route path={ROUTES.ACCOUNT}>
            {
              /* TODO: [BUG] show loader for the time `storeService.userAccountState` is updated by MobX 
              to prevent redirecting when user indeed has session */
              storeService.userAccountState ? <Account /> : <Redirect to={ROUTES.NOT_LOGGED_IN} />
            }
          </Route>
        </Route>

        <Route>
          <NotFound />
        </Route>
      </Switch>

      <GenericErrorPopup />
    </main>
  );
});
