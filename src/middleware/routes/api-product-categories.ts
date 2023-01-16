/**
 * @module
 */

import getLogger from '@commons/logger';
import { Router, Request, Response, NextFunction } from 'express';
import { getFromDB } from '@database/api';
import { HTTP_STATUS_CODE } from '@commons/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { COLLECTION_NAMES } from '@database/models';
import { CATEGORY_DEPTH_SEPARATOR } from '@commons/consts';

const router = Router();
const logger = getLogger(module.filename);

type TCategory = { categoryName: string; childCategories?: TCategory[] };

function createCategoriesHierarchy(productCategories: string[]) {
  const categoriesHierarchy: TCategory[] = [];

  productCategories.forEach((category) => {
    if (category.includes(CATEGORY_DEPTH_SEPARATOR)) {
      const [categoryName, childCategory] = category.split(CATEGORY_DEPTH_SEPARATOR);
      const parentCategorySlotIndex = categoriesHierarchy.findIndex(
        (categoryItem) => categoryItem.categoryName === categoryName
      );

      if (parentCategorySlotIndex === -1) {
        categoriesHierarchy.push({
          categoryName,
          childCategories: [
            {
              categoryName: childCategory,
            },
          ],
        });
      } else {
        const childCategories = categoriesHierarchy[parentCategorySlotIndex].childCategories;
        if (!Array.isArray(childCategories)) {
          throw Error(`childCategories is not an array! Received "${childCategories}".`);
        }

        childCategories.push({
          categoryName: childCategory,
        });
      }
    } else {
      categoriesHierarchy.push({
        categoryName: category,
      });
    }
  });

  return categoriesHierarchy;
}

router.get('/api/productCategories', getProductCategoriesHierarchy);
router.use(getMiddlewareErrorHandler(logger));

export default router;

async function getProductCategoriesHierarchy(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(getProductCategoriesHierarchy) req.params:', req.params);

    const productCategories = await getFromDB({ modelName: COLLECTION_NAMES.Product, isDistinct: true }, 'category');

    if (!productCategories) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Product categories not found!' });
    }

    const categoriesHierarchy = createCategoriesHierarchy(productCategories as string[]);

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: categoriesHierarchy });
  } catch (exception) {
    return next(exception);
  }
}
