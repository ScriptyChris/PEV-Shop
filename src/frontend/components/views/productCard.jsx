import '@frontend/assets/styles/views/productCard.scss';

import React, { useState, lazy } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

const AddToCartButton = lazy(() =>
  import('@frontend/components/views/cart').then((CartModule) => ({ default: CartModule.AddToCartButton }))
);
const ProductObservabilityToggler = lazy(() =>
  import('@frontend/components/views/productObservability').then((ProductObservabilityModule) => ({
    default: ProductObservabilityModule.ProductObservabilityToggler,
  }))
);
const ProductComparisonCandidatesToggler = lazy(() =>
  import('./productComparisonCandidates').then((ProductComparisonCandidatesModule) => ({
    default: ProductComparisonCandidatesModule.ProductComparisonCandidatesToggler,
  }))
);
const DeleteProductFeature = lazy(() =>
  import('@frontend/components/shared').then((Shared) => ({ default: Shared.DeleteProductFeature }))
);
const NavigateToModifyProduct = lazy(() =>
  import('@frontend/components/shared').then((Shared) => ({ default: Shared.NavigateToModifyProduct }))
);

import Paper from '@material-ui/core/Paper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { PEVIconButton, PEVLink, PEVImage, PEVSuspense } from '@frontend/components/utils/pevElements';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import RatingWidget from '@frontend/components/utils/ratingWidget';
import Price from '@frontend/components/views/price';
import { PEVLoadingAnimation } from '../utils/pevElements';

const translations = {
  productName: 'Name',
  descriptiveProductName: 'product name',
  productImage: 'Image of ',
  productUrl: 'URL',
  price: 'Price',
  actionsBarTogglerLabel: 'toggle actions bar',
  descriptiveProductPrice: 'product price',
  detailsBtn: 'Check details!',
  editProduct: 'Edit',
  deleteProduct: 'Delete',
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  promptProductDeletion: 'Are you sure you want to delete this product?',
  confirmProductDeletion: 'Yes',
  abortProductDeletion: 'No',
  productDeletionSuccess: 'Product successfully deleted!',
  productDeletionFailed: 'Deleting product failed :(',
};

function ProductCardBasicDesc({ isCompactDescription, compactLabel, compactClassName, dataCy, label, value }) {
  return isCompactDescription ? (
    /* TODO: [a11y] presumably use `aria-description` instead, which is only supported from React v18 */
    <span className={compactClassName} aria-label={compactLabel} data-cy={dataCy}>
      {value}
    </span>
  ) : (
    <dl className="product-card__metadata">
      <dt>{label}:</dt>
      <dd data-cy={dataCy}>{value}</dd>
    </dl>
  );
}

export function ProductCardLink({
  children,
  productData,
  avoidPassingState = false,
  /* TODO: [UX] consider if it's needed */ isTextVisible = false,
  ...restProps
}) {
  // TODO: maybe state should be just index or prop name of the element and target component should get it from store?

  return (
    <PEVLink
      {...restProps}
      to={{
        pathname: `${ROUTES.PRODUCTS}/${productData.url}`,
        state: avoidPassingState ? null : productData,
      }}
      data-cy="link:product-card__link"
    >
      {children || (isTextVisible && translations.detailsBtn)}
    </PEVLink>
  );
}

export const PRODUCT_CARD_LAYOUT_TYPES = Object.freeze({
  DETAILED: 'DETAILED',
  COMPACT: 'COMPACT',
});

const productCardLayoutTypesClassModifiers = {
  DETAILED: 'detailed-layout',
  COMPACT: 'compact-layout',
};

