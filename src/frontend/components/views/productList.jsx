import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import httpService from '@frontend/features/httpService';
import ProductItem from './productItem';
import Pagination from '@frontend/components/utils/pagination';
import CategoriesTree from './categoriesTree';
import CompareProducts from './compareProducts';
import { SearchProductsByName } from './search';
import ProductsFilter from './productsFilter';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  lackOfProducts: 'Lack of products...',
  typeProductName: 'Type product name:',
};
const viewModeTranslations = {
  changeToDetails: 'Details view',
  changeToTiles: 'Tiles view',
};
const paginationTranslations = {
  itemsPerPageSuffix: 'produktów',
  allItems: 'Wszystkie produkty',
};

// TODO: setup this on backend and pass via some initial config to frontend
const productsPerPageLimits = [15, 30, 60, Infinity];

function useHandleListControlBarStickiness() {
  const isMobileLayout = useMobileLayout();
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

  const startListening = () => document.addEventListener('scroll', scrollListener);
  const stopListening = () => document.removeEventListener('scroll', scrollListener);

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
  const matchViewTypeTranslation = () => {
    const viewType = viewTypes[viewTypeIndex].match(/--(\w+)-/)[1];
    const viewTypeTranslation = Object.entries(viewModeTranslations).find(([key]) =>
      key.toLowerCase().includes(viewType)
    )[1];

    return viewTypeTranslation;
  };
  const [viewTypeIndex, setViewTypeIndex] = useState(0);
  const [listViewModes, setListViewModes] = useState({});
  const [listViewModesButtonText, setListViewModesButtonText] = useState('');

  useEffect(() => {
    setListViewModes(generateViewTypesMap(viewTypeIndex));
    setListViewModesButtonText(matchViewTypeTranslation());
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
    listViewModesButtonText,
  };
}

export default function ProductList() {
  const [productsList, setProductsList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
  const [currentProductsPerPageLimit, setCurrentProductsPerPageLimit] = useState(productsPerPageLimits[0]);
  const [filterBtnDisabled, setFilterBtnDisabled] = useState(false);
  const isListControlBarSticky = useHandleListControlBarStickiness();
  const { currentListViewModes, switchListViewModes, listViewModesButtonText } = useListViewModes();

  useEffect(() => {
    updateProductsList().catch((updateProductsListError) => {
      console.error('updateProductsListError:', updateProductsListError);
    });
  }, []);

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

  const handleSearchedProducts = async (products) => {
    updateProductsList({ products: await products }).then();
  };

  return (
    <>
      <div
        className={classNames('product-list-control-bar', {
          'product-list-control-bar--sticky': isListControlBarSticky,
        })}
      >
        <SearchProductsByName
          label={translations.typeProductName}
          searchingTarget="productName"
          debounceTimeMs={750}
          pagination={{ currentProductPage: 1, currentProductsPerPageLimit }}
          onReceivedProductsByName={handleSearchedProducts}
        />

        {/* TODO: [UX] presumably move CategoriesTree into ProductsFilter component */}
        <CategoriesTree onCategorySelect={onCategorySelect} isMultiselect={true} />

        <ProductsFilter
          selectedCategories={productCategories}
          onFiltersUpdate={handleFiltersUpdate}
          doFilterProducts={filterProducts}
          filterBtnDisabled={filterBtnDisabled}
        />

        {/* TODO: [UX] add an icon representing current view mode and switch it accordingly */}
        <button onClick={switchListViewModes} className="product-list-view-mode-button">
          {listViewModesButtonText}
        </button>
      </div>

      <CompareProducts.List />

      <ul className={classNames('product-list', currentListViewModes)}>
        {productsList.length > 0
          ? productsList.map((product) => {
              return (
                <li key={product.name}>
                  <ProductItem product={product} />
                </li>
              );
            })
          : translations.lackOfProducts}
      </ul>

      {/* TODO: [UX] disable pagination list options, which are unnecessary, because of too little products */}
      <Pagination
        itemsName="product"
        translations={paginationTranslations}
        currentItemPageIndex={currentProductPage - 1}
        totalPages={totalPages}
        itemLimitsPerPage={productsPerPageLimits}
        onItemsPerPageLimitChange={onProductsPerPageLimitChange}
        onItemPageChange={onProductPageChange}
      />
    </>
  );
}
