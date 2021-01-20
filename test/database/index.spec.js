const modelMock = jest.mock('../../src/database/models/index').requireMock('../../src/database/models/index');

// TODO: create kind of symlinks to test/ folder to avoid using relative paths
const { findAssociatedSrcModulePath } = require('../index');
const { saveToDB, getFromDB, updateOneModelInDB } = require(findAssociatedSrcModulePath());

describe('index', () => {
  describe('saveToDB()', () => {
    const MODEL_TYPE = 'Test';

    afterEach(() => {
      modelMock.mockClear();
      modelMock._ModelClassMock.mockClear();
      modelMock._ModelPrototypeSaveMock.mockClear();
    });

    // TODO: this test may be unnecessary when that function will be refactored to TypeScript
    it('should return null when itemData is falsy or not an object or modelType is falsy or not a string', () => {
      expect(saveToDB()).toBe(null);
      expect(saveToDB('itemData')).toBe(null);
      expect(saveToDB({}, null)).toBe(null);
      expect(saveToDB({}, {})).toBe(null);
    });

    it('should call getModel(..) with modelType param', async () => {
      await saveToDB({}, MODEL_TYPE);

      expect(modelMock).toHaveBeenCalledWith(MODEL_TYPE);
    });

    it('should call Model constructor with itemData param', async () => {
      const itemData = { dataItem: true };

      await saveToDB(itemData, MODEL_TYPE);

      expect(modelMock._ModelClassMock).toHaveBeenCalledWith(itemData);
    });

    it('should call item.save(..) once with callback param', async () => {
      const ModelPrototypeSaveMock = Object.getPrototypeOf(modelMock._ModelClassMock.getMockImplementation()()).save;

      await saveToDB({}, MODEL_TYPE);

      expect(ModelPrototypeSaveMock).toHaveBeenCalledTimes(1);
      expect(ModelPrototypeSaveMock).toHaveBeenCalledWith(expect.any(Function));
    });

    // it('should return promise resolved to saved item when save operation succeeded', async () => {
    //   const savedItem = { itemSaved: true };
    //   const ModelPrototypeSaveMock = Object.getPrototypeOf(modelMock._ModelClassMock.getMockImplementation()()).save;
    //   ModelPrototypeSaveMock.mockImplementationOnce((callback) => {
    //     callback(null, savedItem);
    //   });
    //
    //   const saveToDBResult = await saveToDB({}, MODEL_TYPE);
    //
    //   expect(saveToDBResult).resolves.toBe(savedItem);
    // });

    // it('should return promise rejected to error when save operation failed', async () => {
    //   await saveToDB({}, MODEL_TYPE);
    // });
  });
});
