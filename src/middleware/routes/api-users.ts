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
import { embraceResponse, normalizePayloadType } from '../helpers/middleware-response-wrapper';

dotenv.config();

const {
  // @ts-ignore
  default: { Router },
} = expressModule;
const logger = getLogger(module.filename);

const router: any = Router();

// feature related
router.post(
  '/api/users/add-product-to-observed',
  authMiddlewareFn(getFromDB),
  addProductToObserved,
  getObservedProducts
);
router.delete(
  '/api/users/remove-product-from-observed/:productId',
  authMiddlewareFn(getFromDB),
  removeProductFromObserved,
  getObservedProducts
);
router.delete(
  '/api/users/remove-all-products-from-observed',
  authMiddlewareFn(getFromDB),
  removeAllProductsFromObserved,
  getObservedProducts
);
router.get('/api/users/observed-products', authMiddlewareFn(getFromDB), getObservedProducts);

// auth related
router.post('/api/users/register', registerUser);
router.post('/api/users/confirm-registration', confirmRegistration);
router.post('/api/users/resend-confirm-registration', resendConfirmRegistration);
router.post('/api/users/login', logInUser);
router.post('/api/users/reset-password', resetPassword);
router.post('/api/users/resend-reset-password', resendResetPassword);
router.post('/api/users/logout', authMiddlewareFn(getFromDB), logOutUser);
router.post('/api/users/logout-all', authMiddlewareFn(getFromDB), logOutUserFromSessions);
router.patch('/api/users/set-new-password', setNewPassword);
router.patch('/api/users/change-password', authMiddlewareFn(getFromDB), changePassword);

// general
router.post('/api/users/', updateUser);
router.get('/api/users/:id', authMiddlewareFn(getFromDB), getUser);

router.use(getMiddlewareErrorHandler(logger));

// expose functions for unit tests
router._updateUser = updateUser;
router._registerUser = registerUser;
router._confirmRegistration = confirmRegistration;
router._resendConfirmRegistration = resendConfirmRegistration;
router._logInUser = logInUser;
router._changePassword = changePassword;
router._resetPassword = resetPassword;
router._resendResetPassword = resendResetPassword;
router._logOutUser = logOutUser;
router._logOutUserFromSessions = logOutUserFromSessions;
router._setNewPassword = setNewPassword;
router._getUser = getUser;
router._addProductToObserved = addProductToObserved;
router._removeProductFromObserved = removeProductFromObserved;
router._removeAllProductsFromObserved = removeAllProductsFromObserved;
router._getObservedProducts = getObservedProducts;

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

        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
          embraceResponse({
            error: `Sending email rejected: ${emailSentInfo.rejected}!`,
          })
        );
      }

      return res
        .status(HTTP_STATUS_CODE.CREATED)
        .json(embraceResponse({ message: 'User account created! Check your email.' }));
    })
    .catch(async (emailSentError: Error) => {
      logger.error('emailSentError:', emailSentError);

      await deleteFromDB({ name: login }, 'User');

      // next(new Error())
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
        embraceResponse({
          exception: {
            message: `Email sent error: '${emailSentError.message}'!`,
          },
        })
      );
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

        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
          embraceResponse({
            exception: {
              message: `Sending email rejection: ${emailSentInfo.rejected}`,
            },
          })
        );
      }

      return res
        .status(HTTP_STATUS_CODE.OK)
        .json(embraceResponse({ message: 'Password resetting process began! Check your email.' }));
    })
    .catch(async (emailSentError) => {
      logger.error('emailSentError:', emailSentError);

      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
        embraceResponse({
          exception: {
            message: `Email sent error: '${emailSentError.message}'!`,
          },
        })
      );
    });
};

// TODO: implement updating various user data
async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[POST] /users req.body', req.body);

    // TODO: [error-handling] validate password before hashing it, as in `registerUser` function
    req.body.password = await hashPassword(req.body.password);
    const savedUser = (await saveToDB(req.body, 'User')) as IUser;

    logger.log('User saved:', savedUser);

    // TODO: expose appropriate function from user role module?
    const updatedUser = await updateOneModelInDB(
      { roleName: req.body.roleName },
      {
        action: 'addUnique',
        data: {
          owners: new ObjectId(savedUser._id),
        },
      },
      'User-Role'
    );

    if (!updatedUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: 'User to update was not found!' }));
    }

    return res.status(HTTP_STATUS_CODE.CREATED).json(embraceResponse({ message: 'Success!' }));
  } catch (exception) {
    return next(exception);
  }
}

async function setNewPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(setNewPassword) req.body:', req.body);

  try {
    if (!req.body || !req.body.newPassword || !req.body.token) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request body or "newPassword" or "token" fields are empty!' }));
    }

    const validatedPasswordMsg = UserModel.validatePassword(req.body.newPassword);

    if (validatedPasswordMsg !== '') {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(embraceResponse({ error: validatedPasswordMsg }));
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

      return res.status(HTTP_STATUS_CODE.CREATED).json(embraceResponse({ message: 'Password updated!' }));
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: 'User not found!' }));
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
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(embraceResponse({ error: validatedPasswordMsg }));
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
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Token is empty or not attached!' }));
    }

    const userToConfirm = (await getFromDB(
      { 'tokens.confirmRegistration': req.body.token.replace(/\s/g, '+') },
      'User'
    )) as IUser;

    if (userToConfirm) {
      await userToConfirm.confirmUser();
      await userToConfirm.deleteSingleToken('confirmRegistration');

      return res.status(HTTP_STATUS_CODE.OK).json(embraceResponse({ payload: { isUserConfirmed: true } }));
    } else {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ payload: { isUserConfirmed: false } }));
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
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Email is empty or not attached!' }));
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
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ payload: { isConfirmationReSend: false } }));
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logInUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(logInUser) req.body:', req.body);

    if (!req.body) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request body is empty or not attached!' }));
    } else if (!req.body.login) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'User login is empty or not attached!' }));
    }

    const user = (await getFromDB({ login: req.body.login }, 'User')) as IUser;

    if (!user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(embraceResponse({ error: 'Invalid credentials!' }));
    }

    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(embraceResponse({ error: 'Invalid credentials!' }));
    }

    if (!user.isConfirmed) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(embraceResponse({ error: 'User registration is not confirmed!' }));
    }

    const token = await user.generateAuthToken();

    return res.status(HTTP_STATUS_CODE.OK).json(
      embraceResponse({
        payload: normalizePayloadType({
          ...user,
          observedProducts: await getObservedProducts(
            { ...req, user } as TGetObservedProductsParams[0],
            { ...res, _OMIT_HTTP: true } as TGetObservedProductsParams[1],
            next
          ),
        }),
        token,
      })
    );
  } catch (exception) {
    return next(exception);
  }
}

