// Customize static methods and Jest will automatically mock remaining stuff
export const ProductModel = {
  createImageRelocator: jest.fn(() => {
    return {
      imagesUploadTmpDirPath: 'some tmp path',
      addTmpImagePath: jest.fn(),
      removeTmpImages: jest.fn(),
      moveValidImagesToTargetLocation: jest.fn(),
    };
  }),
  validateImages: jest.fn(() => ({
    imagesValidationError: null,
    images: [],
  })),
  sortImageNames: jest.fn(() => []),
  removeImages: jest.fn(),
};
