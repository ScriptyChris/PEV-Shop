const { model } = require('mongoose');
const userRoleSchema = require('../schemas/userRole');

module.exports = model('User-Role', userRoleSchema);
