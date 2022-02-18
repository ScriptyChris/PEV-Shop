import { TJestMock } from '@unitTests/inline-mocks';

const jwt: TJestMock & {
  verify: TJestMock;
  sign: TJestMock;
} = jest.createMockFromModule('jsonwebtoken');
jwt.verify.mockImplementation(() => ({ _id: '' }));
jwt.sign.mockImplementation(() => 'example token');

module.exports = jwt;
