import '@frontend/assets/styles/views/account.scss';

import React, { useState, useEffect, useMemo, lazy } from 'react';
import { useHistory, useLocation, Route, Switch, Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

const CartContent = lazy(() =>
  import('@frontend/components/views/cart').then((CartModule) => ({ default: CartModule.CartContent }))
);
const OrderSummary = lazy(() =>
  import('@frontend/components/pages/order').then((OrderModule) => ({ default: OrderModule.OrderSummary }))
);

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import EmailIcon from '@material-ui/icons/Email';

import {
  PEVButton,
  PEVLink,
  PEVHeading,
  PEVParagraph,
  PEVSuspense,
  PEVLoadingAnimation,
} from '@frontend/components/utils/pevElements';
import { useRWDLayout } from '@frontend/contexts/rwd-layout.tsx';
import storeService from '@frontend/features/storeService';
import httpService from '@frontend/features/httpService';
import { SetNewPassword } from '@frontend/components/views/password';
import userSessionService from '@frontend/features/userSessionService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import ObservedProducts from '@frontend/components/views/productObservability';
import Scroller from '@frontend/components/utils/scroller';
import { ROUTES, routeHelpers } from './_routes';
import { PAYMENT_METHODS, SHIPMENT_METHODS } from '@commons/consts';

const translations = Object.freeze({
  accountHeader: 'Account',
  accountNavMenuLabel: 'account nav menu',
  accountNavCrumbs: 'Account navigation crumbs',
  goToUserProfile: 'Profile',
  goToSecurity: 'Security',
  goToObservedProducts: 'Observed products',
  goToOrders: 'Orders',
  profileLogin: 'Login',
  profileEmail: 'Email',
  profileCheckEmails: 'view emails',
  profileAccountType: 'Account type',
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
  ordersOfAllClients: 'Listed all client users orders',
  orderSummaryDate: 'Date:',
  orderSummaryRegardingUser: 'User:',
  orderReceiverHeading: 'Receiver',
  orderReceiverName: 'Name',
  orderReceiverEmail: 'Email',
  orderReceiverPhone: 'Phone number',
  orderPaymentHeading: 'Payment',
  orderPaymentCash: 'Cash',
  orderPaymentCard: 'Card',
  orderPaymentTransfer: 'Transfer',
  orderPaymentBlik: 'Blik',
  orderShipmentHeading: 'Shipment',
  orderShipmentInPerson: 'In person',
  orderShipmentHome: 'Home',
  orderShipmentStreetAndApartment: 'Street and apartment number',
  orderShipmentPostalCode: 'Postal code',
  orderShipmentCity: 'City',
  orderShipmentParcelLocker: 'Parcel locker:',
  orderProductsHeading: 'Products',
  noOrdersMadeYet: 'No orders made yet!',
});

const UserProfile = observer(function UserProfile() {
  const [userData, setUserData] = useState(storeService.userAccountState);
  const { isMobileLayout } = useRWDLayout();

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

  // const edit = () => console.log('TODO: [FEATURE] implement editing user profile');
  const viewEmailLabel = isMobileLayout ? translations.profileCheckEmails : null;

  return userData ? (
    <section className="account__menu-tab pev-flex pev-flex--columned" data-cy="section:user-profile">
      <TableContainer className="account__menu-tab-profile-table-container">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" data-cy="cell-header:user-login">
                {translations.profileLogin}
              </TableCell>
              <TableCell data-cy="cell-value:user-login">{userData.login}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" className="account__profile-email">
                <span data-cy="cell-header:user-email">{translations.profileEmail}</span>
                <PEVLink
                  to={{ pathname: storeService.appSetup.emailServiceUrl }}
                  toExternalPage
                  aria-label={viewEmailLabel}
                  title={viewEmailLabel}
                >
                  <EmailIcon color="primary" fontSize="small" />
                  {!isMobileLayout && translations.profileCheckEmails}
                </PEVLink>
              </TableCell>
              <TableCell data-cy="cell-value:user-email">{userData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" data-cy="cell-header:user-account-type">
                {translations.profileAccountType}
              </TableCell>
              <TableCell data-cy="cell-value:user-account-type">{userData.accountType}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* TODO: [feature] implement editing user data */}
      {/* <PEVButton className="account__menu-tab-user-profile-edit-btn" onClick={edit}>
        {translations.editUserData}
      </PEVButton> */}
    </section>
  ) : (
    translations.lackOfData
  );
});

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

// TODO: [feature] implement listing orders with options such as: status, invoice, review, refund
// TODO: [feature] implement searching orders via name and date(?)
function Orders() {
  const [orders, setOrders] = useState(null);
  const { search } = useLocation();
  const { chosenTimestamp } = useMemo(() => routeHelpers.parseSearchParams(search), [search]);
  const isSellerUser = storeService.userAccountState.accountType === 'seller';

  useEffect(() => {
    let _isComponentMounted = true;
    setOrders([]);

    const userOrdersPromise = isSellerUser ? httpService.getAllOrders() : httpService.getCurrentUserOrders();
    userOrdersPromise.then((userOrders) => {
      if (_isComponentMounted) {
        setOrders(userOrders?.length ? userOrders : null);
      }
    });

    return () => (_isComponentMounted = false);
  }, []);

  return (
    <section className="account__menu-tab orders pev-flex pev-flex--columned" data-cy="section:orders">
      {isSellerUser && <small className="orders__all-client-users-hint">{translations.ordersOfAllClients}</small>}

      {orders ? (
        orders.length ? (
          orders
            .sort((prev, next) => next.timestamp - prev.timestamp)
            .map(({ timestamp, receiver, payment, shipment, regardingUser, regardingProducts, cost }) => (
              <Accordion defaultExpanded={timestamp === chosenTimestamp} key={timestamp} data-cy="container:order">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <PEVParagraph
                    className={classNames('orders__order-summary', {
                      'orders__order-summary--for-seller': isSellerUser,
                    })}
                  >
                    <span data-cy="label:order__summary-date">
                      <strong>{translations.orderSummaryDate}</strong> {new Date(timestamp).toLocaleString()}
                    </span>
                    {isSellerUser && (
                      <span data-cy="label:order__summary-user">
                        <strong>{translations.orderSummaryRegardingUser}</strong> {regardingUser}
                      </span>
                    )}
                  </PEVParagraph>
                </AccordionSummary>
                <AccordionDetails className="orders__order-details">
                  <Orders.Receiver receiver={receiver} />
                  <Divider />
                  <Orders.Shipment {...shipment} />
                  <Divider />
                  <Orders.Payment {...payment} />
                  <Divider />
                  <Orders.Products regardingProducts={regardingProducts} totalProductsCost={cost.products} />
                  <Divider />
                  <section className="orders__order-details--summary">
                    <PEVSuspense>
                      <OrderSummary
                        headingLevel={4}
                        containerClassName="order-detail-value"
                        shipmentPrice={cost.shipment}
                        productsPrice={cost.products}
                        totalCost={cost.total}
                      />
                    </PEVSuspense>
                  </section>
                </AccordionDetails>
              </Accordion>
            ))
        ) : (
          <PEVLoadingAnimation />
        )
      ) : (
        <PEVParagraph>{translations.noOrdersMadeYet}</PEVParagraph>
      )}
    </section>
  );
}
Orders.Receiver = function Receiver({ receiver }) {
  return (
    <section className="orders__order-details--receiver">
      <PEVHeading level={4}>{translations.orderReceiverHeading}</PEVHeading>
      <dl>
        <dt data-cy="label:order__receiver-name">
          <b>{translations.orderReceiverName}</b>
        </dt>
        <dd>{receiver.name}</dd>
        <dt data-cy="label:order__receiver-email">
          <b>{translations.orderReceiverEmail}</b>
        </dt>
        <dd>{receiver.email}</dd>
        <dt data-cy="label:order__receiver-phone">
          <b>{translations.orderReceiverPhone}</b>
        </dt>
        <dd>{receiver.phone}</dd>
      </dl>
    </section>
  );
};
Orders.Payment = function Payment({ method }) {
  let paymentTranslation;

  switch (method) {
    case PAYMENT_METHODS.CASH: {
      paymentTranslation = translations.orderPaymentCash;
      break;
    }
    case PAYMENT_METHODS.CARD: {
      paymentTranslation = translations.orderPaymentCard;
      break;
    }
    case PAYMENT_METHODS.TRANSFER: {
      paymentTranslation = translations.orderPaymentTransfer;
      break;
    }
    case PAYMENT_METHODS.BLIK: {
      paymentTranslation = translations.orderPaymentBlik;
      break;
    }
    default: {
      throw TypeError(`Payment method "${method}" not recognized!`);
    }
  }

  return (
    <section className="orders__order-details--payment">
      <PEVHeading level={4}>{translations.orderPaymentHeading}</PEVHeading>
      <PEVParagraph className="order-detail-value" data-cy="label:order__payment">
        <b>{paymentTranslation}</b>
      </PEVParagraph>
    </section>
  );
};
Orders.Shipment = function Shipment({ method, address }) {
  let ShipmentComponent;

  switch (method) {
    case SHIPMENT_METHODS.IN_PERSON: {
      ShipmentComponent = Orders.InPersonShipment;
      break;
    }
    case SHIPMENT_METHODS.HOME: {
      ShipmentComponent = Orders.HomeShipment;
      break;
    }
    case SHIPMENT_METHODS.PARCEL_LOCKER: {
      ShipmentComponent = Orders.ParcelLockerShipment;
      break;
    }
    default: {
      throw TypeError(`Shipment method "${method}" not recognized!`);
    }
  }

  return (
    <section className="orders__order-details--shipment">
      <PEVHeading level={4}>{translations.orderShipmentHeading}</PEVHeading>
      <ShipmentComponent address={address} />
    </section>
  );
};
Orders.InPersonShipment = function InPersonShipment({ address }) {
  return (
    <div className="order-detail-value">
      <PEVParagraph>
        <b>{translations.orderShipmentInPerson}</b>
      </PEVParagraph>
      <address className="orders__order-details--shipment-in-person" data-cy="label:order__in-person-shipment">
        {address.split(',').map((part) => (
          <span key={part}>{part}</span>
        ))}
      </address>
    </div>
  );
};
Orders.HomeShipment = function HomeShipment({ address }) {
  return (
    <div className="order-detail-value">
      <PEVParagraph>
        <b>{translations.orderShipmentHome}</b>
      </PEVParagraph>
      <address className="orders__order-details--shipment-home">
        <dl>
          <dt data-cy="label:order__home-shipment-street-and-apartment">
            <b>{translations.orderShipmentStreetAndApartment}</b>
          </dt>
          <dd>{address.streetAndApartmentNumber}</dd>
          <dt data-cy="label:order__home-shipment-postal-code">
            <b>{translations.orderShipmentPostalCode}</b>
          </dt>
          <dd>{address.postalCode}</dd>
          <dt data-cy="label:order__home-shipment-city">
            <b>{translations.orderShipmentCity}</b>
          </dt>
          <dd>{address.city}</dd>
        </dl>
      </address>
    </div>
  );
};
Orders.ParcelLockerShipment = function ParcelLockerShipment({ address }) {
  return (
    <div className="order-detail-value">
      <PEVParagraph>
        <b>{translations.orderShipmentParcelLocker}</b> <em>{address.name}</em>
      </PEVParagraph>
      <address className="orders__order-details--shipment-parcel" data-cy="label:order__parcel-locker-shipment">
        {address.location.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </address>
    </div>
  );
};
Orders.Products = function Products({ regardingProducts, totalProductsCost }) {
  return (
    <section className="orders__order-details--products">
      <PEVHeading level={4}>{translations.orderProductsHeading}</PEVHeading>
      <PEVSuspense>
        <CartContent
          productsList={regardingProducts.map(({ id, unitPrice, ...restProduct }) => ({
            ...restProduct,
            _id: id,
            price: unitPrice,
          }))}
          containerClassName="order-detail-value"
          totalProductsCount={regardingProducts.reduce((totalCount, { quantity }) => totalCount + quantity, 0)}
          totalProductsCost={totalProductsCost}
        />
      </PEVSuspense>
    </section>
  );
};

export default function Account() {
  const { isDesktopLayout } = useRWDLayout();
  const { pathname } = useLocation();

  const TabsLayoutWrapper = ({ children }) =>
    isDesktopLayout ? <Paper className="account__menu-tabs">{children}</Paper> : children;
  const subMenuNavCrumb = Object.values(Account.MENU_ITEMS).find(
    ({ url }) => window.location.pathname === url
  )?.translation;

  return (
    <article className="account">
      {isDesktopLayout ? (
        <Breadcrumbs component={Paper} className="account__header" aria-label={translations.accountNavCrumbs}>
          <PEVHeading level={2}>{translations.accountHeader}</PEVHeading>
          {subMenuNavCrumb && <PEVHeading level={3}>{subMenuNavCrumb}</PEVHeading>}
        </Breadcrumbs>
      ) : (
        <PEVHeading level={2} className="account__header">
          {translations.accountHeader}
        </PEVHeading>
      )}

      <nav className="account__menu-nav">
        {isDesktopLayout ? (
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
        ) : (
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
              </ScrollerHookingParent>
            )}
          />
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
