import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useLocation, useHistory } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import TuneIcon from '@material-ui/icons/Tune';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StarRateIcon from '@material-ui/icons/StarRate';
import ShopIcon from '@material-ui/icons/Shop';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListIcon from '@material-ui/icons/List';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FormControl, Select, MenuItem } from '@material-ui/core';

import {
  PEVButton,
  PEVIconButton,
  PEVHeading,
  PEVForm,
  PEVTextField,
  PEVFormFieldError,
} from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import ProductCard, { PRODUCT_CARD_LAYOUT_TYPES } from './productCard';
import Pagination from '@frontend/components/utils/pagination';
import CategoriesTree from './categoriesTree';
import { ProductComparisonCandidatesList } from './productComparisonCandidates';
import TechnicalSpecsChooser from './technicalSpecsChooser';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import { routeHelpers } from '@frontend/components/pages/_routes';
import { FILTER_RANGE_SEPARATOR } from '@commons/consts';
import { productPriceRangeValidator } from '@commons/validators';
import { subscribeToBodyMutations, unSubscribeFromBodyMutations } from '@frontend/components/utils/bodyObserver';

const translations = {
  lackOfProducts: 'Lack of products...',
  typeProductName: 'Type product name:',
  showFilters: 'filters',
  viewMode: 'view',
  sortBy: 'sort',
  sortByNameAsc: 'Name ascending',
  sortByNameDesc: 'Name descending',
  sortByPriceAsc: 'Price ascending',
  sortByPriceDesc: 'Price descending',
  sortByRatingScoreDesc: 'Rating descending',
  sortByOrderedUnitsDesc: 'Sold descending',
  sortByCreatedAtDesc: 'Newest descending',
  tabletFiltersToggleBtn: 'toggle filters',
  filtersHeading: 'Filters',
  priceFilterHeading: 'Price',
  minLabel: 'min',
  maxLabel: 'max',
  goBackLabel: 'go back',
  clear: 'Clear',
  apply: 'Apply',
  minValueGreaterThanMaxError: 'Minimum value must be less than maximum!',
};

function ViewModeBtn({ viewModeType, onClick }) {
  let StartIcon;

  switch (viewModeType) {
    case 'details': {
      StartIcon = ListIcon;

      break;
    }
    case 'tiles': {
      StartIcon = ViewModuleIcon;

      break;
    }
    default: {
      throw TypeError(`Unrecognized viewModeType: '${viewModeType}'!`);
    }
  }

  return (
    <PEVButton onClick={onClick} startIcon={<StartIcon />} variant="contained" color="primary">
      {translations.viewMode}
    </PEVButton>
  );
}

const paginationTranslations = {
  itemsPerPageSuffix: 'produktów',
  allItems: 'Wszystkie produkty',
};

// TODO: setup this on backend and pass via some initial config to frontend
const productsPerPageLimits = [15, 30, 60, Infinity];

const useHandleListControlBarStickiness = (isMobileLayout) => {
  const [isListControlBarSticky, setIsListControlBarSticky] = useState(false);

  let lastKnownScrollPosition = 0;
  let scrollProcessing = false;

  useEffect(() => {
    if (isMobileLayout) {
      setIsListControlBarSticky(true);
      stopListening();
      startListening();

      return stopListening;
    }

    setIsListControlBarSticky(false);
  }, [isMobileLayout]);

  const handleStickiness = () => {
    const isScrollUp = lastKnownScrollPosition > window.scrollY;

    setIsListControlBarSticky(isScrollUp);

    lastKnownScrollPosition = window.scrollY;
  };

  const scrollListener = () => {
    if (!scrollProcessing) {
      window.requestAnimationFrame(() => {
        handleStickiness();
        scrollProcessing = false;
      });

      scrollProcessing = true;
    }
  };

  const startListening = () => document.addEventListener('scroll', scrollListener, { passive: true });
  const stopListening = () => document.removeEventListener('scroll', scrollListener, { passive: true });

  return isListControlBarSticky;
};

