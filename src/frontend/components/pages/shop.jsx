import React, { memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { ROUTES, useRoutesGuards } from './_routes';
import storeService from '@frontend/features/storeService';
import ProductList from '@frontend/components/views/productList';
import ProductDetails from '@frontend/components/views/productDetails';
import { NewProduct, ModifyProduct } from './productForm';
import ProductComparison from './productComparison';
import Order from './order';
import NotFound from './notFound';

function Shop() {
  const routesGuards = useRoutesGuards(storeService);

  return (
    <Switch>
      <Route path={ROUTES.SHOP} exact>
        <ProductList />
      </Route>
      <Route path={`${ROUTES.PRODUCT}/:productName`}>
        <ProductDetails />
      </Route>
      <Route path={ROUTES.COMPARE}>
        <ProductComparison />
      </Route>
      <Route path={ROUTES.ADD_NEW_PRODUCT}>
        {routesGuards.isSeller() ? <NewProduct /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
      </Route>
      <Route path={ROUTES.MODIFY_PRODUCT}>
        {routesGuards.isSeller() ? <ModifyProduct /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
      </Route>
      <Route path={ROUTES.ORDER}>{routesGuards.isClient() ? <Order /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}</Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default memo(observer(Shop));
