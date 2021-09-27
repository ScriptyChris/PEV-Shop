const ModelModuleMock = jest
  .mock('../../src/database/models/models-index')
  .requireMock('../../src/database/models/models-index').default;
const getPaginatedItemsMock = jest
  .mock('../../src/database/utils/paginateItemsFromDB')
  .requireMock('../../src/database/utils/paginateItemsFromDB').default;

// TODO: create kind of symlinks to test/ folder to avoid using relative paths
import { findAssociatedSrcModulePath } from '../test-index';

describe('#database-index', () => {
  const MODEL_TYPE = 'Test';
  let saveToDB: any, getFromDB: any, updateOneModelInDB: any;

  beforeAll(async () => {
    ({ saveToDB, getFromDB, updateOneModelInDB } = await import(findAssociatedSrcModulePath()));
  });

  afterEach(() => {
    ModelModuleMock.mockClear();
    ModelModuleMock._ModelClassMock.mockClear();
    ModelModuleMock._ModelClassMock.distinct.mockClear();
    ModelModuleMock._ModelClassMock.find.mockClear();
    ModelModuleMock._ModelClassMock.findOne.mockClear();
    ModelModuleMock._ModelClassMock.findOneAndUpdate.mockClear();
    ModelModuleMock._ModelPrototypeSaveMock.mockClear();
    getPaginatedItemsMock.mockClear();
  });

  describe('saveToDB()', () => {
    const getModelPrototypeSaveMock = () =>
      Object.getPrototypeOf(ModelModuleMock._ModelClassMock.getMockImplementation()()).save;

    it('should call getModel(..) with modelType param', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB({}, MODEL_TYPE);

      expect(ModelModuleMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model constructor with itemData param', async () => {
      const itemData = { dataItem: true };
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB(itemData, MODEL_TYPE);

      expect(ModelModuleMock._ModelClassMock).toHaveBeenCalledWith(itemData);
    });

    it('should call item.save(..) once without callback param', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB({}, MODEL_TYPE);

      expect(ModelPrototypeSaveMock).toHaveBeenCalledTimes(1);
      expect(ModelPrototypeSaveMock).toHaveBeenCalledWith();
    });

    it('should return promise resolved to saved item when save operation succeeded', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      expect(saveToDB({}, MODEL_TYPE)).resolves.toStrictEqual(new ModelModuleMock._ModelClassMock());
    });

    it('should return promise rejected to null when save operation failed', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._failedCall);

      expect(saveToDB({}, MODEL_TYPE)).rejects.toBe(null);
    });
  });

  describe('getFromDB()', () => {
    it('should call getModel(..) with modelType param', async () => {
      await getFromDB({}, MODEL_TYPE, {});

      expect(ModelModuleMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call getPaginatedItems(..) with appropriate params when provided options.pagination param is truthy', async () => {
      const itemQuery = { itemQuery: true };
      const options = { pagination: true };

      await getFromDB(itemQuery, MODEL_TYPE, options);

      expect(getPaginatedItemsMock).toHaveBeenCalledWith(
        ModelModuleMock._ModelClassMock,
        itemQuery,
        options.pagination
      );
    });

    it('should return result of calling getPaginatedItems(..) when provided options.pagination param is truthy', async () => {
      const options = { pagination: true };
      const getFromDBResult = await getFromDB({}, MODEL_TYPE, options);
      const getPaginatedItemsMockResult = await getPaginatedItemsMock();

      expect(getFromDBResult).toStrictEqual(getPaginatedItemsMockResult);
    });

    it('should call Model.distinct(..) with itemQuery when provided options.isDistinct params is true', async () => {
      const itemQuery = {};
      const options = { isDistinct: true };

      await getFromDB({}, MODEL_TYPE, options);

      expect(ModelModuleMock._ModelClassMock.distinct).toHaveBeenCalledWith(itemQuery);
    });

    it('should return result of calling Model.distinct(..) when provided options.isDistinct params is true', async () => {
      const options = { isDistinct: true };
      const getFromDBResult = await getFromDB({}, MODEL_TYPE, options);
      const distinctMockResult = await ModelModuleMock._ModelClassMock.distinct();

      expect(getFromDBResult).toStrictEqual(distinctMockResult);
    });

    it('should call Model.find(..) or Model.findOne(..) depending on itemQuery param value and return promise resolved to the result of that call', async () => {
      const projectionParam = undefined;

      const itemQueryEmpty = {};
      const getFromDBResult1 = getFromDB(itemQueryEmpty, MODEL_TYPE, {}, projectionParam);
      expect(getFromDBResult1).resolves.toBe('find result');
      expect(ModelModuleMock._ModelClassMock.find).toHaveBeenCalledWith(itemQueryEmpty, projectionParam);

      const itemQueryIdObject = { _id: {} };
      const getFromDBResult2 = getFromDB(itemQueryIdObject, MODEL_TYPE, {}, projectionParam);
      expect(getFromDBResult2).resolves.toBe('find result');
      expect(ModelModuleMock._ModelClassMock.find).toHaveBeenCalledWith(itemQueryIdObject, projectionParam);

      const itemQueryNumber = 123;
      const getFromDBResult3 = getFromDB(itemQueryNumber, MODEL_TYPE, {});
      expect(getFromDBResult3).resolves.toBe('findOne result');
      expect(ModelModuleMock._ModelClassMock.findOne).toHaveBeenCalledWith(itemQueryNumber);
    });
  });

  describe('updateOneModelInDB()', () => {
    it('should call getModel(..) with modelType param', () => {
      const updateData = { action: 'addUnique' };
      ModelModuleMock._ModelClassMock.findOneAndUpdate.mockImplementationOnce(
        ModelModuleMock._ModelClassMock.findOneAndUpdate._succeededCall
      );

      updateOneModelInDB({}, updateData, MODEL_TYPE);

      expect(ModelModuleMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model.findOneAndUpdate(..) with correct params', () => {
      const itemQuery = {};

      [
        { action: 'addUnique', operator: '$addToSet' },
        { action: 'deleteAll', operator: '$pull' },
        { action: 'modify', operator: '$set' },
      ].forEach(({ action, operator }, index) => {
        ModelModuleMock._ModelClassMock.findOneAndUpdate.mockImplementationOnce(
          ModelModuleMock._ModelClassMock.findOneAndUpdate._succeededCall
        );
        const updateData = { action, data: 'new value' };

        updateOneModelInDB(itemQuery, updateData, MODEL_TYPE);

        const callToFindOneAndUpdateMock = ModelModuleMock._ModelClassMock.findOneAndUpdate.mock.calls[index];

        expect(callToFindOneAndUpdateMock[0]).toBe(itemQuery);
        expect(callToFindOneAndUpdateMock[1]).toStrictEqual({ [operator]: updateData.data });
        expect(callToFindOneAndUpdateMock[2]).toStrictEqual({ new: true });
      });
    });

    it('should return null if updateData.action prop was not matched', () => {
      expect(updateOneModelInDB({}, {}, MODEL_TYPE)).toBeNull();
      expect(updateOneModelInDB({}, { action: 'add' }, MODEL_TYPE)).toBeNull();
    });

    it('should return value or null depend on Model.findOneAndUpdate(..) result', () => {
      ModelModuleMock._ModelClassMock.findOneAndUpdate
        .mockImplementationOnce(ModelModuleMock._ModelClassMock.findOneAndUpdate._succeededCall)
        .mockImplementationOnce(ModelModuleMock._ModelClassMock.findOneAndUpdate._failedCall);

      const updateData = { action: 'addUnique' };

      expect(updateOneModelInDB({}, updateData, MODEL_TYPE)).toStrictEqual(
        // @ts-ignore
        new ModelModuleMock._ModelClassMock.findOneAndUpdate._clazz()
      );
      expect(updateOneModelInDB({}, updateData, MODEL_TYPE)).toBeNull();
    });
  });
});
