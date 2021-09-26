import { model } from 'mongoose';
import * as mongooseModule from 'mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import getLogger from '../../../utils/logger';

const logger = getLogger(module.filename);

const {
  // @ts-ignore
  default: { Schema },
} = mongooseModule;

const reviewsSchema: mongooseModule.Schema = new Schema({
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

const technicalSpecs: mongooseModule.Schema = new Schema({
  // TODO: restrict that to predefined (and extendable) values
  heading: String,
  data: {
    type: Schema.Types.Mixed,
    set(value: any) {
      // TODO: make it dependable on heading value
      const stringValueAsNumber = typeof value === 'string' ? Number(value) : value;

      if (!Number.isNaN(stringValueAsNumber)) {
        value = stringValueAsNumber;
      }

      return value;
    },
  },
  // TODO: restrict that to predefined (and extendable) values
  defaultUnit: String,
  iconSrc: String,
  specFromImage: String,
});

const productSchema: mongooseModule.Schema = new Schema({
  name: {
    type: String,
    unique: true /* TODO: handle case when some product tries to be set with duplicated name */,
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
    type: [technicalSpecs],
    required: true,
  },
  images: {
    // TODO: include different kinds, like Main and Others
    type: [Object],
    required: true,
  },
  relatedProductsNames: {
    type: [String],
    required: false,
    async validate(relatedProductsNames: Array<string>) {
      if (!Array.isArray(relatedProductsNames) || !relatedProductsNames.every((value) => typeof value === 'string')) {
        return false;
      }

      const matchedRelatedProductsNames = (await ProductModel.find({ name: { $in: relatedProductsNames } }).lean()).map(
        (product) => (product as IProduct).name
      );
      const foundAllMatchedProductsNames = relatedProductsNames.length === matchedRelatedProductsNames.length;

      if (!foundAllMatchedProductsNames) {
        logger.error(
          'Unable to find all related products during validation! Missing:',
          relatedProductsNames.filter((relatedProductName) => !matchedRelatedProductsNames.includes(relatedProductName))
        );
      }

      return foundAllMatchedProductsNames;
    },
  },
  reviews: {
    type: reviewsSchema,
    required: false,
    default() {
      return {
        list: [],
        summary: {
          summary: '',
          reviewsAmount: 0,
        },
      };
    },
  },
});
productSchema.pre('validate', function (next: () => void) {
  // @ts-ignore: implicit this
  const document = (this as unknown) as Document & Schema.methods;
  document.prepareUrlFieldBasedOnNameField();

  next();
});

// @ts-ignore
productSchema.plugin(mongoosePaginate.default);

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  delete product.__v;

  return product;
};
productSchema.methods.prepareUrlFieldBasedOnNameField = function () {
  this.url = this.name.toLowerCase().replace(/\s/g, '-');
};

const ProductModel = model<IProduct>('Product', productSchema);

export interface IReviews extends Document {
  summary: string;
  list: [];
}

export interface IProduct extends Document {
  name: string;
  url: string;
  category: string;
  price: number;
  shortDescription: string[];
  technicalSpecs: Record<string, unknown>[];
  images: Record<string, unknown>[];
  relatedProductsNames: Array<string>;
  reviews: IReviews;
}

export default ProductModel;
