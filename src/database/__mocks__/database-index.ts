import { TJestMock } from '../../../test/unit/test-index';
import { getMockImplementationError } from '../../../test/unit/mockUtils';

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
getFromDB._succeededCall = () =>
  Promise.resolve(
    Object.create(getFromDB._succeededCall._clazz.prototype, { isConfirmed: { value: true, enumerable: true } })
  );
getFromDB._succeededCall._clazz = DataBaseResult;
getFromDB._failedCall = {
  general: () => Promise.resolve(null),
  notConfirmed: () =>
    Promise.resolve(
      Object.create(getFromDB._succeededCall._clazz.prototype, { isConfirmed: { value: false, enumerable: true } })
    ),
};

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

const deleteFromDB: TMockWithProps = jest.fn(() => {
  throw getMockImplementationError('deleteFromDB');
});
deleteFromDB._succeededCall = () => ({
  ...new deleteFromDB._succeededCall._clazz(),
  ok: true,
  deletedCount: 1,
});
deleteFromDB._succeededCall._clazz = DataBaseResult;
deleteFromDB._failedCall = {
  general: () => ({ ok: false }),
  nothingFound: () => ({ ok: true, deletedCount: 0 }),
};

export { getFromDB, saveToDB, updateOneModelInDB, deleteFromDB };
