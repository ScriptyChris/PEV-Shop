const globMock = require('../../__mocks__/glob');
const bodyParserMock = require('../../__mocks__/body-parser');
const [apiProductsMock, apiProductsCategoriesMock, apiUsersMock, apiUserRolesMock] = [
  'api-products',
  'api-product-categories',
  'api-users',
  'api-user-roles',
].map((apiFileName) => {
  const apiFilePath = `../../src/middleware/routes/${apiFileName}`;

  return jest.mock(apiFilePath).requireMock(apiFilePath);
});

const middleware = require('../../src/middleware/index');

describe('#middleware-index', () => {
  const appMock = Object.freeze({
    use: jest.fn(),
    get: jest.fn((path, callback) => {
      callback(reqMock, resMock);
    }),
  });
  const reqMock = Object.freeze({
    url: 'test',
  });
  const resEndMock = jest.fn(() => {});
  const resMock = Object.freeze({
    sendFile: jest.fn((image) => {}),
    status: jest.fn((code) => ({
      end: resEndMock,
    })),
  });

  beforeEach(() => {
    globMock.mockClear();
    bodyParserMock.json.mockClear();
    appMock.use.mockClear();
    appMock.get.mockClear();
    resMock.sendFile.mockClear();
    resMock.status.mockClear();
    resEndMock.mockClear();
  });

  it('should call app.use(..) and app.get(..) methods with correct params', () => {
    middleware(appMock);

    expect(appMock.use).toHaveBeenCalledWith(bodyParserMock.json());
    expect(appMock.use).toHaveBeenCalledWith(
      apiProductsMock,
      apiProductsCategoriesMock,
      apiUsersMock,
      apiUserRolesMock
    );
    expect(appMock.use).toHaveBeenCalledTimes(2);
    expect(appMock.get).toHaveBeenCalledTimes(1);
  });
});
