import { getMockImplementationError, TJestMock } from '@unitTests/inline-mocks';

const UserModel: {
  validatePassword: TJestMock &
    Partial<{
      _succeededCall: TJestMock;
      _failedCall: TJestMock;
    }>;
} = {
  validatePassword: jest.fn(() => {
    throw getMockImplementationError('validatePassword');
  }),
};
UserModel.validatePassword._succeededCall = jest.fn(() => '');
UserModel.validatePassword._failedCall = jest.fn(() => 'invalid');

export { UserModel };
