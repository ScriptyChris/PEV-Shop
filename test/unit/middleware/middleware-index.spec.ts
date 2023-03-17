import { getRootRelativePath, mockAndRequireModule } from '@unitTests/utils';
import type { TJestMock } from '@unitTests/inline-mocks';
import { HTTP_STATUS_CODE } from '@commons/types';

const globMock: TJestMock = jest.requireActual(getRootRelativePath('__mocks__/glob'));
const { json: expressJSONMock } = jest.requireActual(getRootRelativePath('__mocks__/express'));
const [apiConfigMock, apiProductsMock, apiProductsCategoriesMock, apiUsersMock, apiUserRolesMock, apiOrdersMock] = [
  'api-config',
  'api-products',
  'api-product-categories',
  'api-users',
  'api-user-roles',
  'api-orders',
].map((apiFileName) => mockAndRequireModule(`src/middleware/routes/${apiFileName}`).default);

jest.doMock(getRootRelativePath('commons/cyclicAppReset'), () => ({
  getRemainingTimestampToNextAppReset: () => {
    const oneHour = 3600000;
    return oneHour;
  },
}));

import middleware from '@middleware/middleware-index';

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
    globMock.mockClear();
    expressJSONMock.mockClear();
    appMock.use.mockClear();
    appMock.get.mockClear();
    reqUrlMock.mockClear();
    resMock.sendFile.mockClear();
    resMock.status.mockClear();
    resEndMock.mockClear();
  });

  it('should call app.use(..) and app.get(..) methods with correct params', () => {
    middleware(appMock);

    expect(appMock.use).toHaveBeenCalledWith(expressJSONMock());
    expect(appMock.use).toHaveBeenCalledWith([
      apiConfigMock,
      apiProductsMock,
      apiProductsCategoriesMock,
      apiUsersMock,
      apiUserRolesMock,
      apiOrdersMock,
    ]);
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
      type TImagesArgs = [string, { maxAge: number }];
      const imageFoundPromise = new Promise<TImagesArgs>((resolve) => {
        (globMock as TJestMock).mockImplementationOnce((path: any, callback: any) => {
          const oneHourMinus15SecsBuffer = 3585000;
          const images: TImagesArgs = ['some image', { maxAge: oneHourMinus15SecsBuffer }];

          callback(null, images);
          resolve(images);
        });
      });

      middleware(appMock);

      return new Promise((resolve) => {
        /*
          setImmediate(..) inside new Promise(..) here is used, because middleware(..) -> app.get(..) -> callback -> getImage(..) chain partially uses Promises.
          Also, getImage is tested module's private function, so it's not mocked.
          Thus, without modifying target source code to be controllable/watchable/observable (i.e. by returning Promise)
          it's difficult to check in other way when mentioned async functions call chain finished, in order to use expect(..) to test the final result.
         */
        setImmediate(async () => {
          expect(resMock.sendFile).toHaveBeenCalledWith(...(await imageFoundPromise));

          resolve();
        });
      });
    });

    it('should call res.status(..).end(..) when image is not found', async (): Promise<void> => {
      const imageNotFoundPromise = new Promise((resolve, reject) => {
        (globMock as TJestMock).mockImplementationOnce((path: any, callback: any) => {
          const error = 'image not found';

          callback(error);
          reject(error);
        });
      });

      middleware(appMock);
      await imageNotFoundPromise.catch(() => Promise.resolve(undefined));

      return new Promise((resolve) => {
        setImmediate(() => {
          expect(resMock.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
          expect(resEndMock).toHaveBeenCalled();

          resolve();
        });
      });
    });
  });
});
