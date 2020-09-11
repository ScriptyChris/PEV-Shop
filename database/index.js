const { connect } = require('mongoose');
const getModel = require('./models/index');

const databaseURL = 'mongodb://localhost:27017';
connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const saveToDB = (itemData, modelType) => {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object' || !modelType || typeof modelType !== 'string') {
    return null;
  }

  const Model = getModel(modelType);
  const item = new Model(itemData);

  return new Promise((resolve, reject) => {
    item.save((error, savedItem) => {
      if (error) {
        return reject(error);
      }

      resolve(savedItem);
    });
  });
};

const getFromDB = (itemQuery, modelType) => {
  const Model = getModel(modelType);

  return new Promise((resolve, reject) => {
    // TODO: improve querying via various ways
    if (typeof itemQuery === 'string') {
      itemQuery = { _id: itemQuery };
    }

    Model.findOne(itemQuery, (error, foundItem) => {
      if (error) {
        return reject(error);
      }

      resolve(foundItem);
    });
  });
};

module.exports = {
  saveToDB,
  getFromDB,
};
