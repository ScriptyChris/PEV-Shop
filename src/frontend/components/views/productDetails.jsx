import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Field } from 'formik';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';

import {
  PEVForm,
  PEVButton,
  PEVLink,
  PEVRadio,
  PEVHeading,
  PEVParagraph,
  PEVFieldset,
} from '@frontend/components/utils/pevElements';
import ProductCard from './productCard';
import { ProductComparisonCandidatesList } from '@frontend/components/views/productComparisonCandidates';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import RatingWidget from '@frontend/components/utils/ratingWidget';
import { getLocalizedDate } from '@frontend/features/localization';
import { AddToCartButton } from '@frontend/components/views/cart';
import { useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import { ProductObservabilityToggler } from '@frontend/components/views/productObservability';
import { ProductComparisonCandidatesToggler } from '@frontend/components/views/productComparisonCandidates';
import Scroller from '@frontend/components/utils/scroller';
import { DeleteProductFeature, NavigateToModifyProduct } from '@frontend/components/shared';

const productDetailsTranslations = Object.freeze({
  category: 'Category',
  name: 'Name',
  price: 'Price',
  shortDescription: 'Short description',
  technicalSpecs: 'Specification',
  reviews: 'Reviews',
  reviewAuthor: 'Author',
  reviewNewAuthor: 'Add review as',
  productDetailsNavMenuLabel: 'product details nav menu',
  descriptionNavLabel: 'Description',
  technicalSpecsNavLabel: 'Specification',
  reviewsNavLabel: 'Reviews',
  relatedProductsNavLabel: 'Related products',
  addReview: 'Add review',
  anonymously: 'Anonymous',
  reviewContentPlaceholder: 'You can share your opinion here...',
  cancelReview: 'Cancel',
  submitReview: 'Submit',
  emptyData: 'No data!',
});

function AddReview({ productName, updateReviews }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const formInitials = {
    author: '',
    rating: 0,
    content: '',
  };
  const [popupData, setPopupData] = useState(null);

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
        <PEVForm onSubmit={onSubmitHandler} initialValues={formInitials} className="pev-flex pev-flex--columned">
          <PEVFieldset className="pev-flex pev-flex--columned">
            <Field component={RatingWidget} name="rating" isBig required />

            {/* TODO: [UX] adjust <textarea> size to device */}
            <Field
              component="textarea"
              name="content"
              placeholder={productDetailsTranslations.reviewContentPlaceholder}
            />

            <div className="pev-flex">
              <PEVParagraph>{productDetailsTranslations.reviewNewAuthor}:</PEVParagraph>
              <FormGroup>
                <div className="product-reviews__new-author">
                  <PEVRadio
                    label="TODO: put user nick here"
                    value="TODO: put user nick here"
                    name="author"
                    identity="namedAuthor"
                    required
                  />
                </div>
                <div className="product-reviews__new-author">
                  <PEVRadio
                    label={productDetailsTranslations.anonymously}
                    value={productDetailsTranslations.anonymously}
                    name="author"
                    identity="anonymousAuthor"
                    required
                  />
                </div>
              </FormGroup>
            </div>
          </PEVFieldset>

          <div className="pev-flex">
            <PEVButton type="submit">{productDetailsTranslations.submitReview}</PEVButton>
            <PEVButton onClick={() => setShowReviewForm(false)}>{productDetailsTranslations.cancelReview}</PEVButton>
          </div>
        </PEVForm>

        <Popup {...popupData} />
      </>
    );
  }

  return <PEVButton onClick={() => setShowReviewForm(true)}>{productDetailsTranslations.addReview}</PEVButton>;
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

