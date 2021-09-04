import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response } from 'express';
import { authMiddlewareFn as authMiddleware, userRoleMiddlewareFn } from '../features/auth';
import { getFromDB, saveToDB, updateOneModelInDB, queryBuilder } from '../../database/database-index';
import {
  TIdListReq,
  TPageLimit,
  TProductFiltersReq,
  TProductNameReq,
  TProductsCategoriesReq,
} from '../../database/utils/queryBuilder';
import { TPaginationConfig } from '../../database/utils/paginateItemsFromDB';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;

// import { readFileSync } from 'fs';
const logger = getLogger(module.filename);
const router: any = Router();
// const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
// const productList =  getProductList();

// just for tests
router.get('/api/products/specs', async (req: Request, res: Response) => {
  try {
    const specQuery = {
      name: {
        $ne: '',
      },
    };
    const projection = {
      category: 1,
      'technicalSpecs.heading': 1,
      'technicalSpecs.data': 1,
      'technicalSpecs.defaultUnit': 1,
    };
    const productsSpec = mapProductsTechnicalSpecs(await getFromDB(specQuery, 'Product', {}, projection));

    res.status(200).json(productsSpec);
  } catch (exception) {
    logger.error('Retrieving product specs exception:', exception);

    res.status(500).json({ exception });
  }
});

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);
// TODO: add auth and user-role middlewares
router.post('/api/products', addProduct);
router.patch('/api/products/', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), modifyProduct);

// expose for unit tests
router._getProducts = getProducts;
router._getProductById = getProductById;
router._addProduct = addProduct;
router._modifyProduct = modifyProduct;

export default router;

async function getProducts(
  req: Request & { query: TIdListReq & TProductsCategoriesReq & TPageLimit & TProductNameReq & TProductFiltersReq },
  res: Response
): Promise<void> {
  // TODO: move building query with options to queryBuilder module; pass query type/target name, to use Strategy like pattern
  try {
    logger.log('[products GET] req.query', req.query);

    // TODO: ... and really refactor this!
    const idListConfig = queryBuilder.getIdListConfig(req.query);
    const chosenCategories = queryBuilder.getProductsWithChosenCategories(req.query);
    const searchByName = queryBuilder.getSearchByNameConfig(req.query);
    const filters = queryBuilder.getFilters(req.query);
    console.log('filters:', JSON.stringify(filters));

    let query = {};

    if (idListConfig) {
      query = idListConfig;
    } else if (chosenCategories) {
      query = chosenCategories;
    } else if (searchByName) {
      query = searchByName;
    } else if (filters) {
      query = filters;
    }

    const options: { pagination?: TPaginationConfig } = {};
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);

    if (paginationConfig) {
      options.pagination = paginationConfig;
    }

    const paginatedProducts = await getFromDB(query, 'Product', options);

    res.status(200).json(paginatedProducts);
  } catch (exception) {
    logger.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
}

async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    logger.log('[products/:id GET] req.param', req.params);

    const product = await getFromDB(req.params._id, 'Product');

    res.status(200).json(product);
  } catch (exception) {
    logger.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
}

async function addProduct(req: Request, res: Response): Promise<void> {
  try {
    logger.log('[products POST] req.body', req.body);

    await saveToDB(req.body, 'Product');

    res.status(201).json({ msg: 'Success!' });
  } catch (exception) {
    logger.error('Saving product exception:', exception);

    res.status(500).json({ exception });
  }
}

