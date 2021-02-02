const logger = require('../../../utils/logger')(module.filename);
const { Router } = require('express');
const { authMiddlewareFn: authMiddleware } = require('../features/auth');
const { saveToDB, getFromDB, updateOneModelInDB } = require('../../database/database-index');

const router = Router();
router.post('/api/user-roles', authMiddleware(getFromDB), saveUserRole);
router.patch('/api/user-roles', authMiddleware(getFromDB), updateUserRole);
router.get('/api/user-roles/:roleName', authMiddleware(getFromDB), getUserRole);

// expose functions for unit tests
router._saveUserRole = saveUserRole;
router._updateUserRole = updateUserRole;
router._getUserRole = getUserRole;

module.exports = router;

async function saveUserRole(req, res) {
  logger.log('[POST] /user-roles:', req.body);

  const userRole = {
    roleName: req.body.roleName,
    permissions: req.body.permissions,
  };
  logger.log('userRole: ', userRole);

  const savedUserRole = await saveToDB(userRole, 'User-Role');
  savedUserRole.save();

  logger.log('savedUserRole:', savedUserRole);

  res.status(200).json({ payload: savedUserRole });
}

async function updateUserRole(req, res) {
  logger.log('[PATCH] /user-roles:', req.body);

  const updatedUserRole = await updateOneModelInDB({ roleName: req.body.roleName }, req.body.permissions, 'User-Role');
  logger.log('updatedUserRole:', updatedUserRole);

  res.status(200).json({ payload: updatedUserRole });
}

async function getUserRole(req, res) {
  logger.log('[GET] /user-roles:', req.params);

  const userRole = await getFromDB({ roleName: req.params.roleName }, 'User-Role');
  await userRole.execPopulate('owners');

  res.status(200).json({ payload: userRole });
}
