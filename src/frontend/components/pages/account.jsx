import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation, Route, Switch, Redirect } from 'react-router-dom';
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { PEVButton, PEVLink, PEVHeading, PEVParagraph } from '@frontend/components/utils/pevElements';
import { useRWDLayout } from '@frontend/contexts/rwd-layout.tsx';
import storeService from '@frontend/features/storeService';
import httpService from '@frontend/features/httpService';
import { SetNewPassword } from '@frontend/components/views/password';
import userSessionService from '@frontend/features/userSessionService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import ObservedProducts from '@frontend/components/views/productObservability';
import Scroller from '@frontend/components/utils/scroller';
import { ROUTES } from './_routes';

const translations = Object.freeze({
  accountHeader: 'Account',
  accountNavMenuLabel: 'account nav menu',
  accountNavCrumbs: 'Account navigation crumbs',
  goToUserProfile: 'Profile',
  goToSecurity: 'Security',
  goToObservedProducts: 'Observed products',
  goToOrders: 'Orders',
  editUserData: 'Edit',
  logOutFromAllSessions: 'Log out from all sessions',
  logOutFromOtherSessions: 'Log out from other sessions',
  logOutFromAllSessionsConfirmMsg: 'Are you sure you want to log out from all sessions?',
  logOutFromOtherSessionsConfirmMsg: 'Are you sure you want to log out from other sessions except current one?',
  logOutFromOtherSessionsSuccessMsg: 'Logged out from other sessions!',
  logOutFromOtherSessionsFailedMsg: 'No other active sessions found!',
  confirm: 'Confirm',
  abort: 'Abort',
  lackOfData: 'No user data',
});