function useListViewModes() {
  const viewTypes = ['products-dashboard__list--details-view', 'products-dashboard__list--tiles-view'];
  const getCurrentViewModeType = () => viewTypes[viewTypeIndex].match(/--(\w+)-/)[1];
  const [viewTypeIndex, setViewTypeIndex] = useState(0);
  const [listViewModeClassName, setListViewModeClassName] = useState('');
  const [listViewModeType, setListViewModeType] = useState(getCurrentViewModeType);

  useEffect(() => {
    setListViewModeClassName(viewTypes[viewTypeIndex]);
    setListViewModeType(getCurrentViewModeType());
  }, [viewTypeIndex]);

  const updateViewTypeIndex = () => {
    setViewTypeIndex((index) => {
      const isLastViewType = index === viewTypes.length - 1;

      return isLastViewType ? 0 : index + 1;
    });
  };

  return {
    currentListViewModeClassName: listViewModeClassName,
    switchListViewMode: updateViewTypeIndex,
    listViewModeType,
  };
}

const listViewModeToProductCardLayoutMap = {
  details: PRODUCT_CARD_LAYOUT_TYPES.DETAILED,
  tiles: PRODUCT_CARD_LAYOUT_TYPES.COMPACT,
};

export function BaseProductsList({
  productsList,
  isCompactProductCardSize = false,
  listViewModeType,
  currentListViewModeClassName,
}) {
  return (
    <List
      className={classNames('products-dashboard__list products-list', currentListViewModeClassName)}
      data-cy="list:products-dashboard__list"
    >
      {productsList.length > 0
        ? productsList.map((product, index) => (
            <ProductCard
              key={product.name}
              entryNo={index}
              product={product}
              layoutType={listViewModeToProductCardLayoutMap[listViewModeType]}
              RenderedComponent={ListItem}
              isCompact={isCompactProductCardSize}
              lazyLoadImages
            />
          ))
        : translations.lackOfProducts}
    </List>
  );
}

function ProductsList({ currentListViewModeClassName, listViewModeType, searchParams, settersProp }) {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    updateProductsList(searchParams);
  }, [searchParams]);

  const onGetProducts = (res) => {
    if (res.__EXCEPTION_ALREADY_HANDLED) {
      return;
    }

    return res;
  };

  const updateProductsList = async ({
    productsPerPage,
    pageNumber,
    name,
    productPrice = [],
    productCategories = [],
    productTechnicalSpecs = [],
    sortBy,
  } = {}) => {
    if (!productsPerPage || !pageNumber) {
      return;
    }

    const normalizedForAPI = {
      productPrice: productPrice.length ? productPrice : undefined,
      productCategories: productCategories.length ? productCategories : undefined,
      productTechnicalSpecs: productTechnicalSpecs.length ? productTechnicalSpecs : undefined,
      sortBy: sortBy || undefined,
    };

    let productsList = [];
    let totalPages = 1;
    const isHighestProductsPerPage = productsPerPage === productsPerPageLimits[productsPerPageLimits.length - 1];

    if (isHighestProductsPerPage) {
      productsList = await httpService.getProducts({ name, ...normalizedForAPI }, true).then(onGetProducts);
    } else {
      const pagination = { pageNumber, productsPerPage };
      ({ productsList, totalPages } = await httpService
        .getProducts({ name, pagination, ...normalizedForAPI }, true)
        .then(onGetProducts));
    }

    setProductsList(productsList);
    settersProp.setTotalPages(totalPages);
    settersProp.setCurrentProductPage(pageNumber);
    settersProp.setProductPrice(productPrice);
    settersProp.setProductCategories(productCategories);
    settersProp.setProductTechnicalSpecs(productTechnicalSpecs);
  };

  return <BaseProductsList {...{ productsList, listViewModeType, currentListViewModeClassName }} />;
}

