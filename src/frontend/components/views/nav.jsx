import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import Menu from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import { PEVIconButton, PEVLink } from '@frontend/components/utils/pevElements';
import storeService from '@frontend/features/storeService';
import userSessionService from '@frontend/features/userSessionService';
import { ROUTES } from '@frontend/components/pages/_routes';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

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
const NavMenu = observer(({ logOutUser }) => {
  return (
    <nav className="nav-menu">
      <MenuList className="nav-menu__links">
        <MenuItem>
          <PEVLink to={ROUTES.SHOP}>{translations.shop}</PEVLink>
        </MenuItem>
        <MenuItem>
          <PEVLink to={ROUTES.ADD_NEW_PRODUCT}>{translations.addNewProduct}</PEVLink>
        </MenuItem>
        <MenuItem>
          <PEVLink to={ROUTES.MODIFY_PRODUCT}>{translations.modifyProduct}</PEVLink>
        </MenuItem>
        <MenuItem>
          {storeService.userAccountState ? (
            <PEVLink to={ROUTES.ROOT} onClick={logOutUser}>
              {translations.logOut}
            </PEVLink>
          ) : (
            <PEVLink to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
              {translations.logIn}
            </PEVLink>
          )}
        </MenuItem>
        <MenuItem>
          {storeService.userAccountState ? (
            <PEVLink to={ROUTES.ACCOUNT}>{translations.account}</PEVLink>
          ) : (
            <PEVLink to={ROUTES.REGISTER} data-cy={`link:${ROUTES.REGISTER}`}>
              {translations.register}
            </PEVLink>
          )}
        </MenuItem>
      </MenuList>
    </nav>
  );
});

export default function Nav() {
  const history = useHistory();
  const { isMobileLayout } = useRWDLayout();
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
        className="nav-toggle-btn"
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
        <PEVIconButton className="nav-close-btn" onClick={handleToggleNavMenu} a11y={translations.toggleNavMenu}>
          <CloseIcon />
        </PEVIconButton>

        <NavMenu logOutUser={logOutUser} />
      </Drawer>
    </>
  ) : (
    <NavMenu logOutUser={logOutUser} />
  );
}
