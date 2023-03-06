import React, { lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';

const Home = lazy(() => import('@frontend/components/pages/home'));
const Products = lazy(() => import('@frontend/components/pages/products'));
const Register = lazy(() => import('@frontend/components/pages/register'));
const NotLoggedIn = lazy(() => import('@frontend/components/pages/notLoggedIn'));
const NotAuthorized = lazy(() => import('@frontend/components/pages/notAuthorized'));
const LogIn = lazy(() => import('@frontend/components/pages/logIn'));
const Account = lazy(() => import('@frontend/components/pages/account'));
const ConfirmRegistration = lazy(() => import('@frontend/components/pages/confirmRegistration'));
const NotFound = lazy(() => import('@frontend/components/pages/notFound'));
const ScrollToTop = lazy(() => import('@frontend/components/utils/scrollToTop'));

import { SetNewPassword, ResetPassword } from './password';
import { GenericErrorPopup } from '@frontend/components/utils/popup';
import { PEVSuspense } from '@frontend/components/utils/pevElements';

export default observer(function Main() {
  const routesGuards = useRoutesGuards(storeService);

  return (
    <main className="main">
      <Switch>
        <Route path={ROUTES.ROOT} exact>
          <PEVSuspense>
            <Home />
          </PEVSuspense>
        </Route>

        <Route path={ROUTES.PAGES}>
          <Route path={ROUTES.PRODUCTS}>
            <PEVSuspense>
              <Products />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.REGISTER}>
            <PEVSuspense>
              <Register />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.CONFIRM_REGISTRATION}>
            <PEVSuspense>
              <ConfirmRegistration />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.LOG_IN}>
            <PEVSuspense>
              <LogIn />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.NOT_LOGGED_IN}>
            <PEVSuspense>
              <NotLoggedIn />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.NOT_AUTHORIZED}>
            <PEVSuspense>
              <NotAuthorized />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.RESET_PASSWORD}>
            <PEVSuspense>
              <ResetPassword />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.SET_NEW_PASSWORD}>
            <PEVSuspense>
              <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_OUT} />
            </PEVSuspense>
          </Route>
          <Route path={ROUTES.ACCOUNT}>
            {
              /* TODO: [BUG] show loader for the time `storeService.userAccountState` is updated by MobX 
              to prevent redirecting when user indeed has session */
              routesGuards.isUser() ? (
                <PEVSuspense>
                  <Account />
                </PEVSuspense>
              ) : (
                <Redirect to={ROUTES.NOT_LOGGED_IN} />
              )
            }
          </Route>

          {/* for explicit redirection to 404 */}
          <Route path={ROUTES.NOT_FOUND}>
            <PEVSuspense>
              <NotFound />
            </PEVSuspense>
          </Route>
        </Route>

        {/* for unexpected 404 */}
        <Route>
          <PEVSuspense>
            <NotFound />
          </PEVSuspense>
        </Route>
      </Switch>

      <PEVSuspense emptyLoader>
        <ScrollToTop />
      </PEVSuspense>
      <GenericErrorPopup />
    </main>
  );
});
