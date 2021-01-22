function Model(itemData) {}
Model.prototype.save = jest.fn((callback) => callback());

const ModelClassMock = jest.fn((...args) => new Model(...args)).mockName('Model');
const ModelModuleMock = jest.fn(() => ModelClassMock);
ModelModuleMock._ModelClassMock = ModelClassMock;
ModelModuleMock._ModelPrototypeSaveMock = Model.prototype.save;

module.exports = ModelModuleMock;
