import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import Home from '@frontend/components/pages/home';
import Shop from '@frontend/components/pages/shop';
import Register from '@frontend/components/pages/register';
import NotLoggedIn from '@frontend/components/pages/notLoggedIn';
import NotAuthorized from '@frontend/components/pages/notAuthorized';
import LogIn from '@frontend/components/pages/logIn';
import Account from '@frontend/components/pages/account';
import ConfirmRegistration from '@frontend/components/pages/confirmRegistration';
import { SetNewPassword, ResetPassword } from './password';
import NotFound from '@frontend/components/pages/notFound';
import { GenericErrorPopup } from '@frontend/components/utils/popup';
import { ScrollToTop } from '@frontend/components/utils/scrollToTop';

export default observer(function Main() {
  const routesGuards = useRoutesGuards(storeService);

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
          <Route path={ROUTES.NOT_AUTHORIZED}>
            <NotAuthorized />
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
              routesGuards.isUser() ? <Account /> : <Redirect to={ROUTES.NOT_LOGGED_IN} />
            }
          </Route>
        </Route>

        <Route>
          <NotFound />
        </Route>
      </Switch>

      <ScrollToTop />
      <GenericErrorPopup />
    </main>
  );
});
