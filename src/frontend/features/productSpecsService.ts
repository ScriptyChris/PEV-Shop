import type { TProductTechnicalSpecs } from '../../middleware/helpers/api-products-specs-mapper';
import httpService, { CUSTOM_RES_EXT_DICT } from './httpService';

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

  let productSpecifications: TProductTechnicalSpecs | undefined;

  async function getProductsSpecifications() {
    if (!productSpecifications) {
      productSpecifications = await httpService.getProductsSpecifications().then((res) => {
        if (CUSTOM_RES_EXT_DICT.__EXCEPTION_ALREADY_HANDLED in res) {
          return;
        }

        return res as TProductTechnicalSpecs;
      });
    }

    return productSpecifications;
  }

  function structureProductsSpecifications({ categoryToSpecs, specs }: TProductTechnicalSpecs) {
    return {
      specs: specs.map((specObj) => ({
        ...specObj,
        type: SPEC_TO_FIELD_TYPE[specObj.name as keyof typeof SPEC_TO_FIELD_TYPE],
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
