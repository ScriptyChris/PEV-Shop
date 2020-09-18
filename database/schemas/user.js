const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TODO: move to ENV
const SECRET_KEY = 'secret-key';
const userCredentialsError = new Error('Unable to login');

const userSchema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, SECRET_KEY);

  user.tokens.push({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.tokens;
  delete user.password;

  return user;
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// TODO: remove if unused
userSchema.statics.findByCredentials = async (userModel, nick, password) => {
  const user = userModel.findOne({ nick });

  if (!user) {
    throw userCredentialsError;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw userCredentialsError;
  }

  return user;
};

module.exports = userSchema;
