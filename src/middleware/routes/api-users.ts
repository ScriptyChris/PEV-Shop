import * as dotenv from 'dotenv';
import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response } from 'express';
import { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB, ObjectId } from '../../database/database-index';
import { authMiddlewareFn, hashPassword } from '../features/auth';
import UserModel, { IUser } from '../../database/models/_user';
import sendMail, { EMAIL_TYPES } from '../helpers/mailer';

dotenv.config();

const {
  // @ts-ignore
  default: { Router },
} = expressModule;
const logger = getLogger(module.filename);

const router: any = Router();
router.post('/api/users/', updateUser);
router.post('/api/users/register', registerUser);
router.post('/api/users/confirm-registration', confirmRegistration);
router.post('/api/users/login', logInUser);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);

// expose functions for unit tests
router._updateUser = updateUser;
router._logInUser = logInUser;
router._logOutUser = logOutUser;
router._getUser = getUser;

export default router;

// TODO: implement updating various user data
async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    logger.log('[POST] /users req.body', req.body);

    // TODO: [error-handling] validate password before hashing it, as in `registerUser` function
    req.body.password = await hashPassword(req.body.password);
    const savedUser = (await saveToDB(req.body, 'User')) as IUser;

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

async function registerUser(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  logger.log('(registerUser) req.body:', req.body);

  try {
    // TODO: [SECURITY] add some debounce for register amount per IP

    // @ts-ignore
    const validatedPassword = UserModel.validatePassword(req.body.password);

    if (validatedPassword !== '') {
      return res.status(400).json({ exception: validatedPassword });
    }

    req.body.password = await hashPassword(req.body.password);

    const newUser = (await saveToDB(req.body, 'User')) as IUser;
    await newUser.assignTempToken();

    sendMail(
      req.body.email,
      EMAIL_TYPES.ACTIVATION,
      `http://localhost:${process.env.PORT}/confirm-registration/?token=${newUser.tempToken}`
    )
      .then(async (emailSentInfo) => {
        if (emailSentInfo.rejected.length) {
          logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

          await deleteFromDB({ name: req.body.login }, 'User');

          return res.status(400).json({
            exception: {
              msg: 'Sending email rejection',
              reason: emailSentInfo.rejected,
            },
          });
        }

        res.status(201).json({ msg: 'User account created! Check your email.' });
      })
      .catch(async (emailSentError) => {
        logger.error('emailSentError:', emailSentError);

        await deleteFromDB({ name: req.body.login }, 'User');

        res.status(500).json({
          exception: {
            msg: `Email sent error: '${emailSentError.message}'`,
            reason: emailSentError,
          },
        });
      });
  } catch (exception) {
    logger.error('(registerUser) exception:', exception);

    res.status(500).json({ exception });
  }
}

async function confirmRegistration(req: Request, res: Response): Promise<void> {
  logger.log('(confirmRegistration) req.body.tempToken:', req.body.tempToken);

  try {
    const userToConfirm = (await getFromDB({ tempToken: req.body.tempToken }, 'User')) as IUser;

    if (userToConfirm) {
      await userToConfirm.confirmUser();
      await userToConfirm.deleteTempToken();

      res.status(200).json({ payload: { isUserConfirmed: true } });
    } else {
      res.status(400).json({ payload: { isUserConfirmed: false } });
    }
  } catch (exception) {
    logger.error('(confirmRegistration) exception:', exception);

    res.status(500).json({ exception });
  }
}

async function logInUser(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  logger.log('(logInUser) req.body:', req.body);

  try {
    const user = (await getFromDB({ login: req.body.login }, 'User')) as IUser;

    if (!user.isConfirmed) {
      return res.status(401).json({ msg: 'Login failed, because user registration is not confirmed!' });
    }

    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      throw { message: 'Invalid credentials', status: 401 };
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ payload: user, token });
  } catch (exception) {
    logger.error('Login user exception:', exception);

    res.status(exception.status || 500).json({ payload: exception });
  }
}

async function logOutUser(req: Request & { user: any; token: string }, res: Response): Promise<void> {
  try {
    // TODO: what if .filter(..) returns an empty array? should req.user be saved then?
    req.user.tokens = req.user.tokens.filter((tokenItem: { token: string }) => tokenItem.token !== req.token);
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
