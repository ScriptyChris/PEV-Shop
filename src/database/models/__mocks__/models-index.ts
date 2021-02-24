import { getMockImplementationError } from '../../../../test/mockUtils';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function Model() {}
Model.prototype.save = jest.fn(() => {
  return Promise.reject(getMockImplementationError('save'));
});
Model.prototype.save._succeededCall = () => {
  // @ts-ignore
  return Promise.resolve(new Model());
};
Model.prototype.save._failedCall = () => Promise.reject(null);

const ModelClassMock: TJestMock &
  Partial<{
    find: TJestMock;
    findOne: TJestMock;
    findOneAndUpdate: TJestMock<Error> &
      Partial<{ _succeededCall: () => typeof Model; _clazz: typeof Model; _failedCall: () => null }>;
    distinct: TJestMock;
  }> = jest
  .fn(() => {
    // @ts-ignore
    return new Model();
  })
  .mockName('Model');
ModelClassMock.find = jest.fn(() => 'find result');
ModelClassMock.findOne = jest.fn(() => 'findOne result');
ModelClassMock.findOneAndUpdate = jest.fn(() => {
  throw getMockImplementationError('findOneAndUpdate');
});
ModelClassMock.findOneAndUpdate._succeededCall = () => {
  // @ts-ignore
  return new Model();
};
ModelClassMock.findOneAndUpdate._clazz = Model;
ModelClassMock.findOneAndUpdate._failedCall = () => null;
ModelClassMock.distinct = jest.fn(() => 'distinct result');

const ModelModuleMock: TJestMock &
  Partial<{
    _ModelClassMock: typeof ModelClassMock;
    _ModelPrototypeSaveMock: typeof Model.prototype.save;
  }> = jest.fn(() => ModelClassMock);
ModelModuleMock._ModelClassMock = ModelClassMock;
ModelModuleMock._ModelPrototypeSaveMock = Model.prototype.save;

export default ModelModuleMock;
