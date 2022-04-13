import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import httpService from '@frontend/features/httpService';
import productSpecsService from '@frontend/features/productSpecsService';
import { CategoriesTreeFormField } from '@frontend/components/views/categoriesTree';
import FormFieldError from '@frontend/components/utils/formFieldError';
import { SearchSingleProductByName } from '@frontend/components/views/search';
import FlexibleList from '@frontend/components/utils/flexibleList';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = {
  intro: 'Fill new product details',
  baseInformation: 'Basic information',
  technicalSpecs: 'Technical specification',
  categoryChooser: 'Category',
  chooseCategoryFirst: 'A category needs to be chosen first...',
  name: 'Name',
  price: 'Price',
  addNewSpec: 'Add new spec',
  confirm: 'Confirm',
  cancel: 'Cancel',
  save: 'Save',
  relatedProductsNames: 'Related products names',
  relatedProductName: 'Product name',
  shortDescription: 'Short description',
  duplicatedDescription: 'Description item must be unique!',
  lackOfData: 'No data!',
  emptyCategoryError: 'Category must be selected!',
  colourIsNotTextError: 'Colour value must be a text!',
  modificationError: 'Cannot modify, because no changes were made!',
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
  SPACE: ' ',
});
const FIELD_NAME_PREFIXES = Object.freeze({
  TECHNICAL_SPECS: `technicalSpecs${SPEC_NAMES_SEPARATORS.LEVEL}`,
});
const swapSpaceForGap = (text) => text.replace(/\s/g, SPEC_NAMES_SEPARATORS.GAP);

function BaseInfo({ data: { initialData = {} }, methods: { handleChange, handleBlur } }) {
  return (
    <fieldset className="new-product__base-info">
      <legend>{translations.baseInformation}</legend>

      <div className="new-product__base-info-group">
        <label htmlFor="newProductName">{translations.name}</label>
        <TextField
          id="newProductName"
          name="name"
          type="text"
          variant="outlined"
          size="small"
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={initialData.name}
          required
        />
      </div>

      <div className="new-product__base-info-group">
        <label htmlFor="newProductPrice">{translations.price}</label>
        <TextField
          id="newProductPrice"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          variant="outlined"
          size="small"
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={initialData.price}
          required
        />
        {/* TODO: [feature] add currency chooser */}
      </div>
    </fieldset>
  );
}

function ShortDescription({ data: { initialData = {} }, field: formikField, form: { setFieldValue } }) {
  const [shortDescriptionList, setShortDescriptionList] = useState([]);

  useEffect(() => {
    setFieldValue(formikField.name, shortDescriptionList.filter(Boolean));
  }, [shortDescriptionList]);

  return (
    <fieldset>
      <legend>{translations.shortDescription}</legend>

      <FlexibleList
        initialListItems={initialData[formikField.name]}
        NewItemComponent={({ listFeatures, ...restProps }) => (
          <ShortDescription.InputComponent
            {...restProps}
            shortDescriptionList={shortDescriptionList}
            listFeatures={listFeatures}
          />
        )}
        EditItemComponent={({ item: shortDescItem, ...restProps }) => (
          <ShortDescription.InputComponent
            {...restProps}
            shortDescriptionList={shortDescriptionList}
            isEditMode={true}
            presetValue={shortDescItem}
          />
        )}
        emitUpdatedItemsList={setShortDescriptionList}
      />

      <input {...formikField} type="hidden" />
    </fieldset>
  );
}
ShortDescription.InputComponent = function InputComponent(props) {
  const inputRef = useRef();
  const [isChildrenVisible, setIsChildrenVisible] = useState(false);
  const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(props.isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inputRef.current && props.children) {
      setIsChildrenVisible(true);
    }
  }, [inputRef.current, props.children]);

  const validateInput = (value) => {
    const isValid = !props.shortDescriptionList.some((descriptionItem) => value === descriptionItem);
    setIsConfirmBtnDisabled(!isValid);
    setError(isValid ? '' : translations.duplicatedDescription);

    return isValid;
  };

  return (
    <>
      <TextField
        inputRef={inputRef}
        variant="outlined"
        size="small"
        defaultValue={props.presetValue || ''}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();

            if (isConfirmBtnDisabled) {
              return;
            }

            const inputValue = event.target.value;

            if (validateInput(inputValue)) {
              props.updateItem({
                updateValue: inputValue,
                isEditMode: props.isEditMode,
                editedIndex: props.editedIndex,
              });
            }
          } else if (event.key === 'Escape') {
            props.listFeatures.resetState();
          }
        }}
        onChange={({ target: { value } }) => {
          setIsConfirmBtnDisabled(!!(props.presetValue && props.presetValue === value));

          if (isConfirmBtnDisabled) {
            validateInput(value);
          }
        }}
        autoFocus
        required
      />

      {isChildrenVisible &&
        props.children({
          inputItemRef: inputRef,
          isConfirmBtnDisabled,
          onConfirmBtnClick: () => {
            const inputValue = inputRef.current.value;

            if (validateInput(inputValue)) {
              props.updateItem({
                updateValue: inputValue,
                isEditMode: props.isEditMode,
                editedIndex: props.editedIndex,
              });
            }
          },
        })}

      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};

