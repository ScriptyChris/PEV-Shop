import React, { useState, useEffect } from 'react';
import { useHistory, Link, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import MUILink from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { useMobileLayout } from '@frontend/contexts/mobile-layout.tsx';
import storeService from '@frontend/features/storeService';
import httpService from '@frontend/features/httpService';
import { SetNewPassword } from '@frontend/components/views/password';
import userSessionService from '@frontend/features/userSessionService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import ProductCard, { PRODUCT_CARD_LAYOUT_TYPES } from '@frontend/components/views/productCard';
import Scroller from '@frontend/components/utils/scroller';
import { ROUTES } from './_routes';

const translations = Object.freeze({
  accountHeader: 'Account',
  accountNavMenuLabel: 'account nav menu',
  goToUserProfile: 'Profile',
  goToSecurity: 'Security',
  goToObservedProducts: 'Observed products',
  goToOrders: 'Orders',
  editUserData: 'Edit',
  unobserveAllProducts: 'Unobserve all',
  unobserveProduct: 'Unobserve product',
  unobserveAllProductsFailedMsg: 'Failed to unobserve all products :(',
  unobserveProductFailedMsg: 'Failed to unobserve product :(',
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

  useEffect(() => {
    // this should not happen, because user account state is ready either on app start or after logging in
    if (!userData) {
      httpService.getUser().then((res) => {
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
    <section className="account__menu-tab" data-cy="section:user-profile">
      <TableContainer className="account__menu-tab-profile-table-container">
        <Table>
          <TableBody>
            {Object.entries(userData).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th">{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        className="account__menu-tab-user-profile-edit-btn"
        onClick={edit}
        variant="outlined"
        aria-label={translations.editUserData}
        title={translations.editUserData}
      >
        {translations.editUserData}
      </Button>
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
    <section className="account__menu-tab" data-cy="section:security">
      <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_IN} />

      <div className="account__menu-tab-logout-from-sessions">
        <Button
          variant="outlined"
          onClick={() => logOutFromSessions(false)}
          aria-label={translations.logOutFromAllSessions}
          title={translations.logOutFromAllSessions}
          data-cy="button:logout-from-all-sessions"
        >
          {translations.logOutFromAllSessions}
        </Button>
        <Button
          variant="outlined"
          onClick={() => logOutFromSessions(true)}
          aria-label={translations.logOutFromOtherSessions}
          title={translations.logOutFromOtherSessions}
          data-cy="button:logout-from-other-sessions"
        >
          {translations.logOutFromOtherSessions}
        </Button>

        {popupData && <Popup {...popupData} />}
      </div>
    </section>
  );
}

function ObservedProducts() {
  const isMobileLayout = useMobileLayout();
  const [observedProducts, setObservedProducts] = useState([]);
  const [canUnobserveAllProducts, setCanUnobserveAllProducts] = useState(
    !!storeService.userAccountState?.observedProductsIDs?.length
  );
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    httpService.getObservedProducts().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setObservedProducts(res);
    });
  }, []);

  const handleUnobserveAllProducts = () => {
    httpService
      .disableGenericErrorHandler()
      .removeAllProductsFromObserved()
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: translations.unobserveAllProductsFailedMsg,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setCanUnobserveAllProducts(false);
          setObservedProducts(res);
          storeService.updateUserAccountState({
            ...storeService.userAccountState,
            observedProductsIDs: res,
          });
        }
      });
  };

  // TODO: [FEATURE] implement unobserving a single product
  const handleUnobserveProduct = (event) => {
    event.stopPropagation();

    console.log('TODO: [FEATURE] implement unobserving a single product');
  };

  return (
    <section className="account__menu-tab" data-cy="section:observed-products">
      {/* TODO: [UX] add searching and filtering for observed products */}
      <Button
        onClick={handleUnobserveAllProducts}
        disabled={!canUnobserveAllProducts}
        variant="outlined"
        aria-label={translations.unobserveAllProducts}
        title={translations.unobserveAllProducts}
      >
        {translations.unobserveAllProducts}
      </Button>

      <List component="ol" className="account__menu-tab-observed-products-list" disablePadding={isMobileLayout}>
        {observedProducts.length
          ? observedProducts.map((product, index) => (
              <ListItem
                key={product.name}
                disableGutters={isMobileLayout}
                divider={index < observedProducts.length - 1}
              >
                <IconButton
                  onClick={handleUnobserveProduct}
                  onFocus={(event) => event.stopPropagation()}
                  aria-label={translations.unobserveProduct}
                  title={translations.unobserveProduct}
                >
                  <DeleteIcon />
                </IconButton>
                <ProductCard product={product} layoutType={PRODUCT_CARD_LAYOUT_TYPES.DETAILED} />
              </ListItem>
            ))
          : translations.lackOfData}
      </List>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}

