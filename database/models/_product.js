const { model } = require('mongoose');
const productSchema = require('../schemas/product');

module.exports = model('Product', productSchema);