function CategorySelector({
  data: { initialData = {} },
  methods: { setProductCurrentSpecs, getSpecsForSelectedCategory },
}) {
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
        onCategorySelect={handleCategorySelect}
        preSelectedCategory={initialData.category}
        forceCombinedView={true}
      />
      <ErrorMessage name="category" component={FormFieldError} />
    </fieldset>
  );
}

function TechnicalSpecs({ data: { productCurrentSpecs, initialData = [] }, methods: { handleChange, setFieldValue } }) {
  const prepareInitialDataStructure = useMemo(() => {
    const structure = initialData.reduce((output, spec) => {
      const isSpecArray = Array.isArray(spec.data);
      const BASE_HEADING = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.heading}`;

      if (typeof spec.data === 'object' && !isSpecArray) {
        return {
          ...output,
          ...Object.entries(spec.data).reduce(
            (nestedOutput, [key, value]) => ({
              ...nestedOutput,
              [swapSpaceForGap(`${BASE_HEADING}${SPEC_NAMES_SEPARATORS.LEVEL}${key}`)]: value,
            }),
            {}
          ),
        };
      }

      return {
        ...output,
        [swapSpaceForGap(BASE_HEADING)]: isSpecArray ? spec.data.join(', ') : spec.data,
      };
    }, {});

    return { structure, isFilled: !!Object.keys(structure).length };
  }, [initialData]);

  useEffect(() => {
    if (prepareInitialDataStructure.isFilled) {
      Object.entries(prepareInitialDataStructure.structure).forEach(([name, value]) => {
        setFieldValue(name, value);
      });
    }
  }, [prepareInitialDataStructure.structure]);

  return (
    <fieldset className="new-product__technical-specs">
      <legend>{translations.technicalSpecs}</legend>

      {productCurrentSpecs.length > 0 ? (
        productCurrentSpecs.map((spec) => {
          const fieldIdentifier = `${spec.name
            .replace(/(?<=\s)\w/g, (match) => match.toUpperCase())
            .replace(/\s/g, '')}Field`;
          const minValue = spec.fieldType === 'number' ? 0 : null;
          const BASE_NAME = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`;
          const isSpecDescriptionsArray = Array.isArray(spec.descriptions);

          return (
            <div
              className={classNames(
                { 'new-product__technical-specs-controls-group': !isSpecDescriptionsArray },
                { 'new-product__technical-specs-controls-group--nested-container': isSpecDescriptionsArray }
              )}
              key={fieldIdentifier}
            >
              <label htmlFor={fieldIdentifier}>
                {spec.name.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
                {SPEC_NAMES_SEPARATORS.SPACE}
                {spec.defaultUnit && `(${spec.defaultUnit})`}
              </label>

              {isSpecDescriptionsArray ? (
                spec.descriptions.map((specDescription, index) => {
                  const groupFieldIdentifier = `${fieldIdentifier}${index}`;
                  const mergedName = `${BASE_NAME}${SPEC_NAMES_SEPARATORS.LEVEL}${specDescription}`;

                  return (
                    <div className="new-product__technical-specs-controls-group" key={groupFieldIdentifier}>
                      <label htmlFor={groupFieldIdentifier}>
                        {specDescription.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
                      </label>

                      <TextField
                        variant="outlined"
                        size="small"
                        name={mergedName}
                        type={spec.fieldType}
                        inputProps={{ min: minValue }}
                        id={groupFieldIdentifier}
                        onChange={handleChange}
                        defaultValue={
                          prepareInitialDataStructure.isFilled ? prepareInitialDataStructure.structure[mergedName] : ''
                        }
                        required
                      />
                    </div>
                  );
                })
              ) : (
                <TextField
                  variant="outlined"
                  size="small"
                  name={BASE_NAME}
                  type={spec.fieldType}
                  inputProps={{ min: minValue }}
                  id={fieldIdentifier}
                  onChange={handleChange}
                  defaultValue={
                    prepareInitialDataStructure.isFilled ? prepareInitialDataStructure.structure[BASE_NAME] : ''
                  }
                  required
                />
              )}

              <ErrorMessage
                name={`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`}
                component={FormFieldError}
              />
            </div>
          );
        })
      ) : (
        <em className="new-product__technical-specs-category-choice-reminder">{translations.chooseCategoryFirst}</em>
      )}
    </fieldset>
  );
}

