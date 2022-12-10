import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ErrorMessage } from 'formik';
import classNames from 'classnames';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
  PEVForm,
  PEVHeading,
  PEVFieldset,
  PEVLegend,
  PEVParagraph,
  PEVTextField,
  PEVFormFieldError,
} from '@frontend/components/utils/pevElements';
import productSpecsService from '@frontend/features/productSpecsService';
import { FILTER_RANGE_SEPARATOR } from '@commons/consts';

const translations = {
  specsChooserHeader: 'Technical specs',
  technicalSpecsWidgetToggleButton: 'technical specs',
  technicalSpecsUnavailable: 'Technical specs are not available',
  goBackLabel: 'go back',
  toggleSpecControl: 'Toggle',
  apply: 'Apply',
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
    formikProps,
    filtersCommonChildrenAPI,
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

    // Enforce setting `shouldExpand` is done only once per component's life
    const [shouldExpand] = useState(namesRangeMapping[name].some((rangeName) => formikProps.values[rangeName]));

    return (
      <PEVFieldset key={`product-spec-${name}`}>
        {/* TODO: [UX] accordion should rather be fully expanded by default on PC */}
        <Accordion
          defaultExpanded={shouldExpand}
          onChange={(event, expanded) => {
            if (expanded) {
              const inputEl = event.currentTarget.nextElementSibling.querySelector('input');
              // TODO: [React-refactor] focus might better be done on `ref` not natively queried DOM element
              setTimeout(() => inputEl.focus());
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon data-cy={`button:product-spec-${name}`} />}
            aria-controls={`spec-${name}-content`}
            id={`spec-${name}-header`}
          >
            <PEVLegend className="products-spec-chooser__form-field-legend">{getLegendContent()}</PEVLegend>
          </AccordionSummary>
          <AccordionDetails className="products-spec-chooser__form-field-controls">
            {templateMethod(formikProps, filtersCommonChildrenAPI, name, namesRangeMapping[name], values, descriptions)}
          </AccordionDetails>
        </Accordion>
      </PEVFieldset>
    );
  };

  function getInputNumberControl(
    formikProps,
    filtersCommonChildrenAPI,
    specName,
    specRangeNames,
    specValues,
    specDescriptions
  ) {
    return specValues.map(([vMin, vMax], index) => {
      vMin = Math.floor(vMin);
      vMax = Math.ceil(vMax);

      const startIndex = index * 2;
      const endIndex = startIndex + 2;
      const specRangeName = specRangeNames.slice(startIndex, endIndex);
      const keyAndId = `spec${specName}Control${index}`;
      const areSpecDescriptions = Array.isArray(specDescriptions);
      const ariaLabelledBy = areSpecDescriptions ? keyAndId : CHARS.EMPTY;
      const erroredInputNames =
        (formikProps.errors && specRangeName.filter((rangeName) => formikProps.errors[rangeName])) || [];
      const errorList = erroredInputNames.map((inputName) => ({
        ...formikProps.errors[inputName],
        _name: inputName,
      }));
      const [minValue, maxValue] =
        specRangeName.length === 0 ? ['', ''] : specRangeName.map((item) => formikProps.values[item]);

      return (
        <div
          key={keyAndId}
          className={classNames({
            'products-spec-chooser__form-field-controls-level': !areSpecDescriptions,
            'products-spec-chooser__form-field-controls-nested': areSpecDescriptions,
          })}
        >
          {areSpecDescriptions && (
            <PEVParagraph id={keyAndId}>{translations.normalizeContent(specDescriptions[index])}</PEVParagraph>
          )}

          <div
            className={classNames({
              'products-spec-chooser__form-field-controls-level': areSpecDescriptions,
              'products-spec-chooser__form-field-controls-unnested': !areSpecDescriptions,
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
                onChange: formikProps.handleChange,
              }}
              onEnterKey={filtersCommonChildrenAPI.triggerFiltersNextCycle}
            />

            <span className="products-spec-chooser__form-range-separator">-</span>

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
                onChange: formikProps.handleChange,
              }}
              onEnterKey={filtersCommonChildrenAPI.triggerFiltersNextCycle}
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
                    component={PEVFormFieldError}
                    customMessage={errorMessage}
                  />
                );
              })}
          </div>
        </div>
      );
    });
  }

  function getInputCheckboxControl(formikProps, _, specName, __, specValues) {
    const value = formikProps.values[specName] === undefined ? '' : formikProps.values[specName];
    const normalizedSpecValues = specValues[0].map((specV) => specV.replaceAll(CHARS.SPACE, SPEC_NAMES_SEPARATORS.GAP));

    return normalizedSpecValues.map((val, index) => {
      const identity = `${specName}__${val}`;

      return (
        // TODO: [DX] refactor to use PEVCheckbox (which will most likely require refactoring of whole specs mechanism)
        <div className="products-spec-chooser__form-field-controls--vertical" key={`spec${specName}Control${index}`}>
          <Checkbox name={identity} id={identity} value={value} onChange={formikProps.handleChange} />
          <InputLabel key={`spec${specName}Control${index}`} htmlFor={identity}>
            {translations.normalizeContent(val)}
          </InputLabel>
        </div>
      );
    });
  }
})();

