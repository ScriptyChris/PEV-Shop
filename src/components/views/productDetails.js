import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ProductDetails() {
  const { state: locationState } = useLocation();
  const translations = {
    technicalSpecs: 'Specification',
    reviews: 'Reviews',
    author: 'Author',
    emptyData: 'No data!',
  };

  console.log('[ProductDetails] location.state: ', locationState);

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

  return (
    <section>
      Product details!
      <p>{locationState.name}</p>

      {getTechnicalSpecsContent()}
      {getReviewsContent()}
    </section>
  );
}
