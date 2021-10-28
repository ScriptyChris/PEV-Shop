import { Link } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react-lite';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';

const translations = Object.freeze({
  start: 'Start',
  shop: 'Shop',
  addNewProduct: 'Add new product',
  modifyProduct: 'Modify product',
  register: 'Register',
  logIn: 'Log in',
  logOut: 'Log out',
  account: 'Account',
});

export default observer(function Nav() {
  const logOut = async () => {
    await apiService.logoutUser();
    appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_OUT);
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">{translations.start}</Link>
        </li>
        <li>
          <Link to="/shop">{translations.shop}</Link>
        </li>
        <li>
          <Link to="/add-new-product">{translations.addNewProduct}</Link>
        </li>
        <li>
          <Link to="/modify-product">{translations.modifyProduct}</Link>
        </li>
        <li>
          {appStore.userSessionState === USER_SESSION_STATES.LOGGED_OUT ? (
            <Link to="/log-in">{translations.logIn}</Link>
          ) : (
            <Link to="/" onClick={logOut}>
              {translations.logOut}
            </Link>
          )}
        </li>
        {appStore.userSessionState === USER_SESSION_STATES.LOGGED_OUT && (
          <li>
            <Link to="/register">{translations.register}</Link>
          </li>
        )}
        <li>
          <Link to="/account">{translations.account}</Link>
        </li>
      </ul>
    </nav>
  );
});
