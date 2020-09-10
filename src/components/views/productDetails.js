import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ProductDetails() {
  const { state } = useLocation();
  const translations = {
    emptyData: 'No data!',
  };
  console.warn('location.state: ', state);

  return (
    <>
      Product details!
      <p>{state.name}</p>
      <ul>
        {Array.isArray(state.details)
          ? state.details.map((productDetail, index) => {
              return <li key={index}>{productDetail}</li>;
            })
          : translations.emptyData}
      </ul>
    </>
  );
}
