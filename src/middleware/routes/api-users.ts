import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response } from 'express';
import { saveToDB, getFromDB, updateOneModelInDB, ObjectId } from '../../database/database-index';
import { authMiddlewareFn, hashPassword } from '../features/auth';
import { IUser } from '../../database/models/_user';

// @ts-ignore
const { default: { Router } } = expressModule;
const logger = getLogger(module.filename);

const router: any = Router();
router.post('/api/users/', updateUser);
router.post('/api/users/login', logInUser);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);

// expose functions for unit tests
router._updateUser = updateUser;
router._logInUser = logInUser;
router._logOutUser = logOutUser;
router._getUser = getUser;

export default router;

async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    logger.log('[POST] /users req.body', req.body);

    req.body.password = await hashPassword(req.body.password);
    const savedUser = await saveToDB(req.body, 'User') as IUser;

    // TODO: expose appropriate function from user role module?
    updateOneModelInDB(
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

    res.status(201).json({ msg: 'Success!' });
  } catch (exception) {
    logger.error('Saving user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function logInUser(req: Request, res: Response): Promise<void> {
  logger.log('[POST] /login');

  try {
    const user = await getFromDB({ login: req.body.login }, 'User') as IUser;
    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ payload: user, token });
  } catch (exception) {
    logger.error('Login user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function logOutUser(req: Request & {user: any, token: string}, res: Response): Promise<void> {
  try {
    // TODO: what if .filter(..) returns an empty array? should req.user be saved then?
    req.user.tokens = req.user.tokens.filter((tokenItem: {token: string}) => tokenItem.token !== req.token);
    await req.user.save();

    res.status(200).json({ payload: 'Logged out!' });
  } catch (exception) {
    logger.error('Logout user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function getUser(req: Request, res: Response): Promise<void> {
  logger.log('[GET] /:id', req.params.id);
  // TODO: handle case when user is not found in database
  const user = await getFromDB(req.params.id, 'User');

  res.status(200).json({ payload: user });
}