function Orders() {
  return (
    <section className="account__menu-tab" data-cy="section:orders">
      <input placeholder="TODO: [FEATURE] implement searching orders via name and date(?)" type="search" />
      <p>TODO: [FEATURE] implement listing orders with options such as: status, invoice, review, refund</p>
    </section>
  );
}

export default function Account() {
  const isMobileLayout = useMobileLayout();
  // TODO: [PERFORMANCE]? fix rendering component twice when redirected from LogIn page
  const MENU_ITEMS = Object.freeze([
    {
      url: 'user-profile',
      translation: translations.goToUserProfile,
      component: <UserProfile />,
    },
    {
      url: 'security',
      translation: translations.goToSecurity,
      component: <Security />,
    },
    {
      url: 'observed-products',
      translation: translations.goToObservedProducts,
      component: <ObservedProducts />,
    },
    {
      url: 'orders',
      translation: translations.goToOrders,
      component: <Orders />,
    },
  ]);
  const TabsLayoutWrapper = ({ children }) =>
    isMobileLayout ? <>{children}</> : <Paper className="account__menu-tabs">{children}</Paper>;

  useEffect(() => {
    // TODO: [DX] automatically select first link (user profile) in a better way
    const userProfileURL = MENU_ITEMS[0].url;
    document.querySelector(`a[href$="/${userProfileURL}"]`).click();
  }, []);

  return (
    <article className={classNames('account', { 'account--pc': !isMobileLayout })}>
      <Typography variant="h2" component="h2" className="account__header">
        {translations.accountHeader}
      </Typography>

      <nav className="account__menu-nav">
        {isMobileLayout ? (
          <Scroller
            scrollerBaseValueMeta={{
              useDefault: true,
            }}
            render={({ elementRef }) => (
              <div /* this `div` is hooked with a `ref` by Scroller component */>
                <MenuList
                  ref={elementRef}
                  className="account__menu-nav-list"
                  component="ul"
                  disablePadding={true}
                  // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                  aria-label={translations.accountNavMenuLabel}
                >
                  {MENU_ITEMS.map((item) => (
                    <MenuItem
                      key={item.url}
                      // TODO: [UX] highlight active link
                    >
                      <MUILink
                        to={`${ROUTES.ACCOUNT}/${item.url}`}
                        component={Link}
                        color="inherit"
                        data-cy="link:account-feature"
                      >
                        {item.translation}
                      </MUILink>
                    </MenuItem>
                  ))}
                </MenuList>
              </div>
            )}
          />
        ) : (
          <Paper>
            <MenuList className="account__menu-nav-list">
              {MENU_ITEMS.map((item) => (
                <MenuItem disableGutters key={item.url}>
                  <MUILink to={`${ROUTES.ACCOUNT}/${item.url}`} component={Link} data-cy="link:account-feature">
                    {item.translation}
                  </MUILink>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </nav>

      <TabsLayoutWrapper>
        <Switch>
          {MENU_ITEMS.map((item) => (
            <Route path={`${ROUTES.ACCOUNT}/${item.url}`} key={item.url}>
              {item.component}
            </Route>
          ))}
        </Switch>
      </TabsLayoutWrapper>
    </article>
  );
}
