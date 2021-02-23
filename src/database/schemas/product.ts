import * as mongooseModule from 'mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

// @ts-ignore
const { default: { Schema } } = mongooseModule

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

// @ts-ignore
productSchema.plugin(mongoosePaginate.default);

productSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.__v;

  return user;
};

export interface IReviews extends Document {
  summary: string,
  list: []
}

export interface IProduct extends Document {
  name: string,
  url: string,
  category: string,
  price: number,
  shortDescription: string[],
  technicalSpecs: Object[],
  images: Object[],
  relatedProducts: Object[],
  reviews: IReviews
}

export default productSchema;
