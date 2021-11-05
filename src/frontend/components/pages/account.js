import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';
import { USER_ACCOUNT_STATE } from '../../features/storageApi';

const translations = Object.freeze({
  accountHeader: 'Account',
  lackOfData: 'No user data',
});

export default function Account() {
  // TODO: fix rendering component twice when redirected from LogIn page
  const { state: locationState } = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('(Account useEffect) locationState:', locationState);

    if (locationState) {
      USER_ACCOUNT_STATE.updateStorage(locationState.loggedInUserData);
      setUserData(locationState.loggedInUserData);
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

  return (
    <section>
      <h2>{translations.accountHeader}</h2>

      {userData ? (
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
      ) : (
        translations.lackOfData
      )}
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
