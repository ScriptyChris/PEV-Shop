// TODO: create kind of symlinks to test/ folder to avoid using relative paths
import { findAssociatedSrcModulePath } from '@unitTests/utils';

describe('#paginateItemsFromDB', () => {
  let getPaginatedItems: (...args: any[]) => Promise<void>;

  beforeAll(async () => {
    try {
      getPaginatedItems = (await import(findAssociatedSrcModulePath())).default;
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  describe('getPaginatedItems()', () => {
    const getModelMock = () => {
      return {
        paginate: jest.fn(async () => ({ pagination: null })),
      };
    };
    const itemQueryMock = { query: 'test' };
    const paginationConfigMock = { page: 1, limit: 2 };

    it('should call Model.paginate with appropriate params', async () => {
      const modelMock = getModelMock();

      await getPaginatedItems(modelMock, itemQueryMock, paginationConfigMock);

      expect(modelMock.paginate).toHaveBeenCalledWith(itemQueryMock, {
        page: paginationConfigMock.page,
        limit: paginationConfigMock.limit,
        customLabels: {
          docs: 'productsList',
          totalDocs: 'totalProducts',
        },
      });
    });

    it('should return promise resolved to value returned by call to Mode.paginate(..)', async () => {
      const getPaginatedItemsResult = getPaginatedItems(getModelMock(), itemQueryMock, paginationConfigMock);

      await expect(getPaginatedItemsResult).resolves.toStrictEqual(await getModelMock().paginate());
    });
  });
});
