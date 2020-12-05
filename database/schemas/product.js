const { Schema } = require('mongoose');

const reviewsSchema = new Schema({
  summary: {
    type: Object,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});

module.exports = new Schema({
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