function modifyProduct(req: Request & { userPermissions: any }, res: Response): void {
  try {
    logger.log('[products PATCH] req.body', req.body);

    if (!req.userPermissions) {
      throw new Error('User has no permissions!');
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = updateOneModelInDB(req.body.productId, req.body.modifications, 'Product');

    logger.log('Product modified', modifiedProduct);
    res.status(201).json({ payload: modifiedProduct });
  } catch (exception) {
    logger.error('Modifying product exception:', exception);

    res.status(403).json({ exception });
  }
}

type TSpecs<Collection, Circular> = Record<string, Collection | Circular>;
type TIntermediateSpecsValues = Array<string | number> | Record<string, number[]>;
type TIntermediateSpecs = [string, TIntermediateSpecsValues];
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUniqueSpecs extends TSpecs<Set<number | string>, IUniqueSpecs> {}
type TOutputSpecs = {
  name: string;
  values: TIntermediateSpecsValues;
  defaultUnit: string;
};
type TOutputMapping = {
  specs: TOutputSpecs[];
  categoryToSpecs: Record<string, string[]>;
};
type TMappedSpecs = {
  specs: IUniqueSpecs;
  categoryToSpecs: Record<string, Set<string>>;
};
type TProductTechSpec = {
  category: string;
  technicalSpecs: Array<{
    heading: string;
    defaultUnit: string;
    data: unknown;
  }>;
};

function mapProductsTechnicalSpecs(productTechSpecs: TProductTechSpec[]): TOutputMapping {
  const UNITLESS_SPEC = 'colour';
  const headingToDataType: Record<string, 'primitive' | 'object' | 'array'> = {};
  const defaultUnits: Record<string, string> = {};

  const mapping = productTechSpecs.reduce(
    (mappedSpecs: TMappedSpecs, specData) => {
      if (!mappedSpecs.categoryToSpecs[specData.category]) {
        mappedSpecs.categoryToSpecs[specData.category] = new Set();
      }

      mapUniqueSpecValues(specData, mappedSpecs);

      return mappedSpecs;
    },
    { specs: {}, categoryToSpecs: {} }
  );

  const outputMapping: TOutputMapping = {
    specs: mapMinMax(mapping.specs).map(([key, value]) => ({
      name: key,
      values: value,
      defaultUnit: defaultUnits[key],
    })),

    // @ts-ignore
    categoryToSpecs: Object.fromEntries(
      Object.entries(mapping.categoryToSpecs).map(([key, value]) => [key, Array.from(value)])
    ),
  };

  return outputMapping;

  function mapUniqueSpecValues(specData: TProductTechSpec, mappedSpecs: TMappedSpecs) {
    specData.technicalSpecs.forEach((spec) => {
      if (spec.heading && (spec.defaultUnit || spec.heading === UNITLESS_SPEC)) {
        if (!defaultUnits[specData.category]) {
          defaultUnits[spec.heading] = spec.defaultUnit;
        }

        if (!mappedSpecs.specs[spec.heading]) {
          if (typeof spec.data === 'object' && !Array.isArray(spec.data)) {
            mappedSpecs.specs[spec.heading] = {};
            headingToDataType[spec.heading] = 'object';
          } else {
            if (Array.isArray(spec.data)) {
              headingToDataType[spec.heading] = 'array';
            } else {
              headingToDataType[spec.heading] = 'primitive';
            }

            mappedSpecs.specs[spec.heading] = new Set();
          }
        }

        if (headingToDataType[spec.heading] === 'object') {
          Object.entries(spec.data as Record<string, number>).forEach(([key, value]) => {
            const specProp = mappedSpecs.specs[spec.heading] as Record<string, Set<unknown>>;

            if (!specProp[key]) {
              specProp[key] = new Set();
            }

            specProp[key].add(value);
          });
        } else if (headingToDataType[spec.heading] === 'array') {
          (spec.data as string[]).forEach((data) => (mappedSpecs.specs[spec.heading] as Set<string>).add(data));
        } else {
          (mappedSpecs.specs[spec.heading] as Set<number>).add(spec.data as number);
        }

        mappedSpecs.categoryToSpecs[specData.category].add(spec.heading);
      }
    });
  }

  function mapMinMax(mappingSpecs: IUniqueSpecs): TIntermediateSpecs[] {
    return Object.entries(mappingSpecs).map(function doMapMinMax([key, value]): TIntermediateSpecs {
      const valueAsArray = Array.from(value as Set<number>);

      if (value instanceof Set || Array.isArray(value)) {
        if (valueAsArray.every(Number)) {
          return [key, [Math.min(...valueAsArray), Math.max(...valueAsArray)]];
        }

        return [key, valueAsArray];
      }

      return [
        key,
        // @ts-ignore
        Object.fromEntries(mapMinMax(value)),
      ];
    });
  }
}

// function getProductList() {
//   const [firstCategory] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));
//
//   return firstCategory.products.map(({ name, url, price, images }) => {
//     const image = '/images/' + images[0].imageSrc.split('/').pop();
//
//     return { name, url, price, image };
//   });
// }
