const logger = require('../../../utils/logger')(module.filename);
const { Router } = require('express');
const { saveToDB, getFromDB, updateOneModelInDB, ObjectId } = require('../../database/database-index');
const { authMiddlewareFn, hashPassword } = require('../features/auth');

const router = Router();
router.post('/api/users/', updateUser);
router.post('/api/users/login', logInUser);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);

// expose functions for unit tests
router._updateUser = updateUser;
router._logInUser = logInUser;
router._logOutUser = logOutUser;
router._getUser = getUser;

module.exports = router;

async function updateUser(req, res) {
  logger.log('[POST] /users req.body', req.body);

  try {
    req.body.password = await hashPassword(req.body.password);
    const savedUser = await saveToDB(req.body, 'User');

    // TODO: expose appropriate function from user role module?
    await updateOneModelInDB(
      { roleName: req.body.roleName },
      {
        action: 'addUnique',
        data: {
          owners: new ObjectId(savedUser._id),
        },
      },
      'User-Role'
    );

    logger.log('User saved', savedUser);
  } catch (exception) {
    logger.error('Saving user exception:', exception);

    res.status(500).json({ exception });
  }

  res.status(201).json({ msg: 'Success!' });
}

async function logInUser(req, res) {
  logger.log('[POST] /login');

  try {
    const user = await getFromDB({ login: req.body.login }, 'User');
    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = await user.generateAuthToken();

    res.json({ payload: user, token });
  } catch (exception) {
    logger.error('Login user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function logOutUser(req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((tokenItem) => tokenItem.token !== req.token);
    await req.user.save();

    res.status(200).json({ payload: 'Logged out!' });
  } catch (exception) {
    logger.error('Logout user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function getUser(req, res) {
  logger.log('[GET] /:id', req.params.id);
  const user = await getFromDB(req.params.id, 'User');

  res.json({ payload: user });
}
