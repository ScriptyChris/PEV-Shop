import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { PEVLink, PEVHeading } from '@frontend/components/utils/pevElements';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import Nav from './nav';
import Cart from './cart';
import { SearchProductsByName } from '@frontend/components/views/search';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = Object.freeze({
  appMainHeader: 'PEV Shop',
  searchLabel: 'Search',
  searchPlaceholder: 'type product name...',
});

export default observer(function Header() {
  const routesGuards = useRoutesGuards(storeService);
  const { isMobileLayout } = useRWDLayout();
  const [isHeadingSmall, setIsHeadingSmall] = useState(false);

  useEffect(() => setIsHeadingSmall(false), [isMobileLayout]);

  return (
    <AppBar className="header">
      <Toolbar className="header__toolbar pev-flex">
        <PEVHeading
          level={1}
          className={classNames('header__main-heading', { 'header__main-heading--small': isHeadingSmall })}
        >
          <PEVLink to={ROUTES.ROOT}>{translations.appMainHeader}</PEVLink>
        </PEVHeading>

        <SearchProductsByName
          label={translations.searchLabel}
          placeholder={translations.searchPlaceholder}
          searchingTarget="productName"
          debounceTimeMs={750}
          toggleMainHeadingSize={setIsHeadingSmall}
          syncWithSearchQuery
        />

        <Nav />
        {(routesGuards.isGuest() || routesGuards.isClient()) && <Cart />}
      </Toolbar>
    </AppBar>
  );
});
