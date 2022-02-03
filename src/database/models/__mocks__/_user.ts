import { getMockImplementationError } from '../../../../test/unit/mockUtils';
import { TJestMock } from '../../../../test/unit/test-index';

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
