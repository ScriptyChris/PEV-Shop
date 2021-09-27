import { TJestMock } from '../../types';
import { getMockImplementationError } from '../../../test/mockUtils';

type TMockWithProps = TJestMock & Partial<{ _succeededCall: any; _failedCall: any }>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
function DataBaseResult() {}
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

export { getFromDB, saveToDB, updateOneModelInDB, ObjectId };
