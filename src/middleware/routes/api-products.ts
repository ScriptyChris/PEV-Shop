/**
 * @module
 */

import getLogger from '@commons/logger';
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddlewareFn, userRoleMiddlewareFn } from '@middleware/features/auth';
import { getFromDB, saveToDB, updateOneModelInDB, deleteFromDB } from '@database/api';
import { queryBuilder } from '@database/utils/queryBuilder';
import mapProductsTechnicalSpecs from '@middleware/helpers/api-products-specs-mapper';
import { ProductModel, IProduct, IReviews, COLLECTION_NAMES, USER_ROLES_MAP } from '@database/models';
import { HTTP_STATUS_CODE } from '@commons/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { parseFormData } from '@middleware/helpers/form-data-handler';
import { REVIEW_RATING_MIN_VALUE, REVIEW_RATING_MAX_VALUE } from '@commons/consts';

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

router.get('/api/products/specs', getProductsSpecs);
router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);
router.post('/api/products', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.seller), addProduct);
router.patch('/api/products/:url/add-review', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.client), addReview);
router.patch('/api/products/', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.seller), modifyProduct);
router.delete('/api/products/:url', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.seller), deleteProduct);
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
    logger.log('(getProducts) req.query', req.query);

    if (!req.query) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request query is empty or not attached!' });
    }

    // TODO: ... and really refactor this!
    const idListConfig = queryBuilder.getIdListConfig(req.query);
    const nameListConfig = queryBuilder.getNameListConfig(req.query);
    const price = queryBuilder.getPriceConfig(req.query);
    const chosenCategories = queryBuilder.getProductsWithChosenCategories(req.query);
    const searchByName = queryBuilder.getSearchByNameConfig(req.query);
    const searchByUrl = queryBuilder.getSearchByUrlConfig(req.query);
    const technicalSpecs = queryBuilder.getTechnicalSpecs(req.query);

    let query = {};
    let projection = {};

    if (idListConfig) {
      query = idListConfig;
    } else if (nameListConfig) {
      query = nameListConfig;
    } else if (searchByName) {
      ({ query, projection } = searchByName);
    } else if (searchByUrl) {
      query = searchByUrl;
    } else if (price || chosenCategories || technicalSpecs) {
      query = { ...(price || {}), ...(chosenCategories || {}), ...(technicalSpecs || {}) };
    }

    const options: Omit<Parameters<typeof getFromDB>[0], 'modelName'> = {
      findMultiple: true,
    };
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);
    const sortingConfig = queryBuilder.getSortingConfig(req.query);

    if (paginationConfig) {
      options.pagination = paginationConfig;
    }

    if (sortingConfig) {
      options.sort = sortingConfig;
    }

    const paginatedProducts = (await getFromDB(
      { modelName: COLLECTION_NAMES.Product, ...options },
      query,
      projection
    )) as IProduct[] | null;

    if (!paginatedProducts || paginatedProducts.length === 0) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Products not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: paginatedProducts });
  } catch (exception) {
    return next(exception);
  }
}

async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(getProductById) req.param', req.params);

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
  const { imagesUploadTmpDirPath, addTmpImagePath, removeTmpImages, moveValidImagesToTargetLocation } =
    ProductModel.createImageRelocator();

  try {
    logger.log('(addProduct) req.body', req.body);

    if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Product data is empty or not attached!' });
    }

    const { parsingError, fields, files } = await parseFormData(req, {
      keepExtensions: true,
      // TODO: [DX] use `options.fileWriteStreamHandler` to avoid temporary storing image on disk
      uploadDir: imagesUploadTmpDirPath,
      filename(name, ext, { name: partName = '' }) {
        const tmpPath = `${name}${ext}`;
        addTmpImagePath(tmpPath, partName as string);

        return tmpPath;
      },
    });

    if (parsingError) {
      removeTmpImages();
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: parsingError });
    } else if (!fields?.plainData) {
      removeTmpImages();
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: "Couldn't extract `plainData` property from payload!",
      });
    } else if (!files) {
      removeTmpImages();
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: "Couldn't extract `files` property from payload!" });
    }

    const { imagesValidationError, images } = ProductModel.validateImages(files);
    if (imagesValidationError) {
      removeTmpImages();
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: imagesValidationError });
    }

    const newProductData = {
      ...JSON.parse(fields.plainData as string),
      images: ProductModel.sortImageNames(images),
    };
    const { url } = (await saveToDB(COLLECTION_NAMES.Product, newProductData)) as IProduct;
    moveValidImagesToTargetLocation(url, true);

    return wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Success!' });
  } catch (exception) {
    removeTmpImages();
    return next(exception);
  }
}

async function addReview(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(addReview) req.params.url:', req.params.url, ' /req.body:', req.body);

    if (!req.params.url) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Url param is empty or not attached!' });
    } else if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    }

    const rating = req.body.rating;

    if (!addReview.isNumber(rating)) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Rating value must be a number!' });
    } else if (rating < REVIEW_RATING_MIN_VALUE) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be greater than ${REVIEW_RATING_MIN_VALUE}!`,
      });
    } else if (rating > REVIEW_RATING_MAX_VALUE) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be less than ${REVIEW_RATING_MAX_VALUE}!`,
      });
    } else if (!addReview.isIntOrDecimalHalf(rating)) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: `Rating value must be either an integer or .5 (a half) of it!`,
      });
    } else if (typeof req.body.isAuthorAnonymous !== 'boolean') {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: '`isAuthorAnonymous` value must be a boolean!',
      });
    }

    // TODO: [DX] refactor update process to use some Mongo (declarative) aggregation atomicly
    const productToUpdate = (await getFromDB(
      { modelName: COLLECTION_NAMES.Product },
      { url: req.params.url }
    )) as IProduct;

    if (!productToUpdate) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Reviewed product not found!' });
    }

    if (productToUpdate.validateReviewDuplicatedAuthor(req.user!.login)) {
      return wrapRes(res, HTTP_STATUS_CODE.CONFLICT, { error: 'Given author already added review for this product!' });
    }

    productToUpdate.addReview(req.body, req.user!.login);
    await productToUpdate.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: productToUpdate.reviews as Record<keyof IReviews, IReviews[keyof IReviews]>,
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
    logger.log('(deleteProduct) req.params:', req.params);

    if (!req.params || !req.params.url) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Url param is empty or not attached!' });
    }

    const deletionResult = await deleteFromDB(COLLECTION_NAMES.Product, req.params.url);

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

    ProductModel.removeImages(req.params.url);

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}
