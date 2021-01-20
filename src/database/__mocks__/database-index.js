const succeededGetFromDB = jest.fn(async (itemQuery, modelType, options = {}) => new succeededGetFromDB._clazz());
succeededGetFromDB._clazz = class User {};

const failedGetFromDB = jest.fn(async (itemQuery, modelType, options = {}) => null);

module.exports = {
  succeededGetFromDB,
  failedGetFromDB,
};