async function changePassword(req: Request & { user: IUser }, res: Response, next: NextFunction) {
  try {
    logger.log('(changePassword) req.body:', req.body);

    if (!req.body || !req.body.password || !req.body.newPassword) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request body is empty or not attached!' }));
    }

    const isPasswordMatch = await req.user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(embraceResponse({ error: 'Invalid credentials!' }));
    }

    req.user.password = await hashPassword(req.body.newPassword);
    req.user.save();

    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(resetPassword) req.body:', req.body);

  try {
    if (!req.body.email) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Email is empty or not attached!' }));
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
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request body is empty or not attached!' }));
    } else if (!req.body.email) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse(embraceResponse({ error: 'Email prop is empty or not attached!' })));
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
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: 'User not found!' }));
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logOutUser(req: Request & { user: IUser; token: string }, res: Response, next: NextFunction) {
  try {
    req.user.tokens.auth = (req.user.tokens.auth as string[]).filter((token) => token !== req.token);

    if (req.user.tokens.auth.length === 0) {
      req.user.tokens.auth = undefined;
    }

    await req.user.save();

    return res.status(HTTP_STATUS_CODE.OK).json(embraceResponse({ message: 'Logged out!' }));
  } catch (exception) {
    return next(exception);
  }
}

async function logOutUserFromSessions(
  req: Request & { user: IUser; token: string },
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.preseveCurrentSession) {
      if ((req.user.tokens.auth as string[]).length === 1) {
        return res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .json(embraceResponse({ error: 'Current session is the only one, so there is no other sessions to end!' }));
      }

      req.user.tokens.auth = (req.user.tokens.auth as string[]).filter((authToken) => authToken === req.token);
    } else {
      req.user.tokens.auth = undefined;
    }

    await req.user.save();

    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[GET] /:id', req.params.id);

    if (!req.params.id) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'User id is empty or not attached!' }));
    }

    const user: IUser = await getFromDB(req.params.id, 'User');

    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: `User not found!` }));
    }

    return res.status(HTTP_STATUS_CODE.OK).json(embraceResponse({ payload: normalizePayloadType(user) }));
  } catch (exception) {
    return next(exception);
  }
}

async function addProductToObserved(req: Request & { user: IUser }, res: Response, next: NextFunction) {
  try {
    logger.log('(addProductToObserved) req.body:', req.body);

    if (!req.body || !req.body.productId) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request body or `productId` param are empty or not attached!' }));
    }

    const observationAdditionError = req.user.addProductToObserved(req.body.productId);

    if (observationAdditionError) {
      return res.status(HTTP_STATUS_CODE.CONFLICT).json(embraceResponse({ error: observationAdditionError }));
    }

    await req.user.save();

    return next();
  } catch (exception) {
    return next(exception);
  }
}

async function removeProductFromObserved(req: Request & { user: IUser }, res: Response, next: NextFunction) {
  try {
    logger.log('(removeProductFromObserved) req.params:', req.params);

    if (!req.params || !req.params.productId) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(embraceResponse({ error: 'Request params or `productId` param are empty or not attached!' }));
    }

    const observationRemovalError = req.user.removeProductFromObserved(req.params.productId);

    if (observationRemovalError) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: observationRemovalError }));
    }

    await req.user.save();

    return next();
  } catch (exception) {
    return next(exception);
  }
}

async function removeAllProductsFromObserved(req: Request & { user: IUser }, res: Response, next: NextFunction) {
  try {
    const observationsRemovalError = req.user.removeAllProductsFromObserved();

    if (observationsRemovalError) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(embraceResponse({ error: observationsRemovalError }));
    }

    await req.user.save();

    return next();
  } catch (exception) {
    return next(exception);
  }
}

type TGetObservedProductsParams = Parameters<typeof getObservedProducts>;
async function getObservedProducts(
  req: Request & { user: IUser },
  res: Response & { _OMIT_HTTP?: boolean },
  next: NextFunction
) {
  try {
    if (!req.user.observedProducts) {
      const emptyObservedProductsResponse: unknown[] = [];

      if (res._OMIT_HTTP) {
        return emptyObservedProductsResponse;
      }

      return res.status(HTTP_STATUS_CODE.OK).json(embraceResponse({ payload: emptyObservedProductsResponse }));
    }

    const observedProducts = await getFromDB({ _id: req.user.observedProducts }, 'Product');

    if (res._OMIT_HTTP) {
      return observedProducts;
    }

    return res.status(HTTP_STATUS_CODE.OK).json(embraceResponse({ payload: observedProducts }));
  } catch (exception) {
    return next(exception);
  }
}
