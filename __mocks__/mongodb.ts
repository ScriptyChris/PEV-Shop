import { TJestMock } from '@unitTests/inline-mocks';

const mongodb: TJestMock & { ObjectId: () => string } = jest.createMockFromModule('mongodb');
mongodb.ObjectId = function () {
  return 'test object id';
};

module.exports = mongodb;
