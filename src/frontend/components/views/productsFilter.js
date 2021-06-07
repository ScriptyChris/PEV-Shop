import React, { memo, useCallback, useEffect, useRef, useState, Fragment } from 'react';
import apiService from '../../features/apiService';

const translations = {
  filterUnavailable: 'Filters are not available',
};

const getControlsForSpecs = (() => {
  const TEMPLATE_FUNCTION_PER_CONTROL_TYPE = {
    inputNumber: getInputNumberControl,
    inputCheckbox: getInputCheckboxControl,
  };

  return function GetControlsForSpecs({ name, value, type }) {
    const templateMethod = TEMPLATE_FUNCTION_PER_CONTROL_TYPE[type];

    if (typeof templateMethod !== 'function') {
      throw TypeError(`spec.type '${type}' was not recognized as a template method!`);
    }

    // TODO: make each <fieldset> collapsible
    return (
      <fieldset key={`spec${name}Filter`}>
        <legend>{name}</legend>
        {templateMethod(name, value)}
      </fieldset>
    );
  };

  function getInputNumberControl(specName, specValue) {
    return specValue.map(([vMin, vMax], index) => (
      <input type="number" min={vMin} max={vMax} key={`spec${specName}Control${index}`} />
    ));
  }

  function getInputCheckboxControl(specName, specValue) {
    return specValue.map((val, index) => (
      <Fragment key={`spec${specName}Control${index}`}>
        <label>
          {val}
          <input type="checkbox" />
        </label>
      </Fragment>
    ));
  }
})();

function ProductsFilter({ selectedCategories }) {
  const productsSpecsPerCategory = useRef({});
  const [productSpecsPerSelectedCategory, setProductSpecsPerSelectedCategory] = useState([]);
  const filterSpecsPerCategory = useCallback(() => {
    if (!Object.keys(productsSpecsPerCategory.current).length) {
      return;
    }

    const filteredSpecsPerCategory = productsSpecsPerCategory.current.categoryToSpecs.filter((categoryToSpecsGroup) =>
      selectedCategories.includes(categoryToSpecsGroup.category)
    );

    if (filteredSpecsPerCategory.length) {
      const uniqueSpecNames = [...new Set(filteredSpecsPerCategory.flatMap((catToSpecs) => catToSpecs.specs))];
      const uniqueSpecs = uniqueSpecNames.map((specName) =>
        productsSpecsPerCategory.current.specs.find((spec) => spec.name === specName)
      );

      setProductSpecsPerSelectedCategory(uniqueSpecs);
    } else {
      setProductSpecsPerSelectedCategory(productsSpecsPerCategory.current.specs);
    }
  }, [selectedCategories]);

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

    return productSpecsPerSelectedCategory.map((spec) => getControlsForSpecs(spec));
  }, [productSpecsPerSelectedCategory]);

  return <form>{getFormControls()}</form>;
}

export default memo(
  ProductsFilter,
  (prevProps, nextProps) => prevProps.selectedCategories.length === nextProps.selectedCategories.length
);
