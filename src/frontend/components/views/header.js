import React from 'react';
import Nav from './nav';
import Cart from './cart';

const translations = Object.freeze({
  appMainHeader: 'Welcome to PEV Shop!',
});

export default function Header() {
  return (
    <header className="header">
      <h1>{translations.appMainHeader}</h1>

      <Nav />
      <Cart />
    </header>
  );
}
