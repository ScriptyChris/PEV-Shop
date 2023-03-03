/**
 * @module
 * @notExported
 */

import { renameSync, mkdirSync, rmSync } from 'fs';
import { resolve, join, parse } from 'path';
import { Document, Types, Schema, Model, model, COLLECTION_NAMES } from '@database/models/__core-and-commons';
import mongoosePaginate from 'mongoose-paginate-v2';
import getLogger from '@commons/logger';
import { possiblyReEncodeURI } from '@commons/uriReEncoder';
import {
  MAX_IMAGES_AMOUNT,
  IMAGES__PRODUCTS_ROOT_PATH,
  IMAGES__PRODUCTS_TMP_FOLDER,
  MIN_PRODUCT_UNITS,
  MAX_PRODUCT_UNITS,
} from '@commons/consts';
import { imageSizeValidator } from '@commons/validators';
import { TFile, PersistentFile, TFiles } from '@middleware/helpers/form-data-handler';

const logger = getLogger(module.filename);

const projectRoot = resolve(__dirname, process.env.INIT_CWD || '');
const imagesUploadDirPath = join(projectRoot, IMAGES__PRODUCTS_ROOT_PATH);
const imagesUploadTmpDirPath = join(projectRoot, `${IMAGES__PRODUCTS_ROOT_PATH}/${IMAGES__PRODUCTS_TMP_FOLDER}`);
const createProductImagesTargetDirPath = (productUrl: IProduct['url']) => {
  return join(imagesUploadDirPath, productUrl);
};
const replaceSpacesWithDashes = (value: string) => value.toLowerCase().replace(/\s/g, '-');
const prepareReviewsOutput = (reviews: TReviews) => {
  // this may happen when product is retrieved with projection, which picks only certain fields
  if (!reviews) {
    return undefined;
  }

  return {
    ...reviews,
    list: reviews.list.map((reviewItem) => ({
      ...reviewItem,
      author: reviewItem.isAuthorAnonymous ? '' : reviewItem.author,
      isAuthorAnonymous: undefined,
      _id: undefined,
    })),
    _id: undefined,
  };
};
const calculateRatingScore = (averageRating: IReviews['averageRating'], numberOfRating: IReviews['list']['length']) => {
  const RATING_TO_SCORE = Object.freeze({
    5: 4,
    4: 3,
    3: 1,
    2: 1,
    1: 1,
    0: 1,
  });
  const flooredRating = Math.floor(averageRating) as keyof typeof RATING_TO_SCORE;

  return averageRating * numberOfRating * RATING_TO_SCORE[flooredRating];
};

