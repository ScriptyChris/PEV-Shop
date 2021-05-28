import React, { memo, useRef, useState } from 'react';
import apiService from '../../features/apiService';

const transaction = {
  defaultLabel: 'Search for:',
};

const SearchProductsByName = (props) => {
  const [isCaseSensitive /*, setCaseSensitive*/] = useState(false);

  const handleInputSearchChange = (searchValue) => {
    console.log('searchValue:', searchValue, ' /pagination:', props.pagination);
    const pagination = {
      pageNumber: props.pagination.currentProductPage,
      productsPerPage: props.pagination.currentProductsPerPageLimit,
    };

    props.onReceivedProductsByName(apiService.getProductsByName(searchValue, isCaseSensitive, pagination));
  };

  // const handleCaseSensitiveChange = ({ target: { value } }) => {
  //   setCaseSensitive(value);
  // }

  return (
    <div>
      <Search {...props} onInputChange={handleInputSearchChange} />
      {/*<input type="checkbox" onChange={handleCaseSensitiveChange} value={isCaseSensitive} />*/}
    </div>
  );
};

const Search = memo(function Search({
  label = transaction.defaultLabel,
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
