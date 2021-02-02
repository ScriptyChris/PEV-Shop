const { getMockImplementationError } = require('../../../test/mockUtils');

const DataBaseResult = class {};
DataBaseResult.prototype.save = jest.fn();
DataBaseResult.prototype.execPopulate = jest.fn((path) => Promise.resolve(true));
DataBaseResult.prototype.matchPassword = jest.fn(() => {
  throw getMockImplementationError('matchPassword');
});
DataBaseResult.prototype.matchPassword._succeededCall = jest.fn(() => Promise.resolve(true));
DataBaseResult.prototype.matchPassword._failedCall = jest.fn(() => Promise.resolve(false));
DataBaseResult.prototype.generateAuthToken = jest.fn(() => Promise.resolve('auth token'));

const getFromDB = jest.fn(() => {
  throw getMockImplementationError('getFromDB');
});
getFromDB._succeededCall = jest.fn((itemQuery, modelType, options = {}) =>
  Promise.resolve(new getFromDB._succeededCall._clazz())
);
getFromDB._succeededCall._clazz = DataBaseResult;
getFromDB._failedCall = jest.fn((itemQuery, modelType, options = {}) => Promise.resolve(null));

const saveToDB = jest.fn(() => {
  throw getMockImplementationError('saveToDB');
});
saveToDB._succeededCall = jest.fn((itemData, modelType) => Promise.resolve(new saveToDB._succeededCall._clazz()));
saveToDB._succeededCall._clazz = DataBaseResult;
saveToDB._failedCall = jest.fn((itemData, modelType) => Promise.reject('save item error'));

const updateOneModelInDB = jest.fn(() => {
  throw getMockImplementationError('updateOneModelInDB');
});
updateOneModelInDB._succeededCall = jest.fn((itemQuery, updateData, modelType) =>
  Promise.resolve(new updateOneModelInDB._succeededCall._clazz())
);
updateOneModelInDB._succeededCall._clazz = DataBaseResult;

class ObjectId {
  constructor(id = 'test') {
    return { _id: id };
  }
}

const queryBuilder = (() => {
  const _queryBuilder = {
    getIdListConfig: jest.fn(() => {
      throw getMockImplementationError('getIdListConfig');
    }),
    getProductsWithChosenCategories: jest.fn(() => {
      throw getMockImplementationError('getProductsWithChosenCategories');
    }),
    getPaginationConfig: jest.fn(() => {
      throw getMockImplementationError('getPaginationConfig');
    }),
  };
  _queryBuilder.getIdListConfig._succeededCall = jest.fn((reqQuery) => ({
    _id: { $in: ['123'] },
  }));
  _queryBuilder.getIdListConfig._failedCall = jest.fn((reqQuery) => null);
  _queryBuilder.getProductsWithChosenCategories._succeededCall = jest.fn((reqQuery) => ({
    category: {
      $in: ['test category'],
    },
  }));
  _queryBuilder.getProductsWithChosenCategories._failedCall = jest.fn((reqQuery) => null);
  _queryBuilder.getPaginationConfig._succeededCall = jest.fn((reqQuery) => ({
    page: 1,
    limit: 10,
  }));
  _queryBuilder.getPaginationConfig._failedCall = jest.fn((reqQuery) => null);

  return Object.freeze(_queryBuilder);
})();

module.exports = { getFromDB, saveToDB, updateOneModelInDB, ObjectId, queryBuilder };
