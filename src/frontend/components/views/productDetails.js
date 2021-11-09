import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik, Field } from 'formik';
import ProductItem from './productItem';
import apiService from '../../features/apiService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '../utils/popup';
import RatingWidget from '../utils/ratingWidget';
import { getLocalizedDate } from '../../features/localization';
import appStore from '../../features/appStore';

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
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  goTologIn: 'Log in',
  observeProduct: 'Observe',
  unObserveProduct: 'Unobserve',
  observingProductFailed: 'Failed adding product to observed!',
  unObservingProductFailed: 'Failed removing product from observed!',
  addReview: 'Add review',
  anonymously: 'anonymously?',
  anonymous: 'Anonymous',
  reviewContentPlaceholder: 'You can share your opinion here...',
  cancelReview: 'Cancel review',
  submitReview: 'Submit',
  emptyData: 'No data!',
});

function AddReview({ productName, updateReviews }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formInitials] = useState({
    author: 'TODO: put user nick here',
    rating: 0,
    content: '',
  });
  const [popupData, setPopupData] = useState(null);

  const onAnonymousChange = (checked, setFieldValue) => {
    setFieldValue('author', checked ? productDetailsTranslations.anonymous : formInitials.author);
  };

  const onSubmitHandler = (values) => {
    apiService
      .disableGenericErrorHandler()
      .addProductReview(productName, values)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.list && res.averageRating) {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: 'Review added!',
            buttons: [getClosePopupBtn(setPopupData)],
          });
          updateReviews({ list: res.list, averageRating: res.averageRating });
        } else {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: 'Failed to add review :(',
            buttons: [getClosePopupBtn(setPopupData)],
          });
        }
      });
  };

  if (showReviewForm) {
    return (
      <>
        <Formik onSubmit={onSubmitHandler} initialValues={formInitials}>
          {({ handleSubmit, ...formikRestProps }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <span>
                  <label htmlFor="author">{productDetailsTranslations.author}:</label>
                  <Field name="author" type="text" readOnly required />
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
        {popupData && <Popup {...popupData} />}
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

export function getProductDetailsData(product) {
  return apiService.getProductsByNames(product.relatedProductsNames).then((res) => {
    if (res.__EXCEPTION_ALREADY_HANDLED) {
      return;
    }

    return {
      category: product.category,
      name: product.name,
      price: product.price,
      shortDescription: product.shortDescription,
      technicalSpecs: product.technicalSpecs,
      reviews: product.reviews,
      url: product.url,
      relatedProducts: res,
    };
  });
}

export function prepareSpecificProductDetail(detailName, detailValue, extras = {}) {
  const getOptionalHeaderContent = (headerContent) => (extras.includeHeader ? headerContent : null);

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
      if (extras.includeHeader) {
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
      let reviewsContent;

      // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
      if (!detailValue.list.length) {
        reviewsContent = productDetailsTranslations.emptyData;
      } else {
        const optionalHeaderContent = getOptionalHeaderContent(`${productDetailsTranslations.reviews}: `);
        const RATING_MAX_VALUE = 5; /* TODO: get this from API */

        reviewsContent = (
          // TODO: collapse it on mobile by default and expand on PC by default
          <details>
            {/*TODO: do it in more aesthetic way*/}
            <summary>
              {optionalHeaderContent}
              {detailValue.averageRating} / {RATING_MAX_VALUE} [{detailValue.list.length}]
            </summary>
            <ul>
              {detailValue.list.map((reviewEntry, index) => {
                return (
                  <li key={`review-${index}`}>
                    <article>
                      <header>
                        <RatingWidget presetValue={reviewEntry.rating} />
                        <p>
                          <b>
                            {productDetailsTranslations.author}: {reviewEntry.author}
                          </b>
                          &nbsp;
                          <time>[{getLocalizedDate(reviewEntry.timestamp)}]</time>
                        </p>
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
          {extras.showAddReview && <AddReview productName={extras.productName} updateReviews={extras.updateReviews} />}
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
  const [isProductObserved, setIsProductObserved] = useState(
    (appStore.userSessionState?.observedProductsIDs || []).some(
      (observedProductID) => observedProductID === product._id
    )
  );
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

  const getMainDetailsContent = () =>
    Object.entries(productDetails)
      .filter(([key]) => !ignoredProductKeys.includes(key))
      .map(([key, value]) => (
        <Fragment key={key}>
          {prepareSpecificProductDetail(key, value, {
            includeHeader: true,
            showAddReview: key === 'reviews',
            productName: productDetails.name,
            updateReviews: (reviews) =>
              setProductDetails((prev) => ({
                ...prev,
                reviews,
              })),
          })}
        </Fragment>
      ));

  const navigateToProductModify = () => {
    history.push('/modify-product', productDetails.name);
  };

  const deleteProduct = () => {
    apiService
      .disableGenericErrorHandler()
      .deleteProduct(productDetails.name)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__NO_CONTENT) {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
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
            type: POPUP_TYPES.FAILURE,
            message: 'Deleting product failed :(',
            buttons: [getClosePopupBtn(setPopupData)],
          });
        }
      });
  };

  const toggleProductObserve = () => {
    if (!appStore.userSessionState) {
      return setPopupData({
        type: POPUP_TYPES.NEUTRAL,
        message: productDetailsTranslations.promptToLoginBeforeProductObserveToggling,
        buttons: [
          {
            text: productDetailsTranslations.goTologIn,
            onClick: () => history.push(`/log-in`),
          },
          getClosePopupBtn(setPopupData),
        ],
      });
    }

    apiService
      .disableGenericErrorHandler() /* eslint-disable-next-line no-unexpected-multiline */
      [isProductObserved ? 'removeProductFromObserved' : 'addProductToObserved'](product._id)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          const message = isProductObserved
            ? productDetailsTranslations.unOservingProductFailed
            : productDetailsTranslations.observingProductFailed;

          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          appStore.updateUserSessionState({
            ...appStore.userSessionState,
            observedProductsIDs: res,
          });
          setIsProductObserved(!isProductObserved);
        }
      });
  };

  return (
    <section>
      <p>
        [{productDetails.category}]: {productDetails.name}
        <button onClick={navigateToProductModify}>{productDetailsTranslations.editProduct}</button>
        <button onClick={deleteProduct}>{productDetailsTranslations.deleteProduct}</button>
        <button onClick={toggleProductObserve}>
          {isProductObserved ? productDetailsTranslations.unObserveProduct : productDetailsTranslations.observeProduct}
        </button>
      </p>

      {getMainDetailsContent()}

      {renderRelatedProducts && prepareSpecificProductDetail('relatedProducts', productDetails.relatedProducts, true)}
      {popupData && <Popup type={popupData.type} message={popupData.message} buttons={popupData.buttons} />}
    </section>
  );
}
