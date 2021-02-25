import { TJestMock } from '../src/types';

const mockedBcrypt: TJestMock & { compare: TJestMock; hash: TJestMock } = jest.createMockFromModule('bcrypt');

export default mockedBcrypt;
