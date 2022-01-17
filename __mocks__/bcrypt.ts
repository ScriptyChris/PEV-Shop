import type { TJestMock } from '../src/types';

const bcrypt: TJestMock & { compare: TJestMock; hash: TJestMock } = jest.createMockFromModule('bcrypt');

module.exports = bcrypt;
