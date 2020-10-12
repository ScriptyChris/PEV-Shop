const { readFileSync } = require('fs');
const { Router } = require('express');
const { middlewareFn: authMiddleware } = require('../features/auth');
const { getFromDB, saveToDB, updateOneModelInDB } = require('../../database/index');

const router = Router();
const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
const productList = getProductList();

router.get('/api/products', (req, res) => {
  res.json(productList);
});

router.post('/api/products', async (req, res) => {
  console.log('[products POST] req.body', req.body);

  try {
    const savedProduct = await saveToDB(req.body, 'Product');

    console.log('Product saved', savedProduct);
  } catch (exception) {
    console.error('Saving product exception:', exception);

    res.status(500);
    res.end(JSON.stringify({ exception }));
  }

  res.status(201);
  res.end('Success!');
});

router.patch('/api/products/', authMiddleware(getFromDB), async (req, res) => {
  console.log('[products PATCH] req.body', res.body);

  try {
    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(req.body.productId, req.body.modifications, 'Product');

    console.log('Product modified', modifiedProduct);
    res.status(201).json({ payload: modifiedProduct });
  } catch (exception) {
    console.error('Modifying product exception:', exception);

    res.status(500).json({ exception });
  }
});

module.exports = router;

function getProductList() {
  const [firstCategory] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));

  return firstCategory.products.map(({ name, url, price, images }) => {
    const image = '/images/' + images[0].imageSrc.split('/').pop();

    return { name, url, price, image };
  });
}
