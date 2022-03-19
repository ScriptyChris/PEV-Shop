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
  start: 'Start',
  shop: 'Shop',
  addNewProduct: 'Add new product',
  modifyProduct: 'Modify product',
  register: 'Register',
  logIn: 'Log in',
  logOut: 'Log out',
  account: 'Account',
});

function NavMenu({ logOutUser, isMobile }) {
  return (
    <nav className={classNames('nav', { 'nav--is-mobile': isMobile })}>
      <List className="nav__links">
        <ListItem>
          <MUILink component={Link} to={ROUTES.ROOT}>
            {translations.start}
          </MUILink>
        </ListItem>
        <ListItem>
          <MUILink component={Link} to={ROUTES.SHOP}>
            {translations.shop}
          </MUILink>
        </ListItem>
        <ListItem>
          <MUILink component={Link} to={ROUTES.ADD_NEW_PRODUCT}>
            {translations.addNewProduct}
          </MUILink>
        </ListItem>
        <ListItem>
          <MUILink component={Link} to={ROUTES.MODIFY_PRODUCT}>
            {translations.modifyProduct}
          </MUILink>
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <MUILink component={Link} to={ROUTES.ROOT} onClick={logOutUser}>
              {translations.logOut}
            </MUILink>
          ) : (
            <MUILink component={Link} to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
              {translations.logIn}
            </MUILink>
          )}
        </ListItem>
        <ListItem>
          {storeService.userAccountState ? (
            <MUILink component={Link} to={ROUTES.ACCOUNT}>
              {translations.account}
            </MUILink>
          ) : (
            <MUILink component={Link} to={ROUTES.REGISTER} data-cy={`link:${ROUTES.REGISTER}`}>
              {translations.register}
            </MUILink>
          )}
        </ListItem>
      </List>
    </nav>
  );
}

export default observer(function Nav() {
  const history = useHistory();
  const isMobileLayout = useMobileLayout();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  const handleToggleNavMenu = () => setIsMobileMenuOpened(!isMobileMenuOpened);

  const handleNavMobileOverlayClick = (event) => {
    const clickedInOverlay = event.target === event.currentTarget;
    const clickedInNavAnchor = event.target.tagName.toLowerCase() === 'a';

    if (clickedInOverlay || clickedInNavAnchor) {
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

  return (
    <div onClick={handleNavMobileOverlayClick}>
      {isMobileLayout ? (
        <>
          <IconButton
            onClick={handleToggleNavMenu}
            className="nav__toggle-button"
            aria-label={translations.toggleNavMenu}
            title={translations.toggleNavMenu}
          >
            <Menu />
          </IconButton>

          <Drawer anchor="left" open={isMobileMenuOpened} onClose={handleToggleNavMenu}>
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
      )}
    </div>
  );
});
