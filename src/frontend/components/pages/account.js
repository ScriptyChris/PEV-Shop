import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory, NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import storeService from '../../features/storeService';
import httpService from '../../features/httpService';
import { SetNewPassword } from '../views/password';
import storageService from '../../features/storageService';
import userSessionService from '../../features/userSessionService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '../utils/popup';
import ProductItem from '../views/productItem';

const translations = Object.freeze({
  accountHeader: 'Account',
  goToUserProfile: 'Profile',
  goToSecurity: 'Security',
  goToObservedProducts: 'Observed products',
  goToOrders: 'Orders',
  editUserData: 'Edit',
  removeAllObservedProducts: 'Remove all',
  removeAllObservedProductsFailedMsg: 'Failed to remove all products :(',
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

function UserProfile({ initialUserData }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('(UserData useEffect) initialUserData:', initialUserData);

    if (initialUserData) {
      storageService.userAccount.update(initialUserData);
      setUserData(initialUserData);
    } else if (storageService.userAccount.get()) {
      setUserData(storageService.userAccount.get());
    } else {
      httpService.getUser().then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        storageService.userAccount.update(res);
        setUserData(res);
      });
    }
  }, []);

  const edit = () => {
    console.log('TODO: [FEATURE] implement editing user profile');
  };

  return userData ? (
    <div>
      <button onClick={edit}>{translations.editUserData}</button>

      <table>
        <tbody>
          {Object.entries(userData).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          history.replace('/');
        }
      });
    }
  }, [logOutFromSessionsConfirmation, shouldPreserveCurrentSession]);

  return (
    <div className="account__menu-tab">
      <SetNewPassword contextType={SetNewPassword.CONTEXT_TYPES.LOGGED_IN} />

      <div className="account__menu-tab logout-from-sessions">
        <button onClick={() => logOutFromSessions(false)}>{translations.logOutFromAllSessions}</button>
        <button onClick={() => logOutFromSessions(true)}>{translations.logOutFromOtherSessions}</button>

        {popupData && <Popup {...popupData} />}
      </div>
    </div>
  );
}

function ObservedProducts() {
  const [observedProducts, setObservedProducts] = useState([]);
  const [canRemoveAllProducts, setCanRemoveAllProducts] = useState(
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

  const removeAll = () => {
    httpService
      .disableGenericErrorHandler()
      .removeAllProductsFromObserved()
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: translations.removeAllObservedProductsFailedMsg,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setCanRemoveAllProducts(false);
          setObservedProducts(res);
          storeService.updateUserAccountState({
            ...storeService.userAccountState,
            observedProducts: res,
          });
        }
      });
  };

  return (
    <div className="account__menu-tab">
      <div>
        {/* TODO: [UX] add searching and filtering for observed products */}
        <button onClick={removeAll} disabled={!canRemoveAllProducts}>
          {translations.removeAllObservedProducts}
        </button>
      </div>

      <ol className="account__menu-tab observed-products-list">
        {observedProducts.length
          ? observedProducts.map((product) => (
              <li key={product.name}>
                <ProductItem product={product} />
              </li>
            ))
          : translations.lackOfData}
      </ol>

      {popupData && <Popup {...popupData} />}
    </div>
  );
}

function Orders() {
  return (
    <div>
      <input placeholder="TODO: [FEATURE] implement searching orders via name and date(?)" type="search" />
      <p>TODO: [FEATURE] implement listing orders with options such as: status, invoice, review, refund</p>
    </div>
  );
}

export default function Account() {
  // TODO: [PERFORMANCE] fix rendering component twice when redirected from LogIn page
  const { state: locationState } = useLocation();
  const initialUserData = useRef(null);

  const { path, url } = useRouteMatch();
  const MENU_ITEMS = Object.freeze([
    {
      url: 'user-profile',
      translation: translations.goToUserProfile,
      component: <UserProfile initialUserData={initialUserData.current} />,
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

  useEffect(() => {
    initialUserData.current = locationState?.loggedInUserData;
  }, []);

  return (
    <section className="account">
      <h2>{translations.accountHeader}</h2>

      <div className="account__menu">
        <ul className="account__menu-nav">
          {MENU_ITEMS.map((item) => (
            <li key={item.url}>
              <NavLink to={`${url}/${item.url}`}>{item.translation}</NavLink>
            </li>
          ))}
        </ul>

        <Switch>
          {MENU_ITEMS.map((item) => (
            <Route path={`${path}/${item.url}`} key={item.url}>
              {item.component}
            </Route>
          ))}
        </Switch>
      </div>
    </section>
  );
}
