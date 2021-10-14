import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response } from 'express';
import { authMiddlewareFn as authMiddleware, userRoleMiddlewareFn } from '../features/auth';
import { getFromDB, saveToDB, updateOneModelInDB, deleteFromDB } from '../../database/database-index';
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
import { IProduct, IReviews } from '../../database/models/_product';

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
router.patch(
  '/api/products/:name/add-review',
  /* authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), */ addReview
);
router.patch('/api/products/', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), modifyProduct);
router.delete('/api/products/:name', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), deleteProduct);

// expose for unit tests
router._getProducts = getProducts;
router._getProductById = getProductById;
router._addProduct = addProduct;
router._modifyProduct = modifyProduct;
router._deleteProduct = deleteProduct;

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

async function addReview(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  try {
    logger.log('[addReview] req.params.name:', req.params.name, ' /req.body:', req.body);

    const RATING_MIN_VALUE = 0;
    const RATING_MAX_VALUE = 5;
    const rating = req.body.rating;

    if (!addReview.isNumber(rating)) {
      return res.status(400).json({ exception: 'Rating value must be a number!' });
    } else if (rating < RATING_MIN_VALUE) {
      return res.status(400).json({ exception: `Rating value must be greater than ${RATING_MIN_VALUE}!` });
    } else if (rating > RATING_MAX_VALUE) {
      return res.status(400).json({ exception: `Rating value must be less than ${RATING_MAX_VALUE}!` });
    } else if (!addReview.isIntOrDecimalHalf(rating)) {
      return res.status(400).json({ exception: `Rating value must be either an integer or .5 (a half) of it!` });
    } else if (
      !req.body.author ||
      typeof req.body.author !== 'string' /* TODO: [AUTH] ensure author is a proper User or "Anonymous" */
    ) {
      return res.status(400).json({
        exception: 'Author value must be a non-empty string representing a proper User or "Anonymous"!',
      });
    } /* TODO: [DUP] check if review is not a duplicate */

    // TODO: [DX] refactor update process to use some Mongo (declarative) aggregation atomicly
    const productToUpdate: IProduct = (await getFromDB({ name: req.params.name }, 'Product', {}))[0];
    const productReviews: IReviews = productToUpdate.reviews;

    productReviews.list.push({
      ...req.body,
      timestamp: Date.now(),
    });
    productReviews.averageRating = Number(
      (
        productReviews.list.reduce((sum, { rating }) => sum + (rating as number), 0) / productReviews.list.length
      ).toFixed(1)
    );

    await productToUpdate.save();

    res.status(200).json({ currentReviews: productReviews });
  } catch (exception) {
    logger.error('Adding review exception:', exception);

    res.status(500).json({ exception });
  }
}
addReview.isNumber = (number: unknown): boolean => !Number.isNaN(Number(number));
addReview.isIntOrDecimalHalf = (number: number): boolean => {
  const isInt = Number.parseInt((number as unknown) as string) === number;
  const isDecimalHalf = number % 1 === 0.5;

  return isInt || isDecimalHalf;
};

async function modifyProduct(req: Request & { userPermissions: any }, res: Response): Promise<void> {
  try {
    logger.log('[products PATCH] req.body', req.body);

    if (!req.userPermissions) {
      throw new Error('User has no permissions!');
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(
      req.body.productId || { name: req.body.name },
      req.body.modifications,
      'Product'
    );

    res.status(200).json({ payload: modifiedProduct });
  } catch (exception) {
    logger.error('Modifying product exception:', exception);

    res.status(403).json({ exception });
  }
}

async function deleteProduct(
  req: Request & { userPermissions: any },
  res: Response
): Promise<void | Pick<Response, 'json'>> {
  try {
    logger.log('[products DELETE] req.params:', req.params);

    if (!req.userPermissions) {
      throw new Error('User has no permissions!');
    }

    const deletionResult = await deleteFromDB({ name: req.params.name }, 'Product');

    if (!deletionResult.ok) {
      logger.error('Deletion error occured...', deletionResult);

      return res.status(500).json({ deletionResult });
    } else if (deletionResult.deletedCount === 0) {
      logger.error('Deleted nothing...', deletionResult);

      return res.status(400).json({ deletionResult });
    }

    res.sendStatus(204);
  } catch (exception) {
    logger.error('Deleting product exception:', exception);

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
