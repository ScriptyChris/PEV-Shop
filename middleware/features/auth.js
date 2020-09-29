const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 8;
// TODO: move to ENV
const SECRET_KEY = 'secret-key';

const comparePasswords = (password, passwordPattern) => {
  return bcrypt.compare(password, passwordPattern);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const getToken = (payloadObj) => {
  return jwt.sign(payloadObj, SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = {
  comparePasswords,
  hashPassword,
  getToken,
  verifyToken,
};
