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

const authMiddlewareFn = (getFromDB) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decodedToken = verifyToken(token);
      const user = await getFromDB({ _id: decodedToken._id.toString(), 'tokens.token': token }, 'User');

      if (!user) {
        throw new Error('Auth failed!');
      }

      req.token = token;
      req.user = user;

      next();
    } catch (exception) {
      console.error('authMiddleware exception', exception);
      res.status(401).json({ error: 'You are unauthorized!' });
    }
  };
};

const userRoleMiddlewareFn = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error('No user provided - probably forgot to do auth first.');
      }

      // TODO: improve selecting data while populating
      await req.user.execPopulate({
        path: 'roleName',
        match: { roleName },
      });
      console.log('Populated req.user.roleName', req.user.roleName);

      req.userPermissions = req.user.roleName[0].permissions;

      next();
    } catch (exception) {
      console.error('userRoleMiddlewareFn exception', exception);
      res.status(403).json({ error: "You don't have permissions!" });
    }
  };
};

module.exports = {
  comparePasswords,
  hashPassword,
  getToken,
  verifyToken,
  authMiddlewareFn,
  userRoleMiddlewareFn,
};
