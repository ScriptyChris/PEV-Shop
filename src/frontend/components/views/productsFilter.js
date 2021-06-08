import React, { memo, useCallback, useEffect, useRef, useState, Fragment } from 'react';
import { Formik } from 'formik';
import apiService from '../../features/apiService';

const translations = {
  filterUnavailable: 'Filters are not available',
};

const getControlsForSpecs = (() => {
  const TEMPLATE_FUNCTION_PER_CONTROL_TYPE = {
    inputNumber: getInputNumberControl,
    inputCheckbox: getInputCheckboxControl,
  };

  return function GetControlsForSpecs(
    formikRestProps,
    { _normalizedName: name, values, type, descriptions, _namesRangeMapping: namesRangeMapping }
  ) {
    const templateMethod = TEMPLATE_FUNCTION_PER_CONTROL_TYPE[type];

    if (typeof templateMethod !== 'function') {
      throw TypeError(`spec.type '${type}' was not recognized as a template method!`);
    }

    // TODO: make each <fieldset> collapsible
    return (
      <fieldset key={`spec${name}Filter`}>
        <legend>{name}</legend>
        {templateMethod(formikRestProps, name, namesRangeMapping[name], values, descriptions)}
      </fieldset>
    );
  };

  function getInputNumberControl(formikRestProps, specName, specRangeNames, specValue, specDescriptions) {
    return specValue.map(([vMin, vMax], index) => {
      const startIndex = index * 2;
      const endIndex = startIndex + 2;
      const specRangeName = specRangeNames.slice(startIndex, endIndex);
      const keyAndId = `spec${specName}Control${index}`;
      const areSpecDescriptions = Array.isArray(specDescriptions);

      return (
        <div key={keyAndId}>
          {areSpecDescriptions && <div id={keyAndId}>{specDescriptions[index]}</div>}

          <input
            aria-labelledby={areSpecDescriptions ? keyAndId : ''}
            type="number"
            min={vMin}
            name={specRangeName[0]}
            value={formikRestProps.values[specRangeName[0]]}
            onChange={formikRestProps.handleChange}
          />

          <span className="products-filter-form__range-separator">-</span>

          <input
            aria-labelledby={areSpecDescriptions ? keyAndId : ''}
            type="number"
            max={vMax}
            name={specRangeName[1]}
            value={formikRestProps.values[specRangeName[1]]}
            onChange={formikRestProps.handleChange}
          />
        </div>
      );
    });
  }

  function getInputCheckboxControl(formikRestProps, specName, _, specValue) {
    return specValue.map((val, index) => (
      <Fragment key={`spec${specName}Control${index}`}>
        <label>
          {val}
          <input
            type="checkbox"
            name={specName}
            value={formikRestProps.values[specName]}
            onChange={formikRestProps.handleChange}
          />
        </label>
      </Fragment>
    ));
  }
})();

function ProductsFilter({ selectedCategories }) {
  const productsSpecsPerCategory = useRef({});
  const [productSpecsPerSelectedCategory, setProductSpecsPerSelectedCategory] = useState([]);
  const [formInitials, setFormInitials] = useState({});
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

  useEffect(() => {
    setFormInitials(prepareFormInitialValues());
  }, [productSpecsPerSelectedCategory]);

  const getFormControls = useCallback(
    (formikRestProps) => {
      if (!productSpecsPerSelectedCategory.length) {
        return;
      }

      const getNameRangeMapping = (() => {
        const formInitialsKeys = Object.keys(formInitials);

        return (specName, specDescriptions) => ({
          [specName]: formInitialsKeys.filter((key) => {
            const pipedDescriptionsRegExp = Array.isArray(specDescriptions) ? `(${specDescriptions.join('|')})` : '';
            const regExp = new RegExp(`^${specName}${pipedDescriptionsRegExp}(Min|Max)?$`);

            return regExp.test(key);
          }),
        });
      })();

      return productSpecsPerSelectedCategory.map((spec) => {
        spec._normalizedName = spec.name.replaceAll(' ', '_');
        spec._namesRangeMapping = getNameRangeMapping(spec._normalizedName, spec.descriptions);

        return getControlsForSpecs(formikRestProps, spec);
      });
    },
    [productSpecsPerSelectedCategory, formInitials]
  );

  const prepareFormInitialValues = useCallback(() => {
    const createEntry = (name) => [name.replaceAll(' ', '_'), ''];
    const createMinMaxEntry = (name) => [createEntry(`${name}Min`), createEntry(`${name}Max`)];

    return Object.fromEntries(
      productSpecsPerSelectedCategory.flatMap(({ name, descriptions, values }) => {
        if (!Array.isArray(values[0])) {
          return [createEntry(name)];
        } else if (descriptions) {
          return descriptions.flatMap((desc) => createMinMaxEntry(`${name}${desc}`));
        } else {
          return values.flatMap(() => createMinMaxEntry(name));
        }
      })
    );
  }, [productSpecsPerSelectedCategory]);

  return Object.keys(productsSpecsPerCategory.current).length && Object.keys(formInitials).length ? (
    <Formik initialValues={formInitials}>
      {({ handleSubmit, ...formikRestProps }) => (
        <form onSubmit={handleSubmit} className="products-filter-form">
          {getFormControls(formikRestProps)}
        </form>
      )}
    </Formik>
  ) : (
    translations.filterUnavailable
  );
}

export default memo(
  ProductsFilter,
  (prevProps, nextProps) => prevProps.selectedCategories.length === nextProps.selectedCategories.length
);
