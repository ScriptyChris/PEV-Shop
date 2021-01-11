import React, { useState } from 'react';
import apiService from '../../features/apiService';

export default function NewProduct() {
  const [productNameValue, setProductNameValue] = useState('');
  const [productPriceValue, setProductPriceValue] = useState(0);

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
      <form action="" onSubmit={handlerSubmit}>
        <fieldset>
          <legend>Fill new product details</legend>

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

          <button>Save</button>
        </fieldset>
      </form>
    </section>
  );
}
