import type { TJestMock } from '../test/unit/test-index';

const bcrypt: TJestMock & { compare: TJestMock; hash: TJestMock } = jest.createMockFromModule('bcrypt');

module.exports = bcrypt;
