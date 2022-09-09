import React, { useCallback, useEffect, useRef, useState, useMemo, memo } from 'react';
import { ErrorMessage } from 'formik';
import classNames from 'classnames';

import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Tune from '@material-ui/icons/Tune';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
  PEVForm,
  PEVButton,
  PEVIconButton,
  PEVHeading,
  PEVFieldset,
  PEVLegend,
  PEVParagraph,
  PEVTextField,
} from '@frontend/components/utils/pevElements';
import productSpecsService from '@frontend/features/productSpecsService';
import FormFieldError from '@frontend/components/utils/formFieldError';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  filtersHeader: 'Filters',
  filtersWidgetToggleButton: 'filters',
  filterUnavailable: 'Filters are not available',
  goBackLabel: 'go back',
  toggleSpecControl: 'Toggle',
  filterProducts: 'Apply filters',
  minExceededMax: 'Min value must be lower than or equal to max value!',
  maxBeneathMin: 'Max value must be greater than or equal to min value!',
  inputRangeFrom: 'from',
  inputRangeTo: 'to',
  getBeyondValueRange({ boundaryName, boundaryValue }) {
    if (!boundaryName || !boundaryValue) {
      throw ReferenceError(`boundaryName: ${boundaryName} and boundaryValue: ${boundaryValue} must not be empty!`);
    }

    if (boundaryName === CHARS.MIN) {
      return `Min value must be greater than or equal to ${boundaryValue}!`;
    } else if (boundaryName === CHARS.MAX) {
      return `Max value must be less than or equal to ${boundaryValue}!`;
    }

    throw TypeError(`boundaryName: ${boundaryName} was not recognized!`);
  },
  normalizeContent(text) {
    return text
      .replace(/\W/g, CHARS.EMPTY)
      .replace(/_/g, CHARS.SPACE)
      .replace(/\w/, (match) => match.toUpperCase());
  },
};

const CHARS = Object.freeze({
  EMPTY: '',
  SPACE: ' ',
  PIPE: '|',
  MIN: 'min',
  MAX: 'max',
  LETTERS_REGEXP: '[A-Z_a-z]+',
});
const SPEC_NAMES_SEPARATORS = Object.freeze({
  GAP: '_',
  LEVEL: '__',
  MIN_MAX: '--',
});

const matchRegExp = new RegExp(
  `^((?<block>${CHARS.LETTERS_REGEXP})(${SPEC_NAMES_SEPARATORS.LEVEL}))?(?<element>${CHARS.LETTERS_REGEXP})((${SPEC_NAMES_SEPARATORS.MIN_MAX})(?<modifier>${CHARS.LETTERS_REGEXP}))?$`
);
const parseInputName = (name) => name.match(matchRegExp).groups;

