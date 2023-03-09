import '@frontend/assets/styles/views/search.scss';

import React, { memo, useRef, useCallback, useMemo, useState, forwardRef, useEffect } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import HistoryIcon from '@material-ui/icons/History';
import { ManageSearchIcon } from '@frontend/components/svgIcons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {
  PEVForm,
  PEVIconButton,
  PEVLink,
  PEVTextField,
  PEVTabs,
  PEVParagraph,
  PEVLoadingAnimation,
} from '@frontend/components/utils/pevElements';

// TODO: update imported module name after products dashboard will be refactored
import { BaseProductsList } from '@frontend/components/views/productsDashboard';

import httpService from '@frontend/features/httpService';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import { ROUTES } from '../pages/_routes';

const translations = {
  defaultLabel: 'Search for:',
  openSearchMenu: 'open search menu',
  searchMenu: 'search menu',
  searchResults: 'Results',
  recentSearches: 'Recently searched',
  noRecentSearchesFound: 'No recent searches found',
  noSearchInitiated: 'Nothing to search for. Please type a product name first.',
  createNoProductsFound(productName) {
    return `No products found for name: "${productName}"`;
  },
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
  searchInputDataCy = 'input:the-search',
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

  useEffect(() => {
    // cancel any pending debounce as cleanup
    return () => window.clearTimeout(debounce.current);
  }, []);

  useEffect(() => {
    setInputValue(presetValue);
    handleChange({ target: { value: presetValue } }, true);
  }, [presetValue]);

  const debounceNotify = (notifier, immediate) => {
    if (debounce.current > -1) {
      window.clearTimeout(debounce.current);
    }

    debounce.current = window.setTimeout(notifier, immediate ? 0 : debounceTimeMs);
  };

  const handleChange = ({ target: { value } }, goWithNextTick) => {
    setInputValue(value);

    if (goWithNextTick) {
      debounceNotify(() => onInputChange(value), true);
    } else if (value && debounceTimeMs) {
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
          {...{ className, autoFocus, placeholder, label, labelInside }}
          ref={forwardedRef}
          identity={inputId}
          type="search"
          autoComplete="off"
          overrideProps={{
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            value: inputValue,
            inputProps: {
              list,
              // TODO: [E2E] set more precise value
              'data-cy': searchInputDataCy,
            },
          }}
        />
      )}
    />
  );
});

const ForwardedSearch = forwardRef(function ForwardedSearch(props, ref) {
  return <Search {...props} forwardedRef={ref} />;
});

const useMobileSearchMenuOpenerBtn = () => {
  const mobileSearchMenuOpenerBtnRef = useRef(null);
  const getMobileSearchMenuOpenerBtnRef = useCallback((mobileSearchMenuOpenerBtnNode) => {
    if (mobileSearchMenuOpenerBtnNode) {
      mobileSearchMenuOpenerBtnRef.current = mobileSearchMenuOpenerBtnNode;
    }
  }, []);

  return { mobileSearchMenuOpenerBtnRef, getMobileSearchMenuOpenerBtnRef };
};

const useHandleSearchContainerA11yEventHandlers = (
  openSearchMenu,
  _closeSearchMenu,
  { isMobileLayout, isSearchMenuOpened }
) => {
  const possiblyTabbedOutOfContainer = useRef(false);
  const canCloseMenuRef = useRef(false);

  useEffect(() => {
    if (isMobileLayout || !isSearchMenuOpened) {
      return;
    }

    const onClickAway = ({ target }) => {
      if (!target.closest('[data-search-container]')) {
        resetPossibleBlurTriggerElAndCloseSearchMenu();
      }
    };

    document.addEventListener('click', onClickAway);

    return () => document.removeEventListener('click', onClickAway);
  }, [isMobileLayout, isSearchMenuOpened, _closeSearchMenu]);

  const resetPossibleBlurTriggerElAndCloseSearchMenu = () => {
    canCloseMenuRef.current = false;
    possiblyTabbedOutOfContainer.current = false;

    _closeSearchMenu();
  };

  const isAnchorOrItsDescendant = (element) => element?.closest?.('a');
  const getFirstAndLastFocusableElement = (currentTarget) => {
    const focusable = currentTarget.querySelectorAll(
      `button:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]), 
      select:not([tabindex="-1"]), textarea:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])`
    );
    return {
      first: currentTarget.querySelector('input[type="search"]'),
      last: focusable[focusable.length - 1],
    };
  };

  const onMouseDown = ({ target }) => {
    if (isAnchorOrItsDescendant(target)) {
      canCloseMenuRef.current = true;
    }
  };
  const onKeyDown = ({ key, shiftKey, target, currentTarget }) => {
    const isEnterKeyPressedOnAnchor = key === 'Enter' && isAnchorOrItsDescendant(target);
    const isEscapeKeyPressed = key === 'Escape';
    const isTabKeyPressed = key === 'Tab';
    const isNonShiftTabKeyPressed = isTabKeyPressed && !shiftKey;
    const isShiftTabKeyPressed = isTabKeyPressed && shiftKey;

    if (
      canCloseMenuRef.current ||
      (target === document.activeElement && isEnterKeyPressedOnAnchor) ||
      isEscapeKeyPressed
    ) {
      resetPossibleBlurTriggerElAndCloseSearchMenu();
    } else if (isShiftTabKeyPressed || isNonShiftTabKeyPressed) {
      const firstAndLastFocusableElement = getFirstAndLastFocusableElement(currentTarget);
      const goingOutToPrev = isShiftTabKeyPressed && firstAndLastFocusableElement.first === target;
      const goingOutToNext = isNonShiftTabKeyPressed && firstAndLastFocusableElement.last === target;

      if (goingOutToPrev || goingOutToNext) {
        possiblyTabbedOutOfContainer.current = true;
      }
    }
  };

  const onFocus = ({ target }) => {
    if (target.type === 'search') {
      openSearchMenu();
    }
  };
  const onBlur = () => {
    const tabbedOutToBody = possiblyTabbedOutOfContainer.current && document.activeElement === document.body;

    if (tabbedOutToBody) {
      resetPossibleBlurTriggerElAndCloseSearchMenu();
    }
  };

  const onMouseUp = () => {
    if (canCloseMenuRef.current) {
      resetPossibleBlurTriggerElAndCloseSearchMenu();
    }
  };

  return { onMouseDown, onKeyDown, onFocus, onBlur, onMouseUp };
};

