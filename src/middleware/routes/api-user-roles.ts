import { Router, Request, Response, NextFunction } from 'express';
import getLogger from '@commons/logger';
import { authMiddlewareFn as authMiddleware } from '@middleware/features/auth';
import { saveToDB, getFromDB, updateOneModelInDB } from '@database/database-index';
import type { IUserRole } from '@database/models/_userRole';
import { HTTP_STATUS_CODE } from '@src/types';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';

type TMiddlewareFn = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;

const logger = getLogger(module.filename);
const router: Router &
  Partial<{
    // _saveUserRole: TMiddlewareFn;
    // _updateUserRole: TMiddlewareFn;
    _getUserRoles: TMiddlewareFn;
  }> = Router();

// TODO: [auth] only (future) admin should be able to save and modify user roles
// {
//   router.post('/api/user-roles', authMiddleware(getFromDB), saveUserRole);
//   router.patch('/api/user-roles', authMiddleware(getFromDB), updateUserRole);
// }
router.get('/api/user-roles', getUserRoles);
// TODO: [feature] add endpoint to get role of certain user
router.use(getMiddlewareErrorHandler(logger));

// expose functions for unit tests
// router._saveUserRole = saveUserRole;
// router._updateUserRole = updateUserRole;
router._getUserRoles = getUserRoles;

export default router;

// TODO: [DX] change name to `addUserRole`
// TODO: [TS] consider how to sync adding new role with `/_userRole.ts` type
// async function saveUserRole(req: Request, res: Response, next: NextFunction) {
//   try {
//     logger.log('(saveUserRole) /user-roles:', req.body);

//     if (!req.body) {
//       return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
//     } else if (!req.body.roleName) {
//       return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//         error: 'Param "roleName" is empty or not attached!',
//       });
//     } else if (req.body.owners) {
//       if (!Array.isArray(req.body.owners) || !req.body.owners.length) {
//         return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//           error: 'Param "owners" - if provided - should be a non empty array!',
//         });
//       }

//       //// TODO: [validation] check if there are users with IDs provided inside `.owners` prop
//       // const usersCount = .find({ login:  }).documentsCount();

//       // if (usersCount !== req.body.owners.length) {
//       //   return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//       //     error: 'Role owners were not found!',
//       //   });
//       // }
//     }

//     const userRole = {
//       roleName: req.body.roleName,
//       owners: req.body.owners ?? [],
//     };
//     logger.log('userRole: ', userRole);

//     const savedUserRole = (await saveToDB(userRole, 'UserRole')) as IUserRole;
//     await savedUserRole.save();

//     logger.log('savedUserRole:', savedUserRole);

//     return wrapRes(res, HTTP_STATUS_CODE.OK, {
//       payload: savedUserRole as Record<keyof IUserRole, IUserRole[keyof IUserRole]>,
//     });
//   } catch (exception) {
//     return next(exception);
//   }
// }

// async function updateUserRole(req: Request, res: Response, next: NextFunction) {
//   try {
//     logger.log('(updateUserRole) /user-roles:', req.body);

//     if (!req.body) {
//       return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, { error: 'Request body is empty or not attached!' });
//     } else if (!req.body.roleName) {
//       return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//         error: 'Param "roleName" is empty or not attached!',
//       });
//     } else if (!req.body.owners) {
//       if (!Array.isArray(req.body.owners) || !req.body.owners.length) {
//         return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//           error: 'Param "owners" - if provided - should be a non empty array!',
//         });
//       }

//       //// TODO: [validation] check if there are users with IDs provided inside `.owners` prop
//       // const usersCount = .find({ login:  }).documentsCount();

//       // if (usersCount !== req.body.owners.length) {
//       //   return wrapRes(res, HTTP_STATUS_CODE.BAD_REQUEST, {
//       //     error: 'Role owners were not found!',
//       //   });
//       // }
//     }

//     const updatedUserRole = await updateOneModelInDB({ roleName: req.body.roleName }, req.body.permissions, 'UserRole');
//     logger.log('updatedUserRole:', updatedUserRole);

//     if (!updatedUserRole) {
//       return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, {
//         error: `Role '${req.body.roleName}' could not be updated, because was not found!`,
//       });
//     }

//     return wrapRes(res, HTTP_STATUS_CODE.OK, {
//       payload: updatedUserRole as Record<keyof IUserRole, IUserRole[keyof IUserRole]>,
//     });
//   } catch (exception) {
//     return next(exception);
//   }
// }

async function getUserRoles(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('(getUserRoles)');

    const userRoles: IUserRole = await getFromDB({}, 'UserRole', {}, { roleName: true });

    if (!userRoles) {
      return wrapRes(res, HTTP_STATUS_CODE.NOT_FOUND, { error: `User roles not found!` });
    }

    return wrapRes(res, HTTP_STATUS_CODE.OK, {
      payload: Object.values(userRoles).map(({ roleName }) => roleName),
    });
  } catch (exception) {
    return next(exception);
  }
}
