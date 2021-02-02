const jwt = jest.createMockFromModule('jsonwebtoken');
jwt.verify.mockImplementation((token, SECRET_KEY) => ({
  _id: '',
}));

module.exports = jwt;
