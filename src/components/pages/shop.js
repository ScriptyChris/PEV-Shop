import React, { memo /*, useState*/ } from 'react';
import { Route, Switch } from 'react-router-dom';

// import CategoriesTree from '../views/categoriesTree';
import ProductList from '../views/productList';
import ProductDetails from '../views/productDetails';

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
        <Route path="/shop" exact>
          <ProductList />
          {/*{showChosenProductsView()}*/}
        </Route>
        <Route path="/shop/:productName">
          <ProductDetails />
        </Route>
      </Switch>
    </section>
  );
}

export default memo(Shop);
