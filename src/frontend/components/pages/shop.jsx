import React, { memo /*, useState*/ } from 'react';
import { Route, Switch } from 'react-router-dom';

// import CategoriesTree from '../views/categoriesTree';
import { ROUTES } from './_routes';
import ProductList from '../views/productList';
import ProductDetails from '../views/productDetails';
import { NewProduct, ModifyProduct } from './newProduct';
import Compare from './compare';
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
    <section>
      <h2>Shop!!!</h2>

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
          <Compare />
        </Route>
        <Route path={ROUTES.ADD_NEW_PRODUCT}>
          <NewProduct />
        </Route>
        <Route path={ROUTES.MODIFY_PRODUCT}>
          <ModifyProduct />
        </Route>
        <Route path={ROUTES.ORDER}>
          <Order />
        </Route>

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </section>
  );
}

export default memo(Shop);
