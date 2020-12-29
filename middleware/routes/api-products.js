// const { readFileSync } = require('fs');
const { Router } = require('express');
const { authMiddlewareFn: authMiddleware, userRoleMiddlewareFn } = require('../features/auth');
const { getFromDB, saveToDB, updateOneModelInDB, queryBuilder } = require('../../database/index');

const router = Router();
// const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
// const productList =  getProductList();

router.get('/api/products', async (req, res) => {
  console.log('[products GET] query', req.query);

  // TODO: move building query with options to queryBuilder module; pass query type/target name, to use Strategy like pattern
  try {
    const query = queryBuilder.getIdListConfig(req.query);
    const options = {};
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);

    if (queryBuilder.isEmptyQueryObject(query) && paginationConfig) {
      options.pagination = paginationConfig;
    }

    const paginatedProducts = await getFromDB(query, 'Product', options);

    // console.log('paginatedProducts:', paginatedProducts);

    res.status(200).json(paginatedProducts);
  } catch (exception) {
    console.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
});

router.get('/api/products/:id', async (req, res) => {
  console.log('[products/:id GET] req.param', req.params);

  try {
    const product = await getFromDB(req.params._id, 'Product');

    res.status(200).json(product);
  } catch (exception) {
    console.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
});

router.post('/api/products', async (req, res) => {
  console.log('[products POST] req.body', req.body);

  try {
    const savedProduct = await saveToDB(req.body, 'Product');

    console.log('Product saved', savedProduct);

    res.status(201);
    res.end('Success!');
  } catch (exception) {
    console.error('Saving product exception:', exception);

    res.status(500).json({ exception });
  }
});

router.patch('/api/products/', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), async (req, res) => {
  console.log('[products PATCH] req.body', req.body);

  try {
    if (!req.userPermissions) {
      throw new Error('User has no permissions!');
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(req.body.productId, req.body.modifications, 'Product');

    console.log('Product modified', modifiedProduct);
    res.status(201).json({ payload: modifiedProduct });
  } catch (exception) {
    console.error('Modifying product exception:', exception);

    res.status(403).json({ exception });
  }
});

module.exports = router;

// function getProductList() {
//   const [firstCategory] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));
//
//   return firstCategory.products.map(({ name, url, price, images }) => {
//     const image = '/images/' + images[0].imageSrc.split('/').pop();
//
//     return { name, url, price, image };
//   });
// }
