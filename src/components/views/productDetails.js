import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ProductDetails() {
  const { state: locationState } = useLocation();
  const translations = {
    emptyData: 'No data!',
  };
  console.warn('location.state: ', locationState);

  return (
    <section>
      Product details!
      <p>{locationState.name}</p>
      <ul>
        {Array.isArray(locationState.details)
          ? locationState.details.map((productDetail, index) => {
              return <li key={index}>{productDetail}</li>;
            })
          : translations.emptyData}
      </ul>
    </section>
  );
}
