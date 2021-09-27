import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response } from 'express';
import { authMiddlewareFn as authMiddleware, userRoleMiddlewareFn } from '../features/auth';
import { getFromDB, saveToDB, updateOneModelInDB } from '../../database/database-index';
import {
  queryBuilder,
  TIdListReq,
  TNameListReq,
  TPageLimit,
  TProductFiltersReq,
  TProductNameReq,
  TProductsCategoriesReq,
} from '../../database/utils/queryBuilder';
import { TPaginationConfig } from '../../database/utils/paginateItemsFromDB';
import mapProductsTechnicalSpecs from '../helpers/api-products-specs-mapper';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;

// import { readFileSync } from 'fs';
const logger = getLogger(module.filename);
const router: any = Router();
// const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
// const productList =  getProductList();

router.get('/api/products/specs', getProductsSpecs);
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

async function getProductsSpecs(req: Request, res: Response) {
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
}

async function getProducts(
  req: Request & {
    query: TIdListReq & TNameListReq & TProductsCategoriesReq & TPageLimit & TProductNameReq & TProductFiltersReq;
  },
  res: Response
): Promise<void> {
  // TODO: move building query with options to queryBuilder module; pass query type/target name, to use Strategy like pattern
  try {
    logger.log('[products GET] req.query', req.query);

    // TODO: ... and really refactor this!
    const idListConfig = queryBuilder.getIdListConfig(req.query);
    const nameListConfig = queryBuilder.getNameListConfig(req.query);
    const chosenCategories = queryBuilder.getProductsWithChosenCategories(req.query);
    const searchByName = queryBuilder.getSearchByNameConfig(req.query);
    const filters = queryBuilder.getFilters(req.query);
    console.log('filters:', JSON.stringify(filters));

    let query = {};

    if (idListConfig) {
      query = idListConfig;
    } else if (nameListConfig) {
      query = nameListConfig;
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

// function getProductList() {
//   const [firstCategory] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));
//
//   return firstCategory.products.map(({ name, url, price, images }) => {
//     const image = '/images/' + images[0].imageSrc.split('/').pop();
//
//     return { name, url, price, image };
//   });
// }
