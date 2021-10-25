import * as dotenv from 'dotenv';
import getLogger from '../../../utils/logger';
import * as expressModule from 'express';
import { Request, Response, NextFunction } from 'express';
import { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB, ObjectId } from '../../database/database-index';
import { authMiddlewareFn, hashPassword } from '../features/auth';
import UserModel, { IUser } from '../../database/models/_user';
import sendMail, { EMAIL_TYPES } from '../helpers/mailer';
import { HTTP_STATUS_CODE } from '../../types';
import getMiddlewareErrorHandler from '../helpers/middleware-error-handler';

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
router.post('/api/users/resend-confirm-registration', resendConfirmRegistration);
router.post('/api/users/login', logInUser);
router.post('/api/users/reset-password', resetPassword);
router.post('/api/users/resend-reset-password', resendResetPassword);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.patch('/api/users/set-new-password', setNewPassword);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);
router.use(getMiddlewareErrorHandler(logger));

// expose functions for unit tests
router._updateUser = updateUser;
router._registerUser = registerUser;
router._confirmRegistration = confirmRegistration;
router._resendConfirmRegistration = resendConfirmRegistration;
router._logInUser = logInUser;
router._resetPassword = resetPassword;
router._resendResetPassword = resendResetPassword;
router._logOutUser = logOutUser;
router._setNewPassword = setNewPassword;
router._getUser = getUser;

export default router;

const sendRegistrationEmail = async ({
  email,
  login,
  token,
  res,
}: // next,
{
  email: string;
  login: string;
  token: string;
  res: Response;
  // next: NextFunction;
}) => {
  return sendMail(
    email,
    EMAIL_TYPES.ACTIVATION,
    `http://localhost:${process.env.PORT}/confirm-registration/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        await deleteFromDB({ name: login }, 'User');

        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          error: {
            msg: 'Sending email rejection',
            reason: emailSentInfo.rejected,
          },
        });
      }

      return res.status(HTTP_STATUS_CODE.CREATED).json({ msg: 'User account created! Check your email.' });
    })
    .catch(async (emailSentError: Error) => {
      logger.error('emailSentError:', emailSentError);

      await deleteFromDB({ name: login }, 'User');

      // next(new Error())
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        exception: {
          msg: `Email sent error: '${emailSentError.message}'`,
          reason: emailSentError,
        },
      });
    });
};

const sendResetPasswordEmail = async ({ email, token, res }: { email: string; token: string; res: Response }) => {
  return sendMail(
    email,
    EMAIL_TYPES.RESET_PASSWORD,
    `http://localhost:${process.env.PORT}/set-new-password/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          exception: {
            msg: 'Sending email rejection',
            reason: emailSentInfo.rejected,
          },
        });
      }

      return res.status(HTTP_STATUS_CODE.OK).json({ msg: 'Password resetting process began! Check your email.' });
    })
    .catch(async (emailSentError) => {
      logger.error('emailSentError:', emailSentError);

      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        exception: {
          msg: `Email sent error: '${emailSentError.message}'`,
          reason: emailSentError,
        },
      });
    });
};

// TODO: implement updating various user data
async function updateUser(req: Request, res: Response, next: NextFunction) {
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

    return res.status(HTTP_STATUS_CODE.CREATED).json({ msg: 'Success!' });
  } catch (exception) {
    return next(exception);
  }
}

async function setNewPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(setNewPassword) req.body:', req.body);

  try {
    const validatedPasswordMsg = UserModel.validatePassword(req.body.newPassword);

    if (validatedPasswordMsg !== '') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: validatedPasswordMsg });
    }

    const hashedPassword = await hashPassword(req.body.newPassword);
    const tokenQuery = {
      [`tokens.resetPassword`]: req.body.token.replace(/\s/g, '+'),
    };

    const userToSetNewPassword = (await getFromDB(tokenQuery, 'User')) as IUser;

    if (userToSetNewPassword) {
      await updateOneModelInDB(
        tokenQuery,
        {
          action: 'modify',
          data: {
            password: hashedPassword,
          },
        },
        'User'
      );

      await userToSetNewPassword.deleteSingleToken('resetPassword');

      return res.status(HTTP_STATUS_CODE.CREATED).json({ msg: 'Password updated!' });
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'User not found!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function registerUser(req: Request, res: Response, next: NextFunction) {
  logger.log('(registerUser) req.body:', req.body);

  try {
    // TODO: [SECURITY] add some debounce for register amount per IP

    // @ts-ignore
    const validatedPasswordMsg = UserModel.validatePassword(req.body.password);

    if (validatedPasswordMsg !== '') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: validatedPasswordMsg });
    }

    req.body.password = await hashPassword(req.body.password);

    const newUser = (await saveToDB(req.body, 'User')) as IUser;
    await newUser.setSingleToken('confirmRegistration');

    return await sendRegistrationEmail({
      login: req.body.login,
      email: req.body.email,
      token: newUser.tokens.confirmRegistration as string,
      res,
    });
  } catch (exception) {
    return next(exception);
  }
}

