const { Schema } = require('mongoose');

// const userRoleOwnerSchema = new Schema({
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
// });

const userRoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
    // TODO: use validation in all other database Schemas
    validate: (value) => {
      console.log('perm value', value);
      return Array.isArray(value) && value.length > 0;
    },
  },
  owners: {
    // type: userRoleOwnerSchema,
    type: Map,
    of: Schema.Types.ObjectId,
    ref: 'User',
  },
});

userRoleSchema.methods.toJSON = function () {
  const userRole = this.toObject();

  delete userRole._id;
  delete userRole.__v;

  if (userRole.owners.login) {
    userRole.owners = userRole.owners.login;
  }

  return userRole;
};

module.exports = userRoleSchema;
