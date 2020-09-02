import { Link } from 'react-router-dom';
import React from 'react';

export default function Nav() {
  return (
    <ul>
      <li>
        <Link to="/">Start</Link>
      </li>
      <li>
        <Link to="/shop">Shop</Link>
      </li>
      <li>
        <Link to="/addNewProduct">Add new product</Link>
      </li>
    </ul>
  );
}
