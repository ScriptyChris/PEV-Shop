import React from 'react';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListIcon from '@material-ui/icons/List';
import AddToListIcon from '@material-ui/icons/PlaylistAdd';

import { PEVHeading, PEVLink } from '@frontend/components/utils/pevElements';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';

const translations = Object.freeze({
  heading: 'Where do you want to go?',
  soldProducts: 'See products sold',
  addNewProduct: 'Add new product',
});

function EntryViewsChooser({ views }) {
  return (
    <section className="entry-views-chooser pev-fixed-container">
      <PEVHeading level={2} className="pev-centered-padded-text">
        {translations.heading}
      </PEVHeading>
      <List className="entry-views-chooser__list pev-flex">
        {views.map(({ subPageUrl, translation, icon, dataCyValue }) => (
          <ListItem className="entry-views-chooser__list-item" key={translation}>
            <PEVLink to={subPageUrl} data-cy={`link:${dataCyValue}`}>
              {icon}
              {translation}
            </PEVLink>
          </ListItem>
        ))}
      </List>
    </section>
  );
}

const generateHomeView = (routesGuards, justUrl = false) => {
  switch (true) {
    case routesGuards.isSeller(): {
      if (justUrl) {
        return ROUTES.ROOT;
      }

      const views = [
        {
          subPageUrl: ROUTES.SHOP,
          translation: translations.soldProducts,
          icon: <ListIcon fontSize="large" />,
          dataCyValue: 'shop',
        },
        {
          subPageUrl: ROUTES.ADD_NEW_PRODUCT,
          translation: translations.addNewProduct,
          icon: <AddToListIcon fontSize="large" />,
          dataCyValue: 'add-new-product',
        },
      ];

      return <EntryViewsChooser views={views} />;
    }
    default: {
      if (justUrl) {
        return ROUTES.SHOP;
      }

      return <Redirect to={ROUTES.SHOP} />;
    }
  }
};

export const getUrlToHome = (routesGuards) => generateHomeView(routesGuards, true);

export default observer(function Home() {
  const routesGuards = useRoutesGuards(storeService);

  return generateHomeView(routesGuards);
});
