const { Schema } = require('mongoose');

const reviewsSchema = new Schema({
  summary: {
    type: {
      rating: {
        type: Number,
        default: 0,
      },
      reviewsAmount: {
        type: String,
        default: '',
      },
    },
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // TODO: consider if it's needed
  // isAccessory: {
  //   type: Boolean,
  //   required: true
  // },
  price: {
    type: Number,
    required: true,
  },
  shortDescription: {
    type: [String],
    required: true,
  },
  technicalSpecs: {
    type: [Object],
    required: true,
  },
  images: {
    // TODO: include different kinds, like Main and Others
    type: [Object],
    required: true,
  },
  relatedProducts: {
    // TODO: consider more specific typing (to include name, url and price)
    type: Object,
    required: false,
  },
  reviews: {
    type: reviewsSchema,
    required: false,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.__v;

  return user;
};

module.exports = userSchema;
