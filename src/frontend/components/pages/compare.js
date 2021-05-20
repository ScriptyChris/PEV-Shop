import React, { useRef, createRef, useEffect, useCallback } from 'react';
import appStore from '../../features/appStore';
import { getProductDetailsData, prepareSpecificProductDetail, getProductDetailsHeaders } from '../views/productDetails';
import Scroller from '../utils/scroller';

const translations = {
  productsAmount: 'produktów',
};

export default function Compare() {
  const tableRef = useRef(createRef());
  const {
    nameHeaderIndex,
    productDetailsHeaders,
    productDetailsHeadersKeys,
    comparableProductsData,
  } = prepareComparisonData(getProductDetailsHeaders());

  const setTableStylingCSSVariables = () => {
    tableRef.current.style.setProperty('--compare-rows-number', productDetailsHeadersKeys.length);
    tableRef.current.style.setProperty('--compare-columns-number', comparableProductsData.length);
  };

  const getClassForNameHeader = useCallback((index) => {
    return nameHeaderIndex === index ? 'compare-products--slider-control-row' : '';
  }, []);

  const getProductsAmountText = useCallback(
    () => `${comparableProductsData.length} ${translations.productsAmount}`,
    []
  );

  useEffect(() => {
    setTableStylingCSSVariables();
  }, []);

  return (
    <section className="compare-products">
      <div ref={tableRef} className="compare-products__table" role="table">
        <Scroller
          forwardProps={{ productDetailsHeadersKeys }}
          render={({ elementRef, resizedObservedHeadRef, resizedObservedBodyRef }) => (
            <>
              <div className="compare-products__head" role="rowgroup">
                {productDetailsHeadersKeys.map((detailHeader, headerIndex) => (
                  <div
                    className={`${getClassForNameHeader(headerIndex)}`}
                    ref={resizedObservedHeadRef}
                    role="row"
                    key={`header-row-${headerIndex}`}
                  >
                    <span className="compare-products__cell" role="cell">
                      {headerIndex === 0 ? getProductsAmountText() : productDetailsHeaders[detailHeader]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="scrollable-parent">
                <div className="compare-products__body" ref={elementRef} role="rowgroup">
                  {productDetailsHeadersKeys.map((detailHeader, headerIndex) => (
                    <div
                      className={`compare-products__row ${getClassForNameHeader(headerIndex)}`}
                      ref={resizedObservedBodyRef}
                      role="row"
                      key={`body-row-${headerIndex}`}
                    >
                      {comparableProductsData.map((productData, dataIndex) => (
                        <div className="compare-products__cell" role="cell" key={`cell-${dataIndex}`}>
                          {prepareSpecificProductDetail(detailHeader, productData[detailHeader])}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        />
      </div>
    </section>
  );

  function prepareComparisonData(productDetailsHeaders) {
    let productDetailsHeadersKeys = Object.keys(productDetailsHeaders).filter((header) => header !== 'relatedProducts');
    let nameHeaderIndex = productDetailsHeadersKeys.findIndex((headerName) => headerName.toLowerCase() === 'name');
    const comparableProductsData = appStore.productComparisonState.map((product) => getProductDetailsData(product));

    const [nameHeader] = productDetailsHeadersKeys.splice(nameHeaderIndex, 1);
    productDetailsHeadersKeys.unshift(nameHeader);
    nameHeaderIndex = 0;

    return { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys, comparableProductsData };
  }
}
