const { connect } = require('mongoose');
const { Product } = require('./models/index');
const databaseURL = 'mongodb://localhost:27017';

connect(databaseURL, { useNewUrlParser: true });

const product = new Product({
  name: 'Test product',
  price: 39.87,
});

product.save((error, savedProduct) => {
  if (error) {
    return console.error('Product save error!', error);
  }

  console.log('Product saved', savedProduct);
});
