import getLogger from '../../../utils/logger';
import { Router, Request, Response } from 'express';
import { getFromDB } from '../../database/database-index';

const logger = getLogger(module.filename);
const router = Router();

function createCategoriesHierarchy(productCategories: string[]): string[] {
  const categoriesHierarchy: Array<any> = [];

  productCategories.forEach((category) => {
    if (category.includes('|')) {
      const [parentCategory, childCategory] = category.split('|');
      const parentCategorySlotIndex = categoriesHierarchy.findIndex(
        (categoryItem) => categoryItem.parentCategory === parentCategory
      );

      if (parentCategorySlotIndex === -1) {
        categoriesHierarchy.push({
          parentCategory,
          childCategories: [childCategory],
        });
      } else {
        categoriesHierarchy[parentCategorySlotIndex].childCategories.push(childCategory);
      }
    } else {
      categoriesHierarchy.push(category);
    }
  });

  return categoriesHierarchy;
}

router.get('/api/productCategories', getProductCategoriesHierarchy);

export default router;

async function getProductCategoriesHierarchy(req: Request, res: Response): Promise<void> {
  logger.log('[productCategories GET] req.param:', req.param);

  try {
    const productCategories = await getFromDB('category', 'Product', { isDistinct: true }) as string[];
    // logger.log('productCategories:', productCategories);

    const categoriesHierarchy = createCategoriesHierarchy(productCategories);

    res.status(200).json(categoriesHierarchy);
  } catch (exception) {
    logger.error('Retrieving product categories exception:', exception);

    res.status(500).json({ exception });
  }
}
