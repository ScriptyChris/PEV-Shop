import globMock from '../../__mocks__/glob';
import bodyParserMock from '../../__mocks__/body-parser';

const [
  { default: apiProductsMock },
  { default: apiProductsCategoriesMock },
  { default: apiUsersMock },
  { default: apiUserRolesMock },
] = ['api-products', 'api-product-categories', 'api-users', 'api-user-roles'].map((apiFileName) => {
  const apiFilePath = `../../src/middleware/routes/${apiFileName}`;

  return jest.mock(apiFilePath).requireMock(apiFilePath);
});

import middleware from '../../src/middleware/middleware-index';

describe('#middleware-index', () => {
  const appMock: any = Object.freeze({
    use: jest.fn(),
    get: jest.fn((path, callback) => callback(reqMock, resMock)),
  });
  const reqUrlMock: TJestMock & { index?: number } = jest.fn(() => `test${(reqUrlMock as { index: number }).index++}`);
  reqUrlMock.index = 0;
  const reqMock = Object.freeze(
    Object.defineProperty({}, 'url', {
      get: reqUrlMock,
    })
  );
  const resEndMock = jest.fn(() => undefined);
  const resMock = Object.freeze({
    sendFile: jest.fn((image) => image),
    status: jest.fn(() => ({
      end: resEndMock,
    })),
  });

  afterEach(() => {
    (globMock as TJestMock).mockClear();
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
      (globMock as TJestMock).mockClear();
    });

    it('should call res.sendFile(..) when image is found', async (): Promise<void> => {
      let imageFoundPromise: Promise<string> | string = new Promise((resolve) => {
        (globMock as TJestMock).mockImplementationOnce((path, callback) => {
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

    it('should call res.status(..).end(..) when image is not found', async (): Promise<void> => {
      const imageNotFoundPromise = new Promise((resolve, reject) => {
        (globMock as TJestMock).mockImplementationOnce((path, callback) => {
          const error = 'image not found';

          callback(error);
          reject(error);
        });
      });

      middleware(appMock);
      await imageNotFoundPromise.catch(() => Promise.resolve(undefined));

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
