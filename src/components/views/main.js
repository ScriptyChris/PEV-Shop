import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/home';
import Shop from '../pages/shop';
import NewProduct from '../pages/newProduct';

export default function Main() {
  return (
    <main className="main">
      Hello from PEV main!
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/shop">
          <Shop />
        </Route>
        <Route path="/addNewProduct">
          <NewProduct />
        </Route>
      </Switch>
    </main>
  );
}
