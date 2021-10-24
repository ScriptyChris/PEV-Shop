import getLogger from '../../../utils/logger';
import { Request, Response } from 'express';
import * as expressModule from 'express';
import { getFromDB } from '../../database/database-index';
import { HTTP_STATUS_CODE } from '../../types';

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

export default router;

async function getProductCategoriesHierarchy(req: Request, res: Response): Promise<void> {
  logger.log('[productCategories GET] req.params:', req.params);

  try {
    const productCategories = (await getFromDB('category', 'Product', { isDistinct: true })) as string[];
    // logger.log('productCategories:', productCategories);

    const categoriesHierarchy = createCategoriesHierarchy(productCategories);

    res.status(HTTP_STATUS_CODE.OK).json(categoriesHierarchy);
  } catch (exception) {
    logger.error('Retrieving product categories exception:', exception);

    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ exception });
  }
}
