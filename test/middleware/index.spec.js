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
    get: jest.fn((path, callback) => callback(reqMock, resMock)),
  });
  const reqUrlMock = jest.fn(() => `test${reqUrlMock.index++}`);
  reqUrlMock.index = 0;
  const reqMock = Object.freeze(
    Object.defineProperty({}, 'url', {
      get: reqUrlMock,
    })
  );
  const resEndMock = jest.fn(() => {});
  const resMock = Object.freeze({
    sendFile: jest.fn((image) => image),
    status: jest.fn((code) => ({
      end: resEndMock,
    })),
  });

  afterEach(() => {
    globMock.mockClear();
    bodyParserMock.json.mockClear();
    appMock.use.mockClear();
    appMock.get.mockClear();
    reqUrlMock.mockClear();
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

  it('should lookup req.url property inside callback passed to app.get(..)', () => {
    middleware(appMock);

    expect(reqUrlMock).toHaveBeenCalled();
  });

  describe('inside callback passed to app.get(..)', () => {
    afterEach(() => {
      globMock.mockClear();
    });

    it('should call res.sendFile(..) when image is found', async () => {
      let imageFoundPromise = new Promise((resolve) => {
        globMock.mockImplementationOnce((path, callback) => {
          const images = ['some image'];

          callback(null, images);
          resolve(images[0]);
        });
      });

      middleware(appMock);
      imageFoundPromise = await imageFoundPromise;

      return new Promise((resolve) => {
        /*
          setImmediate(..) inside new Promise(..) here is used, because middleware(..) -> app.get(..) -> callback -> getImage(..) chain partially uses Promises.
          Also, getImage is tested module's private function, so it's not mocked.
          Thus, without modifying target source code to be controllable/watchable/observable (i.e. by returning Promise)
          it's difficult to check in other way when mentioned async functions call chain finished, in order to use expect(..) to test the final result.
         */
        setImmediate(() => {
          expect(resMock.sendFile).toHaveBeenCalledWith(imageFoundPromise);

          resolve();
        });
      });
    });

    it('should call res.status(..).end(..) when image is not found', async () => {
      const imageNotFoundPromise = new Promise((resolve, reject) => {
        globMock.mockImplementationOnce((path, callback) => {
          const error = 'image not found';

          callback(error);
          reject(error);
        });
      });

      middleware(appMock);
      await imageNotFoundPromise.catch(() => {});

      return new Promise((resolve) => {
        setImmediate(() => {
          expect(resMock.status).toHaveBeenCalledWith(404);
          expect(resEndMock).toHaveBeenCalled();

          resolve();
        });
      });
    });
  });
});
