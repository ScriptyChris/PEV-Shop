import { getMockImplementationError } from '../../../test/mockUtils';

type TMockWithProps = TJestMock & Partial<{ _succeededCall: any; _failedCall: any }>;

const DataBaseResult = function () {};
DataBaseResult.prototype.save = jest.fn();
DataBaseResult.prototype.populate = jest.fn(() => ({
  execPopulate() {
    return Promise.resolve(true);
  },
}));
DataBaseResult.prototype.matchPassword = jest.fn(() => {
  throw getMockImplementationError('matchPassword');
});
DataBaseResult.prototype.matchPassword._succeededCall = jest.fn(() => Promise.resolve(true));
DataBaseResult.prototype.matchPassword._failedCall = jest.fn(() => Promise.resolve(false));
DataBaseResult.prototype.generateAuthToken = jest.fn(() => Promise.resolve('auth token'));

const getFromDB: TMockWithProps = jest.fn(() => {
  throw getMockImplementationError('getFromDB');
});
getFromDB._succeededCall = () => Promise.resolve(new getFromDB._succeededCall._clazz());
getFromDB._succeededCall._clazz = DataBaseResult;
getFromDB._failedCall = () => Promise.resolve(null);

const saveToDB: TMockWithProps = jest.fn(() => {
  throw getMockImplementationError('saveToDB');
});
saveToDB._succeededCall = () => Promise.resolve(new saveToDB._succeededCall._clazz());
saveToDB._succeededCall._clazz = DataBaseResult;
saveToDB._failedCall = () => Promise.reject('save item error');

const updateOneModelInDB: TMockWithProps = jest.fn(() => {
  throw getMockImplementationError('updateOneModelInDB');
});
updateOneModelInDB._succeededCall = () => new updateOneModelInDB._succeededCall._clazz();
updateOneModelInDB._succeededCall._clazz = DataBaseResult;
updateOneModelInDB._failedCall = () => null;

class ObjectId {
  constructor(id = 'test') {
    return { _id: id };
  }
}

const queryBuilder = (() => {
  const _queryBuilder: any = {
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
  _queryBuilder.getIdListConfig._succeededCall = () => ({
    _id: { $in: ['123'] },
  });
  _queryBuilder.getIdListConfig._failedCall = () => null;
  _queryBuilder.getProductsWithChosenCategories._succeededCall = () => ({
    category: {
      $in: ['test category'],
    },
  });
  _queryBuilder.getProductsWithChosenCategories._failedCall = () => null;
  _queryBuilder.getPaginationConfig._succeededCall = () => ({
    page: 1,
    limit: 10,
  });
  _queryBuilder.getPaginationConfig._failedCall = () => null;

  return Object.freeze(_queryBuilder);
})();

export { getFromDB, saveToDB, updateOneModelInDB, ObjectId, queryBuilder };
