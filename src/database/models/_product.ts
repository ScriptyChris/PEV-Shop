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
import { MAX_IMAGES_AMOUNT, IMAGES_ROOT_PATH } from '@commons/consts';
import { imageSizeValidator } from '@commons/validators';
import { TFile, PersistentFile, TFiles } from '@middleware/helpers/form-data-handler';

const logger = getLogger(module.filename);

const projectRoot = resolve(__dirname, process.env.INIT_CWD || '');
const imagesUploadDirPath = join(projectRoot, IMAGES_ROOT_PATH);
const imagesUploadTmpDirPath = join(projectRoot, `${IMAGES_ROOT_PATH}/__form-parsing-tmp`);
const createProductImagesTargetDirPath = (productUrl: IProduct['url']) => {
  return join(imagesUploadDirPath, productUrl);
};
const replaceSpacesWithDashes = (value: string) => value.toLowerCase().replace(/\s/g, '-');

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
    // TODO: switch it to `true` when all products will have their images provided
    required: false,
    set(value: any) {
      return (value || []).map((file: TFile) =>
        file instanceof PersistentFile
          ? {
              src: join(IMAGES_ROOT_PATH, file.newFilename),
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
      };
    },
  },
});
productSchema.pre('validate', function (next: () => void) {
  const product = this as IProduct;
  product.prepareUrlFieldBasedOnNameField();
  product.transformImagesToImagePaths();

  next();
});
productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  delete product.__v;

  return product;
};
productSchema.methods.prepareUrlFieldBasedOnNameField = function () {
  this.url = replaceSpacesWithDashes(this.name);
};
productSchema.methods.transformImagesToImagePaths = function () {
  this.images = this.images.map((file) => ({
    src: join(file.src, '..', this.url, parse(file.src).base),
    name: file.name,
  }));
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
productSchema.statics.removeImages = (productName: IProduct['name']) => {
  const productImagesDirName = replaceSpacesWithDashes(productName);
  const targetDirPath = createProductImagesTargetDirPath(productImagesDirName);

  rmSync(targetDirPath, { recursive: true });
};

export const ProductModel = model<IProduct, IProductModel>(COLLECTION_NAMES.Product, productSchema);
export type TProductModel = typeof ProductModel;

export type TProductPublic = Pick<
  IProduct,
  'name' | 'url' | 'category' | 'price' | 'shortDescription' | 'technicalSpecs' | 'images' | 'relatedProductsNames'
>;

export type TProductToPopulate = Exclude<IProduct, 'prepareUrlFieldBasedOnNameField' | 'transformImagesToImagePaths'>;

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
  removeImages(productName: IProduct['name']): void;
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

  prepareUrlFieldBasedOnNameField(): void;
  transformImagesToImagePaths(): void;
}
