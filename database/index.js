const { connect } = require('mongoose');
const getModel = require('./models/index');

const databaseURL = 'mongodb://localhost:27017';
connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TODO: create script and optionally use it to populate example database data

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

// TODO: consider making this function either specific to update case or generic dependent on params
const updateOneModelInDB = (itemQuery, updateData, modelType) => {
  const Model = getModel(modelType);

  return new Promise((resolve, reject) => {
    // TODO: improve querying via various ways
    if (typeof itemQuery === 'string') {
      itemQuery = { _id: itemQuery };
    }

    const updateDataQueries = {};

    let operator;

    switch (updateData.action) {
      case 'addUnique': {
        operator = '$addToSet';
        break;
      }
      case 'deleteAll': {
        operator = '$pull';
        break;
      }
      default: {
        reject(`'Unrecognized update action: ${updateData.action}`);
      }
    }

    // TODO: handle multiple values, most likely by $each operator
    const [key, value] = Object.entries(updateData.data)[0];
    updateDataQueries[operator] = {
      [key]: value,
    };

    Model.updateOne(itemQuery, updateDataQueries, (error, updatedItem) => {
      if (error) {
        return reject(error);
      }

      resolve(updatedItem);
    });
  });
};

module.exports = {
  saveToDB,
  getFromDB,
  updateOneModelInDB,
};
