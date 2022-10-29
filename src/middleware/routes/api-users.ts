import { Router, Request, Response, NextFunction } from 'express';
import getLogger from '@commons/logger';
import { saveToDB, getFromDB, updateOneModelInDB, deleteFromDB } from '@database/api';
import { authMiddlewareFn, hashPassword } from '@middleware/features/auth';
import { UserModel, IUser, IProduct, UserRoleModel, IUserRole, COLLECTION_NAMES, Schema } from '@database/models';
import sendMail, { EMAIL_TYPES } from '@middleware/helpers/mailer';
import { HTTP_STATUS_CODE } from '@src/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import { dotEnv } from '@commons/dotEnvLoader';

const logger = getLogger(module.filename);
const router: Router &
  Partial<{
    _updateUser: typeof updateUser;
    _registerUser: typeof registerUser;
    _confirmRegistration: typeof confirmRegistration;
    _resendConfirmRegistration: typeof resendConfirmRegistration;
    _logInUser: typeof logInUser;
    _changePassword: typeof changePassword;
    _resetPassword: typeof resetPassword;
    _resendResetPassword: typeof resendResetPassword;
    _logOutUser: typeof logOutUser;
    _logOutUserFromSessions: typeof logOutUserFromSessions;
    _setNewPassword: typeof setNewPassword;
    _getUser: typeof getUser;
    _addProductToObserved: typeof addProductToObserved;
    _removeProductFromObserved: typeof removeProductFromObserved;
    _removeAllProductsFromObserved: typeof removeAllProductsFromObserved;
    _getObservedProducts: typeof getObservedProducts;
    _deleteUser: typeof deleteUser;
  }> = Router();

// feature related
router.post('/api/users/add-product-to-observed', authMiddlewareFn, addProductToObserved);
router.delete('/api/users/remove-product-from-observed/:productId', authMiddlewareFn, removeProductFromObserved);
router.delete('/api/users/remove-all-products-from-observed', authMiddlewareFn, removeAllProductsFromObserved);
router.get('/api/users/observed-products', authMiddlewareFn, getObservedProducts);

// auth related
router.post('/api/users/register', registerUser);
router.post('/api/users/confirm-registration', confirmRegistration);
router.post('/api/users/resend-confirm-registration', resendConfirmRegistration);
router.post('/api/users/login', logInUser);
router.post('/api/users/reset-password', resetPassword);
router.post('/api/users/resend-reset-password', resendResetPassword);
router.post('/api/users/logout', authMiddlewareFn, logOutUser);
router.post('/api/users/logout-all', authMiddlewareFn, logOutUserFromSessions);
router.patch('/api/users/set-new-password', setNewPassword);
router.patch('/api/users/change-password', authMiddlewareFn, changePassword);
router.delete('/api/users/delete', /* TODO: [SECURITY] add auth here */ deleteUser);

// general
router.post('/api/users/', updateUser);
router.get('/api/users/:id', authMiddlewareFn, getUser);

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
router._deleteUser = deleteUser;