export const ProductSpecificDetail = forwardRef(function _ProductSpecificDetail(
  { detailName, detailValue, extras = {} },
  forwardedRef
) {
  switch (detailName) {
    case 'name':
    case 'category': {
      return (
        <PEVParagraph className={extras.className} data-cy={`label:product-detail__${detailName}`}>
          {detailValue}
        </PEVParagraph>
      );
    }

    // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
    case 'price': {
      if (extras.header) {
        return (
          <PEVParagraph className={extras.className}>
            {extras.header}
            {detailValue}
          </PEVParagraph>
        );
      }

      return detailValue;
    }

    case 'shortDescription': {
      return (
        <List>
          {detailValue.map((description, index) => {
            return <ListItem key={`short-description-${index}`}>{description}</ListItem>;
          })}
        </List>
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
          <PEVParagraph>
            {detailValue.averageRating} / {RATING_MAX_VALUE} [{detailValue.list.length}]
          </PEVParagraph>

          {extras.showReviewsList && (
            /* TODO: [UX] refactor to pagination/"load more" */
            <details>
              <List>
                {detailValue.list.map((reviewEntry, index) => {
                  return (
                    <ListItem divider={true} key={`review-${index}`}>
                      <article>
                        <header>
                          <RatingWidget presetValue={reviewEntry.rating} />
                          <PEVParagraph>
                            <b>
                              {productDetailsTranslations.reviewAuthor}: {reviewEntry.author}
                            </b>
                            &nbsp;
                            <time>[{getLocalizedDate(reviewEntry.timestamp)}]</time>
                          </PEVParagraph>
                        </header>
                        <cite>{reviewEntry.content}</cite>
                      </article>
                    </ListItem>
                  );
                })}
              </List>
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
        <List ref={forwardedRef} className={extras.className}>
          {detailValue.map((relatedProduct, index) => {
            return (
              <ListItem button={false} disableGutters={extras.disableListItemGutters} key={`related-product-${index}`}>
                {/*
                  TODO: ProductCard component in this case will not have full product info, 
                  so it has to somehow fetch it on its own
                */}
                <ProductCard product={relatedProduct} entryNo={index} />
              </ListItem>
            );
          })}
        </List>
      );
    }

    default: {
      throw TypeError(`detailName '${detailName}' was not matched!`);
    }
  }
});

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

export default observer(function ProductDetails({ product }) {
  // TODO: fetch product data independently when page is loaded explicitly (not navigated to from other page)
  const location = useLocation();
  product = product || location.state;
  const routesGuards = useRoutesGuards(storeService);

  console.log('[ProductDetails] product received from navigation: ', product);

  const [productDetails, setProductDetails] = useState(null);
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

  if (!productDetails) {
    return null;
  }

  return (
    <article className="product-details">
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
        <PEVParagraph className="product-details__header-action-btns">
          {routesGuards.isSeller() && (
            <>
              <NavigateToModifyProduct productName={productDetails.name} />
              <DeleteProductFeature productName={productDetails.name} />
            </>
          )}
          <ProductObservabilityToggler productId={product._id} />
          <ProductComparisonCandidatesToggler product={product} buttonVariant="outlined" />
        </PEVParagraph>

        <div className="product-details__header-image">TODO: [UI] image should go here</div>
        {/*<img src={image} alt={`${translations.productImage}${name}`} className="product-details__header-image" />*/}

        <PEVHeading level={2} className="product-details__header-name">
          <ProductSpecificDetail detailName="name" detailValue={productDetails.name} />
        </PEVHeading>
        {/* TODO: [UX] clicking on rating here should scroll to this product ratings */}
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
          render={({ ScrollerHookingParent }) => (
            <ScrollerHookingParent>
              <MenuList
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
                      <PEVLink to={{ hash: `#${navSection.id}`, state: product }}>{navSection.label}</PEVLink>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ScrollerHookingParent>
          )}
        />
      </aside>

      <section className="product-details__nav-section">
        <PEVHeading
          level={3}
          id={productDetailsNavSections.description.id}
          ref={productDetailsNavSections.description.ref}
        >
          {productDetailsNavSections.description.label}
        </PEVHeading>
        <ProductSpecificDetail detailName="shortDescription" detailValue={productDetails.shortDescription} />
      </section>

      <Divider />

      <section className="product-details__nav-section">
        <PEVHeading
          level={3}
          id={productDetailsNavSections.technicalSpecs.id}
          ref={productDetailsNavSections.technicalSpecs.ref}
        >
          {productDetailsNavSections.technicalSpecs.label}
        </PEVHeading>
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
        <PEVHeading level={3} id={productDetailsNavSections.reviews.id} ref={productDetailsNavSections.reviews.ref}>
          {productDetailsNavSections.reviews.label}
        </PEVHeading>
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
        <PEVHeading
          level={3}
          id={productDetailsNavSections.relatedProducts.id}
          ref={productDetailsNavSections.relatedProducts.ref}
        >
          {productDetailsNavSections.relatedProducts.label}
        </PEVHeading>

        {productDetails.relatedProducts?.length && (
          <div className="product-details__nav-section-related-products">
            <Scroller
              scrollerBaseValueMeta={{
                selector: '.product-details__nav-section-related-products',
                varName: '--related-product-card-width',
              }}
              render={({ ScrollerHookingParent }) => (
                <ScrollerHookingParent>
                  <ProductSpecificDetail
                    detailName="relatedProducts"
                    detailValue={productDetails.relatedProducts}
                    extras={{
                      disableListItemGutters: true,
                    }}
                  />
                </ScrollerHookingParent>
              )}
            />
          </div>
        )}
      </section>

      <Divider />

      <ProductComparisonCandidatesList />
    </article>
  );
});
