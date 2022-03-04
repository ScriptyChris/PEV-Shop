import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import storeService from '@frontend/features/storeService';
import { ROUTES } from '@frontend/components/pages/_routes';
import CompareProduct from './compareProducts';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  productName: 'Name',
  descriptiveProductName: 'product name',
  productImage: 'Image of ',
  productUrl: 'URL',
  price: 'Price',
  actionsBarTogglerLabel: 'toggle actions bar',
  descriptiveProductPrice: 'product price',
  detailsBtn: 'Check details!',
  addToCart: 'Add to cart!',
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
  const isMobileLayout = useMobileLayout();
  const [actionsBarBtnsVisible, setActionsBarBtnsVisible] = useState(false);
  const { name, price, _id } = product;

  const handleClickToggleActionsBarBtns = () => {
    setActionsBarBtnsVisible(!actionsBarBtnsVisible);

    // simple one-time "off-click" for any app's element
    document.addEventListener('click', () => setActionsBarBtnsVisible(false), { once: true });
  };

  const handleHoverToggleActionsBar = (shouldShow) => {
    return () => {
      if (!isMobileLayout) {
        setActionsBarBtnsVisible(shouldShow);
      }
    };
  };

  const handleAddToCartClick = () => {
    storeService.updateUserCartState({ name, price, _id } /* TODO: [TS] `as IUserCart['products']` */);
  };

  return (
    <div
      onMouseEnter={handleHoverToggleActionsBar(true)}
      onMouseLeave={handleHoverToggleActionsBar(false)}
      className="product-item"
      data-cy="container:product-item"
    >
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

      <div className="product-item__actions-bar">
        {actionsBarBtnsVisible && (
          <div className="product-item__actions-bar-buttons">
            <button onClick={handleAddToCartClick} data-cy="button:add-product-to-cart">
              {translations.addToCart}
            </button>

            <CompareProduct.Toggler product={product} />
          </div>
        )}

        {isMobileLayout && (
          <button
            onClick={handleClickToggleActionsBarBtns}
            className="product-item__actions-bar-toggler"
            title={translations.actionsBarTogglerLabel}
            aria-label={translations.actionsBarTogglerLabel}
          >
            {/* TODO: [UI] put an icon here */}
            [...]
          </button>
        )}
      </div>
    </div>
  );
}
