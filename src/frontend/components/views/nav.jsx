import '@frontend/assets/styles/views/nav.scss';

import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListIcon from '@material-ui/icons/List';
import AddToListIcon from '@material-ui/icons/PlaylistAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import { PEVIconButton, PEVLink, PEVButton } from '@frontend/components/utils/pevElements';
import storeService from '@frontend/features/storeService';
import userSessionService from '@frontend/features/userSessionService';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = Object.freeze({
  toggleNavMenu: 'toggle nav menu',
  products: 'Products',
  addNewProduct: 'Add new product',
  modifyProduct: 'Modify product',
  register: 'Register',
  logIn: 'Log in',
  logOut: 'Log out',
  getAccountLinkLabel: (login) => `go to "${login}" user account`,
});

/*
  TODO: [UX/a11y] implement (interactive - so i.e. user can go back a few levels) mini nav widget 
        located under main header to indicate where user currently is
*/
const NavMenu = observer(({ logOutUser, closeMenu = () => void 0 }) => {
  const routesGuards = useRoutesGuards(storeService);

  const handleLinkClick = (event) => {
    event.stopPropagation();
    closeMenu();
  };

  return (
    <nav className="nav-menu">
      <MenuList component="ol" className="nav-menu__links" disablePadding>
        <MenuItem>
          <PEVLink to={ROUTES.PRODUCTS} onClick={handleLinkClick}>
            <ListIcon fontSize="inherit" />
            {translations.products}
          </PEVLink>
        </MenuItem>
        {routesGuards.isSeller() && [
          <MenuItem key="ROUTES.PRODUCTS__ADD_NEW_PRODUCT">
            <PEVLink to={ROUTES.PRODUCTS__ADD_NEW_PRODUCT} onClick={handleLinkClick}>
              <AddToListIcon fontSize="inherit" />
              {translations.addNewProduct}
            </PEVLink>
          </MenuItem>,
        ]}
        <MenuItem>
          {routesGuards.isUser() ? (
            <PEVButton onClick={logOutUser} className="MuiLink-button" a11y={translations.logOut}>
              <ExitToAppIcon fontSize="inherit" />
              {translations.logOut}
            </PEVButton>
          ) : (
            <PEVLink to={ROUTES.LOG_IN} onClick={handleLinkClick} data-cy={`link:${ROUTES.LOG_IN}`}>
              <VpnKeyIcon fontSize="inherit" />
              {translations.logIn}
            </PEVLink>
          )}
        </MenuItem>
        <MenuItem>
          {routesGuards.isUser() ? (
            <PEVLink
              to={ROUTES.ACCOUNT}
              onClick={handleLinkClick}
              aria-label={translations.getAccountLinkLabel(storeService.userAccountState.login)}
            >
              <AccountCircleIcon fontSize="inherit" />
              <span className="nav-menu__links-account-login">{storeService.userAccountState.login}</span>
            </PEVLink>
          ) : (
            <PEVLink to={ROUTES.REGISTER} onClick={handleLinkClick} data-cy={`link:${ROUTES.REGISTER}`}>
              <PersonAddIcon fontSize="inherit" />
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
  const { isDesktopLayout } = useRWDLayout();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  const handleToggleNavMenu = () => setIsMobileMenuOpened((prevState) => !prevState);

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
      handleToggleNavMenu();
    });
  };

  return isDesktopLayout ? (
    <NavMenu logOutUser={logOutUser} />
  ) : (
    <>
      <PEVIconButton
        onClick={handleToggleNavMenu}
        className="nav-toggle-btn"
        color="inherit"
        a11y={translations.toggleNavMenu}
        tabIndex="1"
      >
        <MenuIcon />
      </PEVIconButton>

      <Drawer
        anchor="left"
        open={isMobileMenuOpened}
        onClose={handleToggleNavMenu}
        onClick={handleNavMobileOverlayClick}
      >
        <PEVIconButton
          className="nav-close-btn"
          onClick={handleToggleNavMenu}
          a11y={translations.toggleNavMenu}
          autoFocus
        >
          <CloseIcon />
        </PEVIconButton>

        <Divider />

        <NavMenu logOutUser={logOutUser} closeMenu={handleToggleNavMenu} />
      </Drawer>
    </>
  );
}
