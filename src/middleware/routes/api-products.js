const logger = require('../../../utils/logger')(module.filename);
// const { readFileSync } = require('fs');
const { Router } = require('express');
const { authMiddlewareFn: authMiddleware, userRoleMiddlewareFn } = require('../features/auth');
const { getFromDB, saveToDB, updateOneModelInDB, queryBuilder } = require('../../database/database-index');

const router = Router();
// const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';
// const productList =  getProductList();

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);
// TODO: add auth and user-role middlewares
router.post('/api/products', addProduct);
router.patch('/api/products/', authMiddleware(getFromDB), userRoleMiddlewareFn('seller'), modifyProduct);

// expose for unit tests
router._getProducts = getProducts;
router._getProductById = getProductById;
router._addProduct = addProduct;
router._modifyProduct = modifyProduct;

module.exports = router;

async function getProducts(req, res) {
  // TODO: move building query with options to queryBuilder module; pass query type/target name, to use Strategy like pattern
  try {
    logger.log('[products GET] query', req.query);

    // TODO: ... and really refactor this!
    const idListConfig = queryBuilder.getIdListConfig(req.query);
    const chosenCategories = queryBuilder.getProductsWithChosenCategories(req.query);

    let query = {};

    if (idListConfig) {
      query = idListConfig;
    } else if (chosenCategories) {
      query = chosenCategories;
    }

    const options = {};
    const paginationConfig = queryBuilder.getPaginationConfig(req.query);

    if (paginationConfig) {
      options.pagination = paginationConfig;
    }

    const paginatedProducts = await getFromDB(query, 'Product', options);

    // logger.log('paginatedProducts:', paginatedProducts);

    res.status(200).json(paginatedProducts);
  } catch (exception) {
    logger.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
}

async function getProductById(req, res) {
  try {
    logger.log('[products/:id GET] req.param', req.params);

    const product = await getFromDB(req.params._id, 'Product');

    res.status(200).json(product);
  } catch (exception) {
    logger.error('Retrieving product exception:', exception);

    res.status(500).json({ exception });
  }
}

async function addProduct(req, res) {
  try {
    logger.log('[products POST] req.body', req.body);

    const savedProduct = await saveToDB(req.body, 'Product');

    logger.log('Product saved', savedProduct);

    res.status(201).json({ msg: 'Success!' });
  } catch (exception) {
    logger.error('Saving product exception:', exception);

    res.status(500).json({ exception });
  }
}

async function modifyProduct(req, res) {
  try {
    logger.log('[products PATCH] req.body', req.body);

    if (!req.userPermissions) {
      throw new Error('User has no permissions!');
    }

    // TODO: prepare to be used with various product properties
    const modifiedProduct = await updateOneModelInDB(req.body.productId, req.body.modifications, 'Product');

    logger.log('Product modified', modifiedProduct);
    res.status(201).json({ payload: modifiedProduct });
  } catch (exception) {
    logger.error('Modifying product exception:', exception);

    res.status(403).json({ exception });
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
