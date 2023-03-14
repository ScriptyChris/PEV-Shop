import React, { lazy, useState, useEffect, useRef } from 'react';
import { Route, Switch, Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import storageService from '@frontend/features/storageService';

const Welcome = lazy(() => import('@frontend/components/pages/welcome'));
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
import Popup, { GenericErrorPopup, POPUP_TYPES } from '@frontend/components/utils/popup';
import { PEVSuspense } from '@frontend/components/utils/pevElements';

const translations = {
  appAboutToBeReset: `App is going to be automatically reset to maintain its fresh state (this happens every hour). 
    Please click the reload button below, when it will be active.`,
  resetCounterLabel: 'Reset happens in',
  reloadApp: 'Reload the app',
};

// Set 5 seconds offset to give backend some time buffer for resetting process.
let secondsPassed = -5;
const useAppReloadCountdown = ({ onCountdownTick, onFinishedCountdown, timestampDiff }) => {
  if (typeof onCountdownTick !== 'function') {
    throw TypeError('`onCountdownTick` prop has to be a function!');
  } else if (typeof onFinishedCountdown !== 'function') {
    throw TypeError('`onFinishedCountdown` prop has to be a function!');
  }

  const [isLittleTimeLeft, setIsLittleTimeLeft] = useState(false);
  const countdownIntervalId = useRef(-1);

  useEffect(() => {
    if (!timestampDiff) {
      return;
    }

    const clearCountdown = () => window.clearInterval(countdownIntervalId.current);
    const startCountdown = () => {
      const ONE_SECOND = 1000;
      const ONE_MINUTE = 60;
      const PADDING_LIMIT = 2;
      const PADDING_VALUE = '0';

      onCountdownTick(<b>--:--</b>);
      clearCountdown();
      countdownIntervalId.current = window.setInterval(() => {
        const secondsDiff = Number.parseInt(timestampDiff / ONE_SECOND - secondsPassed);
        const minutesDiff = Number.parseInt(secondsDiff / ONE_MINUTE);
        const remainingMinutes = String(minutesDiff).padStart(PADDING_LIMIT, PADDING_VALUE);
        const secondsDiffCappedToMinute = secondsDiff % ONE_MINUTE;
        const remainingSeconds = String(secondsDiffCappedToMinute).padStart(PADDING_LIMIT, PADDING_VALUE);

        secondsPassed++;

        if (secondsDiff < 1) {
          clearCountdown();
          onFinishedCountdown();
        } else if (secondsDiff <= 10) {
          setIsLittleTimeLeft(true);
        }

        onCountdownTick(
          <>
            {translations.resetCounterLabel}:{' '}
            <b>
              {remainingMinutes}:{remainingSeconds}
            </b>
          </>
        );
      }, ONE_SECOND);
    };

    startCountdown();
    return clearCountdown;
  }, [timestampDiff]);

  const handleReloadAppRef = useRef(() => {
    storageService.clearAllUserData();
    storeService.clearAllUserData();

    // Use native location API to make browser reload a page.
    window.location.pathname = ROUTES.WELCOME;
  });

  return {
    isLittleTimeLeft,
    handleReloadAppRef,
    reloadAppTranslation: translations.reloadApp,
  };
};

function AppReloadPrompt({ remainingTimestampToNextAppReset }) {
  const [remainingTimeToAppNextReset, setRemainingTimeToAppNextReset] = useState();
  const { isLittleTimeLeft, handleReloadAppRef, reloadAppTranslation } = useAppReloadCountdown({
    onCountdownTick: setRemainingTimeToAppNextReset,
    onFinishedCountdown: () => {
      setPopupData((prev) => ({
        ...prev,
        buttons: prev.buttons.map((btn) => ({ ...btn, disabled: false })),
      }));
    },
    timestampDiff: remainingTimestampToNextAppReset,
  });
  const [popupData, setPopupData] = useState(() => ({
    type: POPUP_TYPES.NEUTRAL,
    message: translations.appAboutToBeReset,
    altMessage: remainingTimeToAppNextReset,
    customPopupClassName: 'app-reload-prompt-counter',
    buttons: [
      {
        text: reloadAppTranslation,
        onClick: handleReloadAppRef.current,
        disabled: true,
      },
    ],
  }));

  if (isLittleTimeLeft) {
    return <Popup {...{ ...popupData, altMessage: remainingTimeToAppNextReset }} />;
  }

  return null;
}

const IS_CYPRESS_TESTING = !!window.Cypress;

export default observer(function Main() {
  const routesGuards = useRoutesGuards(storeService);
  const isWelcomeRouteMatch = !!useRouteMatch(ROUTES.WELCOME);
  const history = useHistory();

  useEffect(() => {
    if (IS_CYPRESS_TESTING) {
      return;
    }

    const userAlreadyVisitedWelcomePage = !!storageService.recentWelcomeVisitTimestamp.get();
    const welcomePageWasVisitedInPrevAppReset =
      storageService.recentWelcomeVisitTimestamp.get() < storeService.appSetup.previousAppResetTimestamp;
    const shouldVisitWelcomePage = !userAlreadyVisitedWelcomePage || welcomePageWasVisitedInPrevAppReset;

    if (!isWelcomeRouteMatch && shouldVisitWelcomePage) {
      history.push(ROUTES.WELCOME);
    }
  }, [storeService.appSetup.previousAppResetTimestamp]);

  return (
    <main className="main">
      <Switch>
        <Route path={ROUTES.ROOT} exact>
          <PEVSuspense>
            <Home />
          </PEVSuspense>
        </Route>

        <Route path={ROUTES.PAGES}>
          <Route path={ROUTES.WELCOME}>
            <PEVSuspense>
              <Welcome
                useAppReloadCountdown={useAppReloadCountdown}
                remainingTimestampToNextAppReset={storeService.appSetup.remainingTimestampToNextAppReset}
              />
            </PEVSuspense>
          </Route>
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

      {!isWelcomeRouteMatch && !IS_CYPRESS_TESTING && (
        <AppReloadPrompt remainingTimestampToNextAppReset={storeService.appSetup.remainingTimestampToNextAppReset} />
      )}
      <PEVSuspense emptyLoader>
        <ScrollToTop />
      </PEVSuspense>
      <GenericErrorPopup />
    </main>
  );
});
