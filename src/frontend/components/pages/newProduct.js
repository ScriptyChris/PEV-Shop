import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import apiService from '../../features/apiService';
import productSpecsService from '../../features/productSpecsService';
import { CategoriesTreeFormField } from '../views/categoriesTree';
import FormFieldError from '../utils/formFieldError';
import { SearchSingleProductByName } from '../views/search';
import FlexibleList from '../utils/flexibleList';

const translations = {
  intro: 'Fill new product details',
  baseInformation: 'Basic information',
  technicalSpecs: 'Technical specification',
  categoryChooser: 'Category',
  chooseCategoryFirst: 'please, choose category first',
  name: 'Name',
  price: 'Price',
  addNewSpec: 'Add new spec',
  confirm: 'Confirm',
  save: 'Save',
  relatedProducts: 'Related products',
  relatedProductName: 'Product name',
  shortDescription: 'Short description',
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

function BaseInfo({ methods: { handleChange, handleBlur } }) {
  return (
    <fieldset>
      <legend>{translations.baseInformation}</legend>

      <label htmlFor="newProductName">{translations.name}</label>
      <input id="newProductName" name="name" type="text" onChange={handleChange} onBlur={handleBlur} required />

      <label htmlFor="newProductPrice">{translations.price}</label>
      <input
        id="newProductPrice"
        name="price"
        type="number"
        step="0.01"
        min="0.01"
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
    </fieldset>
  );
}

function ShortDescription() {
  const [shortDescriptionList, setShortDescriptionList] = useState([]);

  useEffect(() => {
    console.log('(useEffect) shortDescriptionList:', shortDescriptionList);
  }, [shortDescriptionList]);

  const BoundShortDescriptionInputComponent = useCallback(
    (props) => {
      console.log('(BoundShortDescriptionInputComponent) props:', props);

      const inputRef = createRef();
      const updateItem = (updateValue, isEditMode) => {
        if (isEditMode) {
          props.listFeatures.editItem(updateValue, props.editedDescIndex);
        } else {
          props.listFeatures.addItem(updateValue);
        }
      };
      const isEditMode = props.editedDescIndex > -1;

      return (
        <>
          <input
            ref={inputRef}
            type="text"
            defaultValue={props.presetValue || ''}
            onKeyPress={(event) => {
              console.log('input value:', event.target.value, ' /key:', event.key);

              if (event.key === 'Enter') {
                event.preventDefault();
                updateItem(event.target.value, isEditMode);
              }
            }}
          />
          {
            <button
              type="button"
              onClick={() => {
                updateItem(inputRef.current.value, isEditMode);
              }}
            >
              {translations.confirm}
            </button>
          }
        </>
      );
    },
    [shortDescriptionList]
  );

  return (
    <fieldset>
      <legend>{translations.shortDescription}</legend>
      <FlexibleList
        newItemComponent={(listFeatures) => <BoundShortDescriptionInputComponent listFeatures={listFeatures} />}
        editItemComponent={(shortDescItem, index, listFeatures) => {
          console.log('(editItemComponent) shortDescItem:', shortDescItem, ' /index:', index);

          return (
            <BoundShortDescriptionInputComponent
              editedDescIndex={index}
              presetValue={shortDescItem}
              listFeatures={listFeatures}
            />
          );
        }}
        emitUpdatedItemsList={setShortDescriptionList}
      />
    </fieldset>
  );
}

function CategorySelector({ methods: { setProductCurrentSpecs, getSpecsForSelectedCategory } }) {
  const handleCategorySelect = (selectedCategoryName) => {
    setProductCurrentSpecs(getSpecsForSelectedCategory(selectedCategoryName));
  };

  return (
    <fieldset>
      <legend>{translations.categoryChooser}</legend>

      <Field
        name="category"
        required
        component={CategoriesTreeFormField}
        onCategorySelect={(selectedCategory) => handleCategorySelect(selectedCategory)}
      />
      <ErrorMessage name="category" component={FormFieldError} />
    </fieldset>
  );
}

function TechnicalSpecs({ data: { productCurrentSpecs }, methods: { handleChange } }) {
  const getSpecsFields = () => {
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
                    onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          )}

          <ErrorMessage name={`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`} component={FormFieldError} />
        </div>
      );
    });
  };

  return (
    <fieldset>
      <legend>
        {translations.technicalSpecs}{' '}
        {productCurrentSpecs.length === 0 && <span>({translations.chooseCategoryFirst})</span>}
      </legend>

      {productCurrentSpecs.length > 0 && getSpecsFields()}
    </fieldset>
  );
}