const useFiltersCommonActions = ({ initialFiltersNames, onFiltersCycleEnd }) => {
  const filterNamesMap = useMemo(() =>
    Object.fromEntries(
      initialFiltersNames.map((name) => [name, name]),
      []
    )
  );
  const [renderIndex, setRenderIndex] = useState(0);
  const filtersChildrenRef = useRef(
    Object.fromEntries(
      initialFiltersNames.map((name) => [
        name,
        {
          value: null,
          isRequestedSubmitBtnDisability: false,
          render: renderIndex,
        },
      ])
    )
  );
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);
  const tryUpdatingFiltersCycleData = useCallback(
    (filterName, filterValue) => {
      const filterChild = findFilterChild(filterName);
      if (renderIndex === 0 || filterChild.render >= renderIndex) {
        return;
      }

      filterChild.render = renderIndex;
      filterChild.value = filterValue;

      const allFiltersChildrenUpdated = Object.values(filtersChildrenRef.current).every(
        ({ render }) => render === renderIndex
      );
      if (allFiltersChildrenUpdated) {
        const filtersOutput = Object.fromEntries(
          Object.entries(filtersChildrenRef.current)
            .map(([key, value]) => [key, value.value])
            .filter(([, value]) => (Array.isArray(value) && !value.length ? false : true))
        );
        onFiltersCycleEnd(filtersOutput);
      }
    },
    [renderIndex]
  );
  const findFilterChild = (filterName) => {
    const filterChild = filtersChildrenRef.current[filterName];

    if (!filterChild) {
      throw Error(`Could not find filter child with name: "${filterName}"`);
    }

    return filterChild;
  };

  const requestTogglingSubmitBtnDisability = (filterName, shouldDisable) => {
    const filterChild = findFilterChild(filterName);
    filterChild.isRequestedSubmitBtnDisability = shouldDisable;

    if (shouldDisable) {
      setIsSubmitBtnDisabled(true);
    } else {
      const noChildrenRequestsToDisableBtn = Object.values(filtersChildrenRef.current).every(
        ({ isRequestedSubmitBtnDisability }) => !isRequestedSubmitBtnDisability
      );
      if (noChildrenRequestsToDisableBtn) {
        setIsSubmitBtnDisabled(false);
      }
    }
  };
  const triggerFiltersNextCycle = () => setRenderIndex((prev) => prev + 1);

  return {
    filtersCommonParentAPI: { triggerFiltersNextCycle, isSubmitBtnDisabled },
    filtersCommonChildrenAPI: {
      triggerFiltersNextCycle,
      tryUpdatingFiltersCycleData,
      renderIndex,
      requestTogglingSubmitBtnDisability,
      filterNamesMap,
    },
  };
};

function PriceFilter({ productPrice, filtersCommonChildrenAPI }) {
  const [priceRenderingKeyIndex, setPriceRenderingKeyIndex] = useState(0);
  const [minPrice, maxPrice] = useMemo(() => {
    const validatedPriceRange = productPriceRangeValidator(productPrice);

    return validatedPriceRange ? validatedPriceRange.priceRange.map((price) => price ?? '') : ['', ''];
  }, [productPrice]);
  const formInitials = { minPrice, maxPrice };
  const externalSubmitTriggerRef = useRef();

  useEffect(() => {
    setPriceRenderingKeyIndex((prev) => prev + 1);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (filtersCommonChildrenAPI.renderIndex === 0) {
      return;
    }

    externalSubmitTriggerRef.current?.();
  }, [filtersCommonChildrenAPI?.renderIndex]);

  const validateHandler = (values) => {
    const errors = {};

    if (values.maxPrice && values.minPrice > values.maxPrice) {
      errors.minPriceGreaterThanMaxPrice = true;
    }

    filtersCommonChildrenAPI.requestTogglingSubmitBtnDisability(
      filtersCommonChildrenAPI.filterNamesMap.productPrice,
      !!errors.minPriceGreaterThanMaxPrice
    );

    return errors;
  };

  const handleSubmit = (values) => {
    const outputValues = Object.entries(values)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => `${key.replace('Price', '')}${FILTER_RANGE_SEPARATOR}${value}`);

    filtersCommonChildrenAPI.tryUpdatingFiltersCycleData(
      filtersCommonChildrenAPI.filterNamesMap.productPrice,
      outputValues
    );
  };

  return (
    <section className="products-price-filter">
      <PEVHeading level={3}>{translations.priceFilterHeading}</PEVHeading>
      <PEVForm
        initialValues={formInitials}
        validate={validateHandler}
        onSubmit={handleSubmit}
        key={priceRenderingKeyIndex}
      >
        {(formikProps) => {
          externalSubmitTriggerRef.current = formikProps.handleSubmit.bind(formikProps);

          // TODO: [DX] these values should be provided by API
          const [minValue, maxValue] = [0, 99999];

          return (
            <div className="products-price-filter__control-field">
              <PEVTextField
                labelInside
                label={translations.minLabel}
                identity="price-min"
                type="number"
                inputProps={{
                  min: minValue,
                  max: maxValue,
                  name: 'minPrice',
                  value: formikProps.values.minPrice,
                  'data-cy': 'input:price-min-filter',
                }}
                onEnterKey={filtersCommonChildrenAPI.triggerFiltersNextCycle}
              />

              <span className="products-price-filter__control-field-separator">-</span>

              <PEVTextField
                labelInside
                label={translations.maxLabel}
                identity="price-max"
                type="number"
                inputProps={{
                  min: minValue,
                  max: maxValue,
                  name: 'maxPrice',
                  value: formikProps.values.maxPrice,
                  'data-cy': 'input:price-max-filter',
                }}
                onEnterKey={filtersCommonChildrenAPI.triggerFiltersNextCycle}
              />

              {formikProps.errors.minPriceGreaterThanMaxPrice && (
                <PEVFormFieldError>{translations.minValueGreaterThanMaxError}</PEVFormFieldError>
              )}
            </div>
          );
        }}
      </PEVForm>
    </section>
  );
}

