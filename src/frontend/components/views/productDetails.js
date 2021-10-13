import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import ProductItem from './productItem';
import apiService from '../../features/apiService';
import Popup from '../utils/popup';
import RatingWidget from '../utils/ratingWidget';

const productDetailsTranslations = Object.freeze({
  category: 'Category',
  name: 'Name',
  price: 'Price',
  shortDescription: 'Short description',
  technicalSpecs: 'Specification',
  reviews: 'Reviews',
  author: 'Author',
  relatedProducts: 'Related products',
  editProduct: 'Edit',
  deleteProduct: 'Delete',
  addReview: 'Add review',
  reviewAuthor: 'Author',
  anonymously: 'anonymously?',
  anonymous: 'Anonymous',
  reviewContentPlaceholder: 'You can share your opinion here...',
  cancelReview: 'Cancel review',
  submitReview: 'Submit',
  emptyData: 'No data!',
});

function AddReview({ productName }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formInitials] = useState({
    author: 'TODO: put user nick here',
    rating: 0,
    content: '',
  });
  const [authorReadonly, setAuthorReadonly] = useState(false);

  const onAnonymousChange = (checked, setFieldValue) => {
    setFieldValue('author', checked ? productDetailsTranslations.anonymous : formInitials.author);
    setAuthorReadonly(checked);
  };

  const onSubmitHandler = (values) => {
    console.log('submit review /values:', values);

    apiService.addProductReview(productName, values);
  };

  if (showReviewForm) {
    return (
      <>
        <Formik onSubmit={onSubmitHandler} initialValues={formInitials}>
          {({ handleSubmit, ...formikRestProps }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <span>
                  <label htmlFor="author">{productDetailsTranslations.reviewAuthor}:</label>
                  <Field name="author" type="text" readOnly={authorReadonly} />
                </span>

                <span>
                  <label htmlFor="asAnonymous">{productDetailsTranslations.anonymously}</label>
                  <input
                    id="asAnonymous"
                    type="checkbox"
                    onChange={({ target: { checked } }) => onAnonymousChange(checked, formikRestProps.setFieldValue)}
                  />
                </span>
              </div>

              <Field name="rating" component={RatingWidget} required />

              {/* TODO: adjust <textarea> size to device */}
              <Field name="content" placeholder={productDetailsTranslations.reviewContentPlaceholder} as="textarea" />

              <button type="submit">{productDetailsTranslations.submitReview}</button>
            </form>
          )}
        </Formik>

        <button onClick={() => setShowReviewForm(false)}>{productDetailsTranslations.cancelReview}</button>
      </>
    );
  }

  return <button onClick={() => setShowReviewForm(true)}>{productDetailsTranslations.addReview}</button>;
}

export function getProductDetailsHeaders() {
  const detailKeys = ['category', 'name', 'price', 'shortDescription', 'technicalSpecs', 'reviews', 'relatedProducts'];

  return detailKeys.reduce((detailsHeaders, key) => {
    detailsHeaders[key] = productDetailsTranslations[key];

    return detailsHeaders;
  }, {});
}

export async function getProductDetailsData(product) {
  const relatedProducts = await apiService.getProductsByNames(product.relatedProductsNames);

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

export function prepareSpecificProductDetail(detailName, detailValue, includeHeader, getAdditionalDetailData) {
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
      const productName = getAdditionalDetailData('name');
      let reviewsContent;

      // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
      if (!detailValue.list.length) {
        reviewsContent = productDetailsTranslations.emptyData;
      } else {
        const optionalHeaderContent = getOptionalHeaderContent(`${productDetailsTranslations.reviews}: `);

        reviewsContent = (
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
                        <time>
                          [{reviewEntry.reviewMeta.join() /*TODO: fix empty strings in array in some cases*/}]
                        </time>
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

      return (
        <>
          {reviewsContent}
          <AddReview productName={productName} />
        </>
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
                  {/*
                      TODO: ProductItem component in this case will not have full product info, 
                      so it has to somehow fetch it on it's own
                    */}
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
  const history = useHistory();

  console.log('[ProductDetails] product received from navigation: ', product);

  const [productDetails, setProductDetails] = useState([]);
  const [renderRelatedProducts, setRenderRelatedProducts] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const ignoredProductKeys = ['name', 'category', 'url', 'relatedProducts', 'url'];

  useEffect(() => {
    getProductDetailsData(product)
      .then((productDetails) => {
        setProductDetails(productDetails);

        if (productDetails.relatedProducts?.length) {
          setRenderRelatedProducts(true);
        }
      })
      .catch((error) => console.warn('TODO: fix relatedProducts! /error:', error));
  }, []);

  const getAdditionalDetailData = (detailName) => productDetails[detailName];

  const getMainDetailsContent = () =>
    Object.entries(productDetails)
      .filter(([key]) => !ignoredProductKeys.includes(key))
      .map(([key, value]) => (
        <Fragment key={key}>{prepareSpecificProductDetail(key, value, true, getAdditionalDetailData)}</Fragment>
      ));

  const navigateToProductModify = () => {
    history.push('/modify-product', productDetails.name);
  };

  const deleteProduct = () => {
    apiService.deleteProduct(productDetails.name).then((res) => {
      if (res.status === 204) {
        setPopupData({
          type: 'SUCCESS',
          message: 'Product successfully deleted!',
          buttons: [
            {
              onClick: () => history.push('/shop'),
              text: 'Go back to shop',
            },
          ],
        });
      } else {
        console.error('(deleteProduct) failed res:', res);

        setPopupData({
          type: 'FAILURE',
          message: 'Deleting product failed :(',
          buttons: [
            {
              onClick: () => setPopupData(null),
              text: 'Close',
            },
          ],
        });
      }
    });
  };

  return (
    <section>
      <p>
        [{productDetails.category}]: {productDetails.name}
        <button onClick={navigateToProductModify}>{productDetailsTranslations.editProduct}</button>
        <button onClick={deleteProduct}>{productDetailsTranslations.deleteProduct}</button>
      </p>

      {getMainDetailsContent()}

      {renderRelatedProducts && prepareSpecificProductDetail('relatedProducts', productDetails.relatedProducts, true)}
      {popupData && <Popup type={popupData.type} message={popupData.message} buttons={popupData.buttons} />}
    </section>
  );
}
