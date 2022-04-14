import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ListIcon from '@material-ui/icons/List';
import Toolbar from '@material-ui/core/Toolbar';

import httpService from '@frontend/features/httpService';
import ProductCard from './productCard';
import Pagination from '@frontend/components/utils/pagination';
import CategoriesTree from './categoriesTree';
import { ProductComparisonCandidatesList } from './productComparisonCandidates';
import ProductsFilter from './productsFilter';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  lackOfProducts: 'Lack of products...',
  typeProductName: 'Type product name:',
  sortingMode: 'sorting',
};
const viewModeTranslations = {
  changeToDetails: 'details view',
  changeToTiles: 'tiles view',
};

function ViewModeBtn({ viewModeType, onClick, isMobileLayout }) {
  const color = isMobileLayout ? 'inherit' : 'primary';

  switch (viewModeType) {
    case 'details': {
      return (
        <Button
          onClick={onClick}
          startIcon={<ListIcon />}
          className="product-list-control-bar__buttons-view-mode"
          variant="contained"
          color={color}
          aria-label={viewModeTranslations.changeToDetails}
          title={viewModeTranslations.changeToDetails}
        >
          {viewModeTranslations.changeToDetails}
        </Button>
      );
    }
    case 'tiles': {
      return (
        <Button
          onClick={onClick}
          startIcon={<ViewModuleIcon />}
          className="product-list-control-bar__buttons-view-mode"
          variant="contained"
          color={color}
          aria-label={viewModeTranslations.changeToTiles}
          title={viewModeTranslations.changeToTiles}
        >
          {viewModeTranslations.changeToTiles}
        </Button>
      );
    }
    default: {
      throw TypeError(`Unrecognized viewModeType: '${viewModeType}'!`);
    }
  }
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
  const generateViewTypesMap = (targetIndex) =>
    viewTypes.reduce(
      (viewTypesMap, viewName, index) => ({
        ...viewTypesMap,
        [viewName]: index === targetIndex,
      }),
      {}
    );
  const matchViewTypeBtn = () => viewTypes[viewTypeIndex].match(/--(\w+)-/)[1];
  const [viewTypeIndex, setViewTypeIndex] = useState(0);
  const [listViewModes, setListViewModes] = useState({});
  const [listViewModesButton, setListViewModesButton] = useState(matchViewTypeBtn());

  useEffect(() => {
    setListViewModes(generateViewTypesMap(viewTypeIndex));
    setListViewModesButton(matchViewTypeBtn());
  }, [viewTypeIndex]);

  const updateViewTypeIndex = () => {
    setViewTypeIndex((index) => {
      const isLastViewType = index === viewTypes.length - 1;

      return isLastViewType ? 0 : index + 1;
    });
  };

  return {
    currentListViewModes: listViewModes,
    switchListViewModes: updateViewTypeIndex,
    listViewModesButton,
  };
}

export default function ProductList() {
  const { state: locationState } = useLocation();
  const [productsList, setProductsList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
  const [currentProductsPerPageLimit, setCurrentProductsPerPageLimit] = useState(productsPerPageLimits[0]);
  const [filterBtnDisabled, setFilterBtnDisabled] = useState(false);
  const isMobileLayout = useMobileLayout();
  const isListControlBarSticky = useHandleListControlBarStickiness(isMobileLayout);
  const { currentListViewModes, switchListViewModes, listViewModesButton } = useListViewModes();

  useEffect(() => {
    updateProductsList(locationState?.searchedProducts && { products: locationState.searchedProducts }).catch(
      (updateProductsListError) => {
        console.error('updateProductsListError:', updateProductsListError);
      }
    );
  }, [locationState]);

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
        'product-list-container--pc': !isMobileLayout,
        'product-list-control-bar--mobile': isMobileLayout,
      })}
    >
      {isMobileLayout ? (
        <aside
          className={classNames('product-list-control-bar', {
            'product-list-control-bar--sticky': isListControlBarSticky,
          })}
        >
          <div className="product-list-control-bar__buttons">
            <ViewModeBtn
              viewModeType={listViewModesButton}
              onClick={switchListViewModes}
              isMobileLayout={isMobileLayout}
            />

            <div>
              {/* TODO: [UX] presumably move CategoriesTree into ProductsFilter component */}
              <CategoriesTree onCategorySelect={onCategorySelect} isMultiselect={true} />

              <ProductsFilter
                selectedCategories={productCategories}
                onFiltersUpdate={handleFiltersUpdate}
                doFilterProducts={filterProducts}
                filterBtnDisabled={filterBtnDisabled}
              />

              {/* TODO: [UX] add sorting */}
              <IconButton onClick={handleSorting} aria-label={translations.sortBtn} title={translations.sortBtn}>
                <SortIcon />
              </IconButton>
            </div>
          </div>

          <Divider variant="fullWidth" />

          <ProductComparisonCandidatesList />
        </aside>
      ) : (
        <>
          <Paper component="aside" variant="outlined" className="product-list-control-sidebar">
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
          <Toolbar className="product-list-control-topbar" component="aside">
            <div className="product-list-control-topbar__buttons">
              <ViewModeBtn viewModeType={listViewModesButton} onClick={switchListViewModes} />

              {/* TODO: [UX] add sorting */}
              <Button
                onClick={handleSorting}
                startIcon={<SortIcon />}
                variant="contained"
                color="primary"
                aria-label={translations.sortingMode}
                title={translations.sortingMode}
              >
                {translations.sortingMode}
              </Button>
            </div>

            <ProductComparisonCandidatesList />
          </Toolbar>
        </>
      )}
      <ul className={classNames('product-list', currentListViewModes)}>
        {productsList.length > 0
          ? productsList.map((product) => (
              <li key={product.name}>
                <ProductCard product={product} />
              </li>
            ))
          : translations.lackOfProducts}
      </ul>

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
    </article>
  );
}