const useFiltersCommonActionsRefHandler = () => {
  const containerRef = useRef();
  const getContainerRef = useCallback((containerNode) => {
    if (containerNode) {
      containerRef.current = containerNode;
    }
  }, []);

  return { containerRef, getContainerRef };
};

function Filters({
  productPrice,
  productCategories,
  productTechnicalSpecs,
  updateProductsDashboardQuery,
  isMobileLayout,
  isTabletLayout,
  isFiltersSidebarCollapsed,
  setIsFiltersSidebarCollapsed,
  isFiltersMobileMenuVisible,
  closeFiltersMobileMenu,
}) {
  const { filtersCommonParentAPI, filtersCommonChildrenAPI } = useFiltersCommonActions({
    initialFiltersNames: ['productPrice', 'productCategories', 'productTechnicalSpecs'],
    onFiltersCycleEnd: updateProductsDashboardQuery,
  });
  const { containerRef, getContainerRef } = useFiltersCommonActionsRefHandler();
  const [adhocProductCategoriesForSpecs, setAdhocProductCategoriesForSpecs] = useState(productCategories);

  useEffect(() => {
    if (isMobileLayout) {
      return;
    }

    const subscriptionID = subscribeToBodyMutations(({ marginBottom }) => {
      containerRef.current.style.bottom = marginBottom;
    });

    return () => unSubscribeFromBodyMutations(subscriptionID);
  }, [isMobileLayout]);

  const onFiltersSidebarToggle = () => setIsFiltersSidebarCollapsed((prevState) => !prevState);
  const handleClearFilters = () => {
    updateProductsDashboardQuery(null);

    if (isMobileLayout) {
      closeFiltersMobileMenu();
    }
  };
  const handleApplyFilters = () => {
    filtersCommonParentAPI.triggerFiltersNextCycle();

    if (isMobileLayout) {
      closeFiltersMobileMenu();
    }
  };

  const filtersHeading = (
    <PEVHeading level={2} className="pev-centered-padded-text">
      {translations.filtersHeading}
    </PEVHeading>
  );

  const filterElements = (
    <>
      <CategoriesTree
        {...{ filtersCommonChildrenAPI }}
        preSelectedCategories={productCategories}
        onCategorySelect={setAdhocProductCategoriesForSpecs}
        shouldPreselectLazily
        isMultiselect
      />
      <Divider />
      <PriceFilter {...{ productPrice, filtersCommonChildrenAPI }} />
      <Divider />
      <TechnicalSpecsChooser
        {...{
          productCategories: adhocProductCategoriesForSpecs,
          productTechnicalSpecs,
          filtersCommonChildrenAPI,
        }}
      />
      <div ref={getContainerRef} className="products-dashboard__filters-common-actions pev-flex">
        <PEVButton onClick={handleClearFilters} data-cy="button:clear-filters">
          {translations.clear}
        </PEVButton>
        <PEVButton
          className="products-dashboard__filters-common-actions-apply"
          onClick={handleApplyFilters}
          variant="contained"
          disabled={filtersCommonParentAPI.isSubmitBtnDisabled}
          data-cy="button:apply-filters"
        >
          {translations.apply}
        </PEVButton>
      </div>
    </>
  );

  return isMobileLayout ? (
    <Drawer anchor="left" open={isFiltersMobileMenuVisible} keepMounted>
      <Paper component="aside" className="products-dashboard__filters pev-flex pev-flex--columned">
        <header className="products-dashboard__filters-header pev-flex">
          <PEVIconButton
            onClick={closeFiltersMobileMenu}
            className="products-dashboard__filters-close-menu-btn"
            a11y={translations.goBackLabel}
          >
            <ArrowBackIcon />
          </PEVIconButton>

          {filtersHeading}
        </header>

        {filterElements}
      </Paper>
    </Drawer>
  ) : (
    <Paper
      component="aside"
      variant="outlined"
      className={classNames('products-dashboard__filters-sidebar', {
        'products-dashboard__filters-sidebar--collapsed': isFiltersSidebarCollapsed,
      })}
    >
      <header className="products-dashboard__filters-header">{filtersHeading}</header>

      {isTabletLayout && (
        <PEVIconButton
          onClick={onFiltersSidebarToggle}
          className="products-dashboard__filters-sidebar-extend-toggle-btn"
          a11y={translations.tabletFiltersToggleBtn}
        >
          {!isFiltersSidebarCollapsed && <ChevronLeftIcon fontSize="small" />}
          <TuneIcon fontSize="small" />
          {isFiltersSidebarCollapsed && <ChevronRightIcon fontSize="small" />}
        </PEVIconButton>
      )}

      {filterElements}
    </Paper>
  );
}

