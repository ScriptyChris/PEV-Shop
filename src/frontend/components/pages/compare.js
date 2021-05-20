import React, { useState, createRef, useEffect } from 'react';
import appStore from '../../features/appStore';
import { getProductDetailsData, prepareSpecificProductDetail, getProductDetailsHeaders } from '../views/productDetails';
import Scroller from '../utils/scroller';

export default function Compare() {
  const [tableRef] = useState(createRef);
  const productDetailsHeaders = getProductDetailsHeaders();
  const productDetailsHeadersKeys = Object.keys(productDetailsHeaders).filter((header) => header !== 'relatedProducts');
  const comparableProductsData = appStore.productComparisonState.map((product) => getProductDetailsData(product));

  useEffect(() => {
    tableRef.current.style.setProperty('--compare-rows-number', productDetailsHeadersKeys.length);
    tableRef.current.style.setProperty('--compare-columns-number', Object.keys(comparableProductsData).length);
  }, []);

  return (
    <section className="compare-products">
      <div ref={tableRef} className="compare-products__table">
        <Scroller
          forwardProps={{ productDetailsHeadersKeys }}
          render={({ elementRef, resizedObservedHeadRef, resizedObservedBodyRef }) => {
            // console.warn('[render] elementRef:', elementRef, ' /curr:', elementRef.current);

            return (
              <>
                <div className="compare-products__head">
                  {productDetailsHeadersKeys.map((detailHeader, index) => (
                    <div className="compare-products__cell" ref={resizedObservedHeadRef} key={`header-row-${index}`}>
                      {productDetailsHeaders[detailHeader]}
                    </div>
                  ))}
                </div>

                <div className="scrollable-parent">
                  <div className="compare-products__body" ref={elementRef}>
                    {productDetailsHeadersKeys.map((detailHeader, headerIndex) => (
                      <div
                        className="compare-products__row"
                        ref={resizedObservedBodyRef}
                        key={`body-row-${headerIndex}`}
                      >
                        {comparableProductsData.map((productData, dataIndex) => (
                          <div className="compare-products__cell" key={`cell-${dataIndex}`}>
                            {prepareSpecificProductDetail(detailHeader, productData[detailHeader])}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          }}
        />
      </div>
    </section>
  );
}
