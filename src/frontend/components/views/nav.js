import { Link } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react-lite';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';

export default observer(function Nav() {
  const logOut = async () => {
    await apiService.logoutUser();
    appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_OUT);
  };

  const translations = {
    start: 'Start',
    shop: 'Sklep',
    addNewProduct: 'Dodaj nowy produkt',
    logIn: 'Zaloguj się',
    logOut: 'Wyloguj się',
    account: 'Moje konto',
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
          {appStore.userSessionState === USER_SESSION_STATES.LOGGED_OUT ? (
            <Link to="/log-in">{translations.logIn}</Link>
          ) : (
            <Link to="/" onClick={logOut}>
              {translations.logOut}
            </Link>
          )}
        </li>
        <li>
          <Link to="/account">{translations.account}</Link>
        </li>
      </ul>
    </nav>
  );
});
