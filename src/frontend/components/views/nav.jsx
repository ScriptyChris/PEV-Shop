import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react-lite';
import storeService from '../../features/storeService';
import userSessionService from '../../features/userSessionService';
import { ROUTES } from '../pages/_routes';

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

  const logOutUser = () => {
    userSessionService.logOut().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      history.replace(ROUTES.ROOT);
    });
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to={ROUTES.ROOT}>{translations.start}</Link>
        </li>
        <li>
          <Link to={ROUTES.SHOP}>{translations.shop}</Link>
        </li>
        <li>
          <Link to={ROUTES.ADD_NEW_PRODUCT}>{translations.addNewProduct}</Link>
        </li>
        <li>
          <Link to={ROUTES.MODIFY_PRODUCT}>{translations.modifyProduct}</Link>
        </li>
        <li>
          {storeService.userAccountState ? (
            <Link to={ROUTES.ROOT} onClick={logOutUser}>
              {translations.logOut}
            </Link>
          ) : (
            <Link to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
              {translations.logIn}
            </Link>
          )}
        </li>
        <li>
          {storeService.userAccountState ? (
            <Link to={ROUTES.ACCOUNT}>{translations.account}</Link>
          ) : (
            <Link to={ROUTES.REGISTER} data-cy={`link:${ROUTES.REGISTER}`}>
              {translations.register}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
});
