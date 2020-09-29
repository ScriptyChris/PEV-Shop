const { Router } = require('express');
const { saveToDB, getFromDB } = require('../../database/index');
const auth = require('../features/auth');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = auth.verifyToken(token);
    const user = await getFromDB({ _id: decodedToken._id.toString(), 'tokens.token': token }, 'user');
    console.log('schema class?', user.constructor, ' /class name: ', user.constructor.name);

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

const router = Router();

router.post('/api/users/', async (req, res) => {
  console.log('[POST] /users req.body', req.body);

  try {
    req.body.password = await auth.hashPassword(req.body.password);
    const savedUser = await saveToDB(req.body, 'user');

    console.log('User saved', savedUser);
  } catch (exception) {
    console.error('Saving user exception:', exception);

    res.status(500).json({ exception });
  }

  res.status(201).json({ msg: 'Success!' });
});

router.post('/api/users/login', async (req, res) => {
  console.log('[POST] /login');

  try {
    const user = await getFromDB({ login: req.body.login }, 'user');
    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = await user.generateAuthToken();

    res.json({ payload: user, token });
  } catch (exception) {
    console.error('Login user exception:', exception);

    res.status(500).json({ exception });
  }
});

router.post('/api/users/logout', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenItem) => tokenItem.token !== req.token);
    await req.user.save();

    res.status(200).json({ payload: 'Logged out!' });
  } catch (exception) {
    console.error('Logout user exception:', exception);

    res.status(500).json({ exception });
  }
});

router.get('/api/users/:id', authMiddleware, async (req, res) => {
  console.log('[GET] /:id', req.params.id);
  const user = await getFromDB(req.params.id, 'user');

  res.json({ payload: user });
});

module.exports = router;
