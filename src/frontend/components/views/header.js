import React from 'react';
import Nav from './nav';
import Cart from './cart';

export default function Header() {
  return (
    <header className="header">
      Hello from PEV header!
      <Nav />
      <Cart />
    </header>
  );
}