function RelatedProductsNames({ data: { initialData = {} }, field: formikField, form: { setFieldValue } }) {
  const [relatedProductNamesList, setRelatedProductNamesList] = useState([]);

  useEffect(() => {
    setFieldValue(formikField.name, relatedProductNamesList.filter(Boolean));
  }, [relatedProductNamesList]);

  const BoundSearchSingleProductByName = useCallback(
    ({ children = () => void 0, ...props }) => (
      <>
        <SearchSingleProductByName
          {...props}
          list="foundRelatedProductsNames"
          debounceTimeMs={200}
          label={translations.relatedProductName}
          searchingTarget="relatedProductsNames"
          ignoredProductNames={relatedProductNamesList.filter(
            (productName) => productName && props.presetValue !== productName
          )}
          onSelectedProductName={(productName) => {
            if (props.editedProductIndex > -1) {
              props.listFeatures.editItem(productName, props.editedProductIndex);
            } else {
              props.listFeatures.addItem(productName);
            }
          }}
          onEscapeBtn={() => props.listFeatures.resetState()}
          autoFocus={true}
          separateLabel={true}
        />
        {children()}
      </>
    ),
    [relatedProductNamesList]
  );

  return (
    <fieldset className="new-product__related-product-names">
      <legend>{translations.relatedProductsNames}</legend>

      <FlexibleList
        initialListItems={initialData[formikField.name]}
        NewItemComponent={(props) => <BoundSearchSingleProductByName {...props} />}
        EditItemComponent={({ item: relatedProductName, index, ...restProps }) => (
          <BoundSearchSingleProductByName {...restProps} presetValue={relatedProductName} editedProductIndex={index} />
        )}
        emitUpdatedItemsList={setRelatedProductNamesList}
      />

      <input {...formikField} type="hidden" />
    </fieldset>
  );
}

