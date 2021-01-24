const getModelMock = jest.mock('../../src/database/models/index').requireMock('../../src/database/models/index');
const getPaginatedItemsMock = jest
  .mock('../../src/database/utils/paginateItemsFromDB')
  .requireMock('../../src/database/utils/paginateItemsFromDB');

// TODO: create kind of symlinks to test/ folder to avoid using relative paths
const { findAssociatedSrcModulePath } = require('../index');
const { saveToDB, getFromDB, updateOneModelInDB } = require(findAssociatedSrcModulePath());

describe('#database-index', () => {
  const MODEL_TYPE = 'Test';

  afterEach(() => {
    getModelMock.mockClear();
    getModelMock._ModelClassMock.mockClear();
    getModelMock._ModelClassMock.distinct.mockClear();
    getModelMock._ModelClassMock.find.mockClear();
    getModelMock._ModelClassMock.findOne.mockClear();
    getModelMock._ModelClassMock.findOneAndUpdate.mockClear();
    getModelMock._ModelPrototypeSaveMock.mockClear();
    getPaginatedItemsMock.mockClear();
  });

  describe('saveToDB()', () => {
    // TODO: this test may be unnecessary when that function will be refactored to TypeScript
    it('should return null when itemData is falsy or not an object or modelType is falsy or not a string', () => {
      expect(saveToDB()).toBe(null);
      expect(saveToDB('itemData')).toBe(null);
      expect(saveToDB({}, null)).toBe(null);
      expect(saveToDB({}, {})).toBe(null);
    });

    it('should call getModel(..) with modelType param', async () => {
      await saveToDB({}, MODEL_TYPE);

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model constructor with itemData param', async () => {
      const itemData = { dataItem: true };

      await saveToDB(itemData, MODEL_TYPE);

      expect(getModelMock._ModelClassMock).toHaveBeenCalledWith(itemData);
    });

    it('should call item.save(..) once with callback param', async () => {
      const ModelPrototypeSaveMock = Object.getPrototypeOf(getModelMock._ModelClassMock.getMockImplementation()()).save;

      await saveToDB({}, MODEL_TYPE);

      expect(ModelPrototypeSaveMock).toHaveBeenCalledTimes(1);
      expect(ModelPrototypeSaveMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should return promise resolved to saved item when save operation succeeded', async () => {
      const savedItem = { itemSaved: true };
      const ModelPrototypeSaveMock = Object.getPrototypeOf(getModelMock._ModelClassMock.getMockImplementation()()).save;
      ModelPrototypeSaveMock.mockImplementationOnce((callback) => {
        callback(null, savedItem);
      });

      expect(saveToDB({}, MODEL_TYPE)).resolves.toBe(savedItem);
    });

    it('should return promise rejected to error when save operation failed', async () => {
      const error = 'Item save failed!';
      const ModelPrototypeSaveMock = Object.getPrototypeOf(getModelMock._ModelClassMock.getMockImplementation()()).save;
      ModelPrototypeSaveMock.mockImplementationOnce((callback) => {
        callback(error, null);
      });

      expect(saveToDB({}, MODEL_TYPE)).rejects.toBe(error);
    });
  });

  describe('getFromDB()', () => {
    it('should call getModel(..) with modelType param', async () => {
      await getFromDB({}, MODEL_TYPE, {});

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call getPaginatedItems(..) with appropriate params when provided options.pagination param is truthy', async () => {
      const itemQuery = { itemQuery: true };
      const options = { pagination: true };

      await getFromDB(itemQuery, MODEL_TYPE, options);

      expect(getPaginatedItemsMock).toHaveBeenCalledWith(getModelMock._ModelClassMock, itemQuery, options.pagination);
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

      expect(getModelMock._ModelClassMock.distinct).toHaveBeenCalledWith(itemQuery);
    });

    it('should return result of calling Model.distinct(..) when provided options.isDistinct params is true', async () => {
      const options = { isDistinct: true };
      const getFromDBResult = await getFromDB({}, MODEL_TYPE, options);
      const distinctMockResult = await getModelMock._ModelClassMock.distinct();

      expect(getFromDBResult).toStrictEqual(distinctMockResult);
    });

    it('should call Model.find(..) or Model.findOne(..) depending on itemQuery param value and return promise resolved to the result of that call', async () => {
      const itemQueryEmpty = {};
      const getFromDBResult1 = getFromDB(itemQueryEmpty, MODEL_TYPE, {});

      expect(getFromDBResult1).resolves.toBe('find result');
      expect(getModelMock._ModelClassMock.find).toHaveBeenCalledWith(itemQueryEmpty);

      const itemQueryIdObject = { _id: {} };
      const getFromDBResult2 = getFromDB(itemQueryIdObject, MODEL_TYPE, {});

      expect(getFromDBResult2).resolves.toBe('find result');
      expect(getModelMock._ModelClassMock.find).toHaveBeenCalledWith(itemQueryIdObject);

      const itemQueryNumber = 123;
      const getFromDBResult3 = getFromDB(itemQueryNumber, MODEL_TYPE, {});

      expect(getFromDBResult3).resolves.toBe('findOne result');
      expect(getModelMock._ModelClassMock.findOne).toHaveBeenCalledWith(itemQueryNumber);
    });
  });

  describe('updateOneModelInDB()', () => {
    it('should call getModel(..) with modelType param', async () => {
      const updateData = { action: 'addUnique' };

      await updateOneModelInDB({}, updateData, MODEL_TYPE);

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model.findOneAndUpdate(..) with correct params', () => {
      const itemQuery = {};

      const testPromises = [
        { action: 'addUnique', operator: '$addToSet' },
        { action: 'deleteAll', operator: '$pull' },
        { action: 'modify', operator: '$set' },
      ].map(async ({ action, operator }, index) => {
        const updateData = { action, data: 'new value' };

        await updateOneModelInDB(itemQuery, updateData, MODEL_TYPE);

        const callToFindOneAndUpdateMock = getModelMock._ModelClassMock.findOneAndUpdate.mock.calls[index];

        expect(callToFindOneAndUpdateMock[0]).toBe(itemQuery);
        expect(callToFindOneAndUpdateMock[1]).toStrictEqual({ [operator]: updateData.data });
        expect(callToFindOneAndUpdateMock[2]).toStrictEqual({ new: true });
        expect(callToFindOneAndUpdateMock[3]).toEqual(expect.any(Function));
      });

      Promise.all(testPromises).catch((error) => console.error('Test async error:', error));
    });

    it('should return rejected promise if updateData.action prop was not matched', () => {
      expect(updateOneModelInDB({}, {}, MODEL_TYPE)).rejects.toEqual(expect.stringContaining('undefined'));
      expect(updateOneModelInDB({}, { action: 'add' }, MODEL_TYPE)).rejects.toEqual(expect.stringContaining('add'));
    });

    it('should return promise resolved with value or rejected with reason depend on Model.findOneAndUpdate(..) result', () => {
      const resolveValue = 'findOne result';
      const rejectReason = 'findOne failed';

      getModelMock._ModelClassMock.findOneAndUpdate
        .mockImplementationOnce((itemQuery, updateDataQueries, options, callback) => callback(null, resolveValue))
        .mockImplementationOnce((itemQuery, updateDataQueries, options, callback) => callback(rejectReason));

      const updateData = { action: 'addUnique' };

      expect(updateOneModelInDB({}, updateData, MODEL_TYPE)).resolves.toBe(resolveValue);
      expect(updateOneModelInDB({}, updateData, MODEL_TYPE)).rejects.toBe(rejectReason);
    });
  });
});
