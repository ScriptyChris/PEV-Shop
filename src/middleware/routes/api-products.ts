import getLogger from '@commons/logger';
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddlewareFn as authMiddleware, userRoleMiddlewareFn } from '@middleware/features/auth';
import { getFromDB, saveToDB, updateOneModelInDB, deleteFromDB } from '@database/api';
import { queryBuilder } from '@database/utils/queryBuilder';
import mapProductsTechnicalSpecs from '@middleware/helpers/api-products-specs-mapper';
import { IProduct, IReviews, COLLECTION_NAMES, USER_ROLES_MAP } from '@database/models';
import { HTTP_STATUS_CODE } from '@src/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';

// import { readFileSync } from 'fs';
const logger = getLogger(module.filename);
const router: Router &
  Partial<{
    _getProducts: typeof getProducts;
    _getProductById: typeof getProductById;
    _addProduct: typeof addProduct;
    _modifyProduct: typeof modifyProduct;
    _addReview: typeof addReview;
    _deleteProduct: typeof deleteProduct;
  }> = Router();
// const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
// const productList =  getProductList();

router.get('/api/products/specs', getProductsSpecs);
router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);
router.post('/api/products', authMiddleware, userRoleMiddlewareFn(USER_ROLES_MAP.seller), addProduct);
router.patch('/api/products/:name/add-review', authMiddleware, userRoleMiddlewareFn(USER_ROLES_MAP.client), addReview);
router.patch('/api/products/', authMiddleware, userRoleMiddlewareFn(USER_ROLES_MAP.seller), modifyProduct);
router.delete('/api/products/:name', authMiddleware, userRoleMiddlewareFn(USER_ROLES_MAP.seller), deleteProduct);
router.use(getMiddlewareErrorHandler(logger));

// expose for unit tests
router._getProducts = getProducts;
router._getProductById = getProductById;
router._addProduct = addProduct;
router._modifyProduct = modifyProduct;
router._addReview = addReview;
router._deleteProduct = deleteProduct;

export default router;

async function getProductsSpecs(req: Request, res: Response, next: NextFunction) {
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

    const product = await getFromDB({ modelName: COLLECTION_NAMES.Product, findMultiple: true }, specQuery, projection);
    if (!product) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Product to match specs with was not found!' });
    }

    const productsSpec = mapProductsTechnicalSpecs(
      (product as IProduct[]).map(({ category, technicalSpecs }) => ({ category, technicalSpecs }))
    );

    if (!productsSpec) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Products specs not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: productsSpec });
  } catch (exception) {
    return next(exception);
  }
}

async function getProducts(req: Request, res: Response, next: NextFunction) {
  // TODO: move building query with options to queryBuilder module; pass query type/target name, to use Strategy like pattern
  try {
    logger.log('[products GET] req.query', req.query);

    if (!req.query) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request query is empty or not attached!' });
    }

    // TODO: ... and really refactor this!
    const idListConfig = queryBuilder.getIdListConfig(req.query);
    const nameListConfig = queryBuilder.getNameListConfig(req.query);
    const chosenCategories = queryBuilder.getProductsWithChosenCategories(req.query);
    const searchByName = queryBuilder.getSearchByNameConfig(req.query);
    const filters = queryBuilder.getFilters(req.query);

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

    const options: Omit<Parameters<typeof getFromDB>[0], 'modelName'> = {
      findMultiple: true,
    };
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);

    if (paginationConfig) {
      options.pagination = paginationConfig;
    }

    const paginatedProducts = await getFromDB({ modelName: COLLECTION_NAMES.Product, ...options }, query);

    if (!paginatedProducts) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Products not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: paginatedProducts as IProduct[] });
  } catch (exception) {
    return next(exception);
  }
}

async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[products/:id GET] req.param', req.params);

    if (!req.params || !req.params._id) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Id params is empty or not attached!' });
    }

    const product = await getFromDB({ modelName: COLLECTION_NAMES.Product }, req.params._id);

    if (!product) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Product not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: product as Record<string, unknown> });
  } catch (exception) {
    return next(exception);
  }
}

async function addProduct(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[products POST] req.body', req.body);

    if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Product data is empty or not attached!' });
    }

    await saveToDB(req.body, COLLECTION_NAMES.Product);

    return wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Success!' });
  } catch (exception) {
    return next(exception);
  }
}

async function addReview(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[addReview] req.params.name:', req.params.name, ' /req.body:', req.body);

    if (!req.params.name) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Name param is empty or not attached!' });
    } else if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    }

    const RATING_MIN_VALUE = 0;
    const RATING_MAX_VALUE = 5;
    const rating = req.body.rating;

    if (!addReview.isNumber(rating)) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Rating value must be a number!' });
    } else if (rating < RATING_MIN_VALUE) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be greater than ${RATING_MIN_VALUE}!`,
      });
    } else if (rating > RATING_MAX_VALUE) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be less than ${RATING_MAX_VALUE}!`,
      });
    } else if (!addReview.isIntOrDecimalHalf(rating)) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be either an integer or .5 (a half) of it!`,
      });
    } else if (
      !req.body.author ||
      typeof req.body.author !== 'string' /* TODO: [AUTH] ensure author is a proper User or "Anonymous" */
    ) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Author value must be a non-empty string representing a proper User or "Anonymous"!',
      });
    } /* TODO: [DUP] check if review is not a duplicate */

    // TODO: [DX] refactor update process to use some Mongo (declarative) aggregation atomicly
    const productToUpdate = (await getFromDB(
      { modelName: COLLECTION_NAMES.Product },
      { name: req.params.name }
    )) as IProduct;

    if (!productToUpdate) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Reviewed product not found!' });
    }

    const productReviews = productToUpdate.reviews;
    productReviews.list.push({
      ...req.body,
      timestamp: Date.now(),
      content: req.body.content || '',
    });
    productReviews.averageRating = Number(
      (
        productReviews.list.reduce((sum, { rating }) => sum + (rating as number), 0) / productReviews.list.length
      ).toFixed(1)
    );

    await productToUpdate.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: productReviews as Record<keyof IReviews, IReviews[keyof IReviews]>,
    });
  } catch (exception) {
    return next(exception);
  }
}
addReview.isNumber = (value: unknown): boolean => value !== null && !Number.isNaN(Number(value));
addReview.isIntOrDecimalHalf = (value: number): boolean => {
  const isInt = Number.parseInt(value as unknown as string) === value;
  const isDecimalHalf = value % 1 === 0.5;

  return isInt || isDecimalHalf;
};

async function modifyProduct(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(products PATCH) req.body:', req.body);

    if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(
      COLLECTION_NAMES.Product,
      req.body.productId || { name: req.body.name },
      req.body.modifications
    );

    if (!modifiedProduct) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Product to modify not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: modifiedProduct as Record<keyof IProduct, IProduct[keyof IProduct]>,
    });
  } catch (exception) {
    return next(exception);
  }
}

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[products DELETE] req.params:', req.params);

    if (!req.params || !req.params.name) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Name param is empty or not attached!' });
    }

    const deletionResult = await deleteFromDB(COLLECTION_NAMES.Product, req.params.name);

    if (!deletionResult.ok) {
      logger.error('Deletion error occured...', deletionResult);

      return wrapRes(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, {
        exception: {
          message: `Failed to delete the product - 
              ok: ${deletionResult.ok}; 
              n: ${deletionResult.n}; 
              deletedCount: ${deletionResult.deletedCount}.
            `.trim(),
        },
      });
    } else if (deletionResult.deletedCount === 0) {
      logger.error('Deleted nothing...', deletionResult);

      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Could not find product to delete!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
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
