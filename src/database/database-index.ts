import { getModel, IModel, TModelType } from './models/models-index';
import { queryBuilder } from './utils/queryBuilder';
import getPaginatedItems, { TPaginationConfig } from './utils/paginateItemsFromDB';
import * as dotenv from 'dotenv';
import getLogger from '../../utils/logger';
import { tryToConnectWithDB } from './connector';

// @ts-ignore
dotenv.default.config();

const logger = getLogger(module.filename);

tryToConnectWithDB();

function saveToDB(itemData: any, modelType: TModelType): Promise<IModel | string> {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object') {
    return Promise.reject('itemData must be an object!');
  }

  const Model = getModel(modelType);
  const item = new Model(itemData);

  return item.save();
}

async function getFromDB(
  itemQuery: any,
  modelType: TModelType,
  options: { pagination?: TPaginationConfig; isDistinct?: boolean } = {},
  projection?: Record<string, unknown>
): Promise<ReturnType<typeof getPaginatedItems> | any> {
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

  // TODO: refactor this!
  if (
    queryBuilder.isEmptyQueryObject(itemQuery) ||
    typeof itemQuery._id === 'object' ||
    (itemQuery instanceof Object && ('name' in itemQuery || '$and' in itemQuery || '_id' in itemQuery))
  ) {
    return Model.find(itemQuery, projection);
  }

  return Model.findOne(itemQuery);
}

// TODO: consider making this function either specific to update case or generic dependent on params
async function updateOneModelInDB(
  itemQuery: any,
  updateData: any,
  modelType: TModelType
): Promise<ReturnType<typeof Model.findOneAndUpdate> | null> {
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
      logger.error(`No operator for "${updateData.action}" action to update was matched!`);
      return null;
    }
  }

  // TODO: handle multiple values, most likely by $each operator
  const updateDataQueries = {
    [operator]: updateData.data,
  };

  return await Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true });
}

async function deleteFromDB(itemQuery: { name: string }, modelType: TModelType) {
  const Model = getModel(modelType);

  return await Model.deleteOne(itemQuery);
}

export { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB };
