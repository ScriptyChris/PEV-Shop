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
  }, []);

  return (
    <section className="compare-products">
      <Scroller
        forwardProps={{ productDetailsHeadersKeys, tableRef }}
        render={(elementRef, { tableRef }) => {
          // console.warn('[render] elementRef:', elementRef, ' /curr:', elementRef.current);

          return (
            <table ref={tableRef} className="compare-products__table scrollable-parent">
              <thead>
                {productDetailsHeadersKeys.map((detailHeader, index) => (
                  <tr key={`header-row-${index}`}>
                    <th>{productDetailsHeaders[detailHeader]}</th>
                  </tr>
                ))}
              </thead>
              <tbody ref={elementRef}>
                {productDetailsHeadersKeys.map((detailHeader, index) => (
                  <tr key={`body-row-${index}`}>
                    {comparableProductsData.map((productData, i) => (
                      <td key={`cell-${i}`}>{prepareSpecificProductDetail(detailHeader, productData[detailHeader])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }}
      />
    </section>
  );
}
