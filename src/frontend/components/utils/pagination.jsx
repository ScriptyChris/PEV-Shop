/**
 * @module
 */

import React from 'react';
import ReactPaginate from 'react-paginate';

const translations = {
  page: 'Page',
  previous: 'Previous',
  next: 'Next',
  get previousAriaLabel() {
    return `${this.previous} ${this.page.toLowerCase()}`;
  },
  get nextAriaLabel() {
    return `${this.next} ${this.page.toLowerCase()}`;
  },
};

export default function Pagination(props) {
  const updateAriaLabelForPageBtn = (pageNr) => `${translations.page} ${pageNr}`;

  return (
    <div className="pagination-container">
      {/*
        TODO: [UX] make it possible to use `<select>` and `<ReactPaginate />` separately, 
        so i.e. selector can be used once on the top of page and pagination itself twice - on the top and the bottom.
      */}

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
    </div>
  );
}
