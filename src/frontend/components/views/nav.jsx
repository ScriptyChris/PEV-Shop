import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useReducer, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
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

const navClassNamesReducer = (state, action) => {
  switch (action.type) {
    case 'toggleMobile': {
      return { ...navClassNamesReducer.init, [navClassNamesReducer.classes.isMobile]: action.payload };
    }
    case 'toggleMobileExpand': {
      return {
        ...state,
        [navClassNamesReducer.classes.mobileExpanded]: !state[navClassNamesReducer.classes.mobileExpanded],
      };
    }
    default: {
      throw new TypeError(`Unrecognized action.type: ${action.type}!`);
    }
  }
};
navClassNamesReducer.init = Object.defineProperties(
  {},
  {
    nav: {
      value: true,
      enumerable: true,
    },
    toString: {
      // custom serialization, instead of [object Object]
      value() {
        return 'nav';
      },
      // be ignored during shallow copy
      enumerable: false,
    },
  }
);
navClassNamesReducer.classes = {
  mobileOverlay: 'nav-mobile-overlay',
  isMobile: 'nav--is-mobile',
  mobileExpanded: 'nav--mobile-expanded',
  navToggleButton: 'nav__toggle-button',
};

export default observer(function Nav() {
  const history = useHistory();
  const isMobileLayout = useMobileLayout();
  const [navClassNames, dispatchNavClassNames] = useReducer(navClassNamesReducer, navClassNamesReducer.init);
  const [navOverlayClasses, setNavOverlayClasses] = useState(navClassNamesReducer.classes.mobileOverlay);
  const [navToggleButtonClasses, setNavToggleButtonClasses] = useState(navClassNamesReducer.classes.navToggleButton);

  useEffect(() => {
    dispatchNavClassNames({
      type: 'toggleMobile',
      payload: isMobileLayout,
    });
  }, [isMobileLayout]);

  useEffect(() => {
    const EMPTY_CLASS_NAME = '';
    const isNavExpanded = navClassNames[navClassNamesReducer.classes.mobileExpanded];

    setNavOverlayClasses(isNavExpanded ? navClassNamesReducer.classes.mobileOverlay : EMPTY_CLASS_NAME);
    setNavToggleButtonClasses(
      classNames(navClassNamesReducer.classes.navToggleButton, {
        [`${navClassNamesReducer.classes.navToggleButton}--mobile-expanded`]: !isNavExpanded,
      })
    );
  }, [navClassNames]);

  const handleToggleNavMenu = () => {
    dispatchNavClassNames({
      type: 'toggleMobileExpand',
    });
  };

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
    <div onClick={handleNavMobileOverlayClick} className={navOverlayClasses}>
      {isMobileLayout && (
        <button onClick={handleToggleNavMenu} className={navToggleButtonClasses}>
          {translations.toggleNavMenu}
        </button>
      )}

      <nav className={classNames(navClassNames)}>
        <ul className={`${navClassNamesReducer.init}__links`}>
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
    </div>
  );
});
