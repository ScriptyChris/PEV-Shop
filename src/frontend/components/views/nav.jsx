import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ArrowBack from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MUILink from '@material-ui/core/Link';

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

function LinkWrapper({ children, ...restProps }) {
  return (
    <MUILink {...restProps} component={Link} color="inherit">
      {children}
    </MUILink>
  );
}

const NavMenu = observer(({ logOutUser, isMobile }) => {
  return (
    <nav className={classNames('nav', { 'nav--is-mobile': isMobile })}>
      <List className="nav__links">
        <ListItem>
          <LinkWrapper to={ROUTES.SHOP}>{translations.shop}</LinkWrapper>
        </ListItem>
        <ListItem>
          <LinkWrapper to={ROUTES.ADD_NEW_PRODUCT}>{translations.addNewProduct}</LinkWrapper>
        </ListItem>
        <ListItem>
          <LinkWrapper to={ROUTES.MODIFY_PRODUCT}>{translations.modifyProduct}</LinkWrapper>
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <LinkWrapper to={ROUTES.ROOT} onClick={logOutUser}>
              {translations.logOut}
            </LinkWrapper>
          ) : (
            <LinkWrapper to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
              {translations.logIn}
            </LinkWrapper>
          )}
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <LinkWrapper to={ROUTES.ACCOUNT}>{translations.account}</LinkWrapper>
          ) : (
            <LinkWrapper to={ROUTES.REGISTER} data-cy={`link:${ROUTES.REGISTER}`}>
              {translations.register}
            </LinkWrapper>
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
      <IconButton
        onClick={handleToggleNavMenu}
        className="nav__toggle-button"
        color="inherit"
        aria-label={translations.toggleNavMenu}
        title={translations.toggleNavMenu}
      >
        <Menu />
      </IconButton>

      <Drawer
        anchor="left"
        open={isMobileMenuOpened}
        onClose={handleToggleNavMenu}
        onClick={handleNavMobileOverlayClick}
      >
        <IconButton
          onClick={handleToggleNavMenu}
          aria-label={translations.toggleNavMenu}
          title={translations.toggleNavMenu}
        >
          <ArrowBack />
        </IconButton>

        <NavMenu logOutUser={logOutUser} isMobile={true} />
      </Drawer>
    </>
  ) : (
    <NavMenu logOutUser={logOutUser} />
  );
}
