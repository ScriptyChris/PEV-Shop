import { TJestMock } from '../../../types';
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

const ModelClassMock: TJestMock & {
  find: TJestMock;
  findOne: TJestMock;
  findOneAndUpdate: TJestMock<Error> & {
    _succeededCall: () => typeof Model;
    _clazz: typeof Model;
    _failedCall: () => null;
  };
  distinct: TJestMock;
} = Object.assign(
  jest
    .fn(() => {
      // @ts-ignore
      return new Model();
    })
    .mockName('Model'),
  {
    find: jest.fn(() => 'find result'),
    findOne: jest.fn(() => 'findOne result'),
    findOneAndUpdate: Object.assign(
      jest.fn(() => {
        throw getMockImplementationError('findOneAndUpdate');
      }),
      {
        _succeededCall: () => {
          // @ts-ignore
          return new Model();
        },
        _clazz: Model,
        _failedCall: () => null,
      }
    ),
    distinct: jest.fn(() => 'distinct result'),
  }
);

const getModel: TJestMock & {
  _ModelClassMock: typeof ModelClassMock;
  _ModelPrototypeSaveMock: typeof Model.prototype.save;
} = Object.assign(
  jest.fn(() => ModelClassMock),
  {
    _ModelClassMock: ModelClassMock,
    _ModelPrototypeSaveMock: Model.prototype.save,
  }
);

export { getModel };