function UserProfile() {
  const [userData, setUserData] = useState(storeService.userAccountState);
  const isUserAttributeIgnored = (attributeName) => ['_id'].includes(attributeName);

  useEffect(() => {
    // this should not happen, because user account state is ready either on app start or after logging in
    if (!userData) {
      httpService.getCurrentUser().then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        storeService.updateUserAccountState(res);
        // that probably won't be needed at this point
        // storageService.userAccount.update(res);
        setUserData(res);
      });
    }
  }, []);

  const edit = () => {
    console.log('TODO: [FEATURE] implement editing user profile');
  };

  return userData ? (
    <section className="account__menu-tab pev-flex pev-flex--columned" data-cy="section:user-profile">
      <TableContainer className="account__menu-tab-profile-table-container">
        <Table>
          <TableBody>
            {Object.entries(userData).map(([key, value]) => {
              if (isUserAttributeIgnored(key)) {
                return null;
              }

              return (
                <TableRow key={key}>
                  <TableCell component="th">{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <PEVButton className="account__menu-tab-user-profile-edit-btn" onClick={edit}>
        {translations.editUserData}
      </PEVButton>
    </section>
  ) : (
    translations.lackOfData
  );
}

function Security() {
  const [popupData, setPopupData] = useState(null);
  const [shouldPreserveCurrentSession, setShouldPreserveCurrentSession] = useState(null);
  const [logOutFromSessionsConfirmation, setLogOutFromSessionsConfirmation] = useState(null);
  const history = useHistory();

  const logOutFromSessions = (preseveCurrentSession = false) => {
    setPopupData({
      type: POPUP_TYPES.NEUTRAL,
      message: preseveCurrentSession
        ? translations.logOutFromOtherSessionsConfirmMsg
        : translations.logOutFromAllSessionsConfirmMsg,
      buttons: [
        {
          text: translations.confirm,
          dataCy: 'button:confirm-logging-out-from-multiple-sessions',
          onClick: () => {
            setShouldPreserveCurrentSession(preseveCurrentSession);
            setLogOutFromSessionsConfirmation(true);
          },
        },
        {
          ...getClosePopupBtn(setPopupData),
          text: translations.abort,
        },
      ],
    });
  };

  useEffect(() => {
    if (typeof logOutFromSessionsConfirmation === 'boolean' && typeof shouldPreserveCurrentSession === 'boolean') {
      userSessionService.logOutFromMultipleSessions(shouldPreserveCurrentSession).then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (shouldPreserveCurrentSession) {
          setShouldPreserveCurrentSession(null);
          setLogOutFromSessionsConfirmation(null);
          setPopupData({
            type: res.__ERROR_TO_HANDLE ? POPUP_TYPES.FAILURE : POPUP_TYPES.SUCCESS,
            message: res.__ERROR_TO_HANDLE
              ? translations.logOutFromOtherSessionsFailedMsg
              : translations.logOutFromOtherSessionsSuccessMsg,
            buttons: [
              {
                ...getClosePopupBtn(setPopupData),
                dataCy: 'button:close-ended-other-sessions-confirmation',
              },
            ],
          });
        } else {
          history.replace(ROUTES.ROOT);
        }
      });
    }
  }, [logOutFromSessionsConfirmation, shouldPreserveCurrentSession]);

  return (
    <section className="account__menu-tab pev-flex pev-flex--columned" data-cy="section:security">
      <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_IN} />

      <Divider className="account__menu-tab-divider" light />

      <div className="pev-flex account__menu-tab-logout-from-sessions">
        {/* TODO: [feature] add list of active sessions and their selective removing */}
        <PEVButton onClick={() => logOutFromSessions(false)} data-cy="button:logout-from-all-sessions">
          {translations.logOutFromAllSessions}
        </PEVButton>
        <PEVButton onClick={() => logOutFromSessions(true)} data-cy="button:logout-from-other-sessions">
          {translations.logOutFromOtherSessions}
        </PEVButton>

        <Popup {...popupData} />
      </div>
    </section>
  );
}

function Orders() {
  return (
    <section className="account__menu-tab pev-flex pev-flex--columned" data-cy="section:orders">
      <input placeholder="TODO: [FEATURE] implement searching orders via name and date(?)" type="search" />
      <PEVParagraph>
        TODO: [FEATURE] implement listing orders with options such as: status, invoice, review, refund
      </PEVParagraph>
    </section>
  );
}

export default function Account() {
  const { isMobileLayout } = useRWDLayout();
  const { pathname } = useLocation();

  const TabsLayoutWrapper = ({ children }) =>
    isMobileLayout ? children : <Paper className="account__menu-tabs">{children}</Paper>;
  const subMenuNavCrumb = Object.values(Account.MENU_ITEMS).find(
    ({ url }) => window.location.pathname === url
  )?.translation;

  return (
    <article className="account">
      {isMobileLayout ? (
        <PEVHeading level={2} className="account__header">
          {translations.accountHeader}
        </PEVHeading>
      ) : (
        <Breadcrumbs component={Paper} className="account__header" aria-label={translations.accountNavCrumbs}>
          <PEVHeading level={2}>{translations.accountHeader}</PEVHeading>
          {subMenuNavCrumb && <PEVHeading level={3}>{subMenuNavCrumb}</PEVHeading>}
        </Breadcrumbs>
      )}

      <nav className="account__menu-nav">
        {isMobileLayout ? (
          <Scroller
            scrollerBaseValueMeta={{
              useDefault: true,
            }}
            render={({ ScrollerHookingParent }) => (
              <ScrollerHookingParent>
                <MenuList
                  component="ol"
                  className="account__menu-nav-list"
                  disablePadding
                  // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                  aria-label={translations.accountNavMenuLabel}
                >
                  {Account.MENU_ITEMS.map((item) => (
                    <MenuItem {...routeHelpers.getPossibleNavItemSelectedState(item.url)} key={item.url}>
                      <PEVLink
                        to={item.url}
                        {...routeHelpers.getPossibleAriaCurrentPage(item.url)}
                        data-cy="link:account-feature"
                      >
                        {item.translation}
                      </PEVLink>
                    </MenuItem>
                  ))}
                </MenuList>
              </ScrollerHookingParent>
            )}
          />
        ) : (
          <Paper>
            <MenuList component="ol" className="account__menu-nav-list" aria-label={translations.accountNavMenuLabel}>
              {Account.MENU_ITEMS.map((item) => (
                <MenuItem {...routeHelpers.getPossibleNavItemSelectedState(item.url)} disableGutters key={item.url}>
                  <PEVLink
                    to={item.url}
                    {...routeHelpers.getPossibleAriaCurrentPage(item.url)}
                    data-cy="link:account-feature"
                  >
                    {item.translation}
                  </PEVLink>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </nav>

      <TabsLayoutWrapper>
        <Switch>
          {pathname === ROUTES.ACCOUNT ? (
            <Redirect to={Account.MENU_ITEMS[0].url} />
          ) : (
            Account.MENU_ITEMS.map((item) => (
              <Route path={item.url} key={item.url}>
                {item.component}
              </Route>
            ))
          )}
        </Switch>
      </TabsLayoutWrapper>
    </article>
  );
}
Account.MENU_ITEMS = Object.freeze([
  {
    url: ROUTES.ACCOUNT__USER_PROFILE,
    translation: translations.goToUserProfile,
    component: <UserProfile />,
  },
  {
    url: ROUTES.ACCOUNT__SECURITY,
    translation: translations.goToSecurity,
    component: <Security />,
  },
  {
    url: ROUTES.ACCOUNT__OBSERVED_PRODUCTS,
    translation: translations.goToObservedProducts,
    component: <ObservedProducts />,
  },
  {
    url: ROUTES.ACCOUNT__ORDERS,
    translation: translations.goToOrders,
    component: <Orders />,
  },
]);
