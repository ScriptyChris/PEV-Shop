const DataBaseResult = class {
  save() {}
};

const getFromDB = jest.fn(() => {
  throw Error('Need to mock the getFromDB(..) implementation for unit test first!');
});
getFromDB._succeededGetFromDB = jest.fn(
  async (itemQuery, modelType, options = {}) => new getFromDB._succeededGetFromDB._clazz()
);
getFromDB._succeededGetFromDB._clazz = DataBaseResult;
getFromDB._failedGetFromDB = jest.fn(async (itemQuery, modelType, options = {}) => null);

const saveToDB = jest.fn(() => {
  throw Error('Need to mock the saveToDB(..) implementation for unit test first!');
});
saveToDB._succeededSaveToDB = jest.fn((itemData, modelType) =>
  Promise.resolve(new saveToDB._succeededSaveToDB._clazz())
);
saveToDB._succeededSaveToDB._clazz = DataBaseResult;
saveToDB._failedSaveToDB = jest.fn((itemData, modelType) => Promise.reject('save item error'));

module.exports = { getFromDB, saveToDB };
