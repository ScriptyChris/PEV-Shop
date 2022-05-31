import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { PEVLink, PEVHeading } from '@frontend/components/utils/formControls';
import { ROUTES } from '@frontend/components/pages/_routes';
import Nav from './nav';
import Cart from './cart';
import { SearchProductsByName } from '@frontend/components/views/search';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = Object.freeze({
  appMainHeader: 'PEV Shop',
  typeProductName: 'Search for a product',
});

export default function Header() {
  const history = useHistory();
  const isMobileLayout = useMobileLayout();
  const [isHeadingSmall, setIsHeadingSmall] = useState(false);

  useEffect(() => setIsHeadingSmall(false), [isMobileLayout]);

  const updateProductList = (searchedProducts) => {
    /*
      TODO: [UX] if current subpage is not a product list, then show some information 
      that subpage redirection will be made to avoid surprising user
    */
    history.push(ROUTES.SHOP, { searchedProducts });
  };

  return (
    <AppBar className="header">
      <Toolbar className="header__toolbar">
        <PEVHeading
          level={1}
          className={classNames('header__main-heading', { 'header__main-heading--small': isHeadingSmall })}
        >
          <PEVLink to={ROUTES.ROOT}>{translations.appMainHeader}</PEVLink>
        </PEVHeading>

        <SearchProductsByName
          label={translations.typeProductName}
          searchingTarget="productName"
          debounceTimeMs={750}
          pagination={{
            currentProductPage: 1,
            currentProductsPerPageLimit: 15 /* TODO: should be set from a variable */,
          }}
          onReceivedProductsByName={updateProductList}
          toggleMainHeadingSize={setIsHeadingSmall}
        />
        <Nav />
        <Cart />
      </Toolbar>
    </AppBar>
  );
}
