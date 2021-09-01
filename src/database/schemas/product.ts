import * as mongooseModule from 'mongoose';
import { Document, SchemaType } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const {
  // @ts-ignore
  default: { Schema },
} = mongooseModule;

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

const technicalSpecs = new Schema({
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
    type: [technicalSpecs],
    required: true,
    set(technicalSpecsValue: any) {
      const entries: Array<[string, { value: any; defaultUnit?: string }]> = Object.entries(technicalSpecsValue);
      const output = entries.map(([key, data]) => {
        const obj: { heading: string; data: typeof data; defaultUnit?: string } = {
          heading: key,
          data: data.value,
        };

        if (data.defaultUnit) {
          obj.defaultUnit = data.defaultUnit;
        }

        return obj;
      });

      return output;
    },
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
  relatedProducts: Record<string, unknown>[];
  reviews: IReviews;
}

export default productSchema;
