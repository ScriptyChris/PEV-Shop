import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import { PEVIconButton } from '@frontend/components/utils/pevElements';
import { ROUTES, useRoutesGuards } from '@frontend/components/pages/_routes';
import storeService from '@frontend/features/storeService';
import { AddToCartButton } from '@frontend/components/views/cart';
import { ProductObservabilityToggler } from '@frontend/components/views/productObservability';
import { ProductComparisonCandidatesToggler } from './productComparisonCandidates';
import { DeleteProductFeature, NavigateToModifyProduct } from '@frontend/components/shared';

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

function ProductCardBasicDesc({ isCompact, compactLabel, dataCy, label, value }) {
  return (
    <div>
      {isCompact ? (
        /* TODO: [a11y] presumably use `aria-description` instead, which is only supported from React v18 */
        <span aria-label={compactLabel} data-cy={dataCy}>
          {value}
        </span>
      ) : (
        <>
          <dt>{label}:</dt>
          <dd data-cy={dataCy}>{value}</dd>
        </>
      )}
    </div>
  );
}

export function ProductCardLink({
  productData,
  children,
  /* TODO: [UX] consider if it's needed */ isTextVisible = false,
  ...restProps
}) {
  // TODO: maybe state should be just index or prop name of the element and target component should get it from store?

  return (
    <Link
      {...restProps}
      to={{
        pathname: `${ROUTES.PRODUCTS}/${productData.url}`,
        state: productData,
      }}
      data-cy="link:product-card__link"
    >
      {children || (isTextVisible && translations.detailsBtn)}
    </Link>
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
  entryNo,
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
  const { name, price, _id } = product;
  const elevation = layoutType === PRODUCT_CARD_LAYOUT_TYPES.COMPACT ? 0 : 1;

  const handleClickToggleActionsBarBtns = (shouldShow) => {
    return ({ currentTarget }) => setMenuBtnRef(shouldShow ? currentTarget : null);
  };

  /* eslint-disable react/jsx-key */
  const menuItems = [
    routesGuards.isSeller()
      ? [<NavigateToModifyProduct productData={product} />, <DeleteProductFeature productName={name} />]
      : [],
    routesGuards.isGuest() || routesGuards.isClient() ? (
      <AddToCartButton productInfoForCart={{ name, price, _id }} />
    ) : (
      []
    ),
    <ProductComparisonCandidatesToggler product={product} />,
    <ProductObservabilityToggler productId={_id} />,
  ].flat();
  /* eslint-enable react/jsx-key */

  return (
    <Paper
      component={RenderedComponent || 'div'}
      className={classNames('product-card', `product-card--${productCardLayoutTypesClassModifiers[layoutType]}`)}
      data-cy={`container:product-card_${dataCySuffix}`}
      elevation={elevation}
    >
      <ProductCardLink className="product-card__link" productData={product}>
        <div className="product-card__image">TODO: [UI] image should go here</div>
        {/* TODO: [UI] <img src={image} alt={`${translations.productImage}${name}`} className="product-card__image" />*/}
      </ProductCardLink>
      <div className="product-card__content">
        <dl className="product-card__metadata">
          <ProductCardLink productData={product}>
            <ProductCardBasicDesc
              isCompact={hasCompactBasicDesc}
              compactLabel={translations.descriptiveProductName}
              dataCy="label:product-card__name"
              label={translations.productName}
              value={name}
            />
          </ProductCardLink>

          <ProductCardBasicDesc
            isCompact={hasCompactBasicDesc}
            compactLabel={translations.descriptiveProductPrice}
            dataCy="label:product-price"
            label={translations.price}
            value={price}
          />
        </dl>
      </div>
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
          className: 'product-card__actions-bar',
          'data-cy': 'container:product-card__actions-bar',
        }}
        data-cy="popup:product-card__actions-bar"
      >
        {menuItems.flatMap((item, index) => {
          const result = [
            <MenuItem button={false} className="product-card__actions-bar-item" key={`menu-item-${index}`}>
              {item}
            </MenuItem>,
          ];

          if (index < menuItems.length - 1) {
            const MenuItemDivider = (
              <MenuItem
                button={false}
                disableGutters={true}
                className="product-card__actions-bar-item"
                key={`menu-divider-${index}`}
              >
                <Divider orientation="vertical" flexItem />
              </MenuItem>
            );
            result.push(MenuItemDivider);
          }

          return result;
        })}

        {/* TODO: [UX] add (un)observing product */}
      </Menu>
    </Paper>
  );
});
