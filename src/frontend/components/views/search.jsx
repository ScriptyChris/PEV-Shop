import React, { memo, useRef, createRef, useState, useEffect, forwardRef } from 'react';
import classNames from 'classnames';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import TextFormat from '@material-ui/icons/TextFormat';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import httpService from '@frontend/features/httpService';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  defaultLabel: 'Search for:',
  caseSensitiveSearch: 'toggle case sensitivity',
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  searchingTarget = Math.random() /* TODO: make default value more spec conforming */,
  debounceTimeMs = 0,
  onInputChange,
  forwardedRef,
  customCheckbox = null,
  list = '',
  presetValue = '',
  autoFocus = false,
}) {
  if (Number.isNaN(debounceTimeMs) || typeof debounceTimeMs !== 'number') {
    throw TypeError(`debounceTimeMs prop must be number! Received: ${debounceTimeMs}`);
  } else if (typeof onInputChange !== 'function') {
    throw TypeError(`onInputChange props must be a function! Received: ${onInputChange}`);
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
    <>
      <FormControl ref={forwardedRef} size="small">
        <InputLabel className="search-container__field-label" htmlFor={inputId}>
          {label}
        </InputLabel>
        <Input
          id={inputId}
          type="search"
          onChange={handleChange}
          inputProps={{
            value: inputValue,
            list: list,
            autoFocus: autoFocus,
            autoComplete: 'off',
          }}
          endAdornment={customCheckbox && <InputAdornment position="end">{customCheckbox}</InputAdornment>}
        />
      </FormControl>
    </>
  );
});

const ForwardedSearch = forwardRef(function ForwardedSearch(props, ref) {
  return <Search {...props} forwardedRef={ref} />;
});

function SearchProductsByName({ pagination, onReceivedProductsByName, toggleMainHeadingSize, ...restProps }) {
  const isMobileLayout = useMobileLayout();
  const [isCaseSensitive, setCaseSensitive] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(!isMobileLayout);

  useEffect(() => setIsSearchVisible(!isMobileLayout), [isMobileLayout]);

  // TODO: fix issue with stale isCaseSensitive value when checkbox is ticked between user types query and debounce delays reaction
  const handleInputSearchChange = (searchValue) => {
    const mappedPagination = pagination
      ? {
          pageNumber: pagination.currentProductPage,
          productsPerPage: pagination.currentProductsPerPageLimit,
        }
      : null;

    httpService.getProductsByName(searchValue, isCaseSensitive, mappedPagination).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      onReceivedProductsByName(res);
    });
  };

  const handleCaseSensitiveChange = ({ target: { checked } }) => {
    setCaseSensitive(checked);
  };

  const toggleSearch = (shouldShow) => {
    return () => {
      if (isMobileLayout) {
        setIsSearchVisible(shouldShow);
        toggleMainHeadingSize(shouldShow);
      }
    };
  };

  const onSearchSlideEnter = (searchRootRef) => {
    const searchInput = searchRootRef.querySelector('input[type="search"]');

    setTimeout(() => searchInput.focus());
  };

  return (
    <ClickAwayListener onClickAway={toggleSearch(false)}>
      {/* This <div> is used solely to forward a ref from ClickAwayListener, which React Fragment cannot do */}
      <div className="search-wrapper">
        <section className={classNames('search-container', { 'search-container--is-visible': isSearchVisible })}>
          <Slide direction="left" in={isSearchVisible} onEntered={onSearchSlideEnter}>
            <ForwardedSearch
              {...restProps}
              onInputChange={handleInputSearchChange}
              customCheckbox={
                <Checkbox
                  className="search-container__field-letter-case-toggler"
                  icon={<TextFormat color="primary" />}
                  checkedIcon={<TextFormat color="secondary" />}
                  onChange={handleCaseSensitiveChange}
                  checked={isCaseSensitive}
                  inputProps={{
                    'aria-label': translations.caseSensitiveSearch,
                    title: translations.caseSensitiveSearch,
                  }}
                />
              }
            />
          </Slide>
        </section>

        {!isSearchVisible && (
          <IconButton onClick={toggleSearch(true)}>
            <SearchIcon />
          </IconButton>
        )}
      </div>
    </ClickAwayListener>
  );
}

const SearchSingleProductByName = memo(function SearchSingleProductByName({
  onSelectedProductName,
  ignoredProductNames,
  ...restProps
}) {
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
        onSelectedProductName(searchRecentValues.newValue);
      } else if (searchRecentValues.oldValue !== searchRecentValues.newValue) {
        const { oldValue: oldSearchValue, newValue: newSearchValue } = searchRecentValues;
        const newSearchValueContainsOld =
          !!oldSearchValue && newSearchValue.toLowerCase().includes(oldSearchValue.toLowerCase());

        setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: prev.newValue }));

        let p;
        const products = (
          newSearchValueContainsOld
            ? searchResults.filter((result) => result.toLowerCase().includes(newSearchValue.toLowerCase()))
            : (
                await httpService.getProductsByName(searchRecentValues.newValue, false, null).then((res) => {
                  if (res.__EXCEPTION_ALREADY_HANDLED) {
                    return;
                  }

                  return res;
                })
              ).map(({ name }) => name)
        ).filter((productName) => !(ignoredProductNames || []).includes(productName));

        setSearchResults(products);
      }
    })();
  }, [dataListRef]);

  const handleInputSearchChange = async (searchValue) => {
    setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: searchValue }));
  };

  return (
    <>
      <Search {...restProps} onInputChange={handleInputSearchChange} />

      <datalist ref={dataListRef} id={restProps.list}>
        {searchResults.map((relatedProductName) => (
          <option key={relatedProductName} value={relatedProductName}></option>
        ))}
      </datalist>
    </>
  );
});

export { SearchProductsByName, SearchSingleProductByName };
