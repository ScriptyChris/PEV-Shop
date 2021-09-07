import React, { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import ProductItem from './productItem';
import apiService from '../../features/apiService';

const productDetailsTranslations = Object.freeze({
  category: 'Category',
  name: 'Name',
  price: 'Price',
  shortDescription: 'Short description',
  technicalSpecs: 'Specification',
  reviews: 'Reviews',
  author: 'Author',
  relatedProducts: 'Related products',
  emptyData: 'No data!',
});

export function getProductDetailsHeaders() {
  const detailKeys = ['category', 'name', 'price', 'shortDescription', 'technicalSpecs', 'reviews', 'relatedProducts'];

  return detailKeys.reduce((detailsHeaders, key) => {
    detailsHeaders[key] = productDetailsTranslations[key];

    return detailsHeaders;
  }, {});
}

export function getProductDetailsData(product) {
  const relatedProducts = apiService.getProductsById(product.relatedProducts.map((item) => item.id).toString());

  return {
    category: product.category,
    name: product.name,
    price: product.price,
    shortDescription: product.shortDescription,
    technicalSpecs: product.technicalSpecs,
    reviews: product.reviews,
    url: product.url,
    relatedProducts,
  };
}

export function prepareSpecificProductDetail(detailName, detailValue, includeHeader) {
  const getOptionalHeaderContent = (headerContent) => (includeHeader ? headerContent : null);

  switch (detailName) {
    case 'name':
    case 'category': {
      return detailValue;
    }

    case 'price': {
      // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
      const optionalHeaderContent = getOptionalHeaderContent(`${productDetailsTranslations.price}: `);

      if (optionalHeaderContent) {
        return (
          <p>
            {optionalHeaderContent}
            {detailValue}
          </p>
        );
      }

      return detailValue;
    }

    case 'shortDescription': {
      return (
        <ul className="compare-products-list__item-short-description">
          {detailValue.map((description, index) => {
            return <li key={`short-description-${index}`}>{description}</li>;
          })}
        </ul>
      );
    }

    case 'technicalSpecs': {
      if (!Array.isArray(detailValue)) {
        return productDetailsTranslations.emptyData;
      }

      const optionalHeaderContent = getOptionalHeaderContent(
        <summary>{productDetailsTranslations.technicalSpecs}:</summary>
      );
      const getBodyContent = () => (
        <dl>
          {detailValue.map((productDetail, index) => {
            return (
              <div key={`spec-${index}`}>
                <dt>{productDetail.heading}</dt>
                <dd>
                  {/* TODO: use table for object data */}
                  {typeof productDetail.data === 'object' ? JSON.stringify(productDetail.data) : productDetail.data}
                </dd>
              </div>
            );
          })}
        </dl>
      );

      // TODO: collapse it on mobile by default and expand on PC by default
      if (includeHeader) {
        return (
          <>
            <details>
              {optionalHeaderContent}
              {getBodyContent()}
            </details>
          </>
        );
      }

      return getBodyContent();
    }

    case 'reviews': {
      // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
      if (!detailValue.list.length) {
        return productDetailsTranslations.emptyData;
      }

      const optionalHeaderContent = getOptionalHeaderContent(`${productDetailsTranslations.reviews}: `);

      return (
        // TODO: collapse it on mobile by default and expand on PC by default
        <details>
          {/*TODO: do it in more aesthetic way*/}
          <summary>
            {optionalHeaderContent}
            {detailValue.summary.rating}/5 [{detailValue.summary.reviewsAmount}]
          </summary>
          <ul>
            {detailValue.list.map((reviewEntry, index) => {
              return (
                <li key={`review-${index}`}>
                  <article>
                    <header>
                      ({reviewEntry.reviewRate}) &nbsp;
                      <b>
                        {productDetailsTranslations._author}: {reviewEntry.reviewAuthor}
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
    }

    case 'relatedProducts': {
      // TODO: it probably might be used as a separate component
      if (!detailValue) {
        return productDetailsTranslations.emptyData;
      }

      const optionalHeaderContent = getOptionalHeaderContent(<p>{productDetailsTranslations.relatedProducts}</p>);

      return (
        <>
          {optionalHeaderContent}
          <ul>
            {detailValue.map((relatedProduct, index) => {
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
    }

    default: {
      throw TypeError(`detailName '${detailName}' was not matched!`);
    }
  }
}

export default function ProductDetails({ product }) {
  // TODO: fetch product data independently when page is loaded explicitly (not navigated to from other page)
  product = product || useLocation().state;

  console.log('[ProductDetails] product received from navigation: ', product);

  const productDetails = getProductDetailsData(product);
  const [renderRelatedProducts, setRenderRelatedProducts] = useState(false);
  const ignoredProductKeys = ['name', 'category', 'url', 'relatedProducts', 'url'];

  useEffect(() => {
    productDetails.relatedProducts
      .then((relatedProducts) => {
        if (relatedProducts.length) {
          setRenderRelatedProducts(true);
        }
      })
      .catch((error) => console.warn('TODO: fix relatedProducts! /error:', error));
  }, []);

  const getMainDetailsContent = () =>
    Object.entries(productDetails)
      .filter(([key]) => !ignoredProductKeys.includes(key))
      .map(([key, value]) => <Fragment key={key}>{prepareSpecificProductDetail(key, value, true)}</Fragment>);

  return (
    <section>
      <p>
        [{productDetails.category}]: {productDetails.name}
      </p>

      {getMainDetailsContent()}

      {renderRelatedProducts && prepareSpecificProductDetail('relatedProducts', productDetails.relatedProducts, true)}
    </section>
  );
}
