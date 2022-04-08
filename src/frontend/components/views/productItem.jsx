import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import { ROUTES } from '@frontend/components/pages/_routes';
import { AddToCartButton } from '@frontend/components/views/cart';
import { ProductComparisonCandidatesToggler } from './productComparisonCandidates';

const translations = {
  productName: 'Name',
  descriptiveProductName: 'product name',
  productImage: 'Image of ',
  productUrl: 'URL',
  price: 'Price',
  actionsBarTogglerLabel: 'toggle actions bar',
  descriptiveProductPrice: 'product price',
  detailsBtn: 'Check details!',
};

function ProductItemBasicDesc({ isCompact, compactLabel, dataCy, label, value }) {
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

export function ProductItemLink({
  productData,
  children,
  /* TODO: [UX] consider if it's needed */ isTextVisible = false,
}) {
  // TODO: maybe state should be just index or prop name of the element and target component should get it from store?

  return (
    <Link
      to={{
        pathname: `${ROUTES.PRODUCT}/${productData.url}`,
        state: productData,
      }}
    >
      {children || (isTextVisible && translations.detailsBtn)}
    </Link>
  );
}

export default function ProductItem({ product, hasCompactBasicDesc = true }) {
  const [menuBtnRef, setMenuBtnRef] = useState(null);
  const { name, price, _id } = product;

  const handleClickToggleActionsBarBtns = (shouldShow) => {
    return ({ currentTarget }) => setMenuBtnRef(shouldShow ? currentTarget : null);
  };

  return (
    <Card className="product-item" data-cy="container:product-item">
      <CardHeader
        className="product-item__actions-bar"
        action={
          <IconButton
            onClick={handleClickToggleActionsBarBtns(true)}
            aria-label={translations.actionsBarTogglerLabel}
            title={translations.actionsBarTogglerLabel}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />

      <CardContent>
        <ProductItemLink productData={product}>
          <div className="product-item__image">TODO: [UI] image should go here</div>
          {/*<img src={image} alt={`${translations.productImage}${name}`} className="product-item__image" />*/}
        </ProductItemLink>

        <dl className="product-item__metadata">
          <ProductItemLink productData={product}>
            <ProductItemBasicDesc
              isCompact={hasCompactBasicDesc}
              compactLabel={translations.descriptiveProductName}
              dataCy="label:product-name"
              label={translations.productName}
              value={name}
            />
          </ProductItemLink>

          <ProductItemBasicDesc
            isCompact={hasCompactBasicDesc}
            compactLabel={translations.descriptiveProductPrice}
            dataCy="label:product-price"
            label={translations.price}
            value={price}
          />
        </dl>
      </CardContent>
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
      >
        <MenuItem button={false} className="product-item__actions-bar-button-item">
          <AddToCartButton productInfoForCart={{ name, price, _id }} />
          <Divider orientation="vertical" flexItem />
          <ProductComparisonCandidatesToggler product={product} />
        </MenuItem>
      </Menu>
    </Card>
  );
}
