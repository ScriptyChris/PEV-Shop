const { Router } = require('express');
const { saveToDB, getFromDB, updateOneModelInDB, ObjectId } = require('../../database/database-index');
const auth = require('../features/auth');

const router = Router();

router.post('/api/users/', async (req, res) => {
  console.log('[POST] /users req.body', req.body);

  try {
    req.body.password = await auth.hashPassword(req.body.password);
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
    const user = await getFromDB({ login: req.body.login }, 'User');
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

router.post('/api/users/logout', auth.authMiddlewareFn(getFromDB), async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenItem) => tokenItem.token !== req.token);
    await req.user.save();

    res.status(200).json({ payload: 'Logged out!' });
  } catch (exception) {
    console.error('Logout user exception:', exception);

    res.status(500).json({ exception });
  }
});

router.get('/api/users/:id', auth.authMiddlewareFn(getFromDB), async (req, res) => {
  console.log('[GET] /:id', req.params.id);
  const user = await getFromDB(req.params.id, 'User');

  res.json({ payload: user });
});

module.exports = router;
