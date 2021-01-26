const succeededGetFromDB = jest.fn(async (itemQuery, modelType, options = {}) => new succeededGetFromDB._clazz());
succeededGetFromDB._clazz = class User {};

const failedGetFromDB = jest.fn(async (itemQuery, modelType, options = {}) => null);

module.exports = {
  _succeededGetFromDB: succeededGetFromDB,
  _failedGetFromDB: failedGetFromDB,
  getFromDB: jest.fn(() => {
    throw Error('Need to mock the getFromDB(..) implementation for unit test first!');
  }),
};