async function confirmRegistration(req: Request, res: Response, next: NextFunction) {
  logger.log('(confirmRegistration) req.body.token:', req.body.token);

  try {
    if (!req.body.token) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: 'Token is empty or not attached!' });
    }

    const userToConfirm = (await getFromDB(
      { 'tokens.confirmRegistration': req.body.token.replace(/\s/g, '+') },
      'User'
    )) as IUser;

    if (userToConfirm) {
      await userToConfirm.confirmUser();
      await userToConfirm.deleteSingleToken('confirmRegistration');

      return res.status(HTTP_STATUS_CODE.OK).json({ payload: { isUserConfirmed: true } });
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ payload: { isUserConfirmed: false } });
    }
  } catch (exception) {
    return next(exception);
  }
}

// TODO: [SECURITY] set some debounce to limit number of sent emails per time
async function resendConfirmRegistration(req: Request, res: Response, next: NextFunction) {
  logger.log('(resendConfirmRegistration) req.body:', req.body);

  try {
    if (!req.body.email) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: 'Email is empty or not attached!' });
    }

    const userToResendConfirmation = (await getFromDB(
      {
        email: req.body.email,
        isConfirmed: false,
        'tokens.confirmRegistration': { $exists: true },
      },
      'User'
    )) as IUser;

    if (userToResendConfirmation) {
      return await sendRegistrationEmail({
        login: userToResendConfirmation.login,
        email: req.body.email,
        token: userToResendConfirmation.tokens.confirmRegistration as string,
        res,
      });
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ payload: { isConfirmationReSend: false } });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logInUser(req: Request, res: Response, next: NextFunction) {
  logger.log('(logInUser) req.body:', req.body);

  try {
    if (!req.body.login) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: 'User login is empty or not attached!' });
    }

    const user = (await getFromDB({ login: req.body.login }, 'User')) as IUser;

    if (!user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: 'Invalid credentials!' });
    }

    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: 'Invalid credentials!' });
    }

    if (!user.isConfirmed) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: 'User registration is not confirmed!' });
    }

    const token = await user.generateAuthToken();

    return res.status(HTTP_STATUS_CODE.OK).json({ payload: user, token });
  } catch (exception) {
    return next(exception);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(resetPassword) req.body:', req.body);

  try {
    if (!req.body.email) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: 'Email is empty or not attached!' });
    }

    const userToResetPassword = (await getFromDB(
      {
        email: req.body.email,
      },
      'User'
    )) as IUser;

    if (userToResetPassword) {
      await userToResetPassword.setSingleToken('resetPassword');

      return await sendResetPasswordEmail({
        email: userToResetPassword.email,
        token: userToResetPassword.tokens.resetPassword as string,
        res,
      });
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'User not found!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

// TODO: [SECURITY] set some debounce to limit number of sent emails per time
async function resendResetPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(resendResetPassword) req.body:', req.body);

  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is empty or not attached!' });
    } else if (!req.body.email) {
      return res.status(400).json({ error: 'Email prop is empty or not attached!' });
    }

    const userToResendResetPassword = (await getFromDB(
      {
        email: req.body.email,
        'tokens.resetPassword': { $exists: true },
      },
      'User'
    )) as IUser;

    if (userToResendResetPassword) {
      await sendResetPasswordEmail({
        email: userToResendResetPassword.email,
        token: userToResendResetPassword.tokens.resetPassword as string,
        res,
      });
    } else {
      return res.status(404).json({ msg: 'User not found!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logOutUser(req: Request & { user: IUser; token: string }, res: Response, next: NextFunction) {
  try {
    req.user.tokens.auth = (req.user.tokens.auth as string[]).filter((token) => token !== req.token);

    if (req.user.tokens.auth.length === 0) {
      delete req.user.tokens.auth;
    }

    await req.user.save();

    return res.status(HTTP_STATUS_CODE.OK).json({ msg: 'Logged out!' });
  } catch (exception) {
    return next(exception);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  logger.log('[GET] /:id', req.params.id);

  try {
    if (!req.params.id) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: 'User id is empty or not attached!' });
    }

    const user: IUser = await getFromDB(req.params.id, 'User');

    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: `User not found!` });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({ payload: user });
  } catch (exception) {
    return next(exception);
  }
}
