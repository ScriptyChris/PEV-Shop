import { Link } from 'react-router-dom';
import React from 'react';

export default function Nav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">Start</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/add-new-product">Add new product</Link>
        </li>
        <li>
          <Link to="/log-in">Login</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
}
