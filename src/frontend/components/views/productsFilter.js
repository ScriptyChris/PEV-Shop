import React, { memo, useEffect, useState } from 'react';
import apiService from '../../features/apiService';

const translations = {
  filterUnavailable: 'Filter is not available',
};

export default memo(function ProductsFilter() {
  const [productsSpecs, setProductsSpecs] = useState([]);

  useEffect(() => {
    (async () => {
      const specs = await apiService.getProductsSpecifications();

      setProductsSpecs(specs);
    })();
  }, []);

  return (
    <form>
      {productsSpecs.length > 0
        ? productsSpecs.map(({ category, specHeaders }) => (
            <select key={`category${category}`}>
              {specHeaders.map((header) => (
                <option key={`specHeader${header}`} value={header}>
                  {header}
                </option>
              ))}
            </select>
          ))
        : translations.filterUnavailable}
    </form>
  );
});
