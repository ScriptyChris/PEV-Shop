import React, { memo, useCallback, useEffect, useRef, useState, Fragment } from 'react';
import apiService from '../../features/apiService';

const translations = {
  filterUnavailable: 'Filter is not available',
};

const getControlsForSpecs = (() => {
  const TEMPLATE_FUNCTION_PER_CONTROL_TYPE = {
    inputNumber: getInputNumberControl,
    inputCheckbox: getInputCheckboxControl,
  };

  return function GetControlsForSpecs(category, spec, i) {
    console.log('....category:', category);
    // TODO: make each <fieldset> collapsible
    return (
      <fieldset key={`category${category}Filter${i}`}>
        <legend>{spec.name}</legend>
        {TEMPLATE_FUNCTION_PER_CONTROL_TYPE[spec.type](category, spec)}
      </fieldset>
    );
  };

  function getInputNumberControl(category, { name, value }) {
    return value.map(([vMin, vMax], index) => (
      <input type="number" min={vMin} max={vMax} key={`spec${name}Control${index}`} />
    ));
  }

  function getInputCheckboxControl(category, { name, value }) {
    return value.map((val, index) => (
      <Fragment key={`spec${name}Control${index}`}>
        <label>
          {val}
          <input type="checkbox" />
        </label>
      </Fragment>
    ));
  }
})();

function ProductsFilter({ selectedCategories }) {
  const productsSpecsPerCategory = useRef([]);
  const [productSpecsPerSelectedCategory, setProductSpecsPerSelectedCategory] = useState([]);
  const filterSpecsPerCategory = useCallback(() => {
    const filteredSpecsPerCategory = productsSpecsPerCategory.current.filter((categoryToSpecsGroup) =>
      selectedCategories.includes(categoryToSpecsGroup.category)
    );

    if (filteredSpecsPerCategory.length) {
      setProductSpecsPerSelectedCategory(filteredSpecsPerCategory);
    } else {
      setProductSpecsPerSelectedCategory(productsSpecsPerCategory.current);
    }
  }, [productsSpecsPerCategory.current]);

  useEffect(() => {
    (async () => {
      productsSpecsPerCategory.current = await apiService.getProductsSpecifications();
      filterSpecsPerCategory();
    })();
  }, []);

  useEffect(filterSpecsPerCategory, [selectedCategories]);

  const getFormControls = useCallback(() => {
    if (productSpecsPerSelectedCategory.length === 0) {
      return translations.filterUnavailable;
    }

    return productSpecsPerSelectedCategory.map(({ category, specs }) =>
      specs.map((spec, i) => getControlsForSpecs(category, spec, i))
    );
  }, [productSpecsPerSelectedCategory]);

  return <form>{getFormControls()}</form>;
}

export default memo(
  ProductsFilter,
  (prevProps, nextProps) => prevProps.selectedCategories.length === nextProps.selectedCategories.length
);