export default router;

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
}) => {
  return sendMail(
    email,
    EMAIL_TYPES.ACTIVATION,
    /* TODO: [DX] take "pages" from _routeGroups.js module */
    `http://${dotEnv.APP_LOCAL_HOST}:${dotEnv.APP_PORT}/pages/confirm-registration/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        await deleteFromDB(COLLECTION_NAMES.User, login);

        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
          error: `Sending email rejected: ${emailSentInfo.rejected}!`,
        });
      }

      return wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'User account created! Check your email.' });
    })
    .catch(async (emailSentError: Error) => {
      logger.error('emailSentError:', emailSentError);

      await deleteFromDB(COLLECTION_NAMES.User, login);

      return wrapRes(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, {
        exception: {
          message: `Email sent error: '${emailSentError.message}'!`,
        },
      });
    });
};

const sendResetPasswordEmail = async ({ email, token, res }: { email: string; token: string; res: Response }) => {
  return sendMail(
    email,
    EMAIL_TYPES.RESET_PASSWORD,
    /* TODO: [DX] take "pages" from _routeGroups.js module */
    `http://${dotEnv.APP_LOCAL_HOST}:${dotEnv.APP_PORT}/pages/set-new-password/?token=${token}`
  )
    .then(async (emailSentInfo) => {
      if (emailSentInfo.rejected.length) {
        logger.error('emailSentInfo.rejected:', emailSentInfo.rejected);

        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
          error: `Sending email rejection: ${emailSentInfo.rejected}`,
        });
      }

      return wrapRes(res, HTTP_STATUS_CODE.OK, {
        message: 'Password resetting process began! Check your email.',
      });
    })
    .catch(async (emailSentError) => {
      logger.error('emailSentError:', emailSentError);

      return wrapRes(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, {
        exception: {
          message: `Email sent error: '${emailSentError.message}'!`,
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
    const savedUser = (await saveToDB(COLLECTION_NAMES.User, req.body)) as IUser;

    logger.log('User saved:', savedUser);

    // TODO: expose appropriate function from user role module?
    const updatedUser = await updateOneModelInDB(
      COLLECTION_NAMES.User_Role,
      { roleName: req.body.roleName },
      {
        action: 'addUnique',
        data: {
          owners: new Schema.Types.ObjectId(savedUser._id),
        },
      }
    );

    if (!updatedUser) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User to update was not found!' });
    }

    return wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Success!' });
  } catch (exception) {
    return next(exception);
  }
}

async function setNewPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(setNewPassword) req.body:', req.body);

  try {
    if (!req.body || !req.body.newPassword || !req.body.token) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Request body or "newPassword" or "token" fields are empty!',
      });
    }

    const validatedPasswordMsg = UserModel.validatePassword(req.body.newPassword);

    if (validatedPasswordMsg !== '') {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: validatedPasswordMsg });
    }

    const hashedPassword = await hashPassword(req.body.newPassword);
    const tokenQuery = {
      [`tokens.resetPassword`]: req.body.token.replace(/\s/g, '+'),
    };

    const userToSetNewPassword = await getFromDB({ modelName: COLLECTION_NAMES.User }, tokenQuery);

    if (userToSetNewPassword) {
      await updateOneModelInDB(COLLECTION_NAMES.User, tokenQuery, {
        action: 'modify',
        data: {
          password: hashedPassword,
        },
      });

      await (userToSetNewPassword as IUser).deleteSingleToken('resetPassword');

      return wrapRes(res, HTTP_STATUS_CODE.CREATED, { message: 'Password updated!' });
    } else {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User not found!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function registerUser(req: Request, res: Response, next: NextFunction) {
  logger.log('(registerUser) req.body:', req.body);

  try {
    // TODO: [SECURITY] add some debounce for register amount per IP

    const validatedNewUserPayloadMsg = UserModel.validateNewUserPayload(req.body);
    if (validatedNewUserPayloadMsg) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: validatedNewUserPayloadMsg });
    }

    const validatedPasswordMsg = UserModel.validatePassword(req.body.password);
    if (validatedPasswordMsg !== '') {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: validatedPasswordMsg });
    }

    req.body.password = await hashPassword(req.body.password);

    const newUser = (await saveToDB(COLLECTION_NAMES.User, req.body)) as IUser;
    await UserRoleModel.updateOne({ roleName: req.body.accountType }, { $push: { owners: newUser._id } });
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
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Token is empty or not attached!' });
    }

    const userToConfirm = (await getFromDB(
      { modelName: COLLECTION_NAMES.User },
      { 'tokens.confirmRegistration': req.body.token.replace(/\s/g, '+') }
    )) as IUser;

    if (userToConfirm) {
      await userToConfirm.confirmUser();
      await userToConfirm.deleteSingleToken('confirmRegistration');

      return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: { isUserConfirmed: true } });
    } else {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User could not be confirmed!' });
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
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Email is empty or not attached!' });
    }

    const userToResendConfirmation = (await getFromDB(
      { modelName: COLLECTION_NAMES.User },
      {
        email: req.body.email,
        isConfirmed: false,
        'tokens.confirmRegistration': { $exists: true },
      }
    )) as IUser;

    if (userToResendConfirmation) {
      return await sendRegistrationEmail({
        login: userToResendConfirmation.login,
        email: req.body.email,
        token: userToResendConfirmation.tokens.confirmRegistration as string,
        res,
      });
    } else {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'Could not resend user confirmation!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logInUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(logInUser) req.body:', req.body);

    if (!req.body) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    } else if (!req.body.login) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'User login is empty or not attached!' });
    }

    const user = (await getFromDB(
      {
        modelName: COLLECTION_NAMES.User,
        population: 'accountType',
      },
      { login: req.body.login }
    )) as IUser;

    if (!user) {
      return wrapRes(res, HTTP_STATUS_CODE.UNAUTHORIZED, { error: 'Invalid credentials!' });
    }

    const isPasswordMatch = await user.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return wrapRes(res, HTTP_STATUS_CODE.UNAUTHORIZED, { error: 'Invalid credentials!' });
    }

    if (!user.isConfirmed) {
      return wrapRes(res, HTTP_STATUS_CODE.UNAUTHORIZED, { error: 'User registration is not confirmed!' });
    }

    const authToken = await user.generateAuthToken();

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: user as Record<keyof IUser, IUser[keyof IUser]>,
      authToken,
    });
  } catch (exception) {
    return next(exception);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(changePassword) req.body:', req.body);

    if (!req.body || !req.body.password || !req.body.newPassword) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    }

    const isPasswordMatch = await req.user!.matchPassword(req.body.password);

    if (!isPasswordMatch) {
      return wrapRes(res, HTTP_STATUS_CODE.UNAUTHORIZED, { error: 'Invalid credentials!' });
    }

    req.user!.password = await hashPassword(req.body.newPassword);
    req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  logger.log('(resetPassword) req.body:', req.body);

  try {
    if (!req.body.email) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Email is empty or not attached!' });
    }

    const userToResetPassword = (await getFromDB(
      { modelName: COLLECTION_NAMES.User },
      {
        email: req.body.email,
      }
    )) as IUser;

    if (userToResetPassword) {
      await userToResetPassword.setSingleToken('resetPassword');

      return await sendResetPasswordEmail({
        email: userToResetPassword.email,
        token: userToResetPassword.tokens.resetPassword as string,
        res,
      });
    } else {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User not found!' });
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
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
    } else if (!req.body.email) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Email prop is empty or not attached!' });
    }

    const userToResendResetPassword = (await getFromDB(
      { modelName: COLLECTION_NAMES.User },
      {
        email: req.body.email,
        'tokens.resetPassword': { $exists: true },
      }
    )) as IUser;

    if (userToResendResetPassword) {
      await sendResetPasswordEmail({
        email: userToResendResetPassword.email,
        token: userToResendResetPassword.tokens.resetPassword as string,
        res,
      });
    } else {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User not found!' });
    }
  } catch (exception) {
    return next(exception);
  }
}

