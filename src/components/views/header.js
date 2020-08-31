import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      Hello from PEV header!
      <nav>
        <ul>
          <li>
            <Link to="/">Start</Link>
          </li>
          <li>
            <Link to="/shop">Sklep</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
