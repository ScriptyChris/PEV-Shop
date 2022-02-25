import type { TJestMock } from '@unitTests/inline-mocks';

const bcrypt: TJestMock & { compare: TJestMock; hash: TJestMock } = jest.createMockFromModule('bcrypt');

module.exports = bcrypt;
