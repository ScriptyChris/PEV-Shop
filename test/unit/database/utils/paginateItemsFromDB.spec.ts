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
    const getConfigMock = () => {
      return {
        Model: {
          paginate: jest.fn(async () => ({ pagination: null })),
        },
        pagination: { page: 1, limit: 2 },
      };
    };
    const itemQueryMock = { query: 'test' };
    const projectionMock = {};

    it('should call Model.paginate with appropriate params', async () => {
      const configMock = getConfigMock();

      await getPaginatedItems(
        { Model: configMock.Model, pagination: configMock.pagination },
        itemQueryMock,
        projectionMock
      );

      expect(configMock.Model.paginate).toHaveBeenCalledWith(itemQueryMock, {
        page: configMock.pagination.page,
        limit: configMock.pagination.limit,
        customLabels: {
          docs: 'productsList',
          totalDocs: 'totalProducts',
        },
        projection: projectionMock,
      });
    });

    it('should return promise resolved to value returned by call to Mode.paginate(..)', async () => {
      const getPaginatedItemsResult = getPaginatedItems(getConfigMock(), itemQueryMock, projectionMock);

      await expect(getPaginatedItemsResult).resolves.toStrictEqual(await getConfigMock().Model.paginate());
    });
  });
});
