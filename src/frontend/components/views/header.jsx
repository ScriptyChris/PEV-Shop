import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

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
        <Typography
          variant="h1"
          component="h1"
          className={classNames('header__main-heading', { 'header__main-heading--small': isHeadingSmall })}
        >
          <MUILink to={ROUTES.ROOT} component={Link} color="inherit">
            {translations.appMainHeader}
          </MUILink>
        </Typography>

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