function Sorting({ sortBy = '', updateProductsDashboardQuery }) {
  const iconCommonProps = {
    fontSize: 'small',
    color: 'primary',
  };
  const sortOptions = [
    {
      value: 'reviews.ratingScoreDesc',
      translation: translations.sortByRatingScoreDesc,
      icons: (
        <>
          <StarRateIcon {...iconCommonProps} />
          <ArrowDownwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'orderedUnitsDesc',
      translation: translations.sortByOrderedUnitsDesc,
      icons: (
        <>
          <ShopIcon {...iconCommonProps} />
          <ArrowDownwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'createdAtDesc',
      translation: translations.sortByCreatedAtDesc,
      icons: (
        <>
          <CalendarTodayIcon {...iconCommonProps} />
          <ArrowDownwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'priceAsc',
      translation: translations.sortByPriceAsc,
      icons: (
        <>
          <AttachMoneyIcon {...iconCommonProps} />
          <ArrowUpwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'priceDesc',
      translation: translations.sortByPriceDesc,
      icons: (
        <>
          <AttachMoneyIcon {...iconCommonProps} />
          <ArrowDownwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'nameAsc',
      translation: translations.sortByNameAsc,
      icons: (
        <>
          <SortByAlphaIcon className="products-dashboard__sorting-alpha-icon" {...iconCommonProps} />
          <ArrowUpwardIcon {...iconCommonProps} />
        </>
      ),
    },
    {
      value: 'nameDesc',
      translation: translations.sortByNameDesc,
      icons: (
        <>
          <SortByAlphaIcon className="products-dashboard__sorting-alpha-icon" {...iconCommonProps} />
          <ArrowDownwardIcon {...iconCommonProps} />
        </>
      ),
    },
  ];

  const [sortByValueIndex, setSortByValueIndex] = useState(() =>
    sortOptions.findIndex(({ value }) => value === sortBy)
  );

  useEffect(() => {
    if (!sortBy) {
      setSortByValueIndex(-1);
    }
  }, [sortBy]);

  const handleChangeSortBy = ({
    nativeEvent: {
      target: { dataset },
    },
  }) => {
    const newIndex = Number(dataset.sortOptionIndex);
    const sortBy = dataset.value;

    setSortByValueIndex(newIndex);
    updateProductsDashboardQuery({ sortBy, pageNumber: 1 });
  };

  return (
    <FormControl
      classes={{ root: 'MuiButtonBase-root' }}
      className="products-dashboard__sorting-control MuiButton-root MuiButton-contained MuiButton-containedPrimary"
    >
      <label className="MuiButton-label" id="sort-by">
        {translations.sortBy}:
      </label>

      <Select
        className="products-dashboard__sorting-select-trigger"
        labelId="sort-by"
        value={sortOptions[sortByValueIndex]?.value || ''}
        onChange={handleChangeSortBy}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }}
        SelectDisplayProps={{ 'data-cy': 'button:trigger-sorting-select' }}
        inputProps={{ className: 'products-dashboard__sorting-select' }}
        renderValue={(value) => sortOptions.find((opt) => opt.value === value).icons}
      >
        {sortOptions.map(({ value, translation, icons }, index) => (
          <MenuItem value={value} data-sort-option-index={index} data-cy={`option:sort-by-${value}`} key={value}>
            <div className="products-dashboard__sorting-list-item pev-flex">{icons}</div>
            {translation}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ProductsDashboard() {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const searchParams = useMemo(() => routeHelpers.parseSearchParams(search), [search]);
  const updateProductsDashboardQuery = useMemo(
    () => routeHelpers.createProductsDashboardQueryUpdater(searchParams, pathname, history),
    [searchParams, pathname, history]
  );
  const [isFiltersSidebarCollapsed, setIsFiltersSidebarCollapsed] = useState(false);
  const [isFiltersMobileMenuVisible, setIsFiltersMobileMenuVisible] = useState(false);
  const [productPrice, setProductPrice] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productTechnicalSpecs, setProductTechnicalSpecs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const { isMobileLayout, isTabletLayout } = useRWDLayout();
  const { currentListViewModeClassName, switchListViewMode, listViewModeType } = useListViewModes();
  const isListControlBarSticky = useHandleListControlBarStickiness(isMobileLayout);

  useEffect(() => {
    handleBasePagination();
  }, [searchParams]);

  const handleBasePagination = () => {
    let { pageNumber, productsPerPage } = searchParams;

    // TODO: [UX] automatically set highest possible value when it's too high or show user a hint
    const productsPerPageAreBeyondNumLimitButNotInifinity =
      productsPerPage > productsPerPageLimits[productsPerPageLimits.length - 2] && productsPerPage !== Infinity;

    if (!productsPerPage) {
      // TODO: [UX] set initial products per page limit based on device that runs app (e.g. mobile should have lowest limit and PC highest)
      productsPerPage = productsPerPageLimits[0];
    } else if (productsPerPageAreBeyondNumLimitButNotInifinity) {
      productsPerPage = productsPerPageLimits[productsPerPageLimits.length - 2];
    }

    if (!pageNumber) {
      pageNumber = 1;
      updateProductsDashboardQuery({ pageNumber: 1 });
    } else if (pageNumber > productsPerPage) {
      pageNumber = productsPerPage;
    }

    updateProductsDashboardQuery({ pageNumber, productsPerPage });
  };
  const onProductsPerPageLimitChange = ({ target }) => {
    const productsPerPage = Number(target.options[target.selectedIndex].value);

    updateProductsDashboardQuery({ pageNumber: 1, productsPerPage });
  };
  const onProductPageChange = ({ selected: currentPageIndex }) => {
    updateProductsDashboardQuery({ pageNumber: currentPageIndex + 1 });
  };
  const getFiltersMobileMenuToggler = (shouldShow) => () => setIsFiltersMobileMenuVisible(shouldShow);

  const viewModeBtn = <ViewModeBtn viewModeType={listViewModeType} onClick={switchListViewMode} />;
  const sortingWidget = <Sorting {...{ sortBy: searchParams.sortBy, updateProductsDashboardQuery }} />;

  return (
    <article
      className={classNames('products-dashboard', {
        'products-dashboard--extended': isFiltersSidebarCollapsed,
      })}
    >
      <Filters
        {...{
          productPrice,
          productCategories,
          productTechnicalSpecs,
          isFiltersSidebarCollapsed,
          setIsFiltersSidebarCollapsed,
          isMobileLayout,
          isTabletLayout,
          isFiltersMobileMenuVisible,
          updateProductsDashboardQuery,
        }}
        closeFiltersMobileMenu={getFiltersMobileMenuToggler(false)}
      />

      {isMobileLayout ? (
        <aside
          className={classNames('products-dashboard__mobile-control-bar pev-flex', {
            'products-dashboard__mobile-control-bar--sticky': isListControlBarSticky,
          })}
        >
          <PEVButton
            onClick={getFiltersMobileMenuToggler(true)}
            variant="contained"
            color="primary"
            startIcon={<TuneIcon />}
          >
            {translations.showFilters}
          </PEVButton>
          {viewModeBtn}
          {sortingWidget}
        </aside>
      ) : (
        <Toolbar className="products-dashboard__topbar pev-flex" component="aside">
          {viewModeBtn}
          {sortingWidget}
        </Toolbar>
      )}

      <ProductsList
        {...{
          currentListViewModeClassName,
          listViewModeType,
          searchParams,
          settersProp: {
            setTotalPages,
            setCurrentProductPage,
            setProductPrice,
            setProductCategories,
            setProductTechnicalSpecs,
          },
        }}
      />

      {/* TODO: [UX] disable pagination list options, which are unnecessary, because of too little products */}
      <Toolbar className="products-dashboard__pagination">
        <Pagination
          itemsName="product"
          translations={paginationTranslations}
          totalPages={totalPages}
          currentItemPageIndex={currentProductPage - 1}
          itemLimitsPerPage={productsPerPageLimits}
          onItemsPerPageLimitChange={onProductsPerPageLimitChange}
          onItemPageChange={onProductPageChange}
        />
      </Toolbar>

      <ProductComparisonCandidatesList />
    </article>
  );
}
