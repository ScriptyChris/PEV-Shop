import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../pages/home';
import Shop from '../pages/shop';

export default function Main() {
  return (
    <main className="main">
      Hello from PEV main!
      <Switch>
        <Route exact={true} path="/">
          <Home />
        </Route>
        <Route path="/shop">
          <Shop />
        </Route>
      </Switch>
    </main>
  );
}
