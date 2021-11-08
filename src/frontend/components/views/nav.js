import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react-lite';
import appStore from '../../features/appStore';
import { logOutUser } from '../pages/account';

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
  const history = useHistory();

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
          {appStore.userSessionState ? (
            <Link to="/" onClick={() => logOutUser(history)}>
              {translations.logOut}
            </Link>
          ) : (
            <Link to="/log-in">{translations.logIn}</Link>
          )}
        </li>
        <li>
          {appStore.userSessionState ? (
            <Link to="/account">{translations.account}</Link>
          ) : (
            <Link to="/register">{translations.register}</Link>
          )}
        </li>
      </ul>
    </nav>
  );
});
