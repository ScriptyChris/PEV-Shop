import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import getModel, { TModelType, IModel, TGenericModel } from './models/models-index';
import * as queryBuilder from './utils/queryBuilder';
import getPaginatedItems, { TPaginationConfig } from './utils/paginateItemsFromDB';

// @ts-ignore
const { default: { connect } } = mongoose;

// TODO: move to ENV
const databaseURL = 'mongodb://localhost:27017';
connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function saveToDB(itemData: any, modelType: TModelType): Promise<IModel | string> {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object') {
    return Promise.reject('itemData must be an object!');
  }

  const Model: TGenericModel = getModel(modelType);
  const item: IModel = new Model(itemData);

  // @ts-ignore
  return item.save();
}

async function getFromDB(itemQuery: any, modelType: TModelType, options: {pagination?: TPaginationConfig, isDistinct?: boolean} = {})
    : ReturnType<typeof getPaginatedItems | Model.distinct | Model.find | Model.findOne> {
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
}

// TODO: consider making this function either specific to update case or generic dependent on params
function updateOneModelInDB(itemQuery: any, updateData: any, modelType: TModelType): ReturnType<typeof Model.findOneAndUpdate> | null {
  const Model = getModel(modelType);

  // TODO: improve querying via various ways
  if (typeof itemQuery === 'string') {
    itemQuery = { _id: itemQuery };
  }

  let operator = '';

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
      return null;
    }
  }

  // TODO: handle multiple values, most likely by $each operator
  const updateDataQueries = {
    [operator]: updateData.data,
  };

  return Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true });
}

export {
  saveToDB,
  getFromDB,
  updateOneModelInDB,
  queryBuilder,
  ObjectId,
};
