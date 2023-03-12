import '@frontend/assets/styles/views/productComparison.scss';

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { PEVHeading, PEVImage, PEVLoadingAnimation } from '@frontend/components/utils/pevElements';
import storeService from '@frontend/features/storeService';
import { ProductSpecificDetail, getProductDetailsHeaders } from '@frontend/components/views/productDetails';
import Scroller from '@frontend/components/utils/scroller';
import { ProductCardLink } from '@frontend/components/views/productCard';
import httpService from '@frontend/features/httpService';
import { routeHelpers } from './_routes';

const translations = {
  productsAmountLabelPrefix: 'Comparing',
  productsAmountLabelSuffix: 'products',
  noProductsToCompare: 'No products selected to compare!',
};

function usePrepareComparisonData() {
  const [comparableProductsData, setComparableProductsData] = useState(() => {
    const productsData = storeService.productComparisonState.map(({ _id, relatedProducts, ...product }) => product);
    return productsData.length ? productsData : null;
  });
  const { search } = useLocation();
  const { productsNames } = useMemo(() => routeHelpers.parseSearchParams(search), [search]);

  useEffect(() => {
    if (comparableProductsData?.length || !productsNames?.length) {
      return;
    }

    let _isComponentMounted = true;

    setComparableProductsData([]);
    httpService.getProductsByNames(productsNames).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED || !_isComponentMounted) {
        return;
      }

      setComparableProductsData(res.length ? res : null);
    });

    return () => (_isComponentMounted = false);
  }, []);

  const { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys } = useMemo(() => {
    const productDetailsHeaders = getProductDetailsHeaders(['relatedProducts']);
    const productDetailsHeadersKeys = Object.keys(productDetailsHeaders);

    let nameHeaderIndex = productDetailsHeadersKeys.findIndex((headerName) => headerName.toLowerCase() === 'name');
    const [nameHeader] = productDetailsHeadersKeys.splice(nameHeaderIndex, 1);
    productDetailsHeadersKeys.unshift(nameHeader);
    nameHeaderIndex = 0;

    return { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys };
  }, []);

  return { nameHeaderIndex, productDetailsHeaders, productDetailsHeadersKeys, comparableProductsData };
}

export default function Compare() {
  const tableRef = useRef();
  const scrollerBtnsParentRef = useRef();
  const comparisonData = usePrepareComparisonData();

  useEffect(() => {
    if (comparisonData?.comparableProductsData?.length) {
      setTableStylingCSSVariables();
    }
  }, [comparisonData?.comparableProductsData]);

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
        // TODO: [UI] on mobile, shift table headers to be interleaved (instead of occupy single column) between data/body
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
            const extrasProp = {
              className: 'product-comparison__cell-interior',
            };
            const isNameHeader = detailHeader === 'name';

            if (isNameHeader) {
              extrasProp.optionalImage = <PEVImage image={productData.images[0]} width={200} />;
            }

            const preparedProductDetail = (
              <ProductSpecificDetail
                detailName={detailHeader}
                detailValue={productData[detailHeader]}
                extras={extrasProp}
              />
            );

            return (
              // TODO: [UX] hovering over certain spec could highlight regarding specs in other compared products
              <TableCell className="product-comparison__cell" component="div" role="cell" key={`cell-${dataIndex}`}>
                {isNameHeader ? (
                  <ProductCardLink productData={comparisonData.comparableProductsData[dataIndex]}>
                    {preparedProductDetail}
                  </ProductCardLink>
                ) : (
                  preparedProductDetail
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    };

  if (!comparisonData?.comparableProductsData) {
    return translations.noProductsToCompare;
  }

  return comparisonData.comparableProductsData.length ? (
    <article className="product-comparison-container" elevation={0}>
      <header ref={scrollerBtnsParentRef} className="product-comparison__header">
        <PEVHeading level={3}>
          {translations.productsAmountLabelPrefix}{' '}
          <output id="comparedProductsListCounter" data-cy="label:product-comparison__header-counter">
            {comparisonData.comparableProductsData.length}
          </output>{' '}
          {translations.productsAmountLabelSuffix}
        </PEVHeading>
      </header>

      <TableContainer component="section" className="product-comparison">
        <Table ref={tableRef} component="div" className="product-comparison__table" role="table">
          <Scroller
            scrollerBaseValueMeta={{
              selector: '.product-comparison-candidates, .product-comparison',
              varName: '--product-list-item-width',
            }}
            btnsParentRef={scrollerBtnsParentRef}
            render={({ ScrollerHookingParent, multipleRefsGetter }) => {
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

                  <ScrollerHookingParent>
                    <TableBody component="div" className="product-comparison__body" role="rowgroup">
                      {comparisonData.productDetailsHeadersKeys.map(getTableBodyContent(bodyRowRefGetter))}
                    </TableBody>
                  </ScrollerHookingParent>
                </>
              );
            }}
          />
        </Table>
      </TableContainer>
    </article>
  ) : (
    <PEVLoadingAnimation />
  );
}
