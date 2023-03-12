import React, { memo, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const ProductComparison = lazy(() => import('./productComparison'));
const ProductDetails = lazy(() => import('@frontend/components/views/productDetails'));
const NewProduct = lazy(() => import('./productForm').then((ProductModule) => ({ default: ProductModule.NewProduct })));
const ModifyProduct = lazy(() =>
  import('./productForm').then((ProductModule) => ({ default: ProductModule.ModifyProduct }))
);
const Order = lazy(() => import('./order'));

import { ROUTES, useRoutesGuards } from './_routes';
import storeService from '@frontend/features/storeService';
import { PEVSuspense } from '@frontend/components/utils/pevElements';

// TODO: update module file name after search refactor is done
import ProductsDashboard from '@frontend/components/views/productsDashboard';

function Products() {
  const routesGuards = useRoutesGuards(storeService);

  return (
    <Switch>
      <Route path={ROUTES.PRODUCTS} exact>
        <ProductsDashboard />
      </Route>
      <Route path={ROUTES.PRODUCTS__COMPARE}>
        <PEVSuspense>
          <ProductComparison />
        </PEVSuspense>
      </Route>
      <Route path={ROUTES.PRODUCTS__ADD_NEW_PRODUCT}>
        {routesGuards.isSeller() ? (
          <PEVSuspense>
            <NewProduct />
          </PEVSuspense>
        ) : (
          <Redirect to={ROUTES.NOT_AUTHORIZED} />
        )}
      </Route>
      <Route path={ROUTES.PRODUCTS__MODIFY_PRODUCT}>
        {routesGuards.isSeller() ? (
          <PEVSuspense>
            <ModifyProduct />
          </PEVSuspense>
        ) : (
          <Redirect to={ROUTES.NOT_AUTHORIZED} />
        )}
      </Route>
      <Route path={ROUTES.PRODUCTS__ORDER}>
        {routesGuards.isClient() ? (
          <PEVSuspense>
            <Order />
          </PEVSuspense>
        ) : (
          <Redirect to={ROUTES.NOT_AUTHORIZED} />
        )}
      </Route>
      <Route path={ROUTES.PRODUCTS__PRODUCT}>
        <PEVSuspense>
          <ProductDetails />
        </PEVSuspense>
      </Route>
    </Switch>
  );
}

export default memo(observer(Products));
