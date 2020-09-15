import { Link } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';

export default observer(function Nav() {
  const logOut = async () => {
    await apiService.logoutUser();
    appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_OUT);
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">Start</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/add-new-product">Add new product</Link>
        </li>
        <li>
          {appStore.userSessionStates === USER_SESSION_STATES.LOGGED_OUT ? (
            <Link to="/log-in">Log in</Link>
          ) : (
            <Link to="/" onClick={logOut}>
              Log out
            </Link>
          )}
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
});
