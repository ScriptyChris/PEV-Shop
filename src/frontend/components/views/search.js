import React, { memo, useRef, createRef, useState, useEffect } from 'react';
import apiService from '../../features/apiService';

const translations = {
  defaultLabel: 'Search for:',
  caseSensitiveSearch: 'Is case sensitive?',
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  searchingTarget = Math.random() /* TODO: make default value more spec conforming */,
  debounceTimeMs = 0,
  onInputChange,
  onInputBlur = () => {},
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
        onBlur={onInputBlur}
        value={inputValue}
        id={inputId}
        list={list}
        autoFocus={autoFocus}
        type="search"
      />
    </div>
  );
});

function SearchProductsByName(props) {
  const [isCaseSensitive, setCaseSensitive] = useState(false);

  // TODO: fix issue with stale isCaseSensitive value when checkbox is ticked between user types query and debounce delays reaction
  const handleInputSearchChange = async (searchValue) => {
    const pagination = props.pagination
      ? {
          pageNumber: props.pagination.currentProductPage,
          productsPerPage: props.pagination.currentProductsPerPageLimit,
        }
      : null;

    const foundProducts = await apiService.getProductsByName(searchValue, isCaseSensitive, pagination);

    props.onReceivedProductsByName(foundProducts);
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
}

const SearchSingleProductByName = memo(function SearchSingleProductByName(props) {
  // console.log('??? [SearchSingleProductByName] props:', props);

  const [searchResults, setSearchResults] = useState([]);
  const [searchRecentValues, setSearchRecentValues] = useState(['', '']);
  const dataListRef = createRef();

  useEffect(() => {
    (async () => {
      console.log('[0] (useEffect) ignoredProductNames:', props.ignoredProductNames);

      if (
        searchRecentValues[1] &&
        dataListRef.current.children.length === 1 &&
        dataListRef.current.children[0].value === searchRecentValues[1]
      ) {
        props.onSelectedProductName(searchRecentValues[1]);
      } else if (searchRecentValues[0] !== searchRecentValues[1]) {
        const [oldSearchValue, newSearchValue] = searchRecentValues;
        const newSearchValueContainsOld =
          !!oldSearchValue && newSearchValue.toLowerCase().includes(oldSearchValue.toLowerCase());

        setSearchRecentValues((prev) => [prev[1], prev[1]]);

        const products = newSearchValueContainsOld
          ? searchResults.filter((result) => result.name.toLowerCase().includes(newSearchValue.toLowerCase()))
          : (console.log('[===fetch products by name]'),
            await apiService.getProductsByName(searchRecentValues[1], false, null));

        console.log(
          //   '[2](handleInputSearchChange) foundProducts:',
          //   products,
          //   ' /searchRecentValues:',
          //   searchRecentValues,
          //   ' /newSearchValueContainsOld:',
          //   newSearchValueContainsOld
          '[1] ignoredProductNames:',
          props.ignoredProductNames
        );

        setSearchResults(products);
      }
    })();
  }, [dataListRef]);

  const handleInputSearchChange = async (searchValue) => {
    // console.log(
    //   '[0](handleInputSearchChange) single related product:',
    //   searchValue,
    //   ' /searchRecentValues:',
    //   searchRecentValues
    // );

    setSearchRecentValues((prev) => [prev[1], searchValue]);
  };

  return (
    <>
      <Search {...props} onInputChange={handleInputSearchChange} onInputBlur={props.handleInputSearchBlur} />

      {props.cancelBtn && <button onClick={props.cancelBtn.onClick}>{props.cancelBtn.label}</button>}

      <datalist ref={dataListRef} id={props.list}>
        {searchResults.map((relatedProduct) => (
          <option key={relatedProduct.name} value={relatedProduct.name}></option>
        ))}
      </datalist>
    </>
  );
});

export { SearchProductsByName, SearchSingleProductByName };