function RelatedProducts({ field: formikField, form: { setFieldValue } }) {
  const [relatedProductNamesList, setRelatedProductNamesList] = useState([]);

  useEffect(() => {
    console.log('===(useEffect) relatedProductNamesList:', relatedProductNamesList);

    setFieldValue(formikField.name, relatedProductNamesList.filter(Boolean));
  }, [relatedProductNamesList]);

  const BoundSearchSingleProductByName = useCallback(
    (props) => (
      <SearchSingleProductByName
        {...props}
        list="foundRelatedProducts"
        debounceTimeMs={200}
        label={translations.relatedProductName}
        searchingTarget="relatedProducts"
        ignoredProductNames={relatedProductNamesList.filter(
          (productName) => productName && props.presetValue !== productName
        )}
        onSelectedProductName={(productName) => {
          console.log('(onSelectedProductName) productName:', productName, ' /idx:', props.editedProductIndex);

          if (props.editedProductIndex > -1) {
            props.listFeatures.editItem(productName, props.editedProductIndex);
          } else {
            props.listFeatures.addItem(productName);
          }
        }}
        autoFocus={true}
      />
    ),
    [relatedProductNamesList]
  );

  return (
    <fieldset className="new-product">
      <legend>{translations.relatedProducts}</legend>

      <FlexibleList
        newItemComponent={(listFeatures) => <BoundSearchSingleProductByName listFeatures={listFeatures} />}
        editItemComponent={(relatedProductName, index, listFeatures) => (
          <BoundSearchSingleProductByName
            presetValue={relatedProductName}
            editedProductIndex={index}
            listFeatures={listFeatures}
          />
        )}
        emitUpdatedItemsList={setRelatedProductNamesList}
      />

      <input {...formikField} type="hidden" />
    </fieldset>
  );
}

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
    relatedProducts: '',
  });
  const ORIGINAL_FORM_INITIALS_KEYS = useMemo(() => Object.keys(formInitials), []);
  const getSpecsForSelectedCategory = useCallback((selectedCategoryName) => {
    const specsFromChosenCategory = (
      productSpecsMap.current.categoryToSpecs.find(
        (categoryToSpec) => categoryToSpec.category === selectedCategoryName
      ) || { specs: [] }
    ) /* TODO: remove fallback when CategoriesTree will handle ignoring toggle'able nodes */.specs;

    return productSpecsMap.current.specs.filter((spec) => specsFromChosenCategory.includes(spec.name));
  }, []);

  useEffect(() => {
    (async () => {
      const productSpecifications = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);

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

  const filterOutUnrelatedFields = (values) => {
    const specFieldNamesForSelectedCategory = getSpecsForSelectedCategory(values.category).reduce(
      (specEntries, spec) => {
        const names = spec.descriptions
          ? spec.descriptions.map(
              (description) =>
                `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${description}`
            )
          : [`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`];

        names.forEach((name) => {
          specEntries.push(name);
        });

        return specEntries;
      },
      []
    );
    const filteredValues = Object.entries(values).filter(([key]) =>
      specFieldNamesForSelectedCategory.some((fieldName) => fieldName === key)
    );
    const filteredFormInitials = Object.entries(values).filter(([key]) => ORIGINAL_FORM_INITIALS_KEYS.includes(key));

    return Object.fromEntries([...filteredFormInitials, ...filteredValues]);
  };

  const normalizeSubmittedValues = (values) => {
    const entries = Object.entries(values);
    const entriesWithNaturalKeys = entries.filter(([key]) => !key.includes(SPEC_NAMES_SEPARATORS.LEVEL));
    const nestedEntries = entries
      .filter(([key]) => key.includes(SPEC_NAMES_SEPARATORS.LEVEL))
      .reduce((obj, [key, value]) => {
        const nestLevelKeys = key.split(SPEC_NAMES_SEPARATORS.LEVEL);

        normalizeSubmittedValues.createNestedProperty(obj, nestLevelKeys, value);

        return obj;
      }, Object.create(null));

    return {
      ...Object.fromEntries(entriesWithNaturalKeys),
      ...nestedEntries,
    };
  };
  normalizeSubmittedValues.createNestedProperty = (obj, nestLevelKeys, value, currentLevel = 0) => {
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
      normalizeSubmittedValues.createNestedProperty(obj[currentLevelKey], nestLevelKeys, value, nextLevel);
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
  };

  const onSubmitHandler = (values, { setSubmitting }) => {
    const newProductData = normalizeSubmittedValues(filterOutUnrelatedFields(values));

    apiService.addProduct(newProductData).then(
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

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials} validate={validateHandler}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <h2>{translations.intro}</h2>

            <BaseInfo
              methods={{ handleChange: formikRestProps.handleChange, handleBlur: formikRestProps.handleBlur }}
            />
            <ShortDescription />
            <CategorySelector methods={{ setProductCurrentSpecs, getSpecsForSelectedCategory }} />
            <TechnicalSpecs data={{ productCurrentSpecs }} methods={{ handleChange: formikRestProps.handleChange }} />
            <Field name="relatedProducts" component={RelatedProducts} />

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
