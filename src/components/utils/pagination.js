import React, { memo } from 'react';
import ReactPaginate from 'react-paginate';

function Pagination(props) {
  const translations = {
    page: 'Strona',
    previous: 'Poprzednia',
    next: 'Następna',
  };
  translations.previousAriaLabel = `${translations.previous} ${translations.page.toLowerCase()}`;
  translations.nextAriaLabel = `${translations.next} ${translations.page.toLowerCase()}`;

  const updateAriaLabelForPageBtn = (pageNr) => `${translations.page} ${pageNr}`;

  return (
    <nav className="pagination-container">
      <select onChange={props.onItemsPerPageLimitChange} className="pagination-container__limit-selector">
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
        previousLabel={translations.previous}
        nextLabel={translations.next}
        containerClassName="pagination-container__nav"
        pageClassName="pagination-nav__item"
        breakClassName="pagination-nav__break"
        previousClassName="pagination-nav__previous-item"
        nextClassName="pagination-nav__next-item"
        disabledClassName="pagination-nav__disabled-item"
        previousAriaLabel={translations.previousAriaLabel}
        nextAriaLabel={translations.nextAriaLabel}
        ariaLabelBuilder={updateAriaLabelForPageBtn}
      />
    </nav>
  );
}

function arePropsEqual(prevProp, nextProp) {
  const equalTotalPages = prevProp.totalPages === nextProp.totalPages;
  const equalCurrentItemPageIndex = prevProp.currentItemPageIndex === nextProp.currentItemPageIndex;

  return equalTotalPages && equalCurrentItemPageIndex;
}

export default memo(Pagination, arePropsEqual);