const useRecentSearches = () => {
  const MAX_RECENT_SEARCHES = 4;
  const [recentSearchesList, setRecentSearchesList] = useState(useRecentSearches.recentSearchesList);

  useEffect(() => {
    return () => {
      // TODO: [UX] save this to storage and sync with user session
      useRecentSearches.recentSearchesList = recentSearchesList;
    };
  }, []);

  const updateRecentSearchesList = (searchValue) => {
    setRecentSearchesList((prev) => [
      searchValue,
      ...prev.filter((prevSearchValue) => prevSearchValue !== searchValue).filter((_, i) => i < MAX_RECENT_SEARCHES),
    ]);
  };

  return { recentSearchesList, updateRecentSearchesList };
};
useRecentSearches.recentSearchesList = [];

function SearchProductsByName({
  pagination = {
    pageNumber: 1,
    productsPerPage: 10,
  },
  ...restProps
}) {
  const TABS_BASE_INFO = Object.freeze({
    recentSearches: {
      name: 'recent-searches',
      index: 0,
    },
    results: {
      name: 'results',
      index: 1,
    },
  });
  const { isMobileLayout } = useRWDLayout();
  const [isSearchMenuOpened, setIsSearchMenuOpened] = useState(false);
  const [foundProducts, setFoundProducts] = useState(null);
  const { mobileSearchMenuOpenerBtnRef, getMobileSearchMenuOpenerBtnRef } = useMobileSearchMenuOpenerBtn();
  const [tabIndex, setTabIndex] = useState(TABS_BASE_INFO.recentSearches.index);
  const [initialSearch, setInitialSearch] = useState('');
  const searchedValueRef = useRef(initialSearch);
  const { recentSearchesList, updateRecentSearchesList } = useRecentSearches();
  const linkToAllSearchResults = `${ROUTES.PRODUCTS}?name=${globalThis.encodeURIComponent(searchedValueRef.current)}`;

  const handleInputSearchChange = (searchValue) => {
    searchedValueRef.current = searchValue;

    if (!searchValue) {
      setTabIndex(TABS_BASE_INFO.recentSearches.index);
      return setFoundProducts(null);
    }

    {
      // Force PEVTabs component to refresh it's tab state
      // before setting target value, if it has been set to the same value.
      if (tabIndex === TABS_BASE_INFO.results.index) {
        setTabIndex(false);
      }
      setTabIndex(TABS_BASE_INFO.results.index);
      updateRecentSearchesList(searchValue);
    }

    setFoundProducts([]);
    httpService.getProductsByName(searchValue, pagination).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setFoundProducts(res.productsList?.length ? res.productsList : null);
    });
  };

  const toggleSearchMenu = (shouldOpen) => {
    return () => {
      if (isSearchMenuOpened === shouldOpen) {
        return;
      }

      if (shouldOpen) {
        setTabIndex(TABS_BASE_INFO.recentSearches.index);
      }

      setIsSearchMenuOpened(shouldOpen);

      if (!shouldOpen && mobileSearchMenuOpenerBtnRef.current) {
        setTimeout(() => mobileSearchMenuOpenerBtnRef.current.focus());
      }
    };
  };

  const closeSearch = ({ target }) => {
    target.blur();
    toggleSearchMenu(false)();
  };

  const { onFocus, onBlur, onMouseDown, onKeyDown, onMouseUp } = useHandleSearchContainerA11yEventHandlers(
    toggleSearchMenu(true),
    toggleSearchMenu(false),
    { isMobileLayout, isSearchMenuOpened }
  );

  const searchInput = (
    <div className="search-menu__field-container pev-flex">
      <ForwardedSearch
        {...restProps}
        className="search-menu__input-wrapper"
        presetValue={initialSearch}
        onInputChange={handleInputSearchChange}
        onEscapeBtn={closeSearch}
        autoFocus={isMobileLayout}
        searchInputDataCy="input:search-products-by-name"
      />
    </div>
  );
  const recentSearches = recentSearchesList.length ? (
    <div className="search-recent-searches">
      <List component="ol" className="pev-flex pev-flex--columned">
        {recentSearchesList.map((searchPhrase) => (
          <ListItem
            component="li"
            button
            variant="text"
            onClick={() => setInitialSearch(searchPhrase)}
            disabled={searchPhrase === searchedValueRef.current}
            key={searchPhrase}
          >
            {searchPhrase}
          </ListItem>
        ))}
      </List>
    </div>
  ) : (
    <PEVParagraph className="pev-centered-padded-text">{translations.noRecentSearchesFound}</PEVParagraph>
  );
  const searchResults = foundProducts ? (
    <div
      className="search-initial-results pev-flex pev-flex--columned"
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {foundProducts.length ? (
        <>
          <PEVLink
            to={linkToAllSearchResults}
            className="search-initial-results__see-all-link pev-centered-padded-text"
            color="primary"
          >
            {translations.seeAllSearchResults}
          </PEVLink>
          <Divider variant="middle" />
          <BaseProductsList productsList={foundProducts} isCompactProductCardSize />
        </>
      ) : (
        <PEVLoadingAnimation />
      )}
    </div>
  ) : (
    <PEVParagraph className="pev-centered-padded-text" data-cy="message:empty-search-results">
      {searchedValueRef.current
        ? translations.createNoProductsFound(searchedValueRef.current)
        : translations.noSearchInitiated}
    </PEVParagraph>
  );
  const tabsConfig = useMemo(
    () => ({
      groupName: 'search',
      initialData: [
        {
          name: TABS_BASE_INFO.recentSearches.name,
          translation: translations.recentSearches,
          icon: <HistoryIcon />,
          content: recentSearches,
        },
        {
          name: TABS_BASE_INFO.results.name,
          translation: translations.searchResults,
          icon: <ManageSearchIcon />,
          content: searchResults,
        },
      ],
    }),
    [foundProducts]
  );
  const searchMenu = (
    <PEVTabs
      className="search-menu__tabs"
      config={tabsConfig}
      label={translations.searchMenu}
      prechosenTabValue={tabIndex}
      horizontalTabIcons
    />
  );

  return isMobileLayout ? (
    <>
      <PEVIconButton
        ref={getMobileSearchMenuOpenerBtnRef}
        onClick={toggleSearchMenu(true)}
        a11y={translations.openSearchMenu}
      >
        <SearchIcon />
      </PEVIconButton>
      <Drawer
        anchor="right"
        className="search-menu--mobile"
        open={isSearchMenuOpened}
        onBlur={onBlur}
        disableRestoreFocus
      >
        <div className="search-menu--mobile__controls pev-flex">
          {searchInput}
          <PEVIconButton onClick={toggleSearchMenu(false)} a11y={translations.closeSearchMenu}>
            <ExitToAppIcon />
          </PEVIconButton>
        </div>

        {searchMenu}
      </Drawer>
    </>
  ) : (
    <Paper className="search-container" onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} data-search-container>
      {searchInput}
      <Fade in={isSearchMenuOpened}>
        {/* `div` is used as a workaround for underlying PEVTabs not obeying Fade hidden state */}
        <div>{searchMenu}</div>
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
  const initialSearchValue = restProps.presetValue ?? '';
  const [searchRecentValues, setSearchRecentValues] = useState({
    oldValue: initialSearchValue,
    newValue: initialSearchValue,
  });
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

  const handleInputSearchForSingleProductChange = (searchValue) => {
    setSearchRecentValues((prev) => ({ oldValue: prev.newValue, newValue: searchValue }));
  };

  return (
    <>
      <Search
        {...restProps}
        onInputChange={handleInputSearchForSingleProductChange}
        searchInputDataCy="input:search-single-product-by-name"
        labelInside
      />

      <datalist ref={getDataListRef} id={restProps.list} data-cy="datalist:the-search-options">
        {searchResults.map((relatedProductName) => (
          <option key={relatedProductName} value={relatedProductName}></option>
        ))}
      </datalist>
    </>
  );
});

export { SearchProductsByName, SearchSingleProductByName };
