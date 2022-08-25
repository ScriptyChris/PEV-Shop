import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListIcon from '@material-ui/icons/List';
import Toolbar from '@material-ui/core/Toolbar';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { PEVButton, PEVIconButton } from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import ProductCard, { PRODUCT_CARD_LAYOUT_TYPES } from './productCard';
import Pagination from '@frontend/components/utils/pagination';
import CategoriesTree from './categoriesTree';
import { ProductComparisonCandidatesList } from './productComparisonCandidates';
import ProductsFilter from './productsFilter';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  lackOfProducts: 'Lack of products...',
  typeProductName: 'Type product name:',
  sortingMode: 'choose sorting mode',
  sidebarToggleBtn: 'Toggle sidebar',
};
const viewModeTranslations = {
  changeToDetails: 'details view',
  changeToTiles: 'tiles view',
};

function ViewModeBtn({ viewModeType, onClick, isMobileLayout }) {
  const color = isMobileLayout ? 'inherit' : 'primary';
  const btnClassNamePart = isMobileLayout ? 'control' : 'top';
  const viewModeBtnDetails = {
    className: `product-list-${btnClassNamePart}-bar__view-mode-btn`,
  };

  switch (viewModeType) {
    case 'details': {
      viewModeBtnDetails.startIcon = ListIcon;
      viewModeBtnDetails.translation = viewModeTranslations.changeToDetails;

      break;
    }
    case 'tiles': {
      viewModeBtnDetails.startIcon = ViewModuleIcon;
      viewModeBtnDetails.translation = viewModeTranslations.changeToTiles;

      break;
    }
    default: {
      throw TypeError(`Unrecognized viewModeType: '${viewModeType}'!`);
    }
  }

  return (
    <PEVButton
      onClick={onClick}
      startIcon={<viewModeBtnDetails.startIcon />}
      className={viewModeBtnDetails.className}
      variant="contained"
      color={color}
    >
      {viewModeBtnDetails.translation}
    </PEVButton>
  );
}

const paginationTranslations = {
  itemsPerPageSuffix: 'produktów',
  allItems: 'Wszystkie produkty',
};

// TODO: setup this on backend and pass via some initial config to frontend
const productsPerPageLimits = [15, 30, 60, Infinity];

function useHandleListControlBarStickiness(isMobileLayout) {
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
}

