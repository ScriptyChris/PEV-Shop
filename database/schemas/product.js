const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
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
    type: [Object],
    required: false,
  },
  reviews: {
    type: reviewsSchema,
    required: false,
  },
});

productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.__v;

  return user;
};

module.exports = productSchema;
