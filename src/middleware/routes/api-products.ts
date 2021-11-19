import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response, NextFunction } from 'express';
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
import { HTTP_STATUS_CODE } from '../../types';
import getMiddlewareErrorHandler from '../helpers/middleware-error-handler';
import { wrapRes } from '../helpers/middleware-response-wrapper';

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
router.patch('/api/products/:name/add-review', authMiddleware(getFromDB), userRoleMiddlewareFn('client'), addReview);
router.patch('/api/products/', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), modifyProduct);
router.delete('/api/products/:name', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), deleteProduct);
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
    const productsSpec = mapProductsTechnicalSpecs(await getFromDB(specQuery, 'Product', {}, projection));

    if (!productsSpec) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Products specs not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: productsSpec });
  } catch (exception) {
    return next(exception);
  }
}

async function getProducts(
  req: Request & {
    query: TIdListReq & TNameListReq & TProductsCategoriesReq & TPageLimit & TProductNameReq & TProductFiltersReq;
  },
  res: Response,
  next: NextFunction
) {
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

    const options: { pagination?: TPaginationConfig } = {};
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);

    if (paginationConfig) {
      options.pagination = paginationConfig;
    }

    const paginatedProducts = await getFromDB(query, 'Product', options);

    if (!paginatedProducts) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Products not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: paginatedProducts });
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

    const product = await getFromDB(req.params._id, 'Product');

    if (!product) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Product not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: product });
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

    await saveToDB(req.body, 'Product');

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
    const productToUpdate: IProduct = (await getFromDB({ name: req.params.name }, 'Product', {}))[0];

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

async function modifyProduct(req: Request & { userPermissions: any }, res: Response, next: NextFunction) {
  try {
    logger.log('(products PATCH) req.body:', req.body);

    if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    } else if (!req.userPermissions) {
      return wrapRes(res, HTTP_STATUS_CODE.FORBIDDEN, { error: 'User has no permissions!' });
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(
      req.body.productId || { name: req.body.name },
      req.body.modifications,
      'Product'
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

async function deleteProduct(req: Request & { userPermissions: any }, res: Response, next: NextFunction) {
  try {
    logger.log('[products DELETE] req.params:', req.params);

    if (!req.params || !req.params.name) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Name param is empty or not attached!' });
    } else if (!req.userPermissions) {
      return wrapRes(res, HTTP_STATUS_CODE.FORBIDDEN, { error: 'User has no permissions!' });
    }

    const deletionResult = await deleteFromDB({ name: req.params.name }, 'Product');

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
