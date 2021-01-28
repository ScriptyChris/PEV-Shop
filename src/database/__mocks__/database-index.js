const { getMockImplementationError } = require('../../../test/mockUtils');

const DataBaseResult = class {};
DataBaseResult.prototype.save = jest.fn();
DataBaseResult.prototype.execPopulate = jest.fn((path) => Promise.resolve(true));

const getFromDB = jest.fn(() => {
  throw getMockImplementationError('getFromDB');
});
getFromDB._succeededCall = jest.fn(async (itemQuery, modelType, options = {}) => new getFromDB._succeededCall._clazz());
getFromDB._succeededCall._clazz = DataBaseResult;
getFromDB._failedCall = jest.fn(async (itemQuery, modelType, options = {}) => null);

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

module.exports = { getFromDB, saveToDB, updateOneModelInDB, ObjectId };
