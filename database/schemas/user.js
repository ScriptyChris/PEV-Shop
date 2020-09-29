const { Schema } = require('mongoose');
const auth = require('../../middleware/features/auth');

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
  const token = auth.getToken({ _id: user._id });

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

userSchema.methods.matchPassword = function (password) {
  return auth.comparePasswords(password, this.password);
};

// TODO: remove if unused
userSchema.statics.findByCredentials = async (userModel, nick, password) => {
  const user = userModel.findOne({ nick });

  if (!user) {
    throw userCredentialsError;
  }

  const isPasswordMatch = await auth.comparePasswords(password, user.password);

  if (!isPasswordMatch) {
    throw userCredentialsError;
  }

  return user;
};

module.exports = userSchema;
