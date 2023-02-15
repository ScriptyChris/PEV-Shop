import React from 'react';

export default function Price({ valueInUSD, children }) {
  if (typeof valueInUSD !== 'number') {
    throw TypeError(`'valueInUSD' prop has to be a number! Received '${valueInUSD}'.`);
  } else if (typeof children !== 'function') {
    throw TypeError(`'children' prop has to be a function! Received '${children}'.`);
  }

  // TODO: [feature] implement multiple currencies
  const currency = '$';
  const priceValue = valueInUSD;
  ////

  const currencyElem = <span className="price-currency">{currency}</span>;
  const priceValueElem = <span className="price-value">{priceValue}</span>;
  const currencyAndPrice = (
    <span className="price--grouped">
      {currencyElem}
      {priceValueElem}
    </span>
  );

  return children({ currencyElem, priceValueElem, currencyAndPrice });
}