async function logOutUser(req: Request, res: Response, next: NextFunction) {
  try {
    req.user!.tokens.auth = (req.user!.tokens.auth as string[]).filter((token) => token !== req.token);

    if (req.user!.tokens.auth.length === 0) {
      req.user!.tokens.auth = undefined;
    }

    await req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { authToken: null });
  } catch (exception) {
    return next(exception);
  }
}

async function logOutUserFromSessions(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.preseveCurrentSession) {
      if ((req.user!.tokens.auth as string[]).length === 1) {
        return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, {
          error: 'Current session is the only one, so there is no other sessions to end!',
        });
      }

      req.user!.tokens.auth = (req.user!.tokens.auth as string[]).filter((authToken) => authToken === req.token);
    } else {
      req.user!.tokens.auth = undefined;
    }

    await req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { authToken: null });
  } catch (exception) {
    return next(exception);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('[GET] /:id', req.params.id);

    if (!req.params.id) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'User id is empty or not attached!' });
    }

    const user = await getFromDB(
      {
        modelName: COLLECTION_NAMES.User,
        population: 'accountType',
      },
      req.params.id
    );

    if (!user) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: `User not found!` });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: user as Record<string, unknown> });
  } catch (exception) {
    return next(exception);
  }
}

async function addProductToObserved(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(addProductToObserved) req.body:', req.body);

    if (!req.body || !req.body.productId) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Request body or `productId` param are empty or not attached!',
      });
    }

    const observationAdditionError = req.user!.addProductToObserved(req.body.productId);

    if (observationAdditionError) {
      return wrapRes(res, HTTP_STATUS_CODE.CONFLICT, { error: observationAdditionError });
    }

    await req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: req.user!.observedProductsIDs || ([] as unknown[]) });
  } catch (exception) {
    return next(exception);
  }
}

