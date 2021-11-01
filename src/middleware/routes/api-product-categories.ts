import getLogger from '../../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import * as expressModule from 'express';
import { getFromDB } from '../../database/database-index';
import { HTTP_STATUS_CODE } from '../../types';
import getMiddlewareErrorHandler from '../helpers/middleware-error-handler';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;
const router = Router();
const logger = getLogger(module.filename);

function createCategoriesHierarchy(productCategories: string[]): string[] {
  const categoriesHierarchy: Array<any> = [];

  productCategories.forEach((category) => {
    if (category.includes('|')) {
      const [categoryName, childCategory] = category.split('|');
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
        categoriesHierarchy[parentCategorySlotIndex].childCategories.push({
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

    const productCategories = (await getFromDB('category', 'Product', { isDistinct: true })) as string[];

    if (!productCategories) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'Product categories not found!' });
    }

    const categoriesHierarchy = createCategoriesHierarchy(productCategories);

    return res.status(HTTP_STATUS_CODE.OK).json({ payload: categoriesHierarchy });
  } catch (exception) {
    return next(exception);
  }
}
