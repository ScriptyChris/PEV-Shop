const { Router } = require('express');
const { authMiddlewareFn: authMiddleware } = require('../features/auth');
const { saveToDB, getFromDB, updateOneModelInDB } = require('../../database/index');

const router = Router();

router.post('/api/user-roles', authMiddleware(getFromDB), async (req, res) => {
  console.log('[POST] /user-roles:', req.body);

  const userRole = {
    roleName: req.body.roleName,
    permissions: req.body.permissions,
  };
  console.log('userRole: ', userRole);

  const savedUserRole = await saveToDB(userRole, 'User-Role');
  savedUserRole.save();

  console.log('savedUserRole:', savedUserRole);

  res.status(200).json({ payload: savedUserRole });
});

router.patch('/api/user-roles', authMiddleware(getFromDB), async (req, res) => {
  console.log('[PATCH] /user-roles:', req.body);

  const updatedUserRole = await updateOneModelInDB({ roleName: req.body.roleName }, req.body.permissions, 'User-Role');
  console.log('updatedUserRole:', updatedUserRole);

  res.status(200).json({ payload: updatedUserRole });
});

router.get('/api/user-roles/:roleName', authMiddleware(getFromDB), async (req, res) => {
  console.log('[GET] /user-roles:', req.params);

  const userRole = await getFromDB({ roleName: req.params.roleName }, 'User-Role');
  await userRole.execPopulate('owners');

  res.status(200).json({ payload: userRole });
});

module.exports = router;
