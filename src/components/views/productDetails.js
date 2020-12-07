import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductItem from './productItem';

export default function ProductDetails() {
  const { state: locationState } = useLocation();
  const translations = {
    name: 'Name',
    price: 'Price',
    shortDescription: 'Short description',
    technicalSpecs: 'Specification',
    reviews: 'Reviews',
    author: 'Author',
    relatedProducts: 'Related products',
    emptyData: 'No data!',
  };

  console.log('[ProductDetails] location.state: ', locationState);

  const getPriceContent = () => {
    // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
    return <p>{translations.price}: ${locationState.price}</p>;
  };

  const getShortDescriptionContent = () => {
    return <>
      <ul>
        {locationState.shortDescription.map((description, index) => {
          return <li key={`short-description-${index}`}>{description}</li>
        })}
      </ul>
    </>
  };

  const getTechnicalSpecsContent = () => {
    if (!Array.isArray(locationState.technicalSpecs)) {
      return translations.emptyData;
    }

    return (
      // TODO: collapse it on mobile by default and expand on PC by default
      <details>
        <summary>{translations.technicalSpecs}:</summary>
        <dl>
          {locationState.technicalSpecs.map((productDetail, index) => {
            return <div key={`spec-${index}`}>
              <dt>{productDetail.heading}</dt>
              <dd>{productDetail.data}</dd>
            </div>
          })}
        </dl>
      </details>
    )
  };

  // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
  const getReviewsContent = () => {
    if (!locationState.reviews.list.length) {
      return translations.emptyData;
    }

    return (
        // TODO: collapse it on mobile by default and expand on PC by default
        <details>
          {/*TODO: do it in more esthetic way*/}
          <summary>{translations.reviews}: {locationState.reviews.summary.rating}/5 [{locationState.reviews.summary.reviewsAmount}]</summary>
          <ul>
            {locationState.reviews.list.map((reviewEntry, index) => {
              return <li key={`review-${index}`}>
                <article>
                  <header>
                    ({reviewEntry.reviewRate})
                    &nbsp;<b>{translations.author}: {reviewEntry.reviewAuthor}</b>
                    &nbsp;<time>[{reviewEntry.reviewMeta.join() /*TODO: fix empty strings in array in some cases*/}]</time>
                  </header>
                  <cite>{reviewEntry.content}</cite>
                </article>
              </li>;
            })}
          </ul>
        </details>
    );
  };

  // TODO: it probably might be used as a separate component
  const getRelatedProductsContent = () => {
    if (!locationState.relatedProducts.length) {
      return translations.emptyData;
    }

    return (
        <>
          <p>{translations.relatedProducts}</p>
          <ul>
            {locationState.relatedProducts.map((relatedProduct, index) => {
              return <li key={`related-product-${index}`}>
                  {/*TODO: ProductItem component in this case will not have full product info, so it has to somehow fetch it on it's own*/}
                  <ProductItem product={relatedProduct} />
              </li>;
            })}
          </ul>
        </>
    );
  };

  return (
    <section>
      Product details!
      <p>[{locationState.category}]: {locationState.name}</p>

      {getShortDescriptionContent()}
      {getPriceContent()}
      {getTechnicalSpecsContent()}
      {getReviewsContent()}
      {getRelatedProductsContent()}
    </section>
  );
}
