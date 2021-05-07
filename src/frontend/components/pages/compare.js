import React from 'react';
import appStore from '../../features/appStore';
import { getProductDetailsData, prepareSpecificProductDetail, getProductDetailsHeaders } from '../views/productDetails';
// import Scroller from '../utils/scroller';

export default function Compare() {
  const productDetailsHeaders = getProductDetailsHeaders();
  const productDetailsHeadersKeys = Object.keys(productDetailsHeaders).filter((header) => header !== 'relatedProducts');
  const comparableProductsData = appStore.productComparisonState.map((product) => getProductDetailsData(product));

  return (
    <section className="compare-products">
      {/*<Scroller*/}
      {/*  render={(listRef) => (*/}
      {/*    <>*/}
      <table>
        <thead>
          {productDetailsHeadersKeys.map((detailHeader, index) => (
            <tr key={`header-row-${index}`}>
              <th>{productDetailsHeaders[detailHeader]}</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {productDetailsHeadersKeys.map((detailHeader, index) => (
            <tr key={`body-row-${index}`}>
              {comparableProductsData.map((productData, i) => (
                <td key={`cell-${i}`}>{prepareSpecificProductDetail(detailHeader, productData[detailHeader])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
