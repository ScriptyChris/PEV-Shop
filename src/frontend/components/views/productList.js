import React, { useEffect, useState } from 'react';
import apiService from '../../features/apiService';
import ProductItem from './productItem';
import Pagination from '../utils/pagination';
import CategoriesTree from './categoriesTree';
import CompareProducts from './compareProducts';
import { SearchProductsByName } from './search';
import ProductsFilter from './productsFilter';

const translations = {
  lackOfProducts: 'Brak produktów...',
  filterProducts: 'Filtruj produkty',
  typeProductName: 'Type product name:',
};
const paginationTranslations = {
  itemsPerPageSuffix: 'produktów',
  allItems: 'Wszystkie produkty',
};

// TODO: setup this on backend and pass via some initial config to frontend
const productsPerPageLimits = [15, 30, 60, Infinity];

export default function ProductList() {
  const [productsList, setProductsList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  // TODO: set initial products per page limit based on device that runs app (f.e. mobile should have lowest limit and PC highest)
  const [currentProductsPerPageLimit, setCurrentProductsPerPageLimit] = useState(productsPerPageLimits[0]);
  const [filterBtnDisabled, setFilterBtnDisabled] = useState(false);

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
      setProductsList(products || (await apiService.getProducts({ productCategories, productsFilters })));
      setTotalPages(1);
    } else {
      const pagination = { pageNumber, productsPerPage };
      products = products || (await apiService.getProducts({ pagination, productCategories, productsFilters }));

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
      <CategoriesTree onCategorySelect={onCategorySelect} />

      {/*TODO: disable pagination list options, which are unnecessary, because of too little products*/}
      <Pagination
        itemsName="product"
        translations={paginationTranslations}
        currentItemPageIndex={currentProductPage - 1}
        totalPages={totalPages}
        itemLimitsPerPage={productsPerPageLimits}
        onItemsPerPageLimitChange={onProductsPerPageLimitChange}
        onItemPageChange={onProductPageChange}
      />

      <ProductsFilter selectedCategories={productCategories} onFiltersUpdate={handleFiltersUpdate} />

      {/* TODO: move the button into ProductsFilter component, presumably with CategoriesTree */}
      <button onClick={filterProducts} disabled={filterBtnDisabled}>
        {translations.filterProducts}
      </button>

      <CompareProducts.List />

      <SearchProductsByName
        label={translations.typeProductName}
        searchingTarget="productName"
        debounceTimeMs={750}
        pagination={{ currentProductPage: 1, currentProductsPerPageLimit }}
        onReceivedProductsByName={handleSearchedProducts}
      />

      {/*TODO: implement changeable layout (tiles vs list)*/}
      <ul className="product-list">
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
    </>
  );
}