const GetControlsForSpecs = (() => {
  const TEMPLATE_FUNCTION_PER_CONTROL_TYPE = {
    NUMBER: getInputNumberControl,
    CHOICE: getInputCheckboxControl,
  };

  return function _GetControlsForSpecs({
    formikRestProps,
    spec: { _normalizedName: name, values, type, descriptions, defaultUnit, _namesRangeMapping: namesRangeMapping },
  }) {
    const templateMethod = TEMPLATE_FUNCTION_PER_CONTROL_TYPE[type];
    if (typeof templateMethod !== 'function') {
      throw TypeError(`spec.type '${type}' was not recognized as a template method!`);
    }

    const getLegendContent = () => {
      const defaultUnitOutput = defaultUnit ? `(${defaultUnit})` : '';

      return `${translations.normalizeContent(name)} ${defaultUnitOutput}`;
    };

    return (
      <PEVFieldset key={`spec${name}Filter`}>
        {/* TODO: [UX] accordion should rather be fully expanded by default on PC */}
        <Accordion
          onChange={(event, expanded) => {
            if (expanded) {
              const inputEl = event.currentTarget.nextElementSibling.querySelector('input');
              // TODO: [React-refactor] focus might better be done on `ref` not natively queried DOM element
              setTimeout(() => inputEl.focus());
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon data-cy={`button:product-filter__${name}`} />}
            aria-controls={`spec-${name}-content`}
            id={`spec-${name}-header`}
          >
            <PEVLegend className="products-filter__form-field-legend">{getLegendContent()}</PEVLegend>
          </AccordionSummary>
          <AccordionDetails className="products-filter__form-field-controls">
            {templateMethod(formikRestProps, name, namesRangeMapping[name], values, descriptions)}
          </AccordionDetails>
        </Accordion>
      </PEVFieldset>
    );
  };

  function getInputNumberControl(formikRestProps, specName, specRangeNames, specValue, specDescriptions) {
    return specValue.map(([vMin, vMax], index) => {
      vMin = Math.floor(vMin);
      vMax = Math.ceil(vMax);

      const startIndex = index * 2;
      const endIndex = startIndex + 2;
      const specRangeName = specRangeNames.slice(startIndex, endIndex);
      const keyAndId = `spec${specName}Control${index}`;
      const areSpecDescriptions = Array.isArray(specDescriptions);
      const ariaLabelledBy = areSpecDescriptions ? keyAndId : CHARS.EMPTY;
      const erroredInputNames =
        (formikRestProps.errors && specRangeName.filter((rangeName) => formikRestProps.errors[rangeName])) || [];
      const errorList = erroredInputNames.map((inputName) => ({
        ...formikRestProps.errors[inputName],
        _name: inputName,
      }));
      const [minValue, maxValue] =
        specRangeName.length === 0 ? ['', ''] : specRangeName.map((item) => formikRestProps.values[item]);

      return (
        <div
          key={keyAndId}
          className={classNames({
            'products-filter__form-field-controls-level': !areSpecDescriptions,
            'products-filter__form-field-controls-nested': areSpecDescriptions,
          })}
        >
          {areSpecDescriptions && (
            <PEVParagraph id={keyAndId}>{translations.normalizeContent(specDescriptions[index])}</PEVParagraph>
          )}

          <div
            className={classNames({
              'products-filter__form-field-controls-level': areSpecDescriptions,
              'products-filter__form-field-controls-unnested': !areSpecDescriptions,
            })}
            aria-label={`${specName}${areSpecDescriptions ? '-' + keyAndId : ''}`}
          >
            <PEVTextField
              labelInside
              label={translations.inputRangeFrom}
              identity={specRangeName[0]}
              type="number"
              inputProps={{
                min: vMin,
                max: vMax,
                name: specRangeName[0],
                value: minValue,
              }}
              overrideProps={{
                onChange: formikRestProps.handleChange,
              }}
            />

            <span className="products-filter__form-range-separator">-</span>

            <PEVTextField
              labelInside
              label={translations.inputRangeTo}
              identity={specRangeName[1]}
              type="number"
              inputProps={{
                min: vMin,
                max: vMax,
                name: specRangeName[1],
                value: maxValue,
              }}
              overrideProps={{
                onChange: formikRestProps.handleChange,
              }}
            />

            {errorList.length > 0 &&
              errorList.map((errorObj, index) => {
                let errorMessage = '';

                if (errorObj.conflictWithCounterPart) {
                  errorMessage = translations[errorObj.conflictWithCounterPart];
                } else if (errorObj.beyondValueRange) {
                  errorMessage = translations.getBeyondValueRange(errorObj.beyondValueRange);
                }

                return (
                  <ErrorMessage
                    name={errorObj._name}
                    key={`${ariaLabelledBy}-error${index}`}
                    component={FormFieldError}
                    customMessage={errorMessage}
                  />
                );
              })}
          </div>
        </div>
      );
    });
  }

  function getInputCheckboxControl(formikRestProps, specName, _, specValue) {
    const value = formikRestProps.values[specName] === undefined ? '' : formikRestProps.values[specName];
    const normalizedSpecValues = specValue[0].map((specV) => specV.replaceAll(CHARS.SPACE, SPEC_NAMES_SEPARATORS.GAP));

    return normalizedSpecValues.map((val, index) => {
      const identity = `${specName}__${val}`;

      return (
        // TODO: [DX] refactor to use PEVCheckbox (which will most likely require refactoring of whole specs mechanism)
        <div className="products-filter__form-field-controls--vertical" key={`spec${specName}Control${index}`}>
          <Checkbox name={identity} id={identity} value={value} onChange={formikRestProps.handleChange} />
          <InputLabel key={`spec${specName}Control${index}`} htmlFor={identity}>
            {translations.normalizeContent(val)}
          </InputLabel>
        </div>
      );
    });
  }
})();

function ProductsFilter({ selectedCategories, onFiltersUpdate, doFilterProducts, filterBtnDisabled }) {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const productsSpecsPerCategory = useRef({});
  const cachedValidationErrors = useRef({});
  const [productSpecsPerSelectedCategory, setProductSpecsPerSelectedCategory] = useState([]);
  const [formInitials, setFormInitials] = useState({});
  const { isMobileLayout } = useRWDLayout();
  const lastChangedInputMeta = useRef({
    name: CHARS.EMPTY,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
  });
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
      productsSpecsPerCategory.current = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);
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

        return (
          spec._namesRangeMapping[spec._normalizedName]?.length && (
            <GetControlsForSpecs formikRestProps={formikRestProps} spec={spec} key={spec.name} />
          )
        );
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
    lastChangedInputMeta.current.name = target.name;
    lastChangedInputMeta.current.min = Number(target.min);
    lastChangedInputMeta.current.max = Number(target.max);
  };

  const validateHandler = useMemo(() => {
    const getMinMaxCounterPart = (nameValuePairs, nameElement, nameModifier) => {
      const counterPartSuffix = nameModifier === CHARS.MIN ? CHARS.MAX : CHARS.MIN;

      return Object.keys(nameValuePairs).find((name) =>
        name.endsWith(`${nameElement}${SPEC_NAMES_SEPARATORS.MIN_MAX}${counterPartSuffix}`)
      );
    };

    return validator;

    function validator(values) {
      const {
        name: lastChangedInputName,
        min: lastChangedInputMinValue,
        max: lastChangedInputMaxValue,
      } = lastChangedInputMeta.current;

      // TODO: this quick fix may need to be improved and should only matter when inputs are empty
      if (lastChangedInputName === '') {
        return cachedValidationErrors.current;
      }

      const parsedInputName = parseInputName(lastChangedInputName);
      const hasCounterPart = parsedInputName.modifier;

      if (hasCounterPart) {
        const minMaxCounterPartName = getMinMaxCounterPart(values, parsedInputName.element, parsedInputName.modifier);
        const lastInputValue = values[lastChangedInputName];
        const counterPartInputValue = values[minMaxCounterPartName];
        const errors = {
          [lastChangedInputName]: {
            conflictWithCounterPart: CHARS.EMPTY,
            beyondValueRange: undefined,
          },
        };

        if (counterPartInputValue !== CHARS.EMPTY) {
          if (parsedInputName.modifier === CHARS.MIN && counterPartInputValue < lastInputValue) {
            errors[lastChangedInputName].conflictWithCounterPart = 'minExceededMax';
          } else if (parsedInputName.modifier === CHARS.MAX && counterPartInputValue > lastInputValue) {
            errors[lastChangedInputName].conflictWithCounterPart = 'maxBeneathMin';
          }
        }

        if (lastInputValue !== CHARS.EMPTY) {
          if (lastInputValue < lastChangedInputMinValue) {
            errors[lastChangedInputName].beyondValueRange = {
              boundaryName: CHARS.MIN,
              boundaryValue: lastChangedInputMinValue,
            };
          } else if (lastInputValue > lastChangedInputMaxValue) {
            errors[lastChangedInputName].beyondValueRange = {
              boundaryName: CHARS.MAX,
              boundaryValue: lastChangedInputMaxValue,
            };
          }
        }

        const isAnyError = Object.values(errors[lastChangedInputName]).some(Boolean);
        if (isAnyError) {
          cachedValidationErrors.current[lastChangedInputName] = errors[lastChangedInputName];
        } else {
          delete cachedValidationErrors.current[lastChangedInputName];
        }

        if (cachedValidationErrors.current[minMaxCounterPartName]) {
          cachedValidationErrors.current[minMaxCounterPartName].conflictWithCounterPart = CHARS.EMPTY;
        }
      }

      prepareFiltersUpdate(Object.values(cachedValidationErrors.current).some(Boolean), values);

      return cachedValidationErrors.current;
    }
  }, [formInitials, onFiltersUpdate]);

  const prepareFiltersUpdate = (isError, values) => {
    // TODO: this should be rather provided by backend
    const _singleFilterWithMultipleValues = ['colour'];
    const normalizedSingleToMultipleFilters = Object.entries(values)
      .filter(([filterName]) => _singleFilterWithMultipleValues.find((filter) => filterName.startsWith(filter)))
      .reduce((singleFilters, [filterKey, filterChecked]) => {
        if (!filterKey.includes(SPEC_NAMES_SEPARATORS.LEVEL) || !filterChecked) {
          return singleFilters;
        }

        const [filterName, filterValue] = filterKey.split(SPEC_NAMES_SEPARATORS.LEVEL);

        if (!singleFilters[filterName]) {
          singleFilters[filterName] = [];
        }

        singleFilters[filterName].push(filterValue);
        return singleFilters;
      }, {});

    const touchedValues = Object.fromEntries([
      ...Object.entries(values).filter(([filterName, filterValue]) => {
        const matchedFilterName = _singleFilterWithMultipleValues.find((filter) => filterName.startsWith(filter));
        return formInitials[filterName] !== filterValue && !matchedFilterName;
      }),
      ...Object.entries(normalizedSingleToMultipleFilters).map(([filterName, filterValues]) => [
        filterName,
        filterValues.join(CHARS.PIPE),
      ]),
    ]);

    onFiltersUpdate({ isError, values: touchedValues });
  };

  const handleFiltersWidgetToggle = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  if (!Object.keys(productsSpecsPerCategory.current).length || !Object.keys(formInitials).length) {
    /*
      TODO: [UX] on mobile this rather should be implemented as disabled filtering button or one showing regarding tooltip.
      Otherwise, layout is misaligned by the feedback text.
    */
    return translations.filterUnavailable;
  }

  const filterForm = (
    <PEVForm
      initialValues={formInitials}
      validate={validateHandler}
      onChange={changeHandler}
      overrideRenderFn={({ handleSubmit, ...formikRestProps }) => {
        const _handleChange = formikRestProps.handleChange.bind(formikRestProps);
        formikRestProps.handleChange = function (event) {
          // TODO: remove this when form will be submitted via button, not dynamically
          formikRestProps.setFieldTouched(event.target.name, true, false);

          changeHandler(event);
          _handleChange(event);
        };

        return (
          <form
            className="products-filter__form pev-flex pev-flex--columned"
            onSubmit={handleSubmit}
            data-cy="container:products-filter"
          >
            {getFormControls(formikRestProps)}
            <PEVButton
              type="button"
              className="products-filter__submit-btn"
              onClick={doFilterProducts}
              disabled={filterBtnDisabled}
            >
              {translations.filterProducts}
            </PEVButton>
          </form>
        );
      }}
    />
  );

  return isMobileLayout ? (
    <>
      <PEVIconButton onClick={handleFiltersWidgetToggle} a11y={translations.filtersWidgetToggleButton}>
        <Tune />
      </PEVIconButton>

      <Drawer anchor="left" open={isFormExpanded} onClose={handleFiltersWidgetToggle}>
        <section className="products-filter pev-flex pev-flex--columned">
          <header className="products-filter__header">
            <PEVIconButton
              onClick={handleFiltersWidgetToggle}
              className="products-filter__close-btn"
              a11y={translations.goBackLabel}
            >
              <CloseIcon />
            </PEVIconButton>

            <PEVHeading className="pev-centered-padded-text" level={3}>
              {translations.filtersHeader}
            </PEVHeading>
          </header>

          {filterForm}
        </section>
      </Drawer>
    </>
  ) : (
    <section>
      <PEVHeading level={3}>{translations.filtersHeader}</PEVHeading>
      {filterForm}
    </section>
  );
}

export default memo(
  ProductsFilter,
  (prevProps, nextProps) =>
    prevProps.onFiltersUpdate === nextProps.onFiltersUpdate &&
    prevProps.selectedCategories.length === nextProps.selectedCategories.length
);
