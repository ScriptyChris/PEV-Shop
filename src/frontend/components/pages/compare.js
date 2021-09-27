import { toJS } from 'mobx';
import React, { useState, useRef, createRef, useEffect, useCallback } from 'react';
import appStore from '../../features/appStore';
import { getProductDetailsData, prepareSpecificProductDetail, getProductDetailsHeaders } from '../views/productDetails';
import Scroller from '../utils/scroller';
import { ProductItemLink } from '../views/productItem';

const translations = {
  productsAmount: 'produktów',
  lackOfData: 'No data!',
};

export default function Compare() {
  const tableRef = useRef(createRef());
  const [comparisonData, setComparisonData] = useState(null);

  const setTableStylingCSSVariables = () => {
    tableRef.current.style.setProperty('--compare-rows-number', comparisonData.productDetailsHeadersKeys.length);
    tableRef.current.style.setProperty('--compare-columns-number', comparisonData.comparableProductsData.length);
  };

  const getClassForNameHeader = useCallback(
    (index) => {
      return comparisonData.nameHeaderIndex === index ? 'compare-products--slider-control-row' : '';
    },
    [comparisonData]
  );

  const getProductsAmountText = useCallback(
    () => `${comparisonData.comparableProductsData.length} ${translations.productsAmount}`,
    [comparisonData]
  );

  const getTableHeadContent = (headRowRefGetter) =>
    function TableHeadContent(detailHeader, headerIndex) {
      return (
        <div
          className={`${getClassForNameHeader(headerIndex)}`}
          ref={headRowRefGetter}
          role="row"
          key={`header-row-${headerIndex}`}
        >
          <span className="compare-products__cell" role="cell">
            {headerIndex === 0 ? getProductsAmountText() : comparisonData.productDetailsHeaders[detailHeader]}
          </span>
        </div>
      );
    };

  const getTableBodyContent = (bodyRowRefGetter) =>
    function TableBodyContent(detailHeader, headerIndex) {
      return (
        <div
          className={`compare-products__row ${getClassForNameHeader(headerIndex)}`}
          ref={bodyRowRefGetter}
          role="row"
          key={`body-row-${headerIndex}`}
        >
          {comparisonData.comparableProductsData.map((productData, dataIndex) => (
            <div className="compare-products__cell" role="cell" key={`cell-${dataIndex}`}>
              {prepareSpecificProductDetail(detailHeader, productData[detailHeader])}

              {detailHeader === 'name' && (
                <ProductItemLink
                  productData={toJS(appStore.productComparisonState[dataIndex], { recurseEverything: true })}
                />
              )}
            </div>
          ))}
        </div>
      );
    };

  useEffect(() => {
    (async () => {
      setComparisonData(await prepareComparisonData(getProductDetailsHeaders()));
    })();
  }, []);

  useEffect(() => {
    if (comparisonData) {
      setTableStylingCSSVariables();
    }
  }, [comparisonData]);

  return (
    <section className="compare-products">
      {comparisonData ? (
        <div ref={tableRef} className="compare-products__table" role="table">
          <Scroller
            scrollerBaseValueMeta={{
              selector: '.compare-products-candidates, .compare-products',
              varName: '--product-list-item-width',
            }}
            render={({ elementRef, multipleRefsGetter }) => {
              const { createRefGetter, REF_TYPE } = multipleRefsGetter;
              const [headRowRefGetter, bodyRowRefGetter] = [
                createRefGetter(REF_TYPE.HEAD),
                createRefGetter(REF_TYPE.BODY),
              ];

              return (
                <>
                  <div className="compare-products__head" role="rowgroup">
                    {comparisonData.productDetailsHeadersKeys.map(getTableHeadContent(headRowRefGetter))}
                  </div>

                  <div>
                    <div className="compare-products__body" ref={elementRef} role="rowgroup">
                      {comparisonData.productDetailsHeadersKeys.map(getTableBodyContent(bodyRowRefGetter))}
                    </div>
                  </div>
                </>
              );
            }}
          />
        </div>
      ) : (
        translations.lackOfData
      )}
    </section>
  );

  async function prepareComparisonData(productDetailsHeaders) {
    let productDetailsHeadersKeys = Object.keys(productDetailsHeaders).filter(
      (header) => header !== 'relatedProductsNames'
    );
    let nameHeaderIndex = productDetailsHeadersKeys.findIndex((headerName) => headerName.toLowerCase() === 'name');
    const comparableProductsData = await Promise.all(
      appStore.productComparisonState.map((product) => getProductDetailsData(product))
    );

    const [nameHeader] = productDetailsHeadersKeys.splice(nameHeaderIndex, 1);
    productDetailsHeadersKeys.unshift(nameHeader);
    nameHeaderIndex = 0;

    return { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys, comparableProductsData };
  }
}
