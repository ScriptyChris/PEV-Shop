const getMockImplementationError = (fnName: string) =>
  Error(`Need to mock the ${fnName}(..) implementation for unit test first!`);

const getResMock = () => {
  const jsonMethod = jest.fn((errorObj) => {});
  const statusMethod = jest.fn((code) => ({ json: jsonMethod }));

  return {
    status: statusMethod,
    _jsonMethod: jsonMethod,
  };
};

export { getResMock, getMockImplementationError };
