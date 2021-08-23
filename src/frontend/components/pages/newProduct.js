import React, { useEffect, useState, useRef } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import apiService from '../../features/apiService';
import productSpecsService from '../../features/productSpecsService';
import CategoriesTree from '../views/categoriesTree';
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
};

const FIELD_TYPE_MAP = Object.freeze({
  NUMBER: 'number',
  CHOICE: 'text',
});
const SPEC_NAMES_SEPARATORS = Object.freeze({
  GAP: '_',
  LEVEL: '__',
});

export default function NewProduct() {
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
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

  const onSubmitHandler = (values, { setSubmitting }) => {
    console.log('new product submit values:', values);

    apiService
      .addProduct({
        ...values,
        selectedCategoryName,
      })
      .then(
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

  // const handleChange = ({ target }) => {
  //   if (target.name === 'name') {
  //     setProductNameValue(target.value);
  //   } else if (target.name === 'price') {
  //     setProductPriceValue(target.value);
  //   }
  // };

  const handleCategorySelect = (selectedCategoryName) => {
    console.log('---- selectedCategoryName', selectedCategoryName);

    setSelectedCategoryName(selectedCategoryName);

    const specsFromChosenCategory = (
      productSpecsMap.current.categoryToSpecs.find(
        (categoryToSpec) => categoryToSpec.category === selectedCategoryName
      ) || { specs: [] }
    ) /* TODO: remove fallback when CategoriesTree will handle ignoring toggle'able nodes */.specs;
    const currentSpecs = productSpecsMap.current.specs.filter((spec) => specsFromChosenCategory.includes(spec.name));

    setProductCurrentSpecs(currentSpecs);
  };

  const validateCategoryName = (value) => {
    return value ? undefined : translations.emptyCategoryError;
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
              const mergedName = `${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${specDescription}`;

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
              name={spec.fieldName}
              type={spec.fieldType}
              min={minValue}
              id={fieldIdentifier}
              onChange={formikRestProps.handleChange}
              required
            />
          )}
        </div>
      );
    });
  };

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials} validate={(v) => console.log('validate:', v)}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <h2>{translations.intro}</h2>

            <fieldset>
              <legend>{translations.baseInformation}</legend>

              <label htmlFor="newProductName">{translations.name}</label>
              <input id="newProductName" name="name" type="text" onChange={formikRestProps.handleChange} required />

              <label htmlFor="newProductPrice">{translations.price}</label>
              <input
                id="newProductPrice"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                onChange={formikRestProps.handleChange}
                required
              />

              <Field
                name="category"
                required
                validate={validateCategoryName}
                as={CategoriesTree}
                onCategorySelect={(selectedCategory) => {
                  formikRestProps.validateField('category');
                  handleCategorySelect(selectedCategory);
                }}
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

            <button type="submit">{translations.save}</button>
          </form>
        )}
      </Formik>
    </section>
  );
}
