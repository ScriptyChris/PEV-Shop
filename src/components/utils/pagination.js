import React, { memo } from 'react';
import ReactPaginate from 'react-paginate';

function Pagination(props) {
  return (
    <>
      <select onChange={props.onItemsPerPageLimitChange}>
        {props.itemLimitsPerPage.map((limitPerPage, index, arrayContext) => {
          const limitText = `${limitPerPage} ${props.translations.itemsPerPageSuffix}`;
          const optionText = index === arrayContext.length - 1 ? props.translations.allItems : limitText;

          return (
            <option value={limitPerPage} key={`${props.itemsName}ItemsPerPageLimit-${index}`}>
              {optionText}
            </option>
          );
        })}
      </select>

      <ReactPaginate
        pageCount={props.totalPages}
        pageRangeDisplayed={1}
        marginPagesDisplayed={2}
        onPageChange={props.onItemPageChange}
        forcePage={props.currentItemPageIndex}
        containerClassName="pagination-container"
      />
    </>
  );
}

function arePropsEqual(prevProp, nextProp) {
  const equalTotalPages = prevProp.totalPages === nextProp.totalPages;
  const equalCurrentItemPageIndex = prevProp.currentItemPageIndex === nextProp.currentItemPageIndex;

  return equalTotalPages && equalCurrentItemPageIndex;
}

export default memo(Pagination, arePropsEqual);
