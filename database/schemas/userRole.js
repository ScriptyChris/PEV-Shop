const { Schema } = require('mongoose');

const userRoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
    // TODO: use validation in all other database Schemas
    validate: (value) => Array.isArray(value) && value.length > 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

userRoleSchema.methods.toJSON = function () {
  const userRole = this.toObject();

  delete userRole._id;
  delete userRole.__v;

  userRole.owner = userRole.owner.login;

  return userRole;
};

module.exports = userRoleSchema;
