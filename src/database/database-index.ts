import { ObjectId } from 'mongodb';
import { connect } from 'mongoose';
import getModel, { TModelType, IModel, TGenericModel } from './models/models-index';
import * as queryBuilder from './utils/queryBuilder';
import getPaginatedItems, { TPaginateResult, TPaginationConfig } from './utils/paginateItemsFromDB';

// TODO: move to ENV
const databaseURL: string = 'mongodb://localhost:27017';
connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TODO: create script and optionally use it to populate example database data

const saveToDB = async (itemData: any, modelType: TModelType): Promise<IModel | string> => {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object' /*|| !modelType || typeof modelType !== 'string'*/) {
    return Promise.reject('itemData must be an object!');
  }

  const Model: TGenericModel = getModel(modelType);
  const item: IModel = new Model(itemData);

  // @ts-ignore
  return await item.save();
};

const getFromDB = async (itemQuery: any, modelType: TModelType, options: {pagination?: TPaginationConfig, isDistinct?: boolean} = {}) => {
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
const updateOneModelInDB = (itemQuery: any, updateData: any, modelType: TModelType): any | null => {
  const Model = getModel(modelType);

  // return new Promise((resolve, reject) => {
    // TODO: improve querying via various ways
    if (typeof itemQuery === 'string') {
      itemQuery = { _id: itemQuery };
    }

    let operator: string = '';

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
        // reject(`Unrecognized update action: ${updateData.action}`);
        return null;
      }
    }

    // TODO: handle multiple values, most likely by $each operator
    const updateDataQueries = {
      [operator]: updateData.data,
    };

    return Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true });

    // // TODO: wrap it with util.promisify
    // Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true }, (error, updatedItem) => {
    //   if (error) {
    //     return reject(error);
    //   }
    //
    //   resolve(updatedItem);
    // });
  // });
};

export {
  saveToDB,
  getFromDB,
  updateOneModelInDB,
  queryBuilder,
  ObjectId,
};
