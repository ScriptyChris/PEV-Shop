const { Router } = require('express');
const { saveToDB, getFromDB } = require('../../database/index');
const jwt = require('jsonwebtoken');

// TODO: move to ENV
const SECRET_KEY = 'secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user = await getFromDB({ _id: decodedToken._id.toString(), 'tokens.token': token }, 'user');

    if (!user) {
      throw new Error('Auth failed!');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (exception) {
    console.error('authMiddleware exception', exception);
    res.status(401).send('You are unauthorized!');
  }
};

const router = Router();

router.post('/api/users/', async (req, res) => {
  console.log('[POST] /users req.body', req.body);

  try {
    const savedUser = await saveToDB(req.body, 'user');

    console.log('User saved', savedUser);
  } catch (exception) {
    console.error('Saving product exception:', exception);

    res.status(500);
    res.end(JSON.stringify({ exception }));
  }

  res.status(201);
  res.end('Success!');
});

router.post('/api/users/login', async (req, res) => {
  console.log('[POST] /login');

  try {
    const user = await getFromDB({ nickName: req.body.nickName }, 'user');
    const token = await user.generateAuthToken();

    console.log('token', token);

    res.send({ payload: user, token });
  } catch (exception) {
    console.error('Login user exception:', exception);

    res.status(500);
    res.end(JSON.stringify({ exception }));
  }
});

router.post('/api/users/logout', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenItem) => tokenItem.token !== req.token);
    await req.user.save();

    res.status(200).send('Logged out!');
  } catch (exception) {
    console.error('Logout user exception:', exception);

    res.status(500);
    res.end(JSON.stringify({ exception }));
  }
});

router.get('/api/users/:id', authMiddleware, async (req, res) => {
  console.log('[GET] /:id', req.params.id);
  const user = await getFromDB(req.params.id, 'user');

  res.send({ payload: user });
});

module.exports = router;