async function removeProductFromObserved(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(removeProductFromObserved) req.params:', req.params);

    if (!req.params || !req.params.productId) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
        error: 'Request params or `productId` param are empty or not attached!',
      });
    }

    const observationRemovalError = req.user!.removeProductFromObserved(req.params.productId);

    if (observationRemovalError) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: observationRemovalError });
    }

    await req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: req.user!.observedProductsIDs || ([] as unknown[]) });
  } catch (exception) {
    return next(exception);
  }
}

async function removeAllProductsFromObserved(req: Request, res: Response, next: NextFunction) {
  try {
    const observationsRemovalError = req.user!.removeAllProductsFromObserved();

    if (observationsRemovalError) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: observationsRemovalError });
    }

    await req.user!.save();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: req.user!.observedProductsIDs || ([] as unknown[]) });
  } catch (exception) {
    return next(exception);
  }
}

async function getObservedProducts(req: Request, res: Response & { _OMIT_HTTP?: boolean }, next: NextFunction) {
  try {
    if (!req.user!.observedProductsIDs) {
      const emptyObservedProductsResponse: unknown[] = [];

      if (res._OMIT_HTTP) {
        return emptyObservedProductsResponse;
      }

      return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: emptyObservedProductsResponse });
    }

    const observedProducts = await getFromDB(
      { modelName: COLLECTION_NAMES.Product },
      { _id: req.user!.observedProductsIDs }
    );

    if (res._OMIT_HTTP) {
      return observedProducts;
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: observedProducts as IProduct[] });
  } catch (exception) {
    return next(exception);
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(deleteUser) req.body:', req.body);

    if (typeof req.body !== 'object') {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body must be an object!' });
    } else if (!req.body.rawQuery) {
      return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request `rawQuery` must not be empty!' });
    }

    let query: string | RegExp = req.body.rawQuery;

    switch (req.body.queryType) {
      case 'string': {
        break;
      }
      case 'regex': {
        query = new RegExp(req.body.rawQuery);
        break;
      }
      default: {
        return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request `queryType` is invalid!' });
      }
    }

    const usersToDeleteFromRoles = await UserModel.find({ login: query }, { _id: 1 });

    if (!usersToDeleteFromRoles?.length) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: 'User to be deleted was not found!' });
    }

    const userIDsToDeleteFromRoles = (
      Array.isArray(usersToDeleteFromRoles) ? usersToDeleteFromRoles : [usersToDeleteFromRoles]
    ).map(({ _id }: { _id: IUserRole['owners'][number] }) => _id);

    const deletedUser = await deleteFromDB(COLLECTION_NAMES.User, query);
    logger.log('deletedUser?', deletedUser, ' /query:', query);

    await UserRoleModel.update(
      { owners: { $in: userIDsToDeleteFromRoles } },
      // TODO: [TS] fix typing
      // @ts-ignore
      { $pull: { owners: { $in: userIDsToDeleteFromRoles.map((_id) => _id.valueOf()) } } },
      { multi: true }
    );

    await UserRoleModel.find({ owners: { $in: userIDsToDeleteFromRoles } });

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}
