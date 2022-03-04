import React, { memo, useRef, createRef, useState, useEffect } from 'react';
import httpService from '@frontend/features/httpService';

const translations = {
  defaultLabel: 'Search for:',
  caseSensitiveSearch: 'Is case sensitive?',
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  searchingTarget = Math.random() /* TODO: make default value more spec conforming */,
  debounceTimeMs = 0,
  onInputChange,
  list = '',
  presetValue = '',
  autoFocus = false,
}) {
  if (Number.isNaN(debounceTimeMs) || typeof debounceTimeMs !== 'number') {
    throw TypeError(`debounceTimeMs prop must be number! Received: ${debounceTimeMs}`);
  } else if (typeof onInputChange !== 'function') {
    throw TypeError(`onInputChange props must be a function! ReceivedL ${onInputChange}`);
  }

  const [inputValue, setInputValue] = useState(presetValue);
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
      <input
        onChange={handleChange}
        value={inputValue}
        id={inputId}
        list={list}
        autoFocus={autoFocus}
        type="search"
        autoComplete="off"
      />
    </div>
  );
});

function SearchProductsByName(props) {
  const [isCaseSensitive, setCaseSensitive] = useState(false);

  // TODO: fix issue with stale isCaseSensitive value when checkbox is ticked between user types query and debounce delays reaction
  const handleInputSearchChange = (searchValue) => {
    const pagination = props.pagination
      ? {
          pageNumber: props.pagination.currentProductPage,
          productsPerPage: props.pagination.currentProductsPerPageLimit,
        }
      : null;

    httpService.getProductsByName(searchValue, isCaseSensitive, pagination).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      props.onReceivedProductsByName(res);
    });
  };

  const handleCaseSensitiveChange = ({ target: { checked } }) => {
    setCaseSensitive(checked);
  };

  return (
    <div className="search-container">
      <Search {...props} onInputChange={handleInputSearchChange} />
      <label>
        {translations.caseSensitiveSearch}
        <input type="checkbox" onChange={handleCaseSensitiveChange} checked={isCaseSensitive} />
      </label>
    </div>
  );
}

const SearchSingleProductByName = memo(function SearchSingleProductByName(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchRecentValues, setSearchRecentValues] = useState({ oldValue: '', newValue: '' });
  const dataListRef = createRef();

  useEffect(() => {
    (async () => {
      if (
        searchRecentValues.newValue &&
        dataListRef.current.children.length === 1 &&
        dataListRef.current.children[0].value === searchRecentValues.newValue
      ) {
        props.onSelectedProductName(searchRecentValues.newValue);
      } else if (searchRecentValues.oldValue !== searchRecentValues.newValue) {
        const { oldValue: oldSearchValue, newValue: newSearchValue } = searchRecentValues;
        const newSearchValueContainsOld =
          !!oldSearchValue && newSearchValue.toLowerCase().includes(oldSearchValue.toLowerCase());

        setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: prev.newValue }));

        const products = (
          newSearchValueContainsOld
            ? searchResults.filter((result) => result.toLowerCase().includes(newSearchValue.toLowerCase()))
            : (await httpService.getProductsByName(searchRecentValues.newValue, false, null))
                .then((res) => {
                  if (res.__EXCEPTION_ALREADY_HANDLED) {
                    return;
                  }

                  return res;
                })
                .map(({ name }) => name)
        ).filter((productName) => !(props.ignoredProductNames || []).includes(productName));

        setSearchResults(products);
      }
    })();
  }, [dataListRef]);

  const handleInputSearchChange = async (searchValue) => {
    setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: searchValue }));
  };

  return (
    <>
      <Search {...props} onInputChange={handleInputSearchChange} />

      <datalist ref={dataListRef} id={props.list}>
        {searchResults.map((relatedProductName) => (
          <option key={relatedProductName} value={relatedProductName}></option>
        ))}
      </datalist>
    </>
  );
});

export { SearchProductsByName, SearchSingleProductByName };
