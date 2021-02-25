import { TJestMock } from '../src/types';
const getMockImplementationError = (fnName: string): Error =>
  Error(`Need to mock the ${fnName}(..) implementation for unit test first!`);

const getResMock = (): { status: TJestMock; _jsonMethod: TJestMock } => {
  const jsonMethod = jest.fn(() => undefined);
  const statusMethod = jest.fn(() => ({ json: jsonMethod }));

  return {
    status: statusMethod,
    _jsonMethod: jsonMethod,
  };
};

export { getResMock, getMockImplementationError };
