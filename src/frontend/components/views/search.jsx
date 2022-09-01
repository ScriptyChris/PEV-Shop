import React, { memo, useRef, createRef, useState, useEffect, forwardRef } from 'react';
import classNames from 'classnames';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextFormat from '@material-ui/icons/TextFormat';
import Zoom from '@material-ui/core/Zoom';
import SearchIcon from '@material-ui/icons/Search';

import { PEVForm, PEVIconButton, PEVCheckbox } from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  defaultLabel: 'Search for:',
  caseSensitiveSearch: 'toggle case sensitivity',
  doSearchLabel: 'do search',
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  searchingTarget = Math.random() /* TODO: make default value more spec conforming */,
  debounceTimeMs = 0,
  onInputChange,
  onEscapeBtn = () => void 0,
  forwardedRef,
  customCheckbox = null,
  list = '',
  presetValue = '',
  autoFocus = false,
}) {
  if (Number.isNaN(debounceTimeMs) || typeof debounceTimeMs !== 'number') {
    throw TypeError(`debounceTimeMs prop must be number! Received: ${debounceTimeMs}`);
  } else if (typeof onInputChange !== 'function') {
    throw TypeError(`onInputChange prop must be a function! Received: ${onInputChange}`);
  } else if (onEscapeBtn && typeof onEscapeBtn !== 'function') {
    throw TypeError(`onEscapeBtn prop must be a function! Received: ${onEscapeBtn}`);
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

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onEscapeBtn();
    }
  };

  return (
    // Alone (and kind of no-op) `Formik` component wrapper is used only to provide a (React) context for underlying fields, which rely on Context API
    <PEVForm
      overrideRenderFn={() => (
        <TextField
          ref={forwardedRef}
          id={inputId}
          type="search"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{
            value: inputValue,
            list: list,
            autoFocus: autoFocus,
            autoComplete: 'off',
            'data-cy': 'input:the-search',
          }}
          InputProps={{
            endAdornment: customCheckbox && <InputAdornment position="end">{customCheckbox}</InputAdornment>,
          }}
          label={label}
        />
      )}
    />
  );
});

const ForwardedSearch = forwardRef(function ForwardedSearch(props, ref) {
  return <Search {...props} forwardedRef={ref} />;
});

function SearchProductsByName({ pagination, onReceivedProductsByName, toggleMainHeadingSize, ...restProps }) {
  const { isMobileLayout } = useRWDLayout();
  const [isCaseSensitive, setCaseSensitive] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(!isMobileLayout);
  const [isSearchBtnHidden, setIsSearchBtnHidden] = useState(!isMobileLayout);

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

  const focusSearchInput = (searchRootRef) => {
    if (restProps.autoFocus) {
      const searchInput = searchRootRef.querySelector('input[type="search"]');

      setTimeout(() => searchInput.focus());
    }
  };

  const toggleSearchBtn = (shouldShow) => {
    return () => {
      setIsSearchBtnHidden(shouldShow);
    };
  };

  return (
    <ClickAwayListener onClickAway={toggleSearch(false)}>
      {/* This <div> is used solely to forward a ref from ClickAwayListener, which React Fragment cannot do */}
      <div className="search-wrapper">
        <section className={classNames('search-container', { 'search-container--is-visible': isSearchVisible })}>
          <Zoom in={isSearchVisible} onEntered={focusSearchInput}>
            <ForwardedSearch
              {...restProps}
              onInputChange={handleInputSearchChange}
              customCheckbox={
                <PEVCheckbox
                  className="search-container__field-letter-case-toggler"
                  identity="searchCaseSensitivity"
                  icon={<TextFormat color="primary" />}
                  checkedIcon={<TextFormat color="secondary" />}
                  onChange={handleCaseSensitiveChange}
                  checked={isCaseSensitive}
                  label={translations.caseSensitiveSearch}
                  noExplicitlyVisibleLabel
                />
              }
            />
          </Zoom>
        </section>

        <Zoom in={!isSearchVisible} onEnter={toggleSearchBtn(false, 'enter')} onExit={toggleSearchBtn(true, 'exit')}>
          <PEVIconButton
            onClick={toggleSearch(true)}
            className={classNames({
              'search-wrapper__toggle-button--is-hidden': isSearchBtnHidden,
            })}
            a11y={translations.doSearchLabel}
          >
            <SearchIcon />
          </PEVIconButton>
        </Zoom>
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
