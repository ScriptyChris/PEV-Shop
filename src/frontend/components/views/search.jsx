import React, { memo, useRef, useCallback, useState, forwardRef } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { PEVForm, PEVIconButton, PEVLink, PEVTextField } from '@frontend/components/utils/pevElements';
import { ProductsList } from '@frontend/components/views/productsDashboard';
import httpService from '@frontend/features/httpService';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  defaultLabel: 'Search for:',
  openSearchMenu: 'open search menu',
  seeAllSearchResults: 'See all results',
  closeSearchMenu: 'close search menu',
};

const Search = memo(function Search({
  label = translations.defaultLabel,
  placeholder,
  labelInside,
  searchingTarget = Math.random() /* TODO: make default value more spec conforming */,
  debounceTimeMs = 0,
  onInputChange,
  onEscapeBtn = () => void 0,
  forwardedRef,
  list = '',
  presetValue = '',
  autoFocus = false,
  className,
}) {
  if (Number.isNaN(debounceTimeMs) || typeof debounceTimeMs !== 'number') {
    throw TypeError(`debounceTimeMs prop must be a number! Received: ${debounceTimeMs}`);
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

    if (value && debounceTimeMs) {
      debounceNotify(() => onInputChange(value));
    } else {
      onInputChange(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      // Chrome seems to clear the input on ESC key, which may be confusing,
      // so default browser action is prevented.
      event.preventDefault();
      onEscapeBtn(event);
    }
  };

  return (
    // Alone (and kind of no-op) `Formik` component wrapper is used only to provide a (React) context for underlying fields, which rely on Context API
    <PEVForm
      role="search"
      overrideRenderFn={() => (
        <PEVTextField
          className={className}
          ref={forwardedRef}
          identity={inputId}
          type="search"
          autoFocus={autoFocus}
          autoComplete="off"
          overrideProps={{
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            value: inputValue,
            inputProps: {
              list,
              // TODO: [E2E] set more precise value
              'data-cy': 'input:the-search',
            },
          }}
          placeholder={placeholder}
          label={label}
          labelInside={labelInside}
        />
      )}
    />
  );
});

const ForwardedSearch = forwardRef(function ForwardedSearch(props, ref) {
  return <Search {...props} forwardedRef={ref} />;
});

function SearchProductsByName({
  pagination = {
    pageNumber: 1,
    productsPerPage: 10,
  },
  onReceivedProductsByName,
  toggleMainHeadingSize,
  syncWithSearchQuery,
  ...restProps
}) {
  const { isMobileLayout } = useRWDLayout();
  const [isMobileSearchMenuOpened, setIsMobileSearchMenuOpened] = useState(false);
  const [isSearchMenuOpened, setIsSearchMenuOpened] = useState(false);
  const [foundProducts, setFoundProducts] = useState([]);

  const handleInputSearchChange = (searchValue) => {
    if (!searchValue) {
      return setFoundProducts([]);
    }

    httpService.getProductsByName(searchValue, pagination).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setFoundProducts(res.productsList);
    });
  };

  const toggleMobileSearchMenu = (shouldOpen) => {
    return () => setIsMobileSearchMenuOpened(shouldOpen);
  };

  const toggleSearchMenu = (shouldOpen) => {
    return () => setIsSearchMenuOpened(shouldOpen);
  };

  const closeSearch = ({ target }) => {
    target.blur();

    if (isMobileSearchMenuOpened) {
      setIsMobileSearchMenuOpened(false);
    } else {
      setIsSearchMenuOpened(false);
    }
  };

  const searchInput = (
    <div className="search-menu__field-container pev-flex">
      <ForwardedSearch
        {...restProps}
        className="search-menu__input-wrapper"
        onInputChange={handleInputSearchChange}
        onEscapeBtn={closeSearch}
        autoFocus={isMobileLayout}
      />
    </div>
  );
  const searchResults = (
    <Paper className="search-initial-results pev-flex pev-flex--columned">
      <PEVLink to="#" className="search-initial-results__see-all-link search pev-centered-padded-text" color="primary">
        {translations.seeAllSearchResults}
      </PEVLink>
      <Divider variant="middle" />
      <ProductsList initialProducts={foundProducts} isCompactProductCardSize />
    </Paper>
  );

  return isMobileLayout ? (
    <>
      <PEVIconButton onClick={toggleMobileSearchMenu(true)} a11y={translations.openSearchMenu}>
        <SearchIcon />
      </PEVIconButton>
      <Drawer anchor="right" className="search-menu--mobile" open={isMobileSearchMenuOpened}>
        <div className="search-menu--mobile__controls pev-flex">
          {searchInput}
          <PEVIconButton onClick={toggleMobileSearchMenu(false)} a11y={translations.closeSearchMenu}>
            <ExitToAppIcon />
          </PEVIconButton>
        </div>

        {searchResults}
      </Drawer>
    </>
  ) : (
    <Paper className="search-container" onFocus={toggleSearchMenu(true)} onBlur={toggleSearchMenu(false)}>
      {searchInput}
      <Fade in={isSearchMenuOpened} onKeyDown={({ key }) => key === 'Escape' && toggleSearchMenu(false)()}>
        {searchResults}
      </Fade>
    </Paper>
  );
}

const SearchSingleProductByName = memo(function SearchSingleProductByName({
  onSelectedProductName,
  ignoredProductNames,
  ...restProps
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchRecentValues, setSearchRecentValues] = useState({ oldValue: '', newValue: '' });
  const getDataListRef = useCallback(
    async (dataListNode) => {
      if (!dataListNode) {
        return;
      }

      const dataListChildren = dataListNode.children;

      if (
        searchRecentValues.newValue &&
        dataListChildren.length === 1 &&
        dataListChildren[0].value === searchRecentValues.newValue
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
            : await httpService.getProductsByName(searchRecentValues.newValue).then((res) => {
                if (res.__EXCEPTION_ALREADY_HANDLED) {
                  return;
                }

                return res.map(({ name }) => name);
              })
        ).filter((productName) => !(ignoredProductNames || []).includes(productName));

        setSearchResults(products);
      }
    },
    [searchRecentValues, searchResults]
  );

  const handleInputSearchChange = async (searchValue) => {
    setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: searchValue }));
  };

  return (
    <>
      <Search {...restProps} onInputChange={handleInputSearchChange} labelInside />

      <datalist ref={getDataListRef} id={restProps.list} data-cy="datalist:the-search-options">
        {searchResults.map((relatedProductName) => (
          <option key={relatedProductName} value={relatedProductName}></option>
        ))}
      </datalist>
    </>
  );
});

export { SearchProductsByName, SearchSingleProductByName };
