import React from 'react';
import Nav from './nav';
import Cart from './cart';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = Object.freeze({
  appMainHeader: 'Welcome to PEV Shop!',
  appMainMobileHeader: 'PEV Shop',
});

export default function Header() {
  const isMobileLayout = useMobileLayout();

  return (
    <header className="header">
      <h1 className="header__main-heading">
        {isMobileLayout ? translations.appMainMobileHeader : translations.appMainHeader}
      </h1>

      <Nav />
      <Cart />
    </header>
  );
}
