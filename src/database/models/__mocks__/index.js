// const modelSave = jest.fn();
// modelSave._setSuccessImplementation = () => {
//     modelSave.mockImplementation((callback) => {
//       callback(null, { itemSaved: true });
//     });
// };
// modelSave._setFailImplementation = () => {
//     modelSave.mockImplementation((callback) => {
//       callback('Item save failed!', { itemSaved: false });
//     });
// };
// modelSave._setSuccessImplementation();

// _shouldSucceed: true,
  // get shouldSucceed() {
  //   return this._shouldSucceed;
  // },
  // set shouldSucceed(value) {
  //   if (typeof value === 'boolean')
  //   this._shouldSucceed
  // }

function Model(itemData) {}
Model.prototype.save = jest.fn() //modelSave;

const ModelClassMock = jest
  .fn((...args) => new Model(...args))
  .mockName('Model');
const ModelModuleMock = jest.fn(() => ModelClassMock);
ModelModuleMock._ModelClassMock = ModelClassMock;
ModelModuleMock._ModelPrototypeSaveMock = Model.prototype.save;

module.exports = ModelModuleMock;

// module.exports = jest.mock('../index', () => {
//   console.log('model index mock factory');
//   return jest.fn(() => class Model{});
// });