function FormControls({ formikProps, filtersCommonChildrenAPI, productSpecsPerSelectedCategory, formInitials }) {
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
        <GetControlsForSpecs {...{ formikProps, filtersCommonChildrenAPI, spec }} key={spec.name} />
      )
    );
  });
}

export default function TechnicalSpecsChooser({ productCategories, productTechnicalSpecs, filtersCommonChildrenAPI }) {
  const [formRenderingKeyIndex, setFormRenderingKeyIndex] = useState(0);
  const productsSpecsPerCategory = useRef({});
  const cachedValidationErrors = useRef({});
  const [productSpecsPerSelectedCategory, setProductSpecsPerSelectedCategory] = useState([]);
  const [formInitials, setFormInitials] = useState({});
  const externalSubmitTriggerRef = useRef();
  const lastChangedInputMeta = useRef({
    name: CHARS.EMPTY,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
  });
  const chosenTechnicalSpecsOutputRef = useRef({});
  const filterSpecsPerCategory = useCallback(() => {
    if (!Object.keys(productsSpecsPerCategory.current).length) {
      return;
    }

    const filteredSpecsPerCategory = productsSpecsPerCategory.current.categoryToSpecs.filter((categoryToSpecsGroup) =>
      productCategories.includes(categoryToSpecsGroup.category)
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
  }, [productCategories]);
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
  const validateHandler = useMemo(() => {
    const getMinMaxCounterPart = (nameValuePairs, nameElement, nameModifier) => {
      const counterPartSuffix = nameModifier === CHARS.MIN ? CHARS.MAX : CHARS.MIN;

      return Object.keys(nameValuePairs).find((name) =>
        name.endsWith(`${nameElement}${SPEC_NAMES_SEPARATORS.MIN_MAX}${counterPartSuffix}`)
      );
    };

    const prepareSpecsUpdate = (values) => {
      // TODO: this should be rather provided by backend
      const _singleSpecWithMultipleValues = ['colour'];
      const normalizedSingleToMultipleSpecs = Object.entries(values)
        .filter(([specName]) => _singleSpecWithMultipleValues.find((spec) => specName.startsWith(spec)))
        .reduce((singleSpecs, [specKey, specChecked]) => {
          if (!specKey.includes(SPEC_NAMES_SEPARATORS.LEVEL) || !specChecked) {
            return singleSpecs;
          }

          const [specName, specValue] = specKey.split(SPEC_NAMES_SEPARATORS.LEVEL);

          if (!singleSpecs[specName]) {
            singleSpecs[specName] = [];
          }

          singleSpecs[specName].push(specValue);
          return singleSpecs;
        }, {});

      const touchedValues = Object.fromEntries([
        ...Object.entries(values).filter(([specName, specValue]) => {
          const matchedSpecName = _singleSpecWithMultipleValues.find((spec) => specName.startsWith(spec));
          return specValue !== CHARS.EMPTY && !matchedSpecName;
        }),
        ...Object.entries(normalizedSingleToMultipleSpecs).map(([specName, specValues]) => [
          specName,
          specValues.join(CHARS.PIPE),
        ]),
      ]);

      return touchedValues;
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
      const hasCounterPart = !!parsedInputName.modifier;

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

        const isAnyCurrentError = Object.values(errors[lastChangedInputName]).some(Boolean);
        if (isAnyCurrentError) {
          cachedValidationErrors.current[lastChangedInputName] = errors[lastChangedInputName];
        } else {
          delete cachedValidationErrors.current[lastChangedInputName];
        }

        if (
          !errors[lastChangedInputName].conflictWithCounterPart &&
          cachedValidationErrors.current[minMaxCounterPartName]?.conflictWithCounterPart
        ) {
          delete cachedValidationErrors.current[minMaxCounterPartName].conflictWithCounterPart;

          if (Object.values(cachedValidationErrors.current[minMaxCounterPartName])) {
            delete cachedValidationErrors.current[minMaxCounterPartName];
          }
        }
      }

      const touchedValues = prepareSpecsUpdate(values);
      chosenTechnicalSpecsOutputRef.current = touchedValues;

      filtersCommonChildrenAPI.requestTogglingSubmitBtnDisability(
        filtersCommonChildrenAPI.filterNamesMap.productTechnicalSpecs,
        !!Object.values(cachedValidationErrors.current).length
      );

      return cachedValidationErrors.current;
    }
  }, [formInitials]);

  useEffect(() => {
    (async () => {
      productsSpecsPerCategory.current = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);
      filterSpecsPerCategory();
    })();
  }, []);

  useEffect(filterSpecsPerCategory, [productCategories]);

  useEffect(() => {
    setFormInitials(prepareFormInitialValues());
  }, [productSpecsPerSelectedCategory]);

  useEffect(() => {
    if (!Object.keys(formInitials).length || !productSpecsPerSelectedCategory.length) {
      return;
    }

    const technicalSpecsToUpdate = productTechnicalSpecs.map((spec) => {
      let [key, value] = spec.split(FILTER_RANGE_SEPARATOR);

      const valueAsNum = Number(value);
      if (valueAsNum !== value) {
        value = valueAsNum;
      }

      return [key, value];
    });

    setFormRenderingKeyIndex((prev) => prev + 1);
    setFormInitials((prev) => ({
      ...prev,
      ...Object.fromEntries(technicalSpecsToUpdate),
    }));
  }, [productTechnicalSpecs, productSpecsPerSelectedCategory]);

  useEffect(() => {
    if (filtersCommonChildrenAPI.renderIndex === 0) {
      return;
    }

    externalSubmitTriggerRef.current?.();
  }, [filtersCommonChildrenAPI?.renderIndex]);

  if (!Object.keys(productsSpecsPerCategory.current).length || !Object.keys(formInitials).length) {
    /*
      TODO: [UX] on mobile this rather should be implemented as disabled button or one showing regarding tooltip.
      Otherwise, layout is misaligned by the feedback text.
    */
    return translations.technicalSpecsUnavailable;
  }

  const handleOnChange = ({ target }) => {
    lastChangedInputMeta.current.name = target.name;
    lastChangedInputMeta.current.min = Number(target.min);
    lastChangedInputMeta.current.max = Number(target.max);
  };

  const handleSubmit = () => {
    if (Object.values(cachedValidationErrors.current).length) {
      return;
    }

    const filterValuesOutput = Object.entries(chosenTechnicalSpecsOutputRef.current).map((specs) =>
      specs.join(FILTER_RANGE_SEPARATOR)
    );
    filtersCommonChildrenAPI.tryUpdatingFiltersCycleData(
      filtersCommonChildrenAPI.filterNamesMap.productTechnicalSpecs,
      filterValuesOutput
    );
  };

  const formInitiallyTouched = Object.fromEntries(
    Object.entries(formInitials)
      .filter(([, value]) => !!value || value === 0)
      .map(([key]) => [key, true])
  );

  return (
    <section>
      <PEVHeading level={3}>{translations.specsChooserHeader}</PEVHeading>
      <PEVForm
        className="products-spec-chooser__form pev-flex pev-flex--columned"
        data-cy="container:products-spec-chooser"
        initialValues={formInitials}
        initialTouched={formInitiallyTouched}
        validate={validateHandler}
        onSubmit={handleSubmit}
        key={formRenderingKeyIndex}
      >
        {(formikProps) => {
          const _handleChange = formikProps.handleChange.bind(formikProps);
          formikProps.handleChange = function (event) {
            handleOnChange(event);
            _handleChange(event);
          };
          externalSubmitTriggerRef.current = formikProps.handleSubmit.bind(formikProps);

          return (
            <FormControls
              {...{ formikProps, filtersCommonChildrenAPI, productSpecsPerSelectedCategory, formInitials }}
            />
          );
        }}
      </PEVForm>
    </section>
  );
}
