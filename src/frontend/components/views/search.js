import React, { memo, useRef, useState } from 'react';
import apiService from '../../features/apiService';

const translations = {
  defaultLabel: 'Search for:',
  caseSensitiveSearch: 'Is case sensitive?',
};

const SearchProductsByName = (props) => {
  const [isCaseSensitive, setCaseSensitive] = useState(false);

  const handleInputSearchChange = (searchValue) => {
    console.log('searchValue:', searchValue, ' /pagination:', props.pagination);
    const pagination = {
      pageNumber: props.pagination.currentProductPage,
      productsPerPage: props.pagination.currentProductsPerPageLimit,
    };

    props.onReceivedProductsByName(apiService.getProductsByName(searchValue, isCaseSensitive, pagination));
  };

  const handleCaseSensitiveChange = ({ target: { checked } }) => {
    setCaseSensitive(checked);
  };

  return (
    <div className="search">
      <Search {...props} onInputChange={handleInputSearchChange} />
      <label>
        {translations.caseSensitiveSearch}
        <input type="checkbox" onChange={handleCaseSensitiveChange} checked={isCaseSensitive} />
      </label>
    </div>
  );
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  searchingTarget = Math.random(),
  debounceTimeMs = 0,
  onInputChange,
}) {
  if (Number.isNaN(debounceTimeMs) || typeof debounceTimeMs !== 'number') {
    throw TypeError(`debounceTimeMs prop must be number! Received: ${debounceTimeMs}`);
  } else if (typeof onInputChange !== 'function') {
    throw TypeError(`onInputChange props must be a function! ReceivedL ${onInputChange}`);
  }

  const [inputValue, setInputValue] = useState('');
  const debounce = useRef(-1);
  const inputId = `${searchingTarget}Search`;

  const debounceNotify = (notifier) => {
    if (debounce.current > -1) {
      clearTimeout(debounce.current);
    }

    debounce.current = window.setTimeout(notifier, debounceTimeMs);
  };

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);

    if (debounceTimeMs) {
      debounceNotify(() => onInputChange(value));
    } else {
      onInputChange(value);
    }
  };

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input onChange={handleChange} value={inputValue} id={inputId} type="search" />
    </div>
  );
});

export { Search as default, SearchProductsByName };
