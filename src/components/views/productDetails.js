import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductItem from './productItem';
import apiService from '../../features/apiService';

export default function ProductDetails() {
  // TODO: fetch product data independently when page is loaded explicitly (not navigated to from other page)
  const { state: product } = useLocation();
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

  console.log('[ProductDetails] product received from navigation: ', product);

  const [renderRelatedProducts, setRenderRelatedProducts] = useState(false);
  const [standaloneRelatedProducts, setStandaloneRelatedProducts] = useState(null);

  useEffect(() => {
    (async () => {
      const relatedProducts = await apiService.getProductsById(
        product.relatedProducts.map((item) => item.id).toString()
      );
      setStandaloneRelatedProducts(relatedProducts);
      setRenderRelatedProducts(true);
    })();
  }, [product]);

  const getPriceContent = () => {
    // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
    return (
      <p>
        {translations.price}: ${product.price}
      </p>
    );
  };

  const getShortDescriptionContent = () => {
    return (
      <>
        <ul>
          {product.shortDescription.map((description, index) => {
            return <li key={`short-description-${index}`}>{description}</li>;
          })}
        </ul>
      </>
    );
  };

  const getTechnicalSpecsContent = () => {
    if (!Array.isArray(product.technicalSpecs)) {
      return translations.emptyData;
    }

    return (
      // TODO: collapse it on mobile by default and expand on PC by default
      <details>
        <summary>{translations.technicalSpecs}:</summary>
        <dl>
          {product.technicalSpecs.map((productDetail, index) => {
            return (
              <div key={`spec-${index}`}>
                <dt>{productDetail.heading}</dt>
                <dd>{productDetail.data}</dd>
              </div>
            );
          })}
        </dl>
      </details>
    );
  };

  // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
  const getReviewsContent = () => {
    if (!product.reviews.list.length) {
      return translations.emptyData;
    }

    return (
      // TODO: collapse it on mobile by default and expand on PC by default
      <details>
        {/*TODO: do it in more esthetic way*/}
        <summary>
          {translations.reviews}: {product.reviews.summary.rating}/5 [{product.reviews.summary.reviewsAmount}]
        </summary>
        <ul>
          {product.reviews.list.map((reviewEntry, index) => {
            return (
              <li key={`review-${index}`}>
                <article>
                  <header>
                    ({reviewEntry.reviewRate}) &nbsp;
                    <b>
                      {translations.author}: {reviewEntry.reviewAuthor}
                    </b>
                    &nbsp;
                    <time>[{reviewEntry.reviewMeta.join() /*TODO: fix empty strings in array in some cases*/}]</time>
                  </header>
                  <cite>{reviewEntry.content}</cite>
                </article>
              </li>
            );
          })}
        </ul>
      </details>
    );
  };

  // TODO: it probably might be used as a separate component
  const getRelatedProductsContent = () => {
    if (!product.relatedProducts.length || !renderRelatedProducts) {
      return translations.emptyData;
    }

    return (
      <>
        <p>{translations.relatedProducts}</p>
        <ul>
          {standaloneRelatedProducts.map((relatedProduct, index) => {
            return (
              <li key={`related-product-${index}`}>
                {/*TODO: ProductItem component in this case will not have full product info, so it has to somehow fetch it on it's own*/}
                <ProductItem product={relatedProduct} />
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <section>
      Product details!
      <p>
        [{product.category}]: {product.name}
      </p>
      {getShortDescriptionContent()}
      {getPriceContent()}
      {getTechnicalSpecsContent()}
      {getReviewsContent()}
      {getRelatedProductsContent()}
    </section>
  );
}
