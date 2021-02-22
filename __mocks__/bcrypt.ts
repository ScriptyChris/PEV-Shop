const mockedBcrypt: TJestMock & { compare: TJestMock, hash: TJestMock } = jest.createMockFromModule('bcrypt');

export default mockedBcrypt;
