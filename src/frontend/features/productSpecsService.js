import apiService from './apiService';

const productSpecsService = (() => {
  const FIELD_TYPES = Object.freeze({
    NUMBER: 'NUMBER',
    CHOICE: 'CHOICE',
  });
  const SPEC_TO_FIELD_TYPE = Object.freeze({
    weight: FIELD_TYPES.NUMBER,
    dimensions: FIELD_TYPES.NUMBER,
    'top speed': FIELD_TYPES.NUMBER,
    'charge time': FIELD_TYPES.NUMBER,
    'max load': FIELD_TYPES.NUMBER,
    'battery capacity': FIELD_TYPES.NUMBER,
    range: FIELD_TYPES.NUMBER,
    'motor power': FIELD_TYPES.NUMBER,
    colour: FIELD_TYPES.CHOICE,
  });

  let productSpecifications = [];

  async function getProductsSpecifications() {
    if (productSpecifications.length === 0) {
      productSpecifications = await apiService.getProductsSpecifications().then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        }

        return res;
      });
    }

    return productSpecifications;
  }

  function structureProductsSpecifications({ categoryToSpecs, specs }) {
    return {
      specs: specs.map((specObj) => ({
        ...specObj,
        type: productSpecsService.SPEC_TO_FIELD_TYPE[specObj.name],
        values: Array.isArray(specObj.values) ? [specObj.values] : Object.values(specObj.values),
        descriptions: Array.isArray(specObj.values) ? null : Object.keys(specObj.values),
      })),
      categoryToSpecs: Object.entries(categoryToSpecs).map(([category, specs]) => ({
        category,
        specs,
      })),
    };
  }

  return {
    getProductsSpecifications,
    structureProductsSpecifications,
    SPEC_TO_FIELD_TYPE,
  };
})();

export default productSpecsService;