export default observer(function ProductCard({
  product,
  RenderedComponent,
  layoutType = PRODUCT_CARD_LAYOUT_TYPES.DETAILED,
  hasCompactBasicDesc = true,
  isCompact = false,
  entryNo,
  lazyLoadImages,
  hideReviewsAmount = false,
}) {
  if (!PRODUCT_CARD_LAYOUT_TYPES[layoutType]) {
    throw TypeError(`layoutType prop '${layoutType}' doesn't match PRODUCT_CARD_LAYOUT_TYPES!`);
  }

  if (entryNo !== undefined && entryNo !== null && typeof entryNo !== 'number') {
    throw TypeError(`entryNo prop - if provided - has to be a number! Receieved "${entryNo}".`);
  }

  const routesGuards = useRoutesGuards(storeService);
  const dataCySuffix = Number.isNaN(entryNo) ? 'unique' : entryNo;
  const [menuBtnRef, setMenuBtnRef] = useState(null);
  const { isMobileLayout } = useRWDLayout();
  const { name, price, _id, url, images, availability } = product;

  const handleClickToggleActionsBarBtns = (shouldShow) => {
    return ({ currentTarget }) => setMenuBtnRef(shouldShow ? currentTarget : null);
  };

  const menuItemsComponents = [];
  if (routesGuards.isSeller()) {
    menuItemsComponents.push(
      <NavigateToModifyProduct productData={product} />,
      <DeleteProductFeature productUrl={url} />
    );
  }
  if (routesGuards.isGuest() || routesGuards.isClient()) {
    menuItemsComponents.push(
      <AddToCartButton productInfoForCart={{ name, price, availability, _id }} isSmallIcon flattenUnavailableInfo />
    );
  }
  menuItemsComponents.push(
    <ProductComparisonCandidatesToggler product={product} />,
    <ProductObservabilityToggler productId={_id} />
  );

  const [areLazyComponentsLoading, setAreLazyComponentsLoading] = useState(
    // Lazy loaded components have their `type._status` prop set to 1 when they get loaded.
    // https://github.com/facebook/react/blob/v16.13.1/packages/react/src/ReactLazy.js#L12-L19
    // https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactLazyComponent.js#L33
    () => menuItemsComponents.some(({ type: { _status } }) => _status < 1)
  );

  const imageSize = isCompact ? 64 : 100;
  const imageElement = (
    <PEVImage
      image={images[0]}
      className={classNames('product-card__image', { 'product-card__image--is-compact': isCompact })}
      {...{ width: imageSize, height: imageSize }}
      loading={lazyLoadImages ? 'lazy' : 'eager'}
    />
  );

  const nameElement = (
    <ProductCardBasicDesc
      isCompactDescription={hasCompactBasicDesc}
      compactLabel={translations.descriptiveProductName}
      compactClassName="product-card__name"
      dataCy="label:product-card__name"
      label={translations.productName}
      value={name}
    />
  );

  const priceElement = (
    <ProductCardBasicDesc
      isCompactDescription={hasCompactBasicDesc}
      compactClassName="product-card__price"
      compactLabel={translations.descriptiveProductPrice}
      dataCy="label:product-price"
      label={translations.price}
      value={<Price valueInUSD={price}>{({ currencyAndPrice }) => currencyAndPrice}</Price>}
    />
  );

  const reviewsRateElement = product.reviews && (
    <RatingWidget
      externalClassName="product-card__compact-rating-widget"
      presetValue={product.reviews.averageRating}
      reviewsAmount={hideReviewsAmount ? undefined : product.reviews.list.length}
      asSingleIcon
    />
  );

  const getMenuItems = () =>
    menuItemsComponents.map((item, index) => (
      <MenuItem button={false} disableGutters className="product-card__actions-bar-item" key={`menu-item-${index}`}>
        {item}
      </MenuItem>
    ));

  return (
    <Paper
      component={RenderedComponent || 'div'}
      className={classNames('product-card', `product-card--${productCardLayoutTypesClassModifiers[layoutType]}`, {
        'product-card--is-compact': isCompact,
      })}
      data-cy={`container:product-card_${dataCySuffix}`}
      {...(isCompact ? { disableGutters: true } : {})}
    >
      {isCompact ? (
        <ProductCardLink className="product-card__link" productData={product} avoidPassingState>
          {imageElement}

          <p className="product-card__content product-card__content--is-compact pev-flex">
            {nameElement}
            {priceElement}
          </p>
        </ProductCardLink>
      ) : (
        <>
          <ProductCardLink className="product-card__link" productData={product}>
            {imageElement}

            <div
              className={classNames('product-card__content', {
                'product-card__content--with-reviews': reviewsRateElement,
              })}
            >
              {nameElement}
              {reviewsRateElement}
              {priceElement}
            </div>
          </ProductCardLink>

          {/* Cover menu toggler button with animation while menu items are lazy loaded. */}
          {areLazyComponentsLoading ? (
            <>
              <PEVLoadingAnimation className="product-card__action-bar-loader" />
              <PEVSuspense
                _componentName="ProductCard__Menu-Items"
                emptyLoader
                onUnmountedLoader={() => setAreLazyComponentsLoading(false)}
              >
                <ul>{getMenuItems()}</ul>
              </PEVSuspense>
            </>
          ) : (
            <>
              <PEVIconButton
                onClick={handleClickToggleActionsBarBtns(true)}
                a11y={translations.actionsBarTogglerLabel}
                className="product-card__actions-bar-toggler"
                data-cy="button:toggle-action-bar"
              >
                <MoreVertIcon />
              </PEVIconButton>
              <Menu
                anchorEl={menuBtnRef}
                open={!!menuBtnRef}
                onClose={handleClickToggleActionsBarBtns(false)}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
                MenuListProps={{
                  className: classNames('product-card__actions-bar pev-flex', { 'pev-flex--columned': isMobileLayout }),
                  'data-cy': 'container:product-card__actions-bar',
                }}
                data-cy="popup:product-card__actions-bar"
              >
                {getMenuItems()}
              </Menu>
            </>
          )}
        </>
      )}
    </Paper>
  );
});
