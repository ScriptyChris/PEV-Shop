const { connect } = require('mongoose');
const getModel = require('./models/index');

const databaseURL = 'mongodb://localhost:27017';
connect(databaseURL, { useNewUrlParser: true });

const saveToDB = (itemData, modelType) => {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object' || !modelType || typeof modelType !== 'string') {
    return null;
  }

  const Model = getModel(modelType);
  const item = new Model(itemData);

  return new Promise((resolve, reject) => {
    item.save((error, savedProduct) => {
      if (error) {
        return reject(error);
      }

      resolve(savedProduct);
    });
  });
};

module.exports = {
  saveToDB,
};
