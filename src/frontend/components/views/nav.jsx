import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import Menu from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ArrowBack from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { PEVIconButton, PEVLink } from '@frontend/components/utils/pevElements';
import storeService from '@frontend/features/storeService';
import userSessionService from '@frontend/features/userSessionService';
import { ROUTES } from '@frontend/components/pages/_routes';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = Object.freeze({
  toggleNavMenu: 'Menu',
  shop: 'Shop',
  addNewProduct: 'Add new product',
  modifyProduct: 'Modify product',
  register: 'Register',
  logIn: 'Log in',
  logOut: 'Log out',
  account: 'Account',
});

/*
  TODO: [UX/a11y] implement (interactive - so i.e. user can go back a few levels) mini nav widget 
        located under main header to indicate where user currently is
*/
const NavMenu = observer(({ logOutUser, isMobile }) => {
  return (
    <nav className={classNames('nav', { 'nav--is-mobile': isMobile })}>
      <List className="nav__links">
        <ListItem>
          <PEVLink to={ROUTES.SHOP}>{translations.shop}</PEVLink>
        </ListItem>
        <ListItem>
          <PEVLink to={ROUTES.ADD_NEW_PRODUCT}>{translations.addNewProduct}</PEVLink>
        </ListItem>
        <ListItem>
          <PEVLink to={ROUTES.MODIFY_PRODUCT}>{translations.modifyProduct}</PEVLink>
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <PEVLink to={ROUTES.ROOT} onClick={logOutUser}>
              {translations.logOut}
            </PEVLink>
          ) : (
            <PEVLink to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
              {translations.logIn}
            </PEVLink>
          )}
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <PEVLink to={ROUTES.ACCOUNT}>{translations.account}</PEVLink>
          ) : (
            <PEVLink to={ROUTES.REGISTER} data-cy={`link:${ROUTES.REGISTER}`}>
              {translations.register}
            </PEVLink>
          )}
        </ListItem>
      </List>
    </nav>
  );
});

export default function Nav() {
  const history = useHistory();
  const isMobileLayout = useMobileLayout();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  const handleToggleNavMenu = () => setIsMobileMenuOpened(!isMobileMenuOpened);

  const handleNavMobileOverlayClick = (event) => {
    const clickedInNavAnchor = event.target.tagName.toLowerCase() === 'a';

    if (clickedInNavAnchor) {
      handleToggleNavMenu();
    }
  };

  const logOutUser = () => {
    userSessionService.logOut().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      history.replace(ROUTES.ROOT);
    });
  };

  return isMobileLayout ? (
    <>
      <PEVIconButton
        onClick={handleToggleNavMenu}
        className="nav__toggle-button"
        color="inherit"
        a11y={translations.toggleNavMenu}
      >
        <Menu />
      </PEVIconButton>

      <Drawer
        anchor="left"
        open={isMobileMenuOpened}
        onClose={handleToggleNavMenu}
        onClick={handleNavMobileOverlayClick}
      >
        <PEVIconButton onClick={handleToggleNavMenu} a11y={translations.toggleNavMenu}>
          <ArrowBack />
        </PEVIconButton>

        <NavMenu logOutUser={logOutUser} isMobile={true} />
      </Drawer>
    </>
  ) : (
    <NavMenu logOutUser={logOutUser} />
  );
}