const ProductForm = ({ initialData = {}, doSubmit }) => {
  const [productCurrentSpecs, setProductCurrentSpecs] = useState([]);
  const productSpecsMap = useRef({
    specs: null,
    categoryToSpecs: null,
  });
  const [formInitials, setFormInitials] = useState(() =>
    Object.fromEntries(ProductForm.initialFormKeys.map((key) => [key, initialData[key] || '']))
  );
  const ORIGINAL_FORM_INITIALS_KEYS = useMemo(() => Object.keys(formInitials), []);
  const getSpecsForSelectedCategory = useCallback((selectedCategoryName) => {
    const specsFromChosenCategory = (
      productSpecsMap.current.categoryToSpecs.find(
        (categoryToSpec) => categoryToSpec.category === selectedCategoryName
      ) || { specs: [] }
    ) /* TODO: remove fallback when CategoriesTree will handle ignoring toggle'able nodes */.specs;

    return productSpecsMap.current.specs.filter((spec) => specsFromChosenCategory.includes(spec.name));
  }, []);
  const getNestedEntries = useMemo(() => {
    const _getNestedEntries = (entries) =>
      (Array.isArray(entries) ? entries : Object.entries(entries))
        .filter(([key]) => key.includes(SPEC_NAMES_SEPARATORS.LEVEL))
        .reduce((obj, [key, value]) => {
          const nestLevelKeys = key.split(SPEC_NAMES_SEPARATORS.LEVEL);

          _getNestedEntries.createNestedProperty(obj, nestLevelKeys, value);

          return obj;
        }, Object.create(null));

    _getNestedEntries.createNestedProperty = (obj, nestLevelKeys, value, currentLevel = 0) => {
      const currentLevelKey = nestLevelKeys[currentLevel];
      const normalizedCurrentLevelKey = currentLevelKey.replaceAll(
        SPEC_NAMES_SEPARATORS.GAP,
        SPEC_NAMES_SEPARATORS.SPACE
      );
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
        _getNestedEntries.createNestedProperty(obj[currentLevelKey], nestLevelKeys, value, nextLevel);
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

    return _getNestedEntries;
  }, []);
  const isMobileLayout = useMobileLayout();

  useEffect(() => {
    (async () => {
      const productSpecifications = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);

      productSpecsMap.current.categoryToSpecs = productSpecifications.categoryToSpecs;
      productSpecsMap.current.specs = productSpecifications.specs.map((specObj) => ({
        ...specObj,
        fieldName: swapSpaceForGap(specObj.name),
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
    const nestedEntries = getNestedEntries(entries);

    const normalizedValues = {
      ...Object.fromEntries(entriesWithNaturalKeys),
      ...nestedEntries,
    };
    normalizedValues.technicalSpecs = Object.entries(normalizedValues.technicalSpecs).map(
      ([key, { value, defaultUnit }]) => ({
        heading: key,
        data: value,
        defaultUnit,
      })
    );

    return normalizedValues;
  };

  const onSubmitHandler = (values, { setSubmitting }) => {
    const isProductModification = Object.keys(initialData).length > 0;
    let submission;

    if (isProductModification) {
      submission = doSubmit(values, normalizeSubmittedValues(filterOutUnrelatedFields(values)).technicalSpecs);
    } else {
      const newProductData = normalizeSubmittedValues(filterOutUnrelatedFields(values));
      submission = doSubmit(newProductData);
    }

    submission
      .catch((errorMessage) => {
        console.error('Submission error:', errorMessage);
      })
      .finally(() => setSubmitting(false));
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
    <Paper component="section" className={classNames('new-product', { 'new-product--pc': !isMobileLayout })}>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials} validate={validateHandler}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <Typography variant="h2" component="h2">
              {translations.intro}
            </Typography>

            <BaseInfo
              data={{ initialData: formikRestProps.values }}
              methods={{ handleChange: formikRestProps.handleChange, handleBlur: formikRestProps.handleBlur }}
            />
            <Field
              name="shortDescription"
              data={{ initialData: formikRestProps.values }}
              component={ShortDescription}
            />
            {Object.values(productSpecsMap.current).filter(Boolean).length && (
              <CategorySelector
                data={{ initialData: formikRestProps.values }}
                methods={{ setProductCurrentSpecs, getSpecsForSelectedCategory }}
              />
            )}
            <TechnicalSpecs
              data={{ productCurrentSpecs, initialData: initialData.technicalSpecs }}
              methods={{ handleChange: formikRestProps.handleChange, setFieldValue: formikRestProps.setFieldValue }}
            />
            <Field
              name="relatedProductsNames"
              data={{ initialData: formikRestProps.values }}
              component={RelatedProductsNames}
            />

            <Button
              type="submit"
              onClick={() => !formikRestProps.touched.category && formikRestProps.setFieldTouched('category')}
              variant="outlined"
              fullWidth
            >
              {translations.save}
            </Button>
          </form>
        )}
      </Formik>
    </Paper>
  );
};
ProductForm.initialFormKeys = ['name', 'price', 'shortDescription', 'category', 'relatedProductsNames'];

const NewProduct = () => {
  const doSubmit = (newProductData) =>
    httpService.addProduct(newProductData).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      console.log('Product successfully saved');
    });

  return <ProductForm doSubmit={doSubmit} />;
};
const ModifyProduct = () => {
  const productName = useLocation().state;
  const [productData, setProductData] = useState(null);
  const [modificationError, setModificationError] = useState(false);
  const getChangedFields = useCallback(
    (values) => {
      const flatTechnicalSpecs = productData.technicalSpecs.reduce((output, spec) => {
        const obj = {};
        const PREFIX = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${swapSpaceForGap(spec.heading)}`;

        if (typeof spec.data === 'object' && !Array.isArray(spec.data)) {
          Object.entries(spec.data).forEach(([key, value]) => {
            obj[`${PREFIX}${SPEC_NAMES_SEPARATORS.LEVEL}${key}`] = value;
          });
        } else if (Array.isArray(spec.data)) {
          obj[PREFIX] = spec.data.join(', ');
        } else {
          obj[PREFIX] = spec.data;
        }

        return {
          ...output,
          ...obj,
        };
      }, {});

      const normalizedInitialProductData = { ...productData, ...flatTechnicalSpecs };
      delete normalizedInitialProductData.technicalSpecs;

      const changedFields = Object.entries(values).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return normalizedInitialProductData[key].toString() !== value.toString();
        }

        return normalizedInitialProductData[key] !== value;
      });

      return changedFields;
    },
    [productData]
  );

  useEffect(() => {
    // TODO: implement `getProductByName` method instead of (or along with) `getProduct[ById]`
    httpService.getProductsByNames([productName]).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setProductData(res[0]);
    });
  }, []);

  const normalizeTechnicalSpecsProps = (changedFields, technicalSpecsField) => {
    const fieldEntriesWithoutTechnicalSpecs = changedFields.filter(
      ([key]) => !key.startsWith(FIELD_NAME_PREFIXES.TECHNICAL_SPECS)
    );

    if (fieldEntriesWithoutTechnicalSpecs.length === changedFields.length) {
      return changedFields;
    }

    const technicalSpecsEntry = ['technicalSpecs', technicalSpecsField];
    return [...fieldEntriesWithoutTechnicalSpecs, technicalSpecsEntry];
  };

  const doSubmit = (values, technicalSpecsField) => {
    const changedFields = normalizeTechnicalSpecsProps(getChangedFields(values), technicalSpecsField);

    if (changedFields.length) {
      setModificationError(false);

      return httpService.modifyProduct(values.name, Object.fromEntries(changedFields)).then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        setProductData(res);
      });
    }

    setModificationError(true);
    return Promise.reject('modify impossible, due to not changed data');
  };

  return productData ? (
    <>
      <ProductForm initialData={productData} doSubmit={doSubmit} />
      {modificationError && <FormFieldError>{translations.modificationError}</FormFieldError>}
    </>
  ) : (
    translations.lackOfData
  );
};

export { NewProduct, ModifyProduct };
