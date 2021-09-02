import React, { useEffect, useState, useRef } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import apiService from '../../features/apiService';
import productSpecsService from '../../features/productSpecsService';
import { CategoriesTreeFormField } from '../views/categoriesTree';
import FormFieldError from '../utils/formFieldError';

const translations = {
  intro: 'Fill new product details',
  baseInformation: 'Basic information',
  technicalSpecs: 'Technical specification',
  chooseCategoryFirst: 'please, choose category first',
  name: 'Name',
  price: 'Price',
  addNewSpec: 'Add new spec',
  save: 'Save',
  emptyCategoryError: 'Category must be selected!',
  colourIsNotTextError: 'Colour value must be a text!',
};

const FIELD_TYPE_MAP = Object.freeze({
  NUMBER: 'number',
  /* TODO: make colour field as input[type="color"] to let convenient color picking
   * a kind of HEX to approx. human readable color name converter should also be provided
   */
  CHOICE: 'text',
});
const SPEC_NAMES_SEPARATORS = Object.freeze({
  GAP: '_',
  LEVEL: '__',
});
const FIELD_NAME_PREFIXES = Object.freeze({
  TECHNICAL_SPECS: `technicalSpecs${SPEC_NAMES_SEPARATORS.LEVEL}`,
});

export default function NewProduct() {
  const [productCurrentSpecs, setProductCurrentSpecs] = useState([]);
  const productSpecsMap = useRef({
    specs: null,
    categoryToSpecs: null,
  });
  const [formInitials, setFormInitials] = useState({
    name: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    (async () => {
      const productSpecifications = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);
      console.log('newProduct productSpecifications:', productSpecifications);

      productSpecsMap.current.categoryToSpecs = productSpecifications.categoryToSpecs;
      productSpecsMap.current.specs = productSpecifications.specs.map((specObj) => ({
        ...specObj,
        fieldName: specObj.name.replace(/\s/g, SPEC_NAMES_SEPARATORS.GAP),
        fieldType: FIELD_TYPE_MAP[specObj.type],
      }));

      setFormInitials((prevFormInitials) => ({
        ...prevFormInitials,
        ...Object.fromEntries(
          productSpecsMap.current.specs.reduce((specEntries, spec) => {
            const names = spec.descriptions
              ? spec.descriptions.map((description) => `${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${description}`)
              : [spec.fieldName];

            names.forEach((name) => {
              specEntries.push([name, '']);
            });

            return specEntries;
          }, [])
        ),
      }));
    })();
  }, []);

  const normalizeSubmittedValues = (values) => {
    const entries = Object.entries(values);
    const entriesWithNaturalKeys = entries.filter(([key]) => !key.includes(SPEC_NAMES_SEPARATORS.LEVEL));
    const nestedEntries = entries
      .filter(([key]) => key.includes(SPEC_NAMES_SEPARATORS.LEVEL))
      .reduce((obj, [key, value]) => {
        const nestLevelKeys = key.split(SPEC_NAMES_SEPARATORS.LEVEL);

        createNestedProperty(obj, nestLevelKeys, value);

        return obj;
      }, Object.create(null));

    return {
      ...Object.fromEntries(entriesWithNaturalKeys),
      ...nestedEntries,
    };

    function createNestedProperty(obj, nestLevelKeys, value, currentLevel = 0) {
      const currentLevelKey = nestLevelKeys[currentLevel];
      const normalizedCurrentLevelKey = currentLevelKey.replaceAll(SPEC_NAMES_SEPARATORS.GAP, ' ');
      const nextLevel = currentLevel + 1;

      if (!(currentLevelKey in obj)) {
        if (currentLevel === 0) {
          obj[currentLevelKey] = {};
        } else if (currentLevel === 1) {
          obj[normalizedCurrentLevelKey] = {
            value: {},
            defaultUnit: undefined,
          };

          const specWithDefaultUnit = productSpecsMap.current.specs.find(
            (specObj) => specObj.fieldName === currentLevelKey && specObj.defaultUnit
          );

          if (specWithDefaultUnit) {
            obj[normalizedCurrentLevelKey].defaultUnit = specWithDefaultUnit.defaultUnit;
          }
        }
      }

      if (nestLevelKeys[nextLevel]) {
        createNestedProperty(obj[currentLevelKey], nestLevelKeys, value, nextLevel);
      } else {
        if (currentLevel > 1) {
          obj.value[normalizedCurrentLevelKey] = value;
        } else {
          const isSpecWithChoiceType = productSpecsMap.current.specs.some(
            (specObj) => specObj.name === currentLevelKey && specObj.type === 'CHOICE'
          );

          obj[normalizedCurrentLevelKey].value = isSpecWithChoiceType ? [value] : value;
        }
      }
    }
  };

  const onSubmitHandler = (values, { setSubmitting }) => {
    console.log('new product submit values:', values);

    apiService.addProduct(normalizeSubmittedValues(values)).then(
      () => {
        console.log('Product successfully saved');
        setSubmitting(false);
      },
      (err) => {
        console.error('Product save error:', err);
        setSubmitting(false);
      }
    );
  };

  const handleCategorySelect = (selectedCategoryName) => {
    const specsFromChosenCategory = (
      productSpecsMap.current.categoryToSpecs.find(
        (categoryToSpec) => categoryToSpec.category === selectedCategoryName
      ) || { specs: [] }
    ) /* TODO: remove fallback when CategoriesTree will handle ignoring toggle'able nodes */.specs;
    const currentSpecs = productSpecsMap.current.specs.filter((spec) => specsFromChosenCategory.includes(spec.name));

    setProductCurrentSpecs(currentSpecs);
  };

  const validateHandler = (values) => {
    const errors = {};

    if (!values.category) {
      errors.category = translations.emptyCategoryError;
    }

    const { isColourFieldError, colourFieldKey } = validateHandler.colorFieldTextValidator(values);
    if (isColourFieldError) {
      errors[colourFieldKey] = translations.colourIsNotTextError;
    }

    return errors;
  };
  validateHandler.colorFieldTextValidator = (values) => {
    const colourFieldKey = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}colour`;
    const isColorFieldText = /^\D+$/.test(values[colourFieldKey]);

    return { isColourFieldError: !isColorFieldText, colourFieldKey };
  };

  const getSpecsFields = (formikRestProps) => {
    return productCurrentSpecs.map((spec) => {
      const fieldIdentifier = `${spec.name
        .replace(/(?<=\s)\w/g, (match) => match.toUpperCase())
        .replace(/\s/g, '')}Field`;
      const minValue = spec.fieldType === 'number' ? 0 : null;

      return (
        <div key={fieldIdentifier}>
          <label htmlFor={fieldIdentifier}>
            {spec.name.replace(/\w/, (firstChar) => firstChar.toUpperCase())}{' '}
            {spec.defaultUnit && `(${spec.defaultUnit})`}
          </label>

          {Array.isArray(spec.descriptions) ? (
            spec.descriptions.map((specDescription, index) => {
              const groupFieldIdentifier = `${fieldIdentifier}${index}`;
              const mergedName = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${specDescription}`;

              return (
                <div key={groupFieldIdentifier}>
                  <label htmlFor={groupFieldIdentifier}>
                    {specDescription.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
                  </label>

                  <input
                    name={mergedName}
                    type={spec.fieldType}
                    min={minValue}
                    id={groupFieldIdentifier}
                    onChange={formikRestProps.handleChange}
                    required
                  />
                </div>
              );
            })
          ) : (
            <input
              name={`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`}
              type={spec.fieldType}
              min={minValue}
              id={fieldIdentifier}
              onChange={formikRestProps.handleChange}
              required
            />
          )}

          <ErrorMessage name={`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`} component={FormFieldError} />
        </div>
      );
    });
  };

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials} validate={validateHandler}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <h2>{translations.intro}</h2>

            <fieldset>
              <legend>{translations.baseInformation}</legend>

              <label htmlFor="newProductName">{translations.name}</label>
              <input
                id="newProductName"
                name="name"
                type="text"
                onChange={formikRestProps.handleChange}
                onBlur={formikRestProps.handleBlur}
                required
              />

              <label htmlFor="newProductPrice">{translations.price}</label>
              <input
                id="newProductPrice"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                onChange={formikRestProps.handleChange}
                onBlur={formikRestProps.handleBlur}
                required
              />

              <Field
                name="category"
                required
                component={CategoriesTreeFormField}
                onCategorySelect={(selectedCategory) => handleCategorySelect(selectedCategory)}
              />
              <ErrorMessage name="category" component={FormFieldError} />
            </fieldset>
            <fieldset>
              <legend>
                {translations.technicalSpecs}{' '}
                {productCurrentSpecs.length === 0 && <span>({translations.chooseCategoryFirst})</span>}
              </legend>

              {productCurrentSpecs.length > 0 && getSpecsFields(formikRestProps)}
            </fieldset>

            <button
              type="submit"
              onClick={() => !formikRestProps.touched.category && formikRestProps.setFieldTouched('category')}
            >
              {translations.save}
            </button>
          </form>
        )}
      </Formik>
    </section>
  );
}
