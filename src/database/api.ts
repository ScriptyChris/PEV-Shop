/**
 * Facade over database CRUD operations.
 * @module
 */

import {
  getModel,
  TCOLLECTION_NAMES,
  TDocuments,
  COLLECTION_NAMES,
  ModelPopulateOptions,
  isValidObjectId,
  TSort,
} from './models';
import getPaginatedItems, { TPaginationConfig, TPaginateModel } from './utils/paginateItemsFromDB';
import getLogger from '@commons/logger';
import { connectWithDB } from './connector';

type TGetModelReturnType = ReturnType<typeof getModel>;

const logger = getLogger(module.filename);

connectWithDB();

async function saveToDB(modelName: TCOLLECTION_NAMES, itemData: unknown) {
  // TODO: improve validation
  if (!itemData || typeof itemData !== 'object') {
    return Promise.reject(`itemData must be an object! Received: "${itemData}"`);
  }

  const Model = getModel(modelName);
  const item = new Model(itemData);

  return item.save();
}

type TFindParams = Parameters<TGetModelReturnType['find']>;
async function getFromDB<T extends TDocuments>(
  config: {
    modelName: TCOLLECTION_NAMES;
    pagination?: TPaginationConfig;
    isDistinct?: boolean;
    findMultiple?: boolean;
    population?: ModelPopulateOptions | ModelPopulateOptions[] | string;
    sort?: TSort;
  },
  itemQuery: TFindParams[0] | string,
  projection?: unknown
): Promise<T | ReturnType<typeof Model.distinct> | ReturnType<typeof getPaginatedItems> | null> {
  const Model = getModel(config.modelName);

  if (config.pagination) {
    if (typeof itemQuery === 'string') {
      throw TypeError(`itemQuery for pagination cannot be a string! Received "${itemQuery}".`);
    }

    return getPaginatedItems(
      {
        Model: Model as TPaginateModel,
        pagination: config.pagination,
        sort: config.sort,
      },
      itemQuery,
      projection
    );
  }

  if (config.isDistinct === true) {
    if (typeof itemQuery !== 'string') {
      throw TypeError(`itemQuery should be a string to use it for Model.distinct()! Received: '${itemQuery}'`);
    }

    return Model.distinct(itemQuery);
  }

  let result;

  if (typeof itemQuery === 'string') {
    if (isValidObjectId(itemQuery)) {
      result = await Model.findById(itemQuery, projection);
    } else {
      throw TypeError(`itemQuery "${itemQuery}" is a string, but not valid ObjectId!`);
    }
  } else if (config.findMultiple) {
    result = await Model.find(itemQuery, projection, { sort: config.sort });
  } else {
    result = await Model.findOne(itemQuery, projection);
  }

  if (!result) {
    return result;
  }

  if (config.population) {
    if (typeof config.population === 'string') {
      config.population = { path: config.population };
    }

    // avoid TypeScript complaining about possible undefined, because `config` is mutable
    const { population } = config;
    const doPopulate = (doc: TGetModelReturnType) => doc.execPopulate(population);

    result = await (Array.isArray(result) ? Promise.all((result as []).map(doPopulate)) : doPopulate(result as any));
  }

  return result as T;
}

type TFindOneAndUpdateParams = Parameters<TGetModelReturnType['findOneAndUpdate']>;
async function updateOneModelInDB(
  modelName: TCOLLECTION_NAMES,
  itemQuery: TFindOneAndUpdateParams[0] | string,
  updateData: { action: string; data: unknown }
) {
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
  const updateDataQueries: TFindOneAndUpdateParams[1] = {
    [operator]: updateData.data,
  };

  const Model = getModel(modelName);
  return Model.findOneAndUpdate(itemQuery, updateDataQueries, { new: true });
}

async function deleteFromDB(modelName: TCOLLECTION_NAMES, fieldValue: string | RegExp | Record<never, never>) {
  let fieldName = '';

  switch (modelName) {
    case COLLECTION_NAMES.User: {
      fieldName = 'login';
      break;
    }
    case COLLECTION_NAMES.Order: {
      fieldName = '';
      break;
    }
    case COLLECTION_NAMES.Product: {
      fieldName = 'url';
      break;
    }
    default: {
      throw TypeError(`Unrecognized 'modelName': ${modelName}`);
    }
  }

  const Model = getModel(modelName);
  const query = fieldName === '' ? fieldValue : { [fieldName]: fieldValue };

  if (typeof fieldValue === 'string') {
    return Model.deleteOne(query);
  }

  return Model.deleteMany(query);
}

export { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB };
