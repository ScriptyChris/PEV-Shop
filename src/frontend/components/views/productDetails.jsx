import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import RemoveFromQueueIcon from '@material-ui/icons/RemoveFromQueue';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import MUILink from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import ProductCard from './productCard';
import { ProductComparisonCandidatesList } from '@frontend/components/views/productComparisonCandidates';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import RatingWidget from '@frontend/components/utils/ratingWidget';
import { getLocalizedDate } from '@frontend/features/localization';
import storeService from '@frontend/features/storeService';
import { AddToCartButton } from '@frontend/components/views/cart';
import { ROUTES } from '@frontend/components/pages/_routes';
import { ProductComparisonCandidatesToggler } from '@frontend/components/views/productComparisonCandidates';
import Scroller from '@frontend/components/utils/scroller';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const productDetailsTranslations = Object.freeze({
  category: 'Category',
  name: 'Name',
  price: 'Price',
  shortDescription: 'Short description',
  technicalSpecs: 'Specification',
  reviews: 'Reviews',
  author: 'Author',
  editProduct: 'Edit',
  deleteProduct: 'Delete',
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  goTologIn: 'Log in',
  observeProduct: 'Observe',
  unObserveProduct: 'Unobserve',
  observingProductFailed: 'Failed adding product to observed!',
  unObservingProductFailed: 'Failed removing product from observed!',
  productDetailsNavMenuLabel: 'product details nav menu',
  descriptionNavLabel: 'Description',
  technicalSpecsNavLabel: 'Specification',
  reviewsNavLabel: 'Reviews',
  relatedProductsNavLabel: 'Related products',
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
    httpService
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

              <Field name="rating" component={RatingWidget} isBig={true} required />

              {/* TODO: [UX] adjust <textarea> size to device */}
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

export function getProductDetailsHeaders(ignoredHeadersList = []) {
  const detailKeys = ['category', 'name', 'price', 'shortDescription', 'technicalSpecs', 'reviews', 'relatedProducts'];

  return detailKeys.reduce((detailsHeaders, key) => {
    if (!ignoredHeadersList.includes(key)) {
      detailsHeaders[key] = productDetailsTranslations[key];
    }

    return detailsHeaders;
  }, {});
}

export function ProductSpecificDetail({ detailName, detailValue, extras = {} }) {
  switch (detailName) {
    case 'name':
    case 'category': {
      return <p className={extras.className}>{detailValue}</p>;
    }

    // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
    case 'price': {
      if (extras.header) {
        return (
          <p className={extras.className}>
            {extras.header}
            {detailValue}
          </p>
        );
      }

      return detailValue;
    }

    case 'shortDescription': {
      return (
        <ul>
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

      const SpecNestedData = ({ data }) => {
        return Object.entries(data).map(([key, value]) => {
          if (value && typeof value === 'object') {
            return <SpecNestedData key={key} data={value} />;
          }

          return (
            <dl key={key} className="product-technical-specs-nested-list">
              <div className="product-technical-specs-nested-list__item" key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            </dl>
          );
        });
      };

      return (
        <dl className="product-technical-specs-list">
          {detailValue.map((productDetail, index) => {
            const hasNestedData = typeof productDetail.data === 'object';

            return (
              <div
                className={classNames('product-technical-specs-list__item', extras.classNames?.listItem)}
                key={`spec-${index}`}
              >
                <dt>{productDetail.heading}</dt>
                <dd
                  className={classNames({
                    'product-technical-specs-list__item-nested-list-parent': hasNestedData,
                  })}
                >
                  {hasNestedData ? <SpecNestedData data={productDetail.data} /> : productDetail.data}
                </dd>
              </div>
            );
          })}
        </dl>
      );
    }

    case 'reviews': {
      const RATING_MAX_VALUE = 5; /* TODO: get this from API */
      // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
      const reviewsContent = detailValue.list.length ? (
        <>
          <RatingWidget presetValue={Math.round(detailValue.averageRating)} />
          <p>
            {detailValue.averageRating} / {RATING_MAX_VALUE} [{detailValue.list.length}]
          </p>

          {extras.showReviewsList && (
            /* TODO: [UX] refactor to pagination/"load more" */
            <details>
              <MenuList>
                {detailValue.list.map((reviewEntry, index) => {
                  return (
                    <MenuItem divider={true} key={`review-${index}`}>
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
                    </MenuItem>
                  );
                })}
              </MenuList>
            </details>
          )}
        </>
      ) : (
        productDetailsTranslations.emptyData
      );

      return (
        <div className="product-reviews">
          {extras.showAddReview && <AddReview productName={extras.productName} updateReviews={extras.updateReviews} />}
          {reviewsContent}
        </div>
      );
    }

    case 'relatedProducts': {
      // TODO: it probably might be used as a separate component
      if (!detailValue) {
        return productDetailsTranslations.emptyData;
      }

      return (
        <MenuList ref={extras.listRef} className={extras.className}>
          {detailValue.map((relatedProduct, index) => {
            return (
              <MenuItem button={false} disableGutters={extras.disableListItemGutters} key={`related-product-${index}`}>
                {/*
                  TODO: ProductCard component in this case will not have full product info, 
                  so it has to somehow fetch it on its own
                */}
                <ProductCard product={relatedProduct} />
              </MenuItem>
            );
          })}
        </MenuList>
      );
    }

    default: {
      throw TypeError(`detailName '${detailName}' was not matched!`);
    }
  }
}

const useSectionsObserver = () => {
  const [activatedNavMenuItemIndex, setActivatedNavMenuItemIndex] = useState(-1);
  const productDetailsNavSections = {
    heading: {
      ignored: true,
      ref: useRef(),
    },
    description: {
      id: 'productDetailsDescription',
      label: productDetailsTranslations.descriptionNavLabel,
      ref: useRef(),
    },
    technicalSpecs: {
      id: 'productDetailsTechnicalSpecs',
      label: productDetailsTranslations.technicalSpecsNavLabel,
      ref: useRef(),
    },
    reviews: {
      id: 'productDetailsReviews',
      label: productDetailsTranslations.reviewsNavLabel,
      ref: useRef(),
    },
    relatedProducts: {
      id: 'productDetailsRelatedProducts',
      label: productDetailsTranslations.relatedProductsNavLabel,
      ref: useRef(),
    },
  };

  const refObjsList = Object.values(productDetailsNavSections).map(({ ref }) => ref.current);

  useEffect(() => {
    if (!refObjsList.every(Boolean)) {
      return;
    }

    let intersectionObserver;

    // wait for React to render the DOM tree
    setTimeout(setupIntersectionObserver, 0, intersectionObserver);

    return () => intersectionObserver?.disconnect();
  }, refObjsList);

  const setupIntersectionObserver = (intersectionObserver) => {
    const TOP_BOUNDARY = 155;
    const sectionHeadingsToObserve = refObjsList;
    const scrollingElement = document.documentElement;
    let previousScrollValue = scrollingElement.scrollTop;

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const currentScrollValue = scrollingElement.scrollTop;
        const isScrollingDown = previousScrollValue < currentScrollValue;
        const currentHeadingIndex = sectionHeadingsToObserve.findIndex((heading) => entry.target === heading);
        const previousHeading = sectionHeadingsToObserve[currentHeadingIndex - 1];

        // TODO: [a11y] handle changing URL's hash on scrolling through sections
        if (isScrollingDown && !entry.isIntersecting) {
          setActivatedNavMenuItemIndex(currentHeadingIndex);
        } else if (!isScrollingDown && entry.isIntersecting && previousHeading) {
          setActivatedNavMenuItemIndex(currentHeadingIndex - 1);
        }

        previousScrollValue = scrollingElement.scrollTop;
      },
      {
        rootMargin: `-${TOP_BOUNDARY}px 0px 0px 0px`,
      }
    );

    sectionHeadingsToObserve.forEach((sectionHeading) => intersectionObserver.observe(sectionHeading));
  };

  return { productDetailsNavSections, activatedNavMenuItemIndex };
};

export default function ProductDetails({ product }) {
  // TODO: fetch product data independently when page is loaded explicitly (not navigated to from other page)
  const location = useLocation();
  product = product || location.state;
  const history = useHistory();

  console.log('[ProductDetails] product received from navigation: ', product);

  const isMobileLayout = useMobileLayout();
  const [productDetails, setProductDetails] = useState(null);
  const [popupData, setPopupData] = useState(null);
  // TODO: [BUG] update `isProductObserved` when component is re-rendered due to `product` prop param change
  const [isProductObserved, setIsProductObserved] = useState(
    (storeService.userAccountState?.observedProductsIDs || []).some(
      (observedProductID) => observedProductID === product._id
    )
  );
  const { productDetailsNavSections, activatedNavMenuItemIndex } = useSectionsObserver();

  useEffect(() => {
    if (!product) {
      return;
    }

    httpService
      .getProductsByNames(product.relatedProductsNames)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        const relatedProducts = res;
        setProductDetails({ ...product, relatedProducts });
      })
      .catch((error) => console.warn('TODO: fix relatedProducts! /error:', error));
  }, [product]);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const scrollingTarget = document.querySelector(location.hash);

        if (scrollingTarget) {
          scrollingTarget.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [location.hash]);

  const navigateToProductModify = () => {
    history.push(ROUTES.MODIFY_PRODUCT, productDetails.name);
  };

  const deleteProduct = () => {
    httpService
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
                onClick: () => history.push(ROUTES.SHOP),
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
    if (!storeService.userAccountState) {
      return setPopupData({
        type: POPUP_TYPES.NEUTRAL,
        message: productDetailsTranslations.promptToLoginBeforeProductObserveToggling,
        buttons: [
          {
            text: productDetailsTranslations.goTologIn,
            onClick: () => history.push(ROUTES.LOG_IN),
          },
          getClosePopupBtn(setPopupData),
        ],
      });
    }

    httpService
      .disableGenericErrorHandler() /* eslint-disable-next-line no-unexpected-multiline */
      [isProductObserved ? 'removeProductFromObserved' : 'addProductToObserved'](product._id)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          const message = isProductObserved
            ? productDetailsTranslations.unObservingProductFailed
            : productDetailsTranslations.observingProductFailed;

          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          // TODO: [BUG] update observed products IDs list in storage
          storeService.updateUserAccountState({
            ...storeService.userAccountState,
            observedProductsIDs: res,
          });
          setIsProductObserved(!isProductObserved);
        }
      });
  };

  if (!productDetails) {
    return null;
  }

  return (
    <article className={classNames('product-details', { 'product-details--pc': !isMobileLayout })}>
      <aside className="product-details__aside">
        <ProductComparisonCandidatesList
          collapsibleAnimation={true}
          forceHideWhenEmpty={true}
          compensateOuterTopMargin={true}
        />
      </aside>

      <Paper
        component="header"
        elevation={0}
        className="product-details__header"
        ref={productDetailsNavSections.heading.ref}
      >
        <ProductSpecificDetail
          detailName="category"
          detailValue={productDetails.category}
          extras={{
            className: 'product-details__header-category',
          }}
        />
        <p className="product-details__header-action-btns">
          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={navigateToProductModify}>
            {productDetailsTranslations.editProduct}
          </Button>
          <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={deleteProduct}>
            {productDetailsTranslations.deleteProduct}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={isProductObserved ? <RemoveFromQueueIcon /> : <AddToQueueIcon />}
            onClick={toggleProductObserve}
          >
            {isProductObserved
              ? productDetailsTranslations.unObserveProduct
              : productDetailsTranslations.observeProduct}
          </Button>
          <ProductComparisonCandidatesToggler product={product} buttonVariant="outlined" />
        </p>

        <div className="product-details__header-image">TODO: [UI] image should go here</div>
        {/*<img src={image} alt={`${translations.productImage}${name}`} className="product-details__header-image" />*/}

        <Typography variant="h2" component="h2" className="product-details__header-name">
          <ProductSpecificDetail detailName="name" detailValue={productDetails.name} />
        </Typography>
        <RatingWidget
          presetValue={productDetails.reviews.averageRating}
          isBig={true}
          externalClassName="product-details__header-rating"
        />

        <ProductSpecificDetail
          detailName="price"
          detailValue={productDetails.price}
          extras={{
            header: productDetailsTranslations.price,
            className: 'product-details__header-price',
          }}
        />
        <AddToCartButton
          productInfoForCart={{ name: productDetails.name, price: productDetails.price, _id: productDetails._id }}
          startOrEndIcon="startIcon"
          className="product-details__header-buy-btn"
        />
      </Paper>

      <aside className="product-details__nav-menu">
        <Scroller
          scrollerBaseValueMeta={{
            useDefault: true,
          }}
          render={({ elementRef }) => (
            <div /* this `div` is hooked with a `ref` by Scroller component */>
              <MenuList
                ref={elementRef}
                className="product-details__nav-menu-list"
                component="ol"
                disablePadding={true}
                // TODO: [a11y] `aria-describedby` would rather be better, but React has to be upgraded
                aria-label={productDetailsTranslations.productDetailsNavMenuLabel}
              >
                {Object.entries(productDetailsNavSections).map(([, navSection], index) => {
                  if (navSection.ignored) {
                    return null;
                  }

                  return (
                    <MenuItem
                      key={navSection.id}
                      className={classNames({
                        activated: activatedNavMenuItemIndex === index,
                      })}
                    >
                      <MUILink to={{ hash: `#${navSection.id}`, state: product }} component={Link} color="inherit">
                        {navSection.label}
                      </MUILink>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </div>
          )}
        />
      </aside>

      <section className="product-details__nav-section">
        <Typography
          variant="h3"
          component="h3"
          id={productDetailsNavSections.description.id}
          ref={productDetailsNavSections.description.ref}
        >
          {productDetailsNavSections.description.label}
        </Typography>
        <ProductSpecificDetail detailName="shortDescription" detailValue={productDetails.shortDescription} />
      </section>

      <Divider />

      <section className="product-details__nav-section">
        <Typography
          variant="h3"
          component="h3"
          id={productDetailsNavSections.technicalSpecs.id}
          ref={productDetailsNavSections.technicalSpecs.ref}
        >
          {productDetailsNavSections.technicalSpecs.label}
        </Typography>
        <ProductSpecificDetail
          detailName="technicalSpecs"
          detailValue={productDetails.technicalSpecs}
          extras={{
            classNames: {
              listItem: 'product-details__nav-section-specs',
            },
          }}
        />
      </section>

      <Divider />

      <section className="product-details__nav-section">
        <Typography
          variant="h3"
          component="h3"
          id={productDetailsNavSections.reviews.id}
          ref={productDetailsNavSections.reviews.ref}
        >
          {productDetailsNavSections.reviews.label}
        </Typography>
        <ProductSpecificDetail
          detailName="reviews"
          detailValue={productDetails.reviews}
          extras={{
            showReviewsList: true,
            showAddReview: true,
            updateReviews: (reviews) =>
              setProductDetails((prev) => ({
                ...prev,
                reviews,
              })),
          }}
        />
      </section>

      <Divider />

      <section className="product-details__nav-section">
        <Typography
          variant="h3"
          component="h3"
          id={productDetailsNavSections.relatedProducts.id}
          ref={productDetailsNavSections.relatedProducts.ref}
        >
          {productDetailsNavSections.relatedProducts.label}
        </Typography>

        {productDetails.relatedProducts?.length && (
          <div className="product-details__nav-section-related-products">
            <Scroller
              scrollerBaseValueMeta={{
                selector: '.product-details__nav-section-related-products',
                varName: '--related-product-card-width',
              }}
              render={({ elementRef }) => (
                <div /* this `div` is hooked with a `ref` by Scroller component */>
                  <ProductSpecificDetail
                    detailName="relatedProducts"
                    detailValue={productDetails.relatedProducts}
                    extras={{
                      listRef: elementRef,
                      disableListItemGutters: true,
                    }}
                  />
                </div>
              )}
            />
          </div>
        )}
      </section>

      <Divider />

      {popupData && <Popup type={popupData.type} message={popupData.message} buttons={popupData.buttons} />}
    </article>
  );
}
