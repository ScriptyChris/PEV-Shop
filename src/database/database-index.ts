import { getModel, TModel, TModelName } from './models/models-index';
import { queryBuilder } from './utils/queryBuilder';
import getPaginatedItems, { TPaginationConfig } from './utils/paginateItemsFromDB';
import { config as dotenvConfig } from 'dotenv';
import getLogger from '@commons/logger';
import { connectWithDB } from './connector';

dotenvConfig();

const logger = getLogger(module.filename);

connectWithDB();

function saveToDB(itemData: any, modelName: TModelName): Promise<TModel | string> {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object') {
    return Promise.reject('itemData must be an object!');
  }

  const Model = getModel(modelName);
  const item = new Model(itemData);

  return item.save();
}

async function getFromDB(
  itemQuery: any,
  modelName: TModelName,
  options: { pagination?: TPaginationConfig; isDistinct?: boolean } = {},
  projection?: Record<string, unknown>
): Promise<ReturnType<typeof getPaginatedItems> | any> {
  const Model = getModel(modelName);

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
  modelName: TModelName
): Promise<ReturnType<typeof Model.findOneAndUpdate> | null> {
  const Model = getModel(modelName);

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

async function deleteFromDB(fieldValue: string | RegExp, modelName: TModelName) {
  let fieldName = '';

  switch (modelName) {
    case 'User': {
      fieldName = 'login';
      break;
    }
    case 'Product': {
      fieldName = 'name';
      break;
    }
    default: {
      throw TypeError(`Unrecognized 'modelName': ${modelName}`);
    }
  }

  const Model = getModel(modelName);
  const query = { [fieldName]: fieldValue };

  if (typeof fieldValue === 'string') {
    return await Model.deleteOne(query);
  }

  return await Model.deleteMany(query);
}

export { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB };
