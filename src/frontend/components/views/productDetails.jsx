import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Field } from 'formik';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import MobileStepper from '@material-ui/core/MobileStepper';
import Fade from '@material-ui/core/Fade';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import {
  PEVForm,
  PEVButton,
  PEVIconButton,
  PEVLink,
  PEVCheckbox,
  PEVHeading,
  PEVParagraph,
  PEVFieldset,
  PEVImage,
} from '@frontend/components/utils/pevElements';
import ProductCard from './productCard';
import { ProductComparisonCandidatesList } from '@frontend/components/views/productComparisonCandidates';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import RatingWidget from '@frontend/components/utils/ratingWidget';
import { getLocalizedDate } from '@frontend/features/localization';
import { AddToCartButton } from '@frontend/components/views/cart';
import { useRoutesGuards, routeHelpers, ROUTES } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import { ProductObservabilityToggler } from '@frontend/components/views/productObservability';
import { ProductComparisonCandidatesToggler } from '@frontend/components/views/productComparisonCandidates';
import Scroller from '@frontend/components/utils/scroller';
import { DeleteProductFeature, NavigateToModifyProduct } from '@frontend/components/shared';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import Price from '@frontend/components/views/price';

const productDetailsTranslations = Object.freeze({
  category: 'Category',
  name: 'Name',
  price: 'Price',
  productDataDisclaimerPrefix: "Product's data are based on",
  prevImgBtn: 'Prev',
  nextImgBtn: 'Next',
  closeImageBtn: 'close image',
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
  listOfUserReviews: 'List of user reviews',
  noReviews: "This product hasn't received any reviews yet!",
  addReview: 'Add review',
  attemptToAddReviewAgain: 'You already added a review for this product! User can add only single review per product.',
  addedReview: 'Review added!',
  failedToAddReview: 'Failed to add review.',
  addingReviewAuthFailure: "To add a product's review, you have to log in as a client.",
  anonymousAuthor: 'Anonymous',
  isAuthorAnonymous: 'Publish anonymously?',
  reviewContentPlaceholder: 'You can share your opinion here...',
  cancelReview: 'Cancel',
  saveReview: 'Save',
  emptyData: 'No data!',
});

function AddReview({ productUrl, usersWhoMaybeAlreadyAddedReview, updateReviews }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const formInitials = {
    isAuthorAnonymous: false,
    rating: 0,
    content: '',
  };
  const routesGuards = useRoutesGuards(storeService);
  const { isMobileLayout } = useRWDLayout();
  const [popupData, setPopupData] = useState(null);
  const userLogin = storeService.userAccountState?.login;

  const reviewFormVisibilityToggler = (shouldShow) => {
    return () => {
      if (shouldShow) {
        if (!routesGuards.isClient()) {
          return setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: productDetailsTranslations.addingReviewAuthFailure,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } // TODO: [consistency] make more robust check, which will also detect anonymous case
        else if (usersWhoMaybeAlreadyAddedReview.has(userLogin)) {
          return setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: productDetailsTranslations.attemptToAddReviewAgain,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        }
      }

      setIsReviewFormVisible(shouldShow);
    };
  };

  const onSubmitHandler = (values) => {
    httpService
      .disableGenericErrorHandler()
      .addProductReview(productUrl, values)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (Array.isArray(res.list) && 'averageRating' in res) {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: productDetailsTranslations.addedReview,
            buttons: [getClosePopupBtn(setPopupData)],
          });
          updateReviews({ list: res.list, averageRating: res.averageRating });
          setIsReviewFormVisible(false);
        } else if (res.__ERROR_TO_HANDLE === 'Given author already added review for this product!') {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: productDetailsTranslations.attemptToAddReviewAgain,
            buttons: [getClosePopupBtn(setPopupData)],
          });
          setIsReviewFormVisible(false);
        } else {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: productDetailsTranslations.failedToAddReview,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        }
      });
  };

  return (
    <>
      {isReviewFormVisible ? (
        <PEVForm
          onSubmit={onSubmitHandler}
          initialValues={formInitials}
          className="product-reviews__form pev-flex pev-flex--columned"
        >
          <PEVFieldset className="pev-flex pev-flex--columned">
            <Field component={RatingWidget} name="rating" isBig required />

            <Field
              as={TextareaAutosize}
              className="product-reviews__textarea"
              name="content"
              placeholder={productDetailsTranslations.reviewContentPlaceholder}
              minLength={5}
              maxLength={500}
              cols={isMobileLayout ? 30 : 60}
              minRows={5}
              maxRows={15}
            />

            <div className="product-reviews__is-author-anonymous-checkbox pev-flex">
              <PEVCheckbox
                label={productDetailsTranslations.isAuthorAnonymous}
                name="isAuthorAnonymous"
                identity="isAuthorAnonymous"
                color="primary"
              />
            </div>
          </PEVFieldset>

          <div className="pev-flex">
            <PEVButton className="product-reviews__submit-btn" type="submit">
              {productDetailsTranslations.saveReview}
            </PEVButton>
            <PEVButton onClick={reviewFormVisibilityToggler(false)}>
              {productDetailsTranslations.cancelReview}
            </PEVButton>
          </div>
        </PEVForm>
      ) : (
        <PEVButton color="primary" variant="contained" onClick={reviewFormVisibilityToggler(true)}>
          {productDetailsTranslations.addReview}
        </PEVButton>
      )}

      <Popup {...popupData} />
    </>
  );
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
    case 'name': {
      return (
        <PEVParagraph className={extras.className} data-cy={`label:product-detail__name`}>
          {extras.optionalImage}
          <strong>{detailValue}</strong>
        </PEVParagraph>
      );
    }
    case 'category': {
      return (
        <PEVParagraph className={extras.className} data-cy={`label:product-detail__category`}>
          {detailValue}
        </PEVParagraph>
      );
    }

    // TODO: create price component, which will handle things like promotion and will format price according to locale and/or chosen currency
    case 'price': {
      if (extras.header) {
        return (
          <Price valueInUSD={detailValue}>
            {({ currencyAndPrice }) => (
              <PEVParagraph className={extras.className}>
                <b>{extras.header}:</b>
                {currencyAndPrice}
              </PEVParagraph>
            )}
          </Price>
        );
      }

      return (
        <Price valueInUSD={detailValue}>
          {({ currencyAndPrice }) => <PEVParagraph className={extras.className}>{currencyAndPrice}</PEVParagraph>}
        </Price>
      );
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
              <div className="product-technical-specs-list__item" key={`spec-${index}`}>
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
      // TODO: move to separate component as it will likely has some additional logic (like pagination, sorting, filtering)
      const reviewsContent = detailValue.list.length ? (
        <>
          <RatingWidget presetValue={detailValue.averageRating} reviewsAmount={detailValue.list.length} />
          {extras.showReviewsList && (
            /* TODO: [UX] refactor to pagination/"load more" */
            <details>
              <summary>{productDetailsTranslations.listOfUserReviews}</summary>
              <List>
                {detailValue.list
                  .sort((prev, next) => next.timestamp - prev.timestamp)
                  .map((reviewEntry, index) => {
                    return (
                      <ListItem className="product-reviews__list-entry" divider={true} key={`review-${index}`}>
                        <figure>
                          <figcaption>
                            <RatingWidget
                              presetValue={reviewEntry.rating}
                              asSingleIcon={extras.isMobileLayout}
                              decorateSingleIcon={extras.isMobileLayout}
                            />
                            {' - '}
                            {reviewEntry.author || productDetailsTranslations.anonymousAuthor}
                            <time>[{getLocalizedDate(reviewEntry.timestamp)}]</time>
                          </figcaption>
                          <blockquote>
                            {reviewEntry.content && <PEVParagraph>{reviewEntry.content}</PEVParagraph>}
                          </blockquote>
                        </figure>
                      </ListItem>
                    );
                  })}
              </List>
            </details>
          )}
        </>
      ) : (
        <PEVParagraph>{productDetailsTranslations.noReviews}</PEVParagraph>
      );

      return (
        <div className={classNames('product-reviews pev-flex pev-flex--columned', extras.className)}>
          {extras.showAddReview && (
            <AddReview
              productUrl={extras.productUrl}
              usersWhoMaybeAlreadyAddedReview={extras.usersWhoMaybeAlreadyAddedReview}
              updateReviews={extras.updateReviews}
            />
          )}
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
                <ProductCard product={relatedProduct} entryNo={index} lazyLoadImages />
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

// Based on MUI stepper https://v4.mui.com/components/steppers/#text
function Gallery({ images }) {
  const [activeStep, setActiveStep] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const maxSteps = images.length;

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const getImageZoomHandler = (shouldZoomIn) => () => setImageZoomed(shouldZoomIn);
  const handleDisablePageScroll = () => (document.body.style.overflow = 'hidden');
  const handleEnablePageScroll = () => (document.body.style.overflow = null);

  return (
    <div className="product-details__header-gallery">
      <PEVImage
        image={images[activeStep]}
        className="product-details__header-gallery-image"
        onClick={getImageZoomHandler(true)}
      />
      <Fade
        in={imageZoomed}
        timeout={{ enter: 1000, exit: 250 }}
        onEntering={handleDisablePageScroll}
        onExiting={handleEnablePageScroll}
      >
        <div className="zoom-container pev-flex pev-flex--columned">
          <PEVIconButton
            className="zoom-container__close-btn"
            onClick={getImageZoomHandler(false)}
            a11y={productDetailsTranslations.closeImageBtn}
            color="primary"
          >
            <CloseIcon />
          </PEVIconButton>
          <PEVImage
            image={images[activeStep]}
            className="product-details__header-gallery-image zoom-container__image"
            onClick={getImageZoomHandler(false)}
          />
        </div>
      </Fade>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        backButton={
          <PEVButton
            className="pev-flex"
            onClick={handleBack}
            a11y={productDetailsTranslations.prevImgBtn}
            disabled={activeStep === 0}
            size="small"
            variant="text"
          >
            <KeyboardArrowLeftIcon />
            {productDetailsTranslations.prevImgBtn}
          </PEVButton>
        }
        nextButton={
          <PEVButton
            className="pev-flex"
            onClick={handleNext}
            a11y={productDetailsTranslations.nextImgBtn}
            disabled={activeStep === maxSteps - 1}
            size="small"
            variant="text"
          >
            {productDetailsTranslations.nextImgBtn}
            <KeyboardArrowRightIcon />
          </PEVButton>
        }
      />
    </div>
  );
}

export default observer(function ProductDetails() {
  const { state: initialProductData, pathname } = useLocation();
  const recentPathName = useRef(pathname);
  const history = useHistory();
  const routesGuards = useRoutesGuards(storeService);
  const [mergedProductData, setMergedProductData] = useState(initialProductData);
  const { productDetailsNavSections, activatedNavMenuItemIndex } = useSectionsObserver();
  const { isMobileLayout } = useRWDLayout();

  useEffect(() => {
    if (mergedProductData && recentPathName.current === pathname) {
      getRelatedProducts(mergedProductData);
      return;
    }

    recentPathName.current = pathname;

    const productUrl = routeHelpers.extractProductUrlFromPathname(pathname);
    if (!productUrl) {
      throw Error(`Could not extract productUrl based on pathname: "${pathname}"!`);
    }

    httpService
      .disableGenericErrorHandler()
      .getProductByUrl(productUrl)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE === 'Products not found!') {
          history.replace(ROUTES.NOT_FOUND, { label: 'product', url: productUrl });
          return;
        }

        const product = res[0];
        setMergedProductData(product);
        return product;
      })
      .then((maybeProduct) => {
        if (maybeProduct && typeof maybeProduct === 'object') {
          getRelatedProducts(maybeProduct);
        }
      });
  }, [pathname]);

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

  const getRelatedProducts = (product) => {
    httpService
      .getProductsByNames(product.relatedProductsNames)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        setMergedProductData((product) => ({ ...product, relatedProducts: res }));
      })
      .catch((error) => console.warn('TODO: fix relatedProducts! /error:', error));
  };

  if (!mergedProductData) {
    return null;
  }

  const actionElements = /* eslint-disable react/jsx-key */ [
    routesGuards.isSeller()
      ? [
          <NavigateToModifyProduct productData={mergedProductData} />,
          <DeleteProductFeature productUrl={mergedProductData.url} />,
        ]
      : [],
    <ProductObservabilityToggler productId={mergedProductData._id} />,
    <ProductComparisonCandidatesToggler product={mergedProductData} />,
  ].flat(); /* eslint-enable react/jsx-key */

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
          detailValue={mergedProductData.category}
          extras={{
            className: 'product-details__header-category',
          }}
        />
        <List className="product-details__header-action-elements">
          {actionElements.map((element, index) => (
            <ListItem disableGutters key={index}>
              {element}
            </ListItem>
          ))}
        </List>

        <Gallery images={mergedProductData.images} />

        <div className="product-details__header-base-data-container">
          <PEVHeading level={2} className="product-details__header-name">
            <ProductSpecificDetail detailName="name" detailValue={mergedProductData.name} />
          </PEVHeading>
          {/* TODO: [UX] clicking on rating here should scroll to this product ratings */}
          <RatingWidget
            presetValue={mergedProductData.reviews.averageRating}
            reviewsAmount={mergedProductData.reviews.list.length}
            isBig
            externalClassName="product-details__header-rating"
          />

          <ProductSpecificDetail
            detailName="price"
            detailValue={mergedProductData.price}
            extras={{
              header: productDetailsTranslations.price,
              className: 'product-details__header-price',
            }}
          />
          <AddToCartButton
            productInfoForCart={{
              name: mergedProductData.name,
              price: mergedProductData.price,
              _id: mergedProductData._id,
            }}
            startOrEndIcon="startIcon"
            className="product-details__header-buy-btn"
          />
        </div>
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
                      <PEVLink to={{ hash: `#${navSection.id}`, state: mergedProductData }}>{navSection.label}</PEVLink>
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
        <ProductSpecificDetail detailName="shortDescription" detailValue={mergedProductData.shortDescription} />
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
        <ProductSpecificDetail detailName="technicalSpecs" detailValue={mergedProductData.technicalSpecs} />
      </section>

      <Divider />

      <section className="product-details__nav-section">
        <PEVHeading level={3} id={productDetailsNavSections.reviews.id} ref={productDetailsNavSections.reviews.ref}>
          {productDetailsNavSections.reviews.label}
        </PEVHeading>

        <ProductSpecificDetail
          detailName="reviews"
          detailValue={mergedProductData.reviews}
          extras={{
            isMobileLayout,
            showReviewsList: true,
            showAddReview: true,
            updateReviews: (reviews) =>
              setMergedProductData((prev) => ({
                ...prev,
                reviews,
              })),
            productUrl: mergedProductData.url,
            usersWhoMaybeAlreadyAddedReview: new Set(mergedProductData.reviews?.list?.map(({ author }) => author)),
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

        {mergedProductData.relatedProducts?.length && (
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
                    detailValue={mergedProductData.relatedProducts}
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
