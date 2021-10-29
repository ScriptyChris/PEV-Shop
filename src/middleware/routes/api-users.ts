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
router.post('/api/users/resend-confirm-registration', resendConfirmRegistration);
router.post('/api/users/login', logInUser);
router.post('/api/users/reset-password', resetPassword);
router.post('/api/users/resend-reset-password', resendResetPassword);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.patch('/api/users/set-new-password', setNewPassword);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);

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

type TPromisedJSON = Promise<Pick<Response, 'json'>>;
// workaround fix for TS1055 error: https://stackoverflow.com/a/45929350/4983840
const TPromisedJSON = Promise;

const sendRegistrationEmail = async ({
  email,
  login,
  token,
  res,
}: {
  email: string;
  login: string;
  token: string;
  res: Response;
}): TPromisedJSON => {
  return sendMail(
    email,
    EMAIL_TYPES.ACTIVATION,
    `http://localhost:${process.env.PORT}/confirm-registration/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        await deleteFromDB({ name: login }, 'User');

        return res.status(400).json({
          exception: {
            msg: 'Sending email rejection',
            reason: emailSentInfo.rejected,
          },
        });
      }

      return res.status(201).json({ msg: 'User account created! Check your email.' });
    })
    .catch(async (emailSentError) => {
      logger.error('emailSentError:', emailSentError);

      await deleteFromDB({ name: login }, 'User');

      return res.status(500).json({
        exception: {
          msg: `Email sent error: '${emailSentError.message}'`,
          reason: emailSentError,
        },
      });
    });
};

const sendResetPasswordEmail = async ({
  email,
  token,
  res,
}: {
  email: string;
  token: string;
  res: Response;
}): TPromisedJSON => {
  return sendMail(
    email,
    EMAIL_TYPES.RESET_PASSWORD,
    `http://localhost:${process.env.PORT}/set-new-password/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        return res.status(400).json({
          exception: {
            msg: 'Sending email rejection',
            reason: emailSentInfo.rejected,
          },
        });
      }

      return res.status(200).json({ msg: 'Password resetting process began! Check your email.' });
    })
    .catch(async (emailSentError) => {
      logger.error('emailSentError:', emailSentError);

      return res.status(500).json({
        exception: {
          msg: `Email sent error: '${emailSentError.message}'`,
          reason: emailSentError,
        },
      });
    });
};

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

async function setNewPassword(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  logger.log('(setNewPassword) req.body:', req.body);

  try {
    // @ts-ignore
    const validatedPassword = UserModel.validatePassword(req.body.newPassword);

    if (validatedPassword !== '') {
      return res.status(400).json({ exception: validatedPassword });
    }
    const hashedPassword = await hashPassword(req.body.newPassword);
    const tokenQuery = {
      [`tokens.resetPassword`]: req.body.token.replace(/\s/g, '+'),
    };

    const userToSetNewPassword = (await getFromDB(tokenQuery, 'User')) as IUser;

    if (userToSetNewPassword) {
      logger.log(
        '(setNewPassword) userToSetNewPassword.password:',
        userToSetNewPassword.password,
        ' /hashed pass:',
        hashedPassword
      );

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

      res.status(201).json({ msg: 'Password updated!' });
    } else {
      return res.status(400).json({ msg: 'User not found!' });
    }
  } catch (exception) {
    logger.error('(setNewPassword) exception:', exception);

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
    await newUser.setSingleToken('confirmRegistration');

    return await sendRegistrationEmail({
      login: req.body.login,
      email: req.body.email,
      token: newUser.tokens.confirmRegistration as string,
      res,
    });
  } catch (exception) {
    logger.error('(registerUser) exception:', exception);

    res.status(500).json({ exception });
  }
}

async function confirmRegistration(req: Request, res: Response): Promise<void> {
  logger.log('(confirmRegistration) req.body.token:', req.body.token);

  try {
    const userToConfirm = (await getFromDB(
      { 'tokens.confirmRegistration': req.body.token.replace(/\s/g, '+') },
      'User'
    )) as IUser;

    if (userToConfirm) {
      await userToConfirm.confirmUser();
      await userToConfirm.deleteSingleToken('confirmRegistration');

      res.status(200).json({ payload: { isUserConfirmed: true } });
    } else {
      res.status(400).json({ payload: { isUserConfirmed: false } });
    }
  } catch (exception) {
    logger.error('(confirmRegistration) exception:', exception);

    res.status(500).json({ exception });
  }
}

// TODO: [SECURITY] set some debounce to limit number of sent emails per time
async function resendConfirmRegistration(req: Request, res: Response): TPromisedJSON {
  logger.log('(resendConfirmRegistration) req.body:', req.body);

  try {
    const userToResendConfirmation = (await getFromDB(
      {
        email: req.body.email,
        isConfirmed: false,
        'tokens.confirmRegistration': { $exists: true },
      },
      'User'
    )) as IUser;

    logger.log(
      'userToResendConfirmation:',
      userToResendConfirmation,
      ' /userToResendConfirmation.tokens.confirmRegistration:',
      userToResendConfirmation.tokens.confirmRegistration
    );

    if (userToResendConfirmation) {
      return await sendRegistrationEmail({
        login: userToResendConfirmation.login,
        email: req.body.email,
        token: userToResendConfirmation.tokens.confirmRegistration as string,
        res,
      });
    } else {
      return res.status(400).json({ payload: { isConfirmationReSend: false } });
    }
  } catch (exception) {
    logger.error('(resendConfirmRegistration) exception:', exception);

    return res.status(500).json({ exception });
  }
}

async function logInUser(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  logger.log('(logInUser) req.body:', req.body);

  try {
    const user = (await getFromDB({ login: req.body.login }, 'User')) as IUser;

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials!' });
    } else if (!user.isConfirmed) {
      return res.status(401).json({ msg: 'User registration is not confirmed!' });
    }

    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid credentials!' });
    }

    if (!user.isConfirmed) {
      return res.status(401).json({ msg: 'User registration is not confirmed!' });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ payload: user, token });
  } catch (exception) {
    logger.error('Login user exception:', exception);

    res.status(500).json({ exception });
  }
}

async function resetPassword(req: Request, res: Response): Promise<void | Pick<Response, 'json'>> {
  logger.log('(resetPassword) req.body:', req.body);

  try {
    const userToResetPassword = (await getFromDB(
      {
        email: req.body.email,
      },
      'User'
    )) as IUser;

    if (userToResetPassword) {
      logger.log('(resetPassword) userToResetPassword:', userToResetPassword.password);

      await userToResetPassword.setSingleToken('resetPassword');

      await sendResetPasswordEmail({
        email: userToResetPassword.email,
        token: userToResetPassword.tokens.resetPassword as string,
        res,
      });
    } else {
      return res.status(400).json({ msg: 'User not found!' });
    }
  } catch (exception) {
    logger.error('(resetPassword) exception:', exception);

    return res.status(500).json({ exception });
  }
}

// TODO: [SECURITY] set some debounce to limit number of sent emails per time
async function resendResetPassword(req: Request, res: Response) {
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
    logger.error('(resendResetPassword) exception:', exception);

    return res.status(500).json({ exception });
  }
}

async function logOutUser(req: Request & { user: IUser; token: string }, res: Response): Promise<void> {
  try {
    req.user.tokens.auth = (req.user.tokens.auth as string[]).filter((token) => token !== req.token);

    if (req.user.tokens.auth.length === 0) {
      delete req.user.tokens.auth;
    }

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
