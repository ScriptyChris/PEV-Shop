import { getMockImplementationError, TJestMock } from '@unitTests/inline-mocks';

const authMiddlewareFn: TJestMock & { _succeededCall?: () => () => Promise<void>; _failedCall?: () => null } = jest.fn(
  () => {
    throw getMockImplementationError('authMiddlewareFn');
  }
);
authMiddlewareFn._succeededCall = () => async () => undefined;
authMiddlewareFn._failedCall = () => null;

const hashPassword: TJestMock & {
  _succeededCall?: (password: string) => Promise<string>;
  _failedCall?: () => Promise<Error>;
} = jest.fn(() => {
  throw getMockImplementationError('hashPassword');
});
hashPassword._succeededCall = (password: string) => Promise.resolve(Buffer.from(password).toString('base64'));
hashPassword._failedCall = () => Promise.reject(Error('hashing failed'));

const userRoleMiddlewareFn: TJestMock & {
  _succeededCall?: () => () => Promise<void>;
  _failedCall?: () => () => Promise<boolean>;
} = jest.fn(() => {
  throw getMockImplementationError('userRoleMiddlewareFn');
});
userRoleMiddlewareFn._succeededCall = () => async () => undefined;
userRoleMiddlewareFn._failedCall = () => () => Promise.reject(false);

export { authMiddlewareFn, hashPassword, userRoleMiddlewareFn };
