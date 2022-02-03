import { TJestMock } from '../test/unit/test-index';

const jwt: TJestMock & {
  verify: TJestMock;
  sign: TJestMock;
} = jest.createMockFromModule('jsonwebtoken');
jwt.verify.mockImplementation(() => ({ _id: '' }));
jwt.sign.mockImplementation(() => 'example token');

module.exports = jwt;
