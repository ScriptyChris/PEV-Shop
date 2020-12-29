const { Router } = require('express');
const { getFromDB } = require('../../database/index');

const router = Router();

function createCategoriesHierarchy(productCategories) {
  const categoriesHierarchy = [];

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

router.get('/api/productCategories', async (req, res) => {
  console.log('[productCategories GET]');

  try {
    const productCategories = await getFromDB('category', 'Product', { isDistinct: true });
    console.log('productCategories:', productCategories);

    const categoriesHierarchy = createCategoriesHierarchy(productCategories);

    res.status(200).json(categoriesHierarchy);
  } catch (exception) {
    console.error('Retrieving product categories exception:', exception);

    res.status(500).json({ exception });
  }
});

module.exports = router;