function useListViewModes() {
  const viewTypes = ['product-list--details-view', 'product-list--tiles-view'];
  const getCurrentViewModeType = () => viewTypes[viewTypeIndex].match(/--(\w+)-/)[1];
  const [viewTypeIndex, setViewTypeIndex] = useState(0);
  const [listViewModeClassName, setListViewModeClassName] = useState('');
  const [listViewModeType, setListViewModeType] = useState(getCurrentViewModeType());

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

export default function ProductList() {
  const { state: locationState } = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
  const [currentProductsPerPageLimit, setCurrentProductsPerPageLimit] = useState(productsPerPageLimits[0]);
  const [filterBtnDisabled, setFilterBtnDisabled] = useState(false);
  const { isMobileLayout, isTabletLayout } = useRWDLayout();
  const isListControlBarSticky = useHandleListControlBarStickiness(isMobileLayout);
  const { currentListViewModeClassName, switchListViewMode, listViewModeType } = useListViewModes();

  useEffect(() => {
    updateProductsList(locationState?.searchedProducts && { products: locationState.searchedProducts }).catch(
      (updateProductsListError) => {
        console.error('updateProductsListError:', updateProductsListError);
      }
    );
  }, [locationState]);

  const onSidebarToggle = () => setIsSidebarCollapsed((prevState) => !prevState);

  const updateProductsList = async ({
    pageNumber = currentProductPage,
    productsPerPage = currentProductsPerPageLimit,
    productCategories = productCategories,
    productsFilters,
    products,
  } = {}) => {
    const isHighestProductsPerPage = productsPerPage === productsPerPageLimits[productsPerPageLimits.length - 1];

    if (isHighestProductsPerPage) {
      if (products) {
        setProductsList(products);
      } else {
        setProductsList(
          await httpService.getProducts({ productCategories, productsFilters }).then((res) => {
            if (res.__EXCEPTION_ALREADY_HANDLED) {
              return;
            }

            return res;
          })
        );
      }

      setTotalPages(1);
    } else {
      const pagination = { pageNumber, productsPerPage };

      if (!products) {
        products = await httpService.getProducts({ pagination, productCategories, productsFilters }).then((res) => {
          if (res.__EXCEPTION_ALREADY_HANDLED) {
            return;
          }

          return res;
        });
      }

      setProductsList(products.productsList);
      setTotalPages(products.totalPages);
    }

    setCurrentProductsPerPageLimit(productsPerPage);
    setCurrentProductPage(pageNumber);
  };

  const onProductsPerPageLimitChange = ({ target }) => {
    const productsPerPage = Number(target.options[target.selectedIndex].value);

    updateProductsList({ pageNumber: 1, productsPerPage }).then();
  };

  const onProductPageChange = ({ selected: currentPageIndex }) => {
    updateProductsList({ pageNumber: currentPageIndex + 1 }).then();
  };

  const onCategorySelect = (categories) => {
    setProductCategories(categories);
  };

  const handleFiltersUpdate = (filters) => {
    if (filters.isError !== filterBtnDisabled) {
      setFilterBtnDisabled(filters.isError);
    }

    if (!filters.isError) {
      console.log('filters.values:', filters.values);
      const productsFilters = Object.entries(filters.values).map((filter) => filter.join(':'));
      updateProductsList({ productsFilters }).then();
    }
  };

  const filterProducts = () => {
    updateProductsList({
      productCategories: productCategories.toString(),
    }).then();
  };

  const handleSorting = () => console.log('sorting is to be implemented...');

  return (
    <article
      className={classNames('product-list-container', {
        'product-list-container--extended': isSidebarCollapsed,
      })}
    >
      {isMobileLayout ? (
        <aside
          className={classNames('product-list-control-bar pev-flex', {
            'product-list-control-bar--sticky': isListControlBarSticky,
          })}
        >
          <ViewModeBtn viewModeType={listViewModeType} onClick={switchListViewMode} isMobileLayout={isMobileLayout} />

          {/* TODO: [UX] presumably move CategoriesTree into ProductsFilter component */}
          <CategoriesTree onCategorySelect={onCategorySelect} isMultiselect={true} />

          <ProductsFilter
            selectedCategories={productCategories}
            onFiltersUpdate={handleFiltersUpdate}
            doFilterProducts={filterProducts}
            filterBtnDisabled={filterBtnDisabled}
          />

          {/* TODO: [UX] add sorting */}
          <PEVIconButton onClick={handleSorting} a11y={translations.sortingMode}>
            <SortIcon />
          </PEVIconButton>
        </aside>
      ) : (
        <>
          <Paper
            component="aside"
            variant="outlined"
            className={classNames('product-list-control-sidebar', {
              'product-list-control-sidebar--collapsed': isSidebarCollapsed,
            })}
          >
            {isTabletLayout && (
              <PEVIconButton
                onClick={onSidebarToggle}
                className="product-list-control-sidebar__extend-toggle-btn"
                a11y={translations.sidebarToggleBtn}
              >
                {isSidebarCollapsed && <SettingsIcon fontSize="small" />}
                {isSidebarCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </PEVIconButton>
            )}

            {/* TODO: [UX] presumably move CategoriesTree into ProductsFilter component */}
            <CategoriesTree onCategorySelect={onCategorySelect} isMultiselect={true} />

            <Divider />

            <ProductsFilter
              selectedCategories={productCategories}
              onFiltersUpdate={handleFiltersUpdate}
              doFilterProducts={filterProducts}
              filterBtnDisabled={filterBtnDisabled}
            />
          </Paper>
          <Toolbar className="product-list-control-topbar pev-flex" component="aside">
            <ViewModeBtn viewModeType={listViewModeType} onClick={switchListViewMode} />

            {/* TODO: [UX] add sorting */}
            <PEVButton onClick={handleSorting} startIcon={<SortIcon />} variant="contained" color="primary">
              {translations.sortingMode}
            </PEVButton>
          </Toolbar>
        </>
      )}
      <List className={classNames('product-list', currentListViewModeClassName)}>
        {productsList.length > 0
          ? productsList.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                layoutType={listViewModeToProductCardLayoutMap[listViewModeType]}
                RenderedComponent={ListItem}
              />
            ))
          : translations.lackOfProducts}
      </List>

      {/* TODO: [UX] disable pagination list options, which are unnecessary, because of too little products */}
      <Toolbar className="product-list-pagination">
        <Pagination
          itemsName="product"
          translations={paginationTranslations}
          currentItemPageIndex={currentProductPage - 1}
          totalPages={totalPages}
          itemLimitsPerPage={productsPerPageLimits}
          onItemsPerPageLimitChange={onProductsPerPageLimitChange}
          onItemPageChange={onProductPageChange}
        />
      </Toolbar>

      <ProductComparisonCandidatesList />
    </article>
  );
}