const reviewsItemSchema = new Schema<IReviewItem>({
  content: String,
  timestamp: {
    type: Number,
    required: true,
  },
  // TODO: refactor to populating via ObjectID
  author: {
    type: String,
    required: true,
  },
  isAuthorAnonymous: {
    type: Boolean,
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
    set(value: number) {
      const that = this as IReviews;
      /*
        TODO: [db] find better way to calculate `ratingScore` and make it noticable by Mongoose sorting mechanism.
        Virtual field is not picked up during sorting. Getter doesn't seem to be picked either (despite it gets called).
      */
      that.ratingScore = calculateRatingScore(value, that.list.length);

      return value;
    },
  },
  ratingScore: {
    type: Number,
    required: false,
    default: 0,
  },
});
reviewsSchema.methods.toJSON = function () {
  return prepareReviewsOutput(this.toObject() as TReviews);
};

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
    // TODO: [validation] forbid setting name conflicting with any regarding route inside `@frontend/components/pages/_routes.ts`.
    validate(name: string) {
      return name.length > 0;
    },
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
    validate(category: string) {
      return category.length > 0;
    },
  },
  // TODO: consider if it's needed
  // isAccessory: {
  //   type: Boolean,
  //   required: true
  // },
  price: {
    type: Number,
    required: true,
    validate(price: number) {
      return price >= 0;
    },
  },
  shortDescription: {
    type: [String],
    required: true,
    validate(shortDescriptionsList: string[]) {
      return shortDescriptionsList.length > 0 && shortDescriptionsList.every((shortDesc) => shortDesc.length);
    },
  },
  technicalSpecs: {
    type: [technicalSpecs],
    required: true,
    validate(technicalSpecs: string[]) {
      return technicalSpecs.every((specObj) => specObj && typeof specObj === 'object' && Object.values(specObj).length);
    },
  },
  images: {
    type: [Object],
    required: true,
    set(value: any) {
      return (value || []).map((file: TFile) =>
        file instanceof PersistentFile
          ? {
              src: file.newFilename,
              name: parse(file.newFilename).name,
            }
          : file
      );
    },
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
        ratingScore: 0,
      };
    },
  },
  availability: {
    type: Number,
    required: true,
    validate(value: number) {
      return value >= MIN_PRODUCT_UNITS && value <= MAX_PRODUCT_UNITS;
    },
  },
  orderedUnits: {
    type: Number,
    default: 0,
    validate(value: number) {
      return value >= 0;
    },
  },
  createdAt: {
    type: Number,
    default: Date.now(),
    immutable: true,
  },
});
productSchema.pre('validate', function (next: () => void) {
  const product = this as IProduct;
  product.prepareUrlField();
  product.transformImagesToImagePaths();

  next();
});
productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  delete product.__v;

  return {
    ...product,
    reviews: prepareReviewsOutput(product.reviews),
  };
};
productSchema.methods.prepareUrlField = function () {
  const alreadyExistingURLWithoutSpaces = this.url && !/\s/.test(this.url);
  this.url = alreadyExistingURLWithoutSpaces ? this.url : replaceSpacesWithDashes(this.name);
};
productSchema.methods.transformImagesToImagePaths = function () {
  const IMAGES_KIND_FOLDER_NAME = 'products';

  // TODO: find a better way to fix overwriting images when it's not actually desired behavior (like on every other product's save/update action)
  if (this.images.every((file) => file?.src?.startsWith(IMAGES_KIND_FOLDER_NAME))) {
    return;
  }

  this.images = this.images.map((file) => {
    if (typeof file === 'string') {
      return {
        src: join(IMAGES_KIND_FOLDER_NAME, this.url, file),
        name: parse(file).name,
      };
    }

    return {
      src: join(IMAGES_KIND_FOLDER_NAME, file.src, '..', this.url, parse(file.src).base),
      name: file.name,
    };
  });
};
productSchema.methods.validateReviewDuplicatedAuthor = function (reviewAuthor) {
  return this.reviews.list.some(({ author }) => reviewAuthor === author);
};
productSchema.methods.addReview = function (newReviewEntry, reviewAuthor) {
  this.reviews.list.push({
    content: newReviewEntry.content,
    timestamp: Date.now(),
    author: reviewAuthor,
    isAuthorAnonymous: newReviewEntry.isAuthorAnonymous,
    rating: newReviewEntry.rating,
  });
  this.reviews.averageRating = Number(
    (this.reviews.list.reduce((sum, { rating }) => sum + rating, 0) / this.reviews.list.length).toFixed(1)
  );
};

