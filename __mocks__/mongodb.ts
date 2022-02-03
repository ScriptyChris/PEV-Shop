import { TJestMock } from '../test/unit/test-index';

const mongodb: TJestMock & { ObjectId: () => string } = jest.createMockFromModule('mongodb');
mongodb.ObjectId = function () {
  return 'test object id';
};

module.exports = mongodb;
