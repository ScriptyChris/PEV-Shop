import '@frontend/assets/styles/views/productCard.scss';

import React, { useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { PEVIconButton, PEVLink, PEVImage } from '@frontend/components/utils/pevElements';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import { AddToCartButton } from '@frontend/components/views/cart';
import { ProductObservabilityToggler } from '@frontend/components/views/productObservability';
import { ProductComparisonCandidatesToggler } from './productComparisonCandidates';
import { DeleteProductFeature, NavigateToModifyProduct } from '@frontend/components/shared';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import RatingWidget from '@frontend/components/utils/ratingWidget';
import Price from '@frontend/components/views/price';

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

  /* eslint-disable react/jsx-key */
  const menuItems = [
    routesGuards.isSeller()
      ? [<NavigateToModifyProduct productData={product} />, <DeleteProductFeature productUrl={url} />]
      : [],
    routesGuards.isGuest() || routesGuards.isClient() ? (
      <AddToCartButton productInfoForCart={{ name, price, availability, _id }} isSmallIcon flattenUnavailableInfo />
    ) : (
      []
    ),
    <ProductComparisonCandidatesToggler product={product} />,
    <ProductObservabilityToggler productId={_id} />,
  ].flat();
  /* eslint-enable react/jsx-key */

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
      reviewsAmount={product.reviews.list.length}
      asSingleIcon
    />
  );

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
            {menuItems.map((item, index) => (
              <MenuItem
                button={false}
                disableGutters
                className="product-card__actions-bar-item"
                key={`menu-item-${index}`}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Paper>
  );
});