productSchema.statics.validateImages = (files: TFiles) => {
  const filesValues = Object.values(files);
  let imagesValidationError = '';

  if (!Array.isArray(filesValues) || filesValues?.length === 0) {
    imagesValidationError = 'Images has to be a non empty array!';
  } else if (filesValues.length > MAX_IMAGES_AMOUNT) {
    imagesValidationError = `Images array's length has to be less than or equal ${MAX_IMAGES_AMOUNT}!`;
  } else if (filesValues.some((image) => !image || typeof image !== 'object')) {
    imagesValidationError = `Images array has to contain object!`;
  }

  if (imagesValidationError) {
    return { imagesValidationError };
  }

  const imageNames: TFile['originalFilename'][] = [];

  for (const [imageName, imageFile] of Object.entries(files)) {
    if (Array.isArray(imageFile)) {
      imagesValidationError = `Image should not be an array!`;
      break;
    }

    if (!/\d+$/.test(imageName)) {
      imagesValidationError = `Image prop keys should end with a digit!`;
      break;
    }

    if (!imageFile || !(imageFile instanceof PersistentFile)) {
      imagesValidationError = `Image should be an instance of File!`;
      break;
    }

    const expectedMimeType = 'image/';
    if (!imageFile.mimetype?.startsWith(expectedMimeType)) {
      imagesValidationError = `Image's "${imageFile.originalFilename}" file type must start with "${expectedMimeType}"!`;
      break;
    }

    const { isValidSize, maxImgSizeInMB } = imageSizeValidator(imageFile.size);
    if (!isValidSize) {
      imagesValidationError = `Image's "${imageFile.originalFilename}" file size exceeds ${maxImgSizeInMB}MB limit!`;
      break;
    }

    if (!imageFile.originalFilename) {
      imagesValidationError = `Image's "${imageFile.originalFilename}" file name is empty!`;
      break;
    }

    if (imageNames.includes(imageFile.originalFilename)) {
      imagesValidationError = `Image's "${imageFile.originalFilename}" file is duplicated!`;
      break;
    }

    imageNames.push(imageFile.originalFilename);
  }

  return {
    imagesValidationError,
    images: files as TSimpleFiles,
  };
};
productSchema.statics.sortImageNames = (imageFileEntries: TSimpleFiles) => {
  const getNumber = (value: string) => Number(value.match(/\d+/));
  return Object.entries(imageFileEntries)
    .sort(([prevName], [nextName]) => getNumber(prevName) - getNumber(nextName))
    .flatMap(([, imageFile]) => imageFile);
};
productSchema.statics.createImageRelocator = () => {
  const tmpImagePaths: { path: string; order: number }[] = [];

  return {
    imagesUploadTmpDirPath,
    addTmpImagePath: (imageNameAndExt: string, partName: string) => {
      const imageTmpPath = join(imagesUploadTmpDirPath, imageNameAndExt);
      tmpImagePaths.push({ path: imageTmpPath, order: Number(partName.match(/\d+/)) });
    },
    removeTmpImages: () => {
      tmpImagePaths.forEach(({ path }) => rmSync(path, { force: true }));
    },
    moveValidImagesToTargetLocation: (imageTargetDirName: IProduct['url'], shouldCreateTargetDir = false) => {
      const targetDirPath = createProductImagesTargetDirPath(imageTargetDirName);

      if (shouldCreateTargetDir) {
        mkdirSync(targetDirPath);
      }

      tmpImagePaths
        // Ensure order is according to the one received inside <form>.
        .sort(({ order: prev }, { order: next }) => prev - next)
        .forEach(({ path: tmpImagePath }) => {
          const { base } = parse(tmpImagePath);
          const targetPath = join(targetDirPath, base);

          // Move images - automatically saved to temporary folder by `formidable` - to their target folder.
          renameSync(tmpImagePath, targetPath);
        });
    },
  };
};
productSchema.statics.removeImages = (productUrl: IProduct['url']) => {
  const targetDirPath = createProductImagesTargetDirPath(productUrl);

  rmSync(targetDirPath, { recursive: true });
};

export const ProductModel = model<IProduct, IProductModel>(COLLECTION_NAMES.Product, productSchema);
export type TProductModel = typeof ProductModel;

export type TProductPublic = Pick<
  IProduct,
  'name' | 'url' | 'category' | 'price' | 'shortDescription' | 'technicalSpecs' | 'images' | 'relatedProductsNames'
>;

export type TProductToPopulate = Exclude<IProduct, 'prepareUrlField' | 'transformImagesToImagePaths'>;

/**
 * @internal
 */
type TReviewItem = {
  content: string;
  timestamp: number;
  author: string;
  isAuthorAnonymous: boolean;
  rating: number;
};

/**
 * @internal
 */
interface IReviewItem extends TReviewItem, Types.Subdocument {}

/**
 * @internal
 */
type TReviews = {
  list: TReviewItem[];
  averageRating: number;
  ratingScore: number;
};

/**
 * @internal
 */
export interface IReviews extends TReviews, Types.Subdocument {}

/**
 * @internal
 */
type TSimpleFiles = {
  [K in keyof TFiles]: Exclude<TFiles[K], readonly TFiles[K][]>;
};

/**
 * @internal
 */
interface IProductModel extends Model<IProduct> {
  validateImages(files: TFiles): {
    imagesValidationError: string;
    images: TSimpleFiles;
  };
  sortImageNames(imageFileEntries: TSimpleFiles): TFile[];
  createImageRelocator(): {
    imagesUploadTmpDirPath: string;
    addTmpImagePath: (imagePath: string, partName: string) => void;
    removeTmpImages: () => void;
    moveValidImagesToTargetLocation: (imageTargetDirName: IProduct['url'], shouldCreateTargetDir?: boolean) => void;
  };
  removeImages(productUrl: IProduct['url']): void;
}

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
  images: { src: string; name: string }[];
  relatedProductsNames: string[];
  reviews: IReviews;
  availability: number;
  orderedUnits: number;
  createdAt: number;

  prepareUrlField(): void;
  transformImagesToImagePaths(): void;
  validateReviewDuplicatedAuthor(
    reviewAuthor: string /* TOOD: type should be taken from `_user.ts` somehow */
  ): boolean;
  addReview(newReviewEntry: IReviewItem, reviewAuthor: string): void;
}
