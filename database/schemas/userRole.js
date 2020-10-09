const { Schema } = require('mongoose');

const userRoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = userRoleSchema;
