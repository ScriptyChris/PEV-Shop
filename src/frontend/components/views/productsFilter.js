import React, { memo, useCallback, useEffect, useRef, useState, Fragment, useMemo } from 'react';
import { Formik } from 'formik';
import apiService from '../../features/apiService';

const translations = {
  filterUnavailable: 'Filters are not available',
  minExceededMax: 'Min value should not be greater than max value',
  maxBeneathMin: 'Max value should not be lower than min value',
  normalizeContent(text) {
    return text.replace(/\W/g, CHARS.EMPTY).replace(/_/g, CHARS.SPACE);
  },
};

const CHARS = Object.freeze({
  EMPTY: '',
  SPACE: ' ',
  PIPE: '|',
  MIN: 'Min',
  MAX: 'Max',
  LETTERS_REGEXP: '[A-Z_a-z]+',
});
const SPEC_NAMES_SEPARATORS = Object.freeze({
  GAP: '_',
  LEVEL: '__',
  MIN_MAX: '--',
});

const matchRegExp = new RegExp(
  // eslint-disable-next-line no-useless-escape
  `^((?<block>${CHARS.LETTERS_REGEXP})(${SPEC_NAMES_SEPARATORS.LEVEL}))?(?<element>${CHARS.LETTERS_REGEXP})((${SPEC_NAMES_SEPARATORS.MIN_MAX})(?<modifier>${CHARS.LETTERS_REGEXP}))?$`
);
const parseInputName = (name) => name.match(matchRegExp).groups;

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
        <legend>{translations.normalizeContent(name)}</legend>
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
      const ariaLabelledBy = areSpecDescriptions ? keyAndId : CHARS.GAP;
      const erroredInputName =
        formikRestProps.errors && specRangeName.find((rangeName) => formikRestProps.errors[rangeName]);
      const errorValue = formikRestProps.errors[erroredInputName];

      return (
        <div key={keyAndId}>
          {areSpecDescriptions && <div id={keyAndId}>{translations.normalizeContent(specDescriptions[index])}</div>}

          <input
            aria-labelledby={ariaLabelledBy}
            type="number"
            min={vMin}
            max={vMax}
            name={specRangeName[0]}
            value={formikRestProps.values[specRangeName[0]]}
            onChange={formikRestProps.handleChange}
          />

          <span className="products-filter-form__range-separator">-</span>

          <input
            aria-labelledby={ariaLabelledBy}
            type="number"
            min={vMin}
            max={vMax}
            name={specRangeName[1]}
            value={formikRestProps.values[specRangeName[1]]}
            onChange={formikRestProps.handleChange}
          />

          {errorValue && <p className="products-filter-form__range-error">{translations[errorValue]}</p>}
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
  const lastChangedInputName = useRef('');
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
            const pipedDescriptionsRegExp = Array.isArray(specDescriptions)
              ? `(${SPEC_NAMES_SEPARATORS.LEVEL}(${specDescriptions.join(CHARS.PIPE)}))`
              : CHARS.EMPTY;
            const regExp = new RegExp(
              `^${specName}${pipedDescriptionsRegExp}(${SPEC_NAMES_SEPARATORS.MIN_MAX}(${CHARS.MIN}|${CHARS.MAX}))?$`
            );

            return regExp.test(key);
          }),
        });
      })();

      return productSpecsPerSelectedCategory.map((spec) => {
        spec._normalizedName = spec.name.replaceAll(CHARS.SPACE, SPEC_NAMES_SEPARATORS.GAP);
        spec._namesRangeMapping = getNameRangeMapping(spec._normalizedName, spec.descriptions);

        return getControlsForSpecs(formikRestProps, spec);
      });
    },
    [productSpecsPerSelectedCategory, formInitials]
  );

  const prepareFormInitialValues = useCallback(() => {
    const createEntry = (name) => [name.replaceAll(CHARS.SPACE, SPEC_NAMES_SEPARATORS.GAP), CHARS.EMPTY];
    const createMinMaxEntry = (name) => [
      createEntry(`${name}${SPEC_NAMES_SEPARATORS.MIN_MAX}${CHARS.MIN}`),
      createEntry(`${name}${SPEC_NAMES_SEPARATORS.MIN_MAX}${CHARS.MAX}`),
    ];

    return Object.fromEntries(
      productSpecsPerSelectedCategory.flatMap(({ name, descriptions, values }) => {
        if (!Array.isArray(values[0])) {
          return [createEntry(name)];
        } else if (descriptions) {
          return descriptions.flatMap((desc) => createMinMaxEntry(`${name}${SPEC_NAMES_SEPARATORS.LEVEL}${desc}`));
        } else {
          return values.flatMap(() => createMinMaxEntry(name));
        }
      })
    );
  }, [productSpecsPerSelectedCategory]);

  const changeHandler = ({ target }) => {
    lastChangedInputName.current = target.name;
  };

  const validateHandler = useMemo(() => {
    const cachedErrors = {};
    const getMinMaxCounterPart = (nameValuePairs, nameElement, nameModifier) => {
      const counterPartSuffix = nameModifier === CHARS.MIN ? CHARS.MAX : CHARS.MIN;

      return Object.keys(nameValuePairs).find((name) =>
        name.endsWith(`${nameElement}${SPEC_NAMES_SEPARATORS.MIN_MAX}${counterPartSuffix}`)
      );
    };

    return validator;

    function validator(values) {
      const parsedInputName = parseInputName(lastChangedInputName.current);
      const hasCounterPart = parsedInputName.modifier;

      if (!hasCounterPart) {
        return;
      }

      const minMaxCounterPart = getMinMaxCounterPart(values, parsedInputName.element, parsedInputName.modifier);
      const lastInputValue = values[lastChangedInputName.current];
      const counterPartInputValue = values[minMaxCounterPart];
      const errors = {
        [lastChangedInputName.current]: CHARS.EMPTY,
      };

      if (
        parsedInputName.modifier === CHARS.MIN &&
        counterPartInputValue !== CHARS.EMPTY &&
        counterPartInputValue < lastInputValue
      ) {
        errors[lastChangedInputName.current] = 'minExceededMax';
      } else if (
        parsedInputName.modifier === CHARS.MAX &&
        counterPartInputValue !== CHARS.EMPTY &&
        counterPartInputValue > lastInputValue
      ) {
        errors[lastChangedInputName.current] = 'maxBeneathMin';
      }

      cachedErrors[lastChangedInputName.current] = errors[lastChangedInputName.current];
      cachedErrors[minMaxCounterPart] = CHARS.EMPTY;

      return cachedErrors;
    }
  }, []);

  return Object.keys(productsSpecsPerCategory.current).length && Object.keys(formInitials).length ? (
    <Formik initialValues={formInitials} validate={validateHandler} onChange={changeHandler}>
      {({ handleSubmit, ...formikRestProps }) => {
        const _handleChange = formikRestProps.handleChange.bind(formikRestProps);
        formikRestProps.handleChange = function (event) {
          changeHandler(event);
          _handleChange(event);
        };

        return (
          <form onSubmit={handleSubmit} className="products-filter-form">
            {getFormControls(formikRestProps)}
          </form>
        );
      }}
    </Formik>
  ) : (
    translations.filterUnavailable
  );
}

export default memo(
  ProductsFilter,
  (prevProps, nextProps) => prevProps.selectedCategories.length === nextProps.selectedCategories.length
);
