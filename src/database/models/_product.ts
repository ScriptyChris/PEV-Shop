/**
 * @module
 * @notExported
 */

import { Document, Types, Schema, model, COLLECTION_NAMES } from '@database/models/__core-and-commons';
import mongoosePaginate from 'mongoose-paginate-v2';
import getLogger from '@commons/logger';
import { possiblyReEncodeURI } from '@commons/uriReEncoder';

const logger = getLogger(module.filename);

const reviewsItemSchema = new Schema<IReviews['list'][number]>({
  content: String,
  timestamp: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const reviewsSchema = new Schema<IReviews>({
  list: {
    type: [reviewsItemSchema],
    required: true,
  },
  averageRating: {
    type: Number,
    required: true,
  },
});

const technicalSpecs = new Schema<IProduct['technicalSpecs']>({
  // TODO: restrict that to predefined (and extendable) values
  heading: String,
  data: {
    type: Schema.Types.Mixed,
    set(value: unknown) {
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

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    unique: true /* TODO: handle case when some product tries to be set with duplicated name */,
    required: true,
  },
  url: {
    type: String,
    required: true,
    set(uniformResourceName: string) {
      return possiblyReEncodeURI(uniformResourceName, true);
    },
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
    async validate(relatedProductsNames: string[]) {
      if (!Array.isArray(relatedProductsNames) || !relatedProductsNames.every((value) => typeof value === 'string')) {
        return false;
      }

      const matchedRelatedProductsNames: string[] = (
        await ProductModel.find({ name: { $in: relatedProductsNames } }).lean()
      ).map((product) => (product as IProduct).name);
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
        averageRating: 0,
      };
    },
  },
});
productSchema.pre('validate', function (next: () => void) {
  const product = this as IProduct;
  product.prepareUrlFieldBasedOnNameField();

  next();
});
productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  delete product.__v;

  return product;
};
productSchema.methods.prepareUrlFieldBasedOnNameField = function () {
  this.url = this.name.toLowerCase().replace(/\s/g, '-');
};

export const ProductModel = model<IProduct>(COLLECTION_NAMES.Product, productSchema);
export type TProductModel = typeof ProductModel;

export type TProductPublic = Pick<
  IProduct,
  'name' | 'url' | 'category' | 'price' | 'shortDescription' | 'technicalSpecs' | 'relatedProductsNames'
>;

export type TProductToPopulate = Exclude<IProduct, 'prepareUrlFieldBasedOnNameField'>;

/**
 * @internal
 */
export interface IReviews extends Types.Subdocument {
  list: Record<string, string | number>[];
  averageRating: number;
}

/**
 * @internal
 */
export interface IProduct extends Document {
  name: string;
  url: string;
  category: string;
  price: number;
  shortDescription: string[];
  technicalSpecs: {
    heading: string;
    defaultUnit: string;
    data: unknown;
  }[];
  images: Record<string, unknown>[];
  relatedProductsNames: Array<string>;
  reviews: IReviews;

  prepareUrlFieldBasedOnNameField(): void;
}
