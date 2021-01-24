const { ObjectId } = require('mongodb');
const { connect } = require('mongoose');
const getModel = require('./models/models-index');
const queryBuilder = require('./utils/queryBuilder');
const getPaginatedItems = require('./utils/paginateItemsFromDB');

// TODO: move to ENV
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
    // TODO: wrap it with util.promisify
    item.save((error, savedItem) => {
      if (error) {
        return reject(error);
      }

      resolve(savedItem);
    });
  });
};

const getFromDB = async (itemQuery, modelType, options = {}) => {
  const Model = getModel(modelType);

  if (options.pagination) {
    return getPaginatedItems(Model, itemQuery, options.pagination);
  }

  if (options.isDistinct === true) {
    return Model.distinct(itemQuery);
  }

  // TODO: improve querying via various ways
  if (typeof itemQuery === 'string') {
    itemQuery = { _id: itemQuery };
  }

  if (queryBuilder.isEmptyQueryObject(itemQuery) || typeof itemQuery._id === 'object') {
    return Model.find(itemQuery);
  }

  return Model.findOne(itemQuery);
};

// TODO: consider making this function either specific to update case or generic dependent on params
const updateOneModelInDB = (itemQuery, updateData, modelType) => {
  const Model = getModel(modelType);

  return new Promise((resolve, reject) => {
    // TODO: improve querying via various ways
    if (typeof itemQuery === 'string') {
      itemQuery = { _id: itemQuery };
    }

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
      case 'modify': {
        operator = '$set';
        break;
      }
      default: {
        reject(`Unrecognized update action: ${updateData.action}`);
      }
    }

    // TODO: handle multiple values, most likely by $each operator
    const updateDataQueries = {
      [operator]: updateData.data,
    };

    // TODO: wrap it with util.promisify
    Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true }, (error, updatedItem) => {
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
  queryBuilder,
  ObjectId,
};
