import React, { memo /*, useState*/ } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// import CategoriesTree from '@frontend/components/views/categoriesTree';
import { ROUTES, useRoutesGuards } from './_routes';
import storeService from '@frontend/features/storeService';
import ProductList from '@frontend/components/views/productList';
import ProductDetails from '@frontend/components/views/productDetails';
import { NewProduct, ModifyProduct } from './productForm';
import ProductComparison from './productComparison';
import Order from './order';
import NotFound from './notFound';

// const ShopMenuChooser = memo(function ShopMenuChooser(props) {
//   return (
//     <div className="shop-container">
//       <ul>
//         {props.viewsMap.map((view) => (
//           <li key={`shop-${view.component.type.name}-menu`}>
//             <button onClick={() => props.onMenuChooserClick(view.component)}>{view.translation}</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// });

function Shop() {
  const routesGuards = useRoutesGuards(storeService);

  // const [chosenProductsView, setChosenProductsView] = useState('');
  //
  // const viewsMap = [
  //   {
  //     component: <CategoriesTree />,
  //     translation: 'Kategorie',
  //   },
  //   {
  //     component: <ProductList />,
  //     translation: 'Lista',
  //   },
  // ];

  // const setShopView = (chosenViewComponent) => {
  //   setChosenProductsView(chosenViewComponent.type.name);
  // };

  // const showChooser = () => {
  //   if (!chosenProductsView) {
  //     return <ShopMenuChooser viewsMap={viewsMap} onMenuChooserClick={setShopView} />;
  //   }
  //
  //   return '';
  // };

  // const showChosenProductsView = () => {
  //   if (chosenProductsView) {
  //     const matchedView = viewsMap.find(({ component }) => component.type.name === chosenProductsView);
  //     return matchedView.component;
  //   }
  //
  //   return '';
  // };

  return (
    <>
      {/* <PEVHeading level={2}>Shop!!!</PEVHeading> */}

      {/*{showChooser()}*/}

      <Switch>
        <Route path={ROUTES.SHOP} exact>
          <ProductList />
          {/*{showChosenProductsView()}*/}
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
        <Route path={ROUTES.ORDER}>
          {routesGuards.isClient() ? <Order /> : <Redirect to={ROUTES.NOT_AUTHORIZED} />}
        </Route>

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default memo(observer(Shop));
