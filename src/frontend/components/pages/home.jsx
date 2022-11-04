import React, { useState, useEffect } from 'react';

import Divider from '@material-ui/core/Divider';

import { PEVHeading, PEVLink } from '@frontend/components/utils/pevElements';
import Scroller from '@frontend/components/utils/scroller';
import { ProductSpecificDetail } from '@frontend/components/views/productDetails';
import httpService from '@frontend/features/httpService';

const translations = Object.freeze({
  bestSellersHeading: 'Best sellers:',
  topRatedHeading: 'Top rated:',
  recentlyAddedHeading: 'Recently added:',
  recentlyViewedHeading: 'Recently viewed by you:',
  seeAll: 'see all',
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const sections = [
    {
      heading: translations.bestSellersHeading,
      productList: <p>TODO: fetch the data</p>,
      seeAllUrl: '#',
    },
    {
      heading: translations.topRatedHeading,
      productList: <p>TODO: fetch the data</p>,
      seeAllUrl: '#',
    },
    {
      heading: translations.recentlyAddedHeading,
      productList: (
        <ProductSpecificDetail
          detailName="relatedProducts"
          detailValue={products}
          extras={{
            disableListItemGutters: true,
          }}
        />
      ),
      seeAllUrl: '#',
    },
    {
      heading: translations.recentlyViewedHeading,
      productList: <p>TODO: fetch the data</p>,
      seeAllUrl: '#',
    },
  ];

  useEffect(() => {
    const pagination = { pageNumber: 1, productsPerPage: 5 };

    httpService.getProducts({ pagination }).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setProducts(res.productsList);
    });
  }, []);

  return (
    <article className="home pev-fixed-container pev-flex pev-flex--columned">
      {sections.map(({ heading, productList, seeAllUrl }) => (
        <section className="home-section pev-flex pev-flex--columned" key={heading}>
          <PEVHeading level={2}>{heading}</PEVHeading>

          <div className="home-section__product-list">
            <Scroller
              scrollerBaseValueMeta={{
                selector: '.home-section__product-list',
                varName: '--product-card-width',
              }}
              render={({ ScrollerHookingParent }) => <ScrollerHookingParent>{productList}</ScrollerHookingParent>}
            />
          </div>

          <Divider />

          <PEVLink to={seeAllUrl} color="primary" className="home-section__link-to-see-all">
            {translations.seeAll}
          </PEVLink>
        </section>
      ))}
    </article>
  );
}
