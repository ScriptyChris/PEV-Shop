// TODO: create kind of symlinks to test/ folder to avoid using relative paths
import { findAssociatedSrcModulePath, mockAndRequireModule } from '@unitTests/utils';

const { getModel: getModelMock, isValidObjectId: isValidObjectIdMock } = mockAndRequireModule('src/database/models');
const getPaginatedItemsMock = mockAndRequireModule('src/database/utils/paginateItemsFromDB').default;

describe('#database/api', () => {
  const MODEL_TYPE = 'Test';
  let saveToDB: any, getFromDB: any, updateOneModelInDB: any;

  beforeAll(async () => {
    try {
      ({ saveToDB, getFromDB, updateOneModelInDB } = await import(findAssociatedSrcModulePath()));
    } catch (moduleImportException) {
      console.error('(beforeAll) moduleImportException:', moduleImportException);
    }
  });

  afterEach(() => {
    getModelMock.mockClear();
    getModelMock._ModelClassMock.mockClear();
    getModelMock._ModelClassMock.distinct.mockClear();
    getModelMock._ModelClassMock.find.mockClear();
    getModelMock._ModelClassMock.findOne.mockClear();
    getModelMock._ModelClassMock.findById.mockClear();
    getModelMock._ModelClassMock.findOneAndUpdate.mockClear();
    getModelMock._ModelPrototypeSaveMock.mockClear();
    getPaginatedItemsMock.mockClear();
  });

  describe('saveToDB()', () => {
    const getModelPrototypeSaveMock = () =>
      Object.getPrototypeOf(getModelMock._ModelClassMock.getMockImplementation()()).save;

    it('should call getModel(..) with modelType param', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB(MODEL_TYPE, {});

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model constructor with itemData param', async () => {
      const itemData = { dataItem: true };
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB(MODEL_TYPE, itemData);

      expect(getModelMock._ModelClassMock).toHaveBeenCalledWith(itemData);
    });

    it('should call item.save(..) once without callback param', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await saveToDB(MODEL_TYPE, {});

      expect(ModelPrototypeSaveMock).toHaveBeenCalledTimes(1);
      expect(ModelPrototypeSaveMock).toHaveBeenCalledWith();
    });

    it('should return promise resolved to saved item when save operation succeeded', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._succeededCall);

      await expect(saveToDB(MODEL_TYPE, {})).resolves.toStrictEqual(new getModelMock._ModelClassMock());
    });

    it('should return promise rejected to null when save operation failed', async () => {
      const ModelPrototypeSaveMock = getModelPrototypeSaveMock();
      ModelPrototypeSaveMock.mockImplementationOnce(ModelPrototypeSaveMock._failedCall);

      await expect(saveToDB(MODEL_TYPE, {})).rejects.toBe(null);
    });
  });

  describe('getFromDB()', () => {
    it('should call getModel(..) with modelType param', async () => {
      await getFromDB({ modelName: MODEL_TYPE }, {});

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call getPaginatedItems(..) with appropriate params when provided options.pagination param is truthy', async () => {
      const itemQuery = { itemQuery: true };
      const config = { modelName: MODEL_TYPE, pagination: true };

      await getFromDB(config, itemQuery);

      expect(getPaginatedItemsMock).toHaveBeenCalledWith(getModelMock._ModelClassMock, itemQuery, config.pagination);
    });

    it('should return result of calling getPaginatedItems(..) when provided options.pagination param is truthy', async () => {
      const config = { modelName: MODEL_TYPE, pagination: true };
      const getFromDBResult = await getFromDB(config, {});
      const getPaginatedItemsMockResult = await getPaginatedItemsMock();

      expect(getFromDBResult).toStrictEqual(getPaginatedItemsMockResult);
    });

    it('should throw error on attempt to call getPaginatedItems(..), when itemQuery is a string', async () => {
      const config = { modelName: MODEL_TYPE, pagination: true };

      await expect(getFromDB(config, 'some dummy query')).rejects.toThrow(TypeError);
    });

    it('should call Model.distinct(..) with itemQuery when provided options.isDistinct params is true', async () => {
      const itemQuery = 'query for distinct';
      const config = { modelName: MODEL_TYPE, isDistinct: true };

      await getFromDB(config, itemQuery);

      expect(getModelMock._ModelClassMock.distinct).toHaveBeenCalledWith(itemQuery);
    });

    it('should return result of calling Model.distinct(..) when provided options.isDistinct params is true', async () => {
      const config = { modelName: MODEL_TYPE, isDistinct: true };
      const getFromDBResult = await getFromDB(config, 'some distinct query');
      const distinctMockResult = await getModelMock._ModelClassMock.distinct();

      expect(getFromDBResult).toStrictEqual(distinctMockResult);
    });

    it('should throw error on attempt to call Model.distinct(..), when itemQuery is not a string', async () => {
      const config = { modelName: MODEL_TYPE, isDistinct: true };

      await expect(getFromDB(config, null)).rejects.toThrow(TypeError);
      await expect(getFromDB(config, undefined)).rejects.toThrow(TypeError);
      await expect(getFromDB(config, {})).rejects.toThrow(TypeError);
      await expect(getFromDB(config, [])).rejects.toThrow(TypeError);
    });

    it('should call either Model.findById(..) or Model.find(..) or Model.findOne(..) depending on itemQuery param type and config.findMultiple value', async () => {
      const PROJECTION_PARAM = null;

      const itemQueryObjectId = 'some string query for ID';
      isValidObjectIdMock.mockImplementationOnce(isValidObjectIdMock._succeededCall);
      await getFromDB({ modelName: MODEL_TYPE }, itemQueryObjectId, PROJECTION_PARAM);
      expect(getModelMock._ModelClassMock.findById).toHaveBeenCalledWith(itemQueryObjectId, PROJECTION_PARAM);

      const itemQueryForMultiDocs = { multiDoc: true };
      await getFromDB({ modelName: MODEL_TYPE, findMultiple: true }, itemQueryForMultiDocs, PROJECTION_PARAM);
      expect(getModelMock._ModelClassMock.find).toHaveBeenCalledWith(itemQueryForMultiDocs, PROJECTION_PARAM);

      const itemQueryForSingleDoc = { singleDoc: true };
      await getFromDB({ modelName: MODEL_TYPE }, itemQueryForSingleDoc, PROJECTION_PARAM);
      expect(getModelMock._ModelClassMock.findOne).toHaveBeenCalledWith(itemQueryForSingleDoc, PROJECTION_PARAM);
    });

    it(`should return result of calling either of Model['findById' | 'find' | 'findOne']`, async () => {
      const PROJECTION_PARAM = null;

      const itemQueryObjectId = 'some string query for ID';
      isValidObjectIdMock.mockImplementationOnce(isValidObjectIdMock._succeededCall);
      const getFromDBResult1 = getFromDB({ modelName: MODEL_TYPE }, itemQueryObjectId, PROJECTION_PARAM);
      await expect(getFromDBResult1).resolves.toBe('findById result');

      const itemQueryForMultiDocs = { multiDoc: true };
      const getFromDBResult2 = getFromDB(
        { modelName: MODEL_TYPE, findMultiple: true },
        itemQueryForMultiDocs,
        PROJECTION_PARAM
      );
      await expect(getFromDBResult2).resolves.toBe('find result');

      const itemQueryForSingleDoc = { singleDoc: true };
      const getFromDBResult3 = getFromDB({ modelName: MODEL_TYPE }, itemQueryForSingleDoc, PROJECTION_PARAM);
      await expect(getFromDBResult3).resolves.toBe('findOne result');
    });

    it(`should return null after calling either of Model['findById' | 'find' | 'findOne'] when nothing was found`, async () => {
      const MOCKED_NULL_RETURN = null;

      const itemQueryObjectId = 'some string query for ID';
      isValidObjectIdMock.mockImplementationOnce(isValidObjectIdMock._succeededCall);
      getModelMock._ModelClassMock.findById.mockReturnValueOnce(MOCKED_NULL_RETURN);
      const getFromDBResult1 = getFromDB({ modelName: MODEL_TYPE }, itemQueryObjectId);
      await expect(getFromDBResult1).resolves.toBe(MOCKED_NULL_RETURN);

      const itemQueryForMultiDocs = { multiDoc: true };
      getModelMock._ModelClassMock.find.mockReturnValueOnce(MOCKED_NULL_RETURN);
      const getFromDBResult2 = getFromDB({ modelName: MODEL_TYPE, findMultiple: true }, itemQueryForMultiDocs);
      await expect(getFromDBResult2).resolves.toBe(MOCKED_NULL_RETURN);

      const itemQueryForSingleDoc = { singleDoc: true };
      getModelMock._ModelClassMock.findOne.mockReturnValueOnce(MOCKED_NULL_RETURN);
      const getFromDBResult3 = getFromDB({ modelName: MODEL_TYPE }, itemQueryForSingleDoc);
      await expect(getFromDBResult3).resolves.toBe(MOCKED_NULL_RETURN);
    });

    it('should throw error on attempt to call Model.findById(..), when itemQuery is not valid ObjectId', async () => {
      isValidObjectIdMock.mockImplementationOnce(isValidObjectIdMock._failedCall);
      await expect(getFromDB({ modelName: MODEL_TYPE }, 'some not ObjectId item query')).rejects.toThrow(TypeError);
    });

    it('should call Model.execPopulate(..) with correct param when config.population is truthy and return that value as promise', async () => {
      // single doc
      {
        const SINGLE_POPULATION_EXPECTANCE = 'single population';
        const singleExecPopulateMock = jest.fn(() =>
          Promise.resolve({
            population: SINGLE_POPULATION_EXPECTANCE,
          })
        );
        getModelMock._ModelClassMock.findOne.mockReturnValueOnce(
          Promise.resolve({
            execPopulate: singleExecPopulateMock,
          })
        );

        const getFromDBResultSingle = getFromDB(
          { modelName: MODEL_TYPE, population: SINGLE_POPULATION_EXPECTANCE },
          { singleDoc: true }
        );
        await expect(getFromDBResultSingle).resolves.toStrictEqual({
          population: SINGLE_POPULATION_EXPECTANCE,
        });
        expect(singleExecPopulateMock).toHaveBeenCalledWith({ path: SINGLE_POPULATION_EXPECTANCE });
      }

      // multiple docs
      {
        const FIRST_POPULATION_EXPECTANCE = 'first of multiple population';
        const SECOND_POPULATION_EXPECANTCE = 'second of multiple population';
        const MULTIPLE_POPULATION = 'multiple population';
        const firstExecPopulateMock = jest.fn(() =>
          Promise.resolve({
            population: FIRST_POPULATION_EXPECTANCE,
          })
        );
        const secondExecPopulateMock = jest.fn(() =>
          Promise.resolve({
            population: SECOND_POPULATION_EXPECANTCE,
          })
        );
        getModelMock._ModelClassMock.find.mockReturnValueOnce(
          Promise.resolve([
            {
              execPopulate: firstExecPopulateMock,
            },
            {
              execPopulate: secondExecPopulateMock,
            },
          ])
        );

        const getFromDBResultMultiple = getFromDB(
          {
            modelName: MODEL_TYPE,
            population: MULTIPLE_POPULATION,
            findMultiple: true,
          },
          { multipleDoc: true }
        );
        await expect(getFromDBResultMultiple).resolves.toStrictEqual([
          { population: FIRST_POPULATION_EXPECTANCE },
          { population: SECOND_POPULATION_EXPECANTCE },
        ]);
        expect(firstExecPopulateMock).toHaveBeenCalledWith({ path: MULTIPLE_POPULATION });
        expect(secondExecPopulateMock).toHaveBeenCalledWith({ path: MULTIPLE_POPULATION });
      }
    });
  });

  describe('updateOneModelInDB()', () => {
    it('should call getModel(..) with modelType param', async () => {
      const updateData = { action: 'addUnique' };
      getModelMock._ModelClassMock.findOneAndUpdate.mockImplementationOnce(
        getModelMock._ModelClassMock.findOneAndUpdate._succeededCall
      );

      await updateOneModelInDB(MODEL_TYPE, {}, updateData);

      expect(getModelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model.findOneAndUpdate(..) with correct params', async () => {
      const itemQuery = {};

      await Promise.all(
        [
          { action: 'addUnique', operator: '$addToSet' },
          { action: 'deleteAll', operator: '$pull' },
          { action: 'modify', operator: '$set' },
        ].map(async ({ action, operator }, index) => {
          getModelMock._ModelClassMock.findOneAndUpdate.mockImplementationOnce(
            getModelMock._ModelClassMock.findOneAndUpdate._succeededCall
          );
          const updateData = { action, data: 'new value' };

          await updateOneModelInDB(MODEL_TYPE, itemQuery, updateData);

          const callToFindOneAndUpdateMock = getModelMock._ModelClassMock.findOneAndUpdate.mock.calls[index];

          expect(callToFindOneAndUpdateMock[0]).toBe(itemQuery);
          expect(callToFindOneAndUpdateMock[1]).toStrictEqual({ [operator]: updateData.data });
          expect(callToFindOneAndUpdateMock[2]).toStrictEqual({ new: true });
        })
      );
    });

    it('should return null if updateData.action prop was not matched', async () => {
      await expect(updateOneModelInDB(MODEL_TYPE, {}, {})).resolves.toBeNull();
      await expect(updateOneModelInDB(MODEL_TYPE, {}, { action: 'add' })).resolves.toBeNull();
    });

    it('should return value or null depend on Model.findOneAndUpdate(..) result', async () => {
      getModelMock._ModelClassMock.findOneAndUpdate
        .mockImplementationOnce(getModelMock._ModelClassMock.findOneAndUpdate._succeededCall)
        .mockImplementationOnce(getModelMock._ModelClassMock.findOneAndUpdate._failedCall);

      const updateData = { action: 'addUnique' };

      await expect(updateOneModelInDB(MODEL_TYPE, {}, updateData)).resolves.toStrictEqual(
        new getModelMock._ModelClassMock.findOneAndUpdate._clazz()
      );
      await expect(updateOneModelInDB(MODEL_TYPE, {}, updateData)).resolves.toBeNull();
    });
  });
});
