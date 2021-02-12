import { Router, Request, Response } from 'express';
import getLogger from  '../../../utils/logger';
import { authMiddlewareFn as authMiddleware } from '../features/auth';
import { saveToDB, getFromDB, updateOneModelInDB } from '../../database/database-index';
import { IUserRole } from '../../database/schemas/userRole';


const logger = getLogger(module.filename);

const router: Router & Partial<{
  _saveUserRole: TSaveUserRole, _updateUserRole: TUpdateUserRole, _getUserRole: TGetUserRole
}> = Router();
// @ts-ignore
router.post('/api/user-roles', authMiddleware(getFromDB), saveUserRole);
// @ts-ignore
router.patch('/api/user-roles', authMiddleware(getFromDB), updateUserRole);
// @ts-ignore
router.get('/api/user-roles/:roleName', authMiddleware(getFromDB), getUserRole);

type TSaveUserRole = (req: Request, res: Response) => Promise<void>;
type TUpdateUserRole = (req: Request, res: Response) => Promise<void>;
type TGetUserRole = (req: Request, res: Response) => Promise<void>;

// expose functions for unit tests
router._saveUserRole = saveUserRole;
router._updateUserRole = updateUserRole;
router._getUserRole = getUserRole;

export default router;

async function saveUserRole(req: Request, res: Response): Promise<void> {
  logger.log('[POST] /user-roles:', req.body);

  const userRole = {
    roleName: req.body.roleName,
    permissions: req.body.permissions,
  };
  logger.log('userRole: ', userRole);

  const savedUserRole = await saveToDB(userRole, 'User-Role') as IUserRole;
  await savedUserRole.save();

  logger.log('savedUserRole:', savedUserRole);

  res.status(200).json({ payload: savedUserRole });
}

async function updateUserRole(req: Request, res: Response): Promise<void> {
  logger.log('[PATCH] /user-roles:', req.body);

  const updatedUserRole = await updateOneModelInDB({ roleName: req.body.roleName }, req.body.permissions, 'User-Role');
  logger.log('updatedUserRole:', updatedUserRole);

  res.status(200).json({ payload: updatedUserRole });
}

async function getUserRole(req: Request, res: Response): Promise<void> {
  logger.log('[GET] /user-roles:', req.params);

  const userRole = await getFromDB({ roleName: req.params.roleName }, 'User-Role') as IUserRole;
  await userRole.populate('owners').execPopulate();

  res.status(200).json({ payload: userRole });
}
