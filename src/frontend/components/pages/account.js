import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory, NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';
import { SetNewPassword } from '../views/password';
import { USER_ACCOUNT_STATE } from '../../features/storageApi';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '../utils/popup';

const translations = Object.freeze({
  accountHeader: 'Account',
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

function UserProfile({ initialUserData }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('(UserData useEffect) initialUserData:', initialUserData);

    if (initialUserData) {
      USER_ACCOUNT_STATE.updateStorage(initialUserData);
      setUserData(initialUserData);
    } else if (USER_ACCOUNT_STATE.getFromStorage()) {
      setUserData(USER_ACCOUNT_STATE.getFromStorage());
    } else {
      apiService.getUser().then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        USER_ACCOUNT_STATE.updateStorage(res);
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
  const [shouldPreseveCurrentSession, setShouldPreseveCurrentSession] = useState(null);
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
            setShouldPreseveCurrentSession(preseveCurrentSession);
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
    if (typeof logOutFromSessionsConfirmation === 'boolean' && typeof shouldPreseveCurrentSession === 'boolean') {
      apiService
        .disableGenericErrorHandler()
        .logOutUserFromAllSessions(shouldPreseveCurrentSession)
        .then((res) => {
          if (res.__EXCEPTION_ALREADY_HANDLED) {
            return;
          } else if (shouldPreseveCurrentSession) {
            if (res.__ERROR_TO_HANDLE) {
              return setPopupData({
                type: POPUP_TYPES.FAILURE,
                message: translations.logOutFromOtherSessionsFailedMsg,
                buttons: [getClosePopupBtn(setPopupData)],
              });
            }

            setPopupData({
              type: POPUP_TYPES.SUCCESS,
              message: translations.logOutFromOtherSessionsSuccessMsg,
              buttons: [getClosePopupBtn(setPopupData)],
            });
          } else {
            appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_OUT);
            history.replace('/');
          }
        });
    }
  }, [logOutFromSessionsConfirmation, shouldPreseveCurrentSession]);

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
  return <div>TODO: [FEATURE] implement observing products and list them here</div>;
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
        <ul className="account__menu-list">
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

export const logOutUser = () =>
  apiService.logoutUser().then((res) => {
    if (res.__EXCEPTION_ALREADY_HANDLED) {
      return;
    }

    appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_OUT);
    USER_ACCOUNT_STATE.removeFromStorage();
  });
