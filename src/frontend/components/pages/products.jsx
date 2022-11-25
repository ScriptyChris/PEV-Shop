import React, { memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES, useRoutesGuards } from './_routes';
import storeService from '@frontend/features/storeService';

// TODO: update module file name after search refactor is done
import ProductsDashboard from '@frontend/components/views/productList';

import ProductDetails from '@frontend/components/views/productDetails';
import { NewProduct, ModifyProduct } from './productForm';
import ProductComparison from './productComparison';
import Order from './order';

function Products() {
  const routesGuards = useRoutesGuards(storeService);

  return (
    <Switch>
      <Route path={ROUTES.PRODUCTS} exact>
        <ProductsDashboard />
      </Route>
      <Route path={ROUTES.PRODUCTS__COMPARE}>
        <ProductComparison />
      </Route>
      <Route path={ROUTES.PRODUCTS__ADD_NEW_PRODUCT}>
        {routesGuards.isSeller() ? <NewProduct /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
      </Route>
      <Route path={ROUTES.PRODUCTS__MODIFY_PRODUCT}>
        {routesGuards.isSeller() ? <ModifyProduct /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
      </Route>
      <Route path={ROUTES.PRODUCTS__ORDER}>
        {routesGuards.isClient() ? <Order /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
      </Route>
      <Route path={ROUTES.PRODUCTS__PRODUCT}>
        <ProductDetails />
      </Route>
    </Switch>
  );
}

export default memo(observer(Products));
