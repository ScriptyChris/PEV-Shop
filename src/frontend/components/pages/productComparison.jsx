import { toJS } from 'mobx';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import storeService from '@frontend/features/storeService';
import {
  getProductDetailsData,
  prepareSpecificProductDetail,
  getProductDetailsHeaders,
} from '@frontend/components/views/productDetails';
import Scroller from '@frontend/components/utils/scroller';
import { ProductItemLink } from '@frontend/components/views/productItem';

const translations = {
  productsAmountLabelPrefix: 'Comparing',
  productsAmountLabelSuffix: 'products',
  lackOfData: 'No data!',
};

export default function Compare() {
  const tableRef = useRef();
  const scrollerBtnsParentRef = useRef();
  const [comparisonData, setComparisonData] = useState(null);

  const setTableStylingCSSVariables = () => {
    tableRef.current.style.setProperty('--compare-rows-number', comparisonData.productDetailsHeadersKeys.length);
    tableRef.current.style.setProperty('--compare-columns-number', comparisonData.comparableProductsData.length);
  };

  const getClassForNameHeader = useCallback(
    (index) => {
      return comparisonData.nameHeaderIndex === index ? 'product-comparison--slider-control-row' : '';
    },
    [comparisonData]
  );

  const getTableHeadContent = (headRowRefGetter) =>
    function TableHeadContent(detailHeader, headerIndex) {
      return (
        <TableRow
          className={getClassForNameHeader(headerIndex)}
          ref={headRowRefGetter}
          component="div"
          role="row"
          key={`header-row-${headerIndex}`}
        >
          <TableCell className="product-comparison__cell" component={'p'} role="cell">
            {comparisonData.productDetailsHeaders[detailHeader]}
          </TableCell>
        </TableRow>
      );
    };

  const getTableBodyContent = (bodyRowRefGetter) =>
    function TableBodyContent(detailHeader, headerIndex) {
      return (
        <TableRow
          className={`product-comparison__row ${getClassForNameHeader(headerIndex)}`}
          ref={bodyRowRefGetter}
          component="div"
          role="row"
          aria-labelledby={headerIndex === 0 ? 'comparedProductsListCounter' : null}
          key={`body-row-${headerIndex}`}
        >
          {comparisonData.comparableProductsData.map((productData, dataIndex) => {
            const preparedProductDetail = prepareSpecificProductDetail(detailHeader, productData[detailHeader]);

            return (
              <TableCell className="product-comparison__cell" component="div" role="cell" key={`cell-${dataIndex}`}>
                {detailHeader === 'name' ? (
                  <ProductItemLink
                    productData={toJS(storeService.productComparisonState[dataIndex], { recurseEverything: true })}
                  >
                    {preparedProductDetail}
                  </ProductItemLink>
                ) : (
                  preparedProductDetail
                )}
              </TableCell>
            );
          })}
        </TableRow>
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

  return comparisonData ? (
    <Paper className="product-comparison-container" component="section" elevation={0}>
      <header ref={scrollerBtnsParentRef} className="product-comparison__header">
        <Typography variant="h3" component="h3">
          {translations.productsAmountLabelPrefix}{' '}
          <output id="comparedProductsListCounter">{comparisonData.comparableProductsData.length}</output>{' '}
          {translations.productsAmountLabelSuffix}
        </Typography>
      </header>

      <TableContainer component={Paper} className="product-comparison">
        <Table ref={tableRef} component="div" className="product-comparison__table" role="table">
          <Scroller
            scrollerBaseValueMeta={{
              selector: '.product-comparison-candidates, .product-comparison',
              varName: '--product-list-item-width',
            }}
            btnsParentRef={scrollerBtnsParentRef}
            render={({ elementRef, multipleRefsGetter }) => {
              const { createRefGetter, REF_TYPE } = multipleRefsGetter;
              const [headRowRefGetter, bodyRowRefGetter] = [
                createRefGetter(REF_TYPE.HEAD),
                createRefGetter(REF_TYPE.BODY),
              ];

              return (
                <>
                  <TableHead component="div" className="product-comparison__head" role="rowgroup">
                    {comparisonData.productDetailsHeadersKeys.map(getTableHeadContent(headRowRefGetter))}
                  </TableHead>

                  <div /* this `div` is hooked with a `ref` by Scroller component */>
                    <TableBody component="div" className="product-comparison__body" ref={elementRef} role="rowgroup">
                      {comparisonData.productDetailsHeadersKeys.map(getTableBodyContent(bodyRowRefGetter))}
                    </TableBody>
                  </div>
                </>
              );
            }}
          />
        </Table>
      </TableContainer>
    </Paper>
  ) : (
    translations.lackOfData
  );

  async function prepareComparisonData(productDetailsHeaders) {
    let productDetailsHeadersKeys = Object.keys(productDetailsHeaders).filter(
      (header) => header !== 'relatedProductsNames'
    );
    let nameHeaderIndex = productDetailsHeadersKeys.findIndex((headerName) => headerName.toLowerCase() === 'name');
    const comparableProductsData = await Promise.all(
      storeService.productComparisonState.map((product) => getProductDetailsData(product))
    );

    const [nameHeader] = productDetailsHeadersKeys.splice(nameHeaderIndex, 1);
    productDetailsHeadersKeys.unshift(nameHeader);
    nameHeaderIndex = 0;

    return { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys, comparableProductsData };
  }
}
