import '@frontend/assets/styles/views/home.scss';

import React, { useState, useEffect, lazy } from 'react';
import Divider from '@material-ui/core/Divider';

const ProductComparisonCandidatesList = lazy(() =>
  import('@frontend/components/views/productComparisonCandidates').then((ProductComparisonCandidatesModule) => ({
    default: ProductComparisonCandidatesModule.ProductComparisonCandidatesList,
  }))
);

import { PEVHeading, PEVLink, PEVSuspense, PEVLoadingAnimation } from '@frontend/components/utils/pevElements';
import Scroller from '@frontend/components/utils/scroller';
import { ProductSpecificDetail } from '@frontend/components/views/productDetails';
import httpService from '@frontend/features/httpService';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = Object.freeze({
  bestSellersHeading: 'Best sellers:',
  topRatedHeading: 'Top rated:',
  recentlyAddedHeading: 'Recently added:',
  recentlyViewedHeading: 'Recently viewed by you:',
  seeAll: 'see all',
});

const PRODUCTS_SECTIONS_PER_SORTING_ORDER = Object.freeze([
  {
    heading: translations.bestSellersHeading,
    sortBy: 'orderedUnitsDesc',
  },
  {
    heading: translations.topRatedHeading,
    sortBy: 'reviews.ratingScoreDesc',
  },
  {
    heading: translations.recentlyAddedHeading,
    sortBy: 'createdAtDesc',
  },
]);

export default function Home() {
  const [productListForSortedSection, setProductListForSortedSection] = useState(() =>
    Object.fromEntries(PRODUCTS_SECTIONS_PER_SORTING_ORDER.map(({ sortBy }) => [sortBy, []]))
  );

  useEffect(() => {
    let _isComponentMounted = true;
    const pagination = { pageNumber: 1, productsPerPage: 5 };

    PRODUCTS_SECTIONS_PER_SORTING_ORDER.forEach(({ sortBy }) => {
      httpService.getProducts({ pagination, sortBy }, true).then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED || !_isComponentMounted) {
          return;
        }

        setProductListForSortedSection((prev) => ({
          ...prev,
          [sortBy]: res.productsList,
        }));
      });
    });

    return () => (_isComponentMounted = false);
  }, []);

  return (
    <article className="home pev-flex pev-flex--columned">
      {PRODUCTS_SECTIONS_PER_SORTING_ORDER.map(({ heading, sortBy }) => (
        <section className="home-section pev-flex pev-flex--columned" key={heading}>
          <PEVHeading level={2} className="pev-centered-padded-text">
            {heading}
          </PEVHeading>

          <div className="home-section__product-list">
            {productListForSortedSection[sortBy].length ? (
              <Scroller
                scrollerBaseValueMeta={{
                  selector: '.home-section__product-list',
                  varName: '--product-card-width',
                }}
                render={({ ScrollerHookingParent }) => (
                  <ScrollerHookingParent>
                    <ProductSpecificDetail
                      detailName="relatedProducts"
                      detailValue={productListForSortedSection[sortBy]}
                      extras={{
                        disableListItemGutters: true,
                      }}
                    />
                  </ScrollerHookingParent>
                )}
              />
            ) : (
              <PEVLoadingAnimation />
            )}
          </div>

          <Divider />

          <PEVLink
            to={{ pathname: ROUTES.PRODUCTS, search: `?sortBy=${sortBy}` }}
            color="primary"
            className="home-section__link-to-see-all"
          >
            {translations.seeAll}
          </PEVLink>

          <PEVSuspense>
            <ProductComparisonCandidatesList />
          </PEVSuspense>
        </section>
      ))}
    </article>
  );
}
