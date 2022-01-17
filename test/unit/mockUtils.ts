import { TJestMock } from '../../src/types';

const getMockImplementationError = (fnName: string): Error =>
  Error(`Need to mock the ${fnName}(..) implementation for unit test first!`);

const getResMock = (): { status: TJestMock; _jsonMethod: TJestMock; sendStatus: TJestMock } => {
  const jsonMethod = jest.fn(() => undefined);
  const statusMethod = jest.fn(() => ({ json: jsonMethod }));
  const sendStatusMethod = jest.fn(() => undefined);

  return {
    status: statusMethod,
    _jsonMethod: jsonMethod,
    sendStatus: sendStatusMethod,
  };
};

const getNextFnMock = () => jest.fn(() => undefined);

export { getResMock, getMockImplementationError, getNextFnMock };
