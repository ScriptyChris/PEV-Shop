import React, { useEffect, useState /*useRef,*/ /*Fragment*/ } from 'react';
// import { Formik } from 'formik';
import apiService from '../../features/apiService';
import productSpecsService from '../../features/productSpecsService';

const translations = {
  baseInformation: 'Basic information',
  technicalSpecs: 'Technical specification',
  addNewSpec: 'Add new spec',
  save: 'Save',
};

const FIELD_TYPE_MAP = Object.freeze({
  NUMBER: 'number',
  CHOICE: 'text',
});

export default function NewProduct() {
  const [productNameValue, setProductNameValue] = useState('');
  const [productPriceValue, setProductPriceValue] = useState(0);
  const [productSpecs, setProductSpecs] = useState([]);

  useEffect(() => {
    (async () => {
      const productSpecifications = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);
      console.log('newProduct productSpecifications:', productSpecifications);

      setProductSpecs(
        productSpecifications.specs.map((specObj) => ({
          ...specObj,
          fieldType: FIELD_TYPE_MAP[specObj.type],
        }))
      );
    })();
  }, []);

  const handlerSubmit = (event) => {
    event.preventDefault();

    apiService
      .addProduct({
        name: productNameValue,
        price: productPriceValue,
      })
      .then(
        (res) => console.log('Product successfully saved /res', res),
        (err) => console.error('Product save error:', err)
      );
  };

  const handleChange = ({ target }) => {
    if (target.name === 'name') {
      setProductNameValue(target.value);
    } else if (target.name === 'price') {
      setProductPriceValue(target.value);
    }
  };

  return (
    <section>
      {/*<Formik initialValues={} validate={(v) => console.log('validate:', v)}>*/}
      <form action="" onSubmit={handlerSubmit}>
        <h2>Fill new product details</h2>

        <fieldset>
          <legend>{translations.baseInformation}</legend>

          <label htmlFor="newProductName">Name</label>
          <input id="newProductName" name="name" value={productNameValue} onChange={handleChange} />

          <label htmlFor="newProductPrice">Price</label>
          <input
            id="newProductPrice"
            name="price"
            type="number"
            step="0.01"
            value={productPriceValue}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>{translations.technicalSpecs}</legend>

          {productSpecs.length > 0 &&
            productSpecs.map((spec) => {
              const fieldIdentifier = `${spec.name
                .replace(/(?<=\s)\w/g, (match) => match.toUpperCase())
                .replace(/\s/g, '')}Field`;

              return (
                <div key={fieldIdentifier}>
                  <label htmlFor={fieldIdentifier}>
                    {spec.name.replace(/\w/, (firstChar) => firstChar.toUpperCase())}{' '}
                    {spec.defaultUnit && `(${spec.defaultUnit})`}
                  </label>

                  {Array.isArray(spec.descriptions) ? (
                    spec.descriptions.map((specDescription, index) => {
                      const groupFieldIdentifier = `${fieldIdentifier}${index}`;

                      return (
                        <div key={groupFieldIdentifier}>
                          <label htmlFor={groupFieldIdentifier}>
                            {specDescription.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
                          </label>

                          <input type={spec.fieldType} id={groupFieldIdentifier} />
                        </div>
                      );
                    })
                  ) : (
                    <input type={spec.fieldType} id={fieldIdentifier} />
                  )}
                </div>
              );
            })}
        </fieldset>

        <button>{translations.save}</button>
      </form>
      {/*</Formik>*/}
    </section>
  );
}
