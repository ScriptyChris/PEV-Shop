import '@frontend/assets/styles/views/productForm.scss';

import React, { useEffect, useState, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import SaveIcon from '@material-ui/icons/SaveOutlined';

import {
  PEVForm,
  PEVButton,
  PEVIconButton,
  PEVHeading,
  PEVParagraph,
  PEVTextField,
  PEVFieldset,
  PEVLegend,
  PEVFormFieldError,
  PEVImage,
} from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import productSpecsService from '@frontend/features/productSpecsService';
import { CategoriesTreeFormField } from '@frontend/components/views/categoriesTree';
import { SearchSingleProductByName } from '@frontend/components/views/search';
import FlexibleList from '@frontend/components/utils/flexibleList';
import { routeHelpers, ROUTES } from '@frontend/components/pages/_routes';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { imageSizeValidator } from '@commons/validators';
import { ARRAY_FORMAT_SEPARATOR, MAX_IMAGES_AMOUNT, MIN_PRODUCT_UNITS, MAX_PRODUCT_UNITS } from '@commons/consts';

const translations = {
  getIntro(isProductUpdate) {
    return isProductUpdate ? 'Update product details' : 'Fill new product details';
  },
  baseInformation: 'Basic information',
  technicalSpecs: 'Technical specification',
  images: 'Images',
  getUploadImageHint(isMobileLayout) {
    if (isMobileLayout) {
      return 'Add a new image by clicking the button.';
    }

    return 'Add a new image by clicking the button or drag and drop it inside this field.';
  },
  uploadImageDisabledModificationHint: 'Images modification feature is currently not implemented.',
  uploadImageBtn: 'Add image',
  uploadedImagesAmount: 'Added images',
  getUploadedImageAlt(imageNumber) {
    return `Uploaded image number ${imageNumber}`;
  },
  getRemoveImage(imageNumber) {
    return `Remove image ${imageNumber}`;
  },
  getImageWithDuplicatedNameError(imgName) {
    return `Image with name "${imgName}" is already added! Please add a different image.`;
  },
  getMaxImageSizeExceededError(currentImgSizeInMB, maxImgSizeInMB) {
    currentImgSizeInMB = currentImgSizeInMB.toFixed(1);

    return `Maximum allowed image size is ${maxImgSizeInMB}MB! Your image has ${currentImgSizeInMB}MB.`;
  },
  reachedMaxImagesAmount:
    'All image slots filled. You can replace any image by first removing it and then adding some other one.',
  notAnImageTypeError: 'Only image files are allowed!',
  categoryChooser: 'Category',
  chooseCategoryFirst: 'A category needs to be chosen first...',
  name: 'Name',
  price: 'Price',
  availability: 'Available units',
  addNewSpec: 'Add new spec',
  confirm: 'Confirm',
  cancel: 'Cancel',
  addProduct: 'Add product',
  updateProduct: 'Update product',
  relatedProductsNames: 'Related products names',
  relatedProductName: 'Product name',
  shortDescription: 'Short description',
  duplicatedDescription: 'Description item must be unique!',
  lackOfData: 'No data!',
  emptyCategoryError: 'Category must be selected!',
  emptyImagesError: 'At least one image must be added!',
  colourIsNotTextError: 'Colour value must be a text!',
  modificationError: 'Cannot modify, because no changes were made!',
  additionSuccess: 'Product added!',
  modificationSuccess: 'Product modified!',
  formSubmissionError: 'Form submission failed :(',
  navigateToProduct: 'See product',
  modifyProductAgain: 'Modify product again',
  addAnotherProduct: 'Add another product',
};

const FIELD_TYPE_MAP = Object.freeze({
  NUMBER: 'number',
  /* TODO: make colour field as input[type="color"] to let convenient color picking
   * a kind of HEX to approx. human readable color name converter should also be provided
   */
  CHOICE: 'text',
});
const SPEC_NAMES_SEPARATORS = Object.freeze({
  GAP: '_',
  LEVEL: '__',
  SPACE: ' ',
});
const FIELD_NAME_PREFIXES = Object.freeze({
  TECHNICAL_SPECS: `technicalSpecs${SPEC_NAMES_SEPARATORS.LEVEL}`,
});
const swapSpaceForGap = (text) => text.replace(/\s/g, SPEC_NAMES_SEPARATORS.GAP);

function BaseInfo({ data: { initialData = {}, isProductModification } }) {
  return (
    <PEVFieldset className="pev-flex pev-flex--columned">
      <PEVLegend>{translations.baseInformation}</PEVLegend>

      <div className="product-form__base-info-group pev-flex">
        <PEVTextField
          name="name"
          identity="newProductName"
          label={translations.name}
          inputProps={{
            'data-cy': 'input:base__name',
          }}
          InputProps={{
            // TODO: let modifying `name` when backend will match product by `_id` instead of `name`
            readOnly: isProductModification,
          }}
          defaultValue={initialData.name}
          required
        />
      </div>

      <div className="product-form__base-info-group pev-flex">
        <PEVTextField
          name="price"
          identity="newProductPrice"
          label={translations.price}
          type="number"
          inputProps={{
            step: '0.01',
            min: '0.01',
            'data-cy': 'input:base__price',
          }}
          defaultValue={initialData.price}
          required
        />
        {/* TODO: [feature] add currency chooser */}
      </div>

      <div className="product-form__base-info-group pev-flex">
        <PEVTextField
          name="availability"
          identity="newProductAvailability"
          label={translations.availability}
          inputProps={{
            type: 'number',
            min: MIN_PRODUCT_UNITS,
            max: MAX_PRODUCT_UNITS,
            'data-cy': 'input:base__availability',
          }}
          defaultValue={initialData.availability}
          required
        />
      </div>
    </PEVFieldset>
  );
}

function ShortDescription({ data: { initialData = {} }, field: formikField, form: { setFieldValue } }) {
  const [shortDescriptionList, setShortDescriptionList] = useState([]);

  useEffect(() => {
    setFieldValue(formikField.name, shortDescriptionList.filter(Boolean));
  }, [shortDescriptionList]);

  return (
    <PEVFieldset>
      <PEVLegend>{translations.shortDescription}</PEVLegend>

      <ShortDescription.DescriptionContext.Provider value={shortDescriptionList}>
        <FlexibleList
          initialListItems={initialData[formikField.name]}
          NewItemComponent={ShortDescription._NewShortDescriptionInputHoC}
          EditItemComponent={ShortDescription._EditShortDescriptionInputHoc}
          emitUpdatedItemsList={setShortDescriptionList}
          itemsContextName="shortDescription"
        />
      </ShortDescription.DescriptionContext.Provider>

      <input {...formikField} type="hidden" />
    </PEVFieldset>
  );
}
ShortDescription.InputComponent = function InputComponent(props) {
  const inputRef = useRef();
  const [isChildrenVisible, setIsChildrenVisible] = useState(false);
  const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(props.isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inputRef.current && props.children) {
      setIsChildrenVisible(true);
    }
  }, [inputRef.current, props.children]);

  const validateInput = (value) => {
    const isValid = !props.shortDescriptionList.some((descriptionItem) => value === descriptionItem);
    setIsConfirmBtnDisabled(!isValid);
    setError(isValid ? '' : translations.duplicatedDescription);

    return isValid;
  };

  return (
    <>
      <TextField
        inputRef={inputRef}
        variant="outlined"
        size="small"
        defaultValue={props.presetValue || ''}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();

            if (isConfirmBtnDisabled) {
              return;
            }

            const inputValue = event.target.value;

            if (validateInput(inputValue)) {
              props.updateItem({
                updateValue: inputValue,
                isEditMode: props.isEditMode,
                editedIndex: props.editedIndex,
              });
            }
          } else if (event.key === 'Escape') {
            props.listFeatures.resetState();
          }
        }}
        onChange={({ target: { value } }) => {
          setIsConfirmBtnDisabled(!!(props.presetValue && props.presetValue === value));

          if (isConfirmBtnDisabled) {
            validateInput(value);
          }
        }}
        inputProps={{
          'data-cy': `input:shortDescription__${props.editedIndex ?? 'new'}`,
        }}
        autoFocus
        required
      />

      {isChildrenVisible &&
        props.children({
          inputItemRef: inputRef,
          isConfirmBtnDisabled,
          onConfirmBtnClick: () => {
            const inputValue = inputRef.current.value;

            if (validateInput(inputValue)) {
              props.updateItem({
                updateValue: inputValue,
                isEditMode: props.isEditMode,
                editedIndex: props.editedIndex,
              });
            }
          },
        })}

      {error && <PEVFormFieldError>{error}</PEVFormFieldError>}
    </>
  );
};
ShortDescription.DescriptionContext = createContext([]);
ShortDescription._NewShortDescriptionInputHoC = function NewShortDescriptionInputHoC({ listFeatures, ...restProps }) {
  const shortDescriptionList = useContext(ShortDescription.DescriptionContext);
  return <ShortDescription.InputComponent {...{ ...restProps, shortDescriptionList, listFeatures }} />;
};
ShortDescription._EditShortDescriptionInputHoc = function EditShortDescriptionInputHoc({
  item: shortDescItem,
  ...restProps
}) {
  const shortDescriptionList = useContext(ShortDescription.DescriptionContext);
  return (
    <ShortDescription.InputComponent
      {...{ ...restProps, shortDescriptionList }}
      isEditMode={true}
      presetValue={shortDescItem}
    />
  );
};

function CategorySelector({
  data: { initialData = {} },
  methods: { setProductCurrentSpecs, getSpecsForSelectedCategory },
}) {
  const handleCategorySelect = (selectedCategoryName) => {
    setProductCurrentSpecs(getSpecsForSelectedCategory(selectedCategoryName));
  };

  return (
    <PEVFieldset>
      <PEVLegend>{translations.categoryChooser}</PEVLegend>

      <Field
        name="category"
        required
        component={CategoriesTreeFormField}
        onCategorySelect={handleCategorySelect}
        preSelectedCategories={[initialData.category]}
        forceCombinedView={true}
      />
      <ErrorMessage name="category" component={PEVFormFieldError} />
    </PEVFieldset>
  );
}

function TechnicalSpecs({ data: { productCurrentSpecs, initialData = [] }, methods: { handleChange, setFieldValue } }) {
  const prepareInitialDataStructure = useMemo(() => {
    const structure = initialData.reduce((output, spec) => {
      const isSpecArray = Array.isArray(spec.data);
      const BASE_HEADING = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.heading}`;

      if (typeof spec.data === 'object' && !isSpecArray) {
        return {
          ...output,
          ...Object.entries(spec.data).reduce(
            (nestedOutput, [key, value]) => ({
              ...nestedOutput,
              [swapSpaceForGap(`${BASE_HEADING}${SPEC_NAMES_SEPARATORS.LEVEL}${key}`)]: value,
            }),
            {}
          ),
        };
      }

      return {
        ...output,
        [swapSpaceForGap(BASE_HEADING)]: isSpecArray ? spec.data.join(', ') : spec.data,
      };
    }, {});

    return { structure, isFilled: !!Object.keys(structure).length };
  }, [initialData]);

  useEffect(() => {
    if (prepareInitialDataStructure.isFilled) {
      Object.entries(prepareInitialDataStructure.structure).forEach(([name, value]) => {
        setFieldValue(name, value);
      });
    }
  }, [prepareInitialDataStructure.structure]);

  return (
    <PEVFieldset className="product-form__technical-specs pev-flex pev-flex--columned">
      <PEVLegend>{translations.technicalSpecs}</PEVLegend>

      {productCurrentSpecs.length > 0 ? (
        <List className="pev-flex" disablePadding data-cy="list:product-technical-specs">
          {productCurrentSpecs.map((spec) => {
            const fieldIdentifier = `${spec.name
              .replace(/(?<=\s)\w/g, (match) => match.toUpperCase())
              .replace(/\s/g, '')}Field`;
            const minValue = spec.fieldType === 'number' ? 0 : null;
            const BASE_NAME = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`;
            const isSpecDescriptionsArray = Array.isArray(spec.descriptions);
            const specDefaultUnitContent = spec.defaultUnit && `(${spec.defaultUnit})`;
            const legendOrLabelContent = `
            ${spec.name.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
            ${SPEC_NAMES_SEPARATORS.SPACE}
            ${specDefaultUnitContent}
          `;

            if (isSpecDescriptionsArray) {
              return (
                <ListItem className="product-form__technical-specs-controls-group" disableGutters key={fieldIdentifier}>
                  <PEVFieldset className="product-form__technical-specs-controls-group--nested-container">
                    <PEVLegend>{legendOrLabelContent}</PEVLegend>

                    <List className="pev-flex" disablePadding>
                      {spec.descriptions.map((specDescription, index) => {
                        const groupFieldIdentifier = `${fieldIdentifier}${index}`;
                        const mergedName = `${BASE_NAME}${SPEC_NAMES_SEPARATORS.LEVEL}${specDescription}`;
                        const dataCy = `input:spec__${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${specDescription}`;

                        return (
                          <ListItem
                            className="product-form__technical-specs-controls-group pev-flex"
                            disableGutters
                            key={groupFieldIdentifier}
                          >
                            <PEVTextField
                              name={mergedName}
                              identity={groupFieldIdentifier}
                              label={specDescription.replace(/\w/, (firstChar) => firstChar.toUpperCase())}
                              type={spec.fieldType}
                              inputProps={{ min: minValue, 'data-cy': dataCy }}
                              defaultValue={
                                prepareInitialDataStructure.isFilled
                                  ? prepareInitialDataStructure.structure[mergedName]
                                  : ''
                              }
                              required
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </PEVFieldset>
                </ListItem>
              );
            }

            return (
              <ListItem
                className="product-form__technical-specs-controls-group pev-flex"
                disableGutters
                key={fieldIdentifier}
              >
                <InputLabel>{legendOrLabelContent}</InputLabel>

                <TextField
                  variant="outlined"
                  size="small"
                  name={BASE_NAME}
                  type={spec.fieldType}
                  inputProps={{ min: minValue, 'data-cy': `input:spec__${spec.fieldName}` }}
                  id={fieldIdentifier}
                  onChange={handleChange}
                  defaultValue={
                    prepareInitialDataStructure.isFilled ? prepareInitialDataStructure.structure[BASE_NAME] : ''
                  }
                  required
                />

                <ErrorMessage
                  name={`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`}
                  component={PEVFormFieldError}
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <em
          className="product-form__technical-specs-category-choice-reminder"
          data-cy="label:product-technical-specs__category-choice-reminder"
        >
          {translations.chooseCategoryFirst}
        </em>
      )}
    </PEVFieldset>
  );
}

function Images({ data: { initialData = [] } }) {
  const { isMobileLayout } = useRWDLayout();
  const [uploadedImages, setUploadedImages] = useState(initialData);
  const [popupData, setPopupData] = useState(null);
  const canUploadImages = uploadedImages.length < MAX_IMAGES_AMOUNT;
  const canModifyImages = initialData.length === 0;
  const enabledImageHandling = canUploadImages && canModifyImages;
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
  const { handleChangeImg, handleDrop, handleDragOver } = Images.useHandleUploadImage({
    uploadedImages,
    canUploadImages,
    setUploadedImages,
    setPopupData,
    setFieldTouched,
    setFieldError,
  });
  const imagesNamesValue = uploadedImages.map(({ name }) => name).join(ARRAY_FORMAT_SEPARATOR);

  useEffect(() => {
    if (initialData.length) {
      setFieldTouched('imagesEmpty');
    }
  }, []);

  useEffect(() => {
    setFieldValue(
      'images',
      uploadedImages.length ? uploadedImages.map(({ imgFile, ...originalRest }) => imgFile || originalRest) : ''
    );
  }, [uploadedImages]);

  const handleRemoveImg = (imgIndex) => () => {
    setFieldTouched('images');
    setUploadedImages((prev) => prev.filter((_, index) => index !== imgIndex));
  };

  const getHintContent = () => {
    let hintContent = translations.reachedMaxImagesAmount;

    if (enabledImageHandling) {
      hintContent = translations.getUploadImageHint(isMobileLayout);
    } else if (!canModifyImages) {
      hintContent = translations.uploadImageDisabledModificationHint;
    }

    return hintContent;
  };

  return (
    <PEVFieldset className="product-form__images pev-flex pev-flex--columned">
      <PEVLegend>{translations.images}</PEVLegend>

      <Box
        borderRadius="borderRadius"
        borderColor={enabledImageHandling ? 'primary.main' : 'text.disabled'}
        className="product-form__images-drag-and-drop pev-flex pev-flex--columned"
        onDrop={isMobileLayout ? undefined : handleDrop}
        onDragOver={isMobileLayout ? undefined : handleDragOver}
      >
        <PEVParagraph
          className={classNames('pev-centered-padded-text', { 'product-form__images-limit-hint': !canUploadImages })}
        >
          {getHintContent()}
        </PEVParagraph>
        <input
          id="add-product-image"
          type="file"
          accept="image/*"
          onChange={handleChangeImg}
          // this input doesn't need a `value`, because it only serves to show OS based file explorer
          value=""
          style={{ display: 'none' }}
          disabled={!enabledImageHandling}
          data-cy="input:add-new-image"
        />
        <label htmlFor="add-product-image">
          <PEVIconButton
            component="span"
            a11y={translations.uploadImageBtn}
            disabled={!enabledImageHandling}
            name="images"
            value={imagesNamesValue}
          >
            <AddAPhotoOutlinedIcon color={enabledImageHandling ? 'primary' : 'disabled'} />
          </PEVIconButton>
        </label>
        <small>
          {translations.uploadedImagesAmount}:{' '}
          <span data-cy="label:attached-images-count">
            {uploadedImages.length}/{MAX_IMAGES_AMOUNT}
          </span>
        </small>
      </Box>

      <div
        style={{ '--images-limit': MAX_IMAGES_AMOUNT }}
        className="product-form__images-list"
        data-cy="container:product-form-images"
      >
        {/* TODO: [UX] let user choose, which image should serve as a preview on product's card */}
        {uploadedImages.map(({ src, name }, index) => {
          const alt = translations.getUploadedImageAlt(index + 1);
          const imageBasicMeta = src.startsWith('blob:') ? { src, alt } : { image: { src, name: alt } };

          return (
            <Box
              component="figure"
              borderColor={canModifyImages ? 'primary.main' : 'text.disabled'}
              borderRadius="borderRadius"
              className="product-form__images-list-item"
              key={name}
            >
              <PEVImage {...imageBasicMeta} width={128} height={128} />
              <figcaption data-cy={`label:attached-image-${index}-caption`}>{name}</figcaption>
              <PEVIconButton
                type="button"
                color="secondary"
                a11y={translations.getRemoveImage(index + 1)}
                onClick={handleRemoveImg(index)}
                disabled={!canModifyImages}
                data-cy={`button:remove-${index}-uploaded-image`}
              >
                <DeleteOutlineIcon />
              </PEVIconButton>
            </Box>
          );
        })}
      </div>

      <Popup {...popupData} />

      <ErrorMessage name="images" component={PEVFormFieldError} />
    </PEVFieldset>
  );
}
Images.useHandleUploadImage = ({
  uploadedImages,
  canUploadImages,
  setUploadedImages,
  setPopupData,
  setFieldTouched,
  setFieldError,
}) => {
  const validateFileType = (fileType) => fileType.startsWith('image/');
  const validateImgUniqueName = (imgName) => !uploadedImages.some(({ name }) => name === imgName);
  const handleUploadImg = (imgFile) => {
    if (!imgFile) {
      return;
    }

    if (!validateFileType(imgFile.type)) {
      return setPopupData({
        type: POPUP_TYPES.FAILURE,
        message: translations.notAnImageTypeError,
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }

    if (!validateImgUniqueName(imgFile.name)) {
      return setPopupData({
        type: POPUP_TYPES.FAILURE,
        message: translations.getImageWithDuplicatedNameError(imgFile.name),
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }

    const { isValidSize, currentImgSizeInMB, maxImgSizeInMB } = imageSizeValidator(imgFile.size);
    if (!isValidSize) {
      return setPopupData({
        type: POPUP_TYPES.FAILURE,
        message: translations.getMaxImageSizeExceededError(currentImgSizeInMB, maxImgSizeInMB),
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }

    setUploadedImages((prev) => [
      ...prev,
      {
        src: URL.createObjectURL(imgFile),
        name: imgFile.name,
        imgFile,
      },
    ]);
    setFieldTouched('images');
    setFieldError('images', '');
  };
  const handleChangeImg = ({
    target: {
      files: [imgFile],
    },
  }) => handleUploadImg(imgFile);
  const handleDrop = (event) => {
    event.preventDefault();

    if (canUploadImages) {
      event.dataTransfer.dropEffect = 'move';
      handleUploadImg(event.dataTransfer?.files[0]);
    } else {
      event.dataTransfer.dropEffect = 'none';
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();

    if (!canUploadImages) {
      event.dataTransfer.dropEffect = 'none';
    }
  };

  return { handleChangeImg, handleDrop, handleDragOver };
};

function RelatedProductsNames({ data: { initialData = {} }, field: formikField, form: { setFieldValue } }) {
  const [relatedProductNamesList, setRelatedProductNamesList] = useState([]);

  useEffect(() => {
    setFieldValue(formikField.name, relatedProductNamesList.filter(Boolean));
  }, [relatedProductNamesList]);

  return (
    <PEVFieldset className="product-form__related-product-names">
      <PEVLegend>{translations.relatedProductsNames}</PEVLegend>

      <RelatedProductsNames.SearchContext.Provider value={relatedProductNamesList}>
        <FlexibleList
          initialListItems={initialData[formikField.name]}
          NewItemComponent={RelatedProductsNames._SearchSingleProductByNameHoC}
          EditItemComponent={RelatedProductsNames._EditItemComponentHoC}
          emitUpdatedItemsList={setRelatedProductNamesList}
          itemsContextName="related-product-names"
        />
      </RelatedProductsNames.SearchContext.Provider>

      <input {...formikField} type="hidden" />
      {/* TODO: [UX] show error when related product name was not found */}
    </PEVFieldset>
  );
}
RelatedProductsNames.SearchContext = createContext([]);
RelatedProductsNames._SearchSingleProductByNameHoC = function SearchSingleProductByNameHoC({
  children = () => void 0,
  ...props
}) {
  const relatedProductNamesList = useContext(RelatedProductsNames.SearchContext);

  return (
    <>
      <SearchSingleProductByName
        {...props}
        list="foundRelatedProductsNames"
        debounceTimeMs={200}
        InputLabel={translations.relatedProductName}
        searchingTarget="relatedProductsNames"
        ignoredProductNames={relatedProductNamesList.filter(
          (productName) => productName && props.presetValue !== productName
        )}
        onSelectedProductName={(productName) => {
          if (props.editedProductIndex > -1) {
            props.listFeatures.editItem(productName, props.editedProductIndex);
          } else {
            props.listFeatures.addItem(productName);
          }
        }}
        onEscapeBtn={() => props.listFeatures.resetState()}
        autoFocus={true}
      />
      {children()}
    </>
  );
};
RelatedProductsNames._EditItemComponentHoC = function EditItemComponentHoC({
  item: relatedProductName,
  editedIndex,
  ...restProps
}) {
  return (
    <RelatedProductsNames._SearchSingleProductByNameHoC
      {...restProps}
      presetValue={relatedProductName}
      editedProductIndex={editedIndex}
    />
  );
};

// TODO: [UX] show a validation ornament at each form section to indicate user, which section is required/valid/invalid
const ProductForm = ({ initialData = {}, doSubmit }) => {
  const initialDataKeys = Object.keys(initialData);
  const isProductModification = initialDataKeys.length > 0;
  // Use it to force reset form by re-mounting it and its children. Apparently, form logic has to be refactored in order to
  // make Formik's `handleReset` function to do a proper form reset.
  const [formRenderIndex, setFormRenderIndex] = useState(0);
  const history = useHistory();
  const [productCurrentSpecs, setProductCurrentSpecs] = useState([]);
  const productSpecsMap = useRef({
    specs: null,
    categoryToSpecs: null,
  });
  const [formInitials, setFormInitials] = useState(() =>
    Object.fromEntries(ProductForm.initialFormEntries.map(([key, value]) => [key, initialData[key] || value]))
  );
  const ORIGINAL_FORM_INITIALS_KEYS = useMemo(() => Object.keys(formInitials), []);
  const getSpecsForSelectedCategory = useCallback(
    (selectedCategoryName) => {
      if (!productSpecsMap.current.categoryToSpecs || !productSpecsMap.current.specs) {
        return [];
      }

      const specsFromChosenCategory = (
        productSpecsMap.current.categoryToSpecs.find(
          (categoryToSpec) => categoryToSpec.category === selectedCategoryName
        ) || { specs: [] }
      ) /* TODO: remove fallback when CategoriesTree will handle ignoring toggle'able nodes */.specs;

      return productSpecsMap.current.specs.filter((spec) => specsFromChosenCategory.includes(spec.name));
    },
    [formInitials]
  );
  const getNestedEntries = useMemo(() => {
    const _getNestedEntries = (entries) =>
      (Array.isArray(entries) ? entries : Object.entries(entries))
        .filter(([key]) => key.includes(SPEC_NAMES_SEPARATORS.LEVEL))
        .reduce((obj, [key, value]) => {
          const nestLevelKeys = key.split(SPEC_NAMES_SEPARATORS.LEVEL);

          _getNestedEntries.createNestedProperty(obj, nestLevelKeys, value);

          return obj;
        }, Object.create(null));

    _getNestedEntries.createNestedProperty = (obj, nestLevelKeys, value, currentLevel = 0) => {
      const currentLevelKey = nestLevelKeys[currentLevel];
      const normalizedCurrentLevelKey = currentLevelKey.replaceAll(
        SPEC_NAMES_SEPARATORS.GAP,
        SPEC_NAMES_SEPARATORS.SPACE
      );
      const nextLevel = currentLevel + 1;

      if (!(currentLevelKey in obj)) {
        if (currentLevel === 0) {
          obj[currentLevelKey] = {};
        } else if (currentLevel === 1) {
          obj[normalizedCurrentLevelKey] = {
            value: {},
            defaultUnit: undefined,
          };

          const specWithDefaultUnit = productSpecsMap.current.specs.find(
            (specObj) => specObj.fieldName === currentLevelKey && specObj.defaultUnit
          );

          if (specWithDefaultUnit) {
            obj[normalizedCurrentLevelKey].defaultUnit = specWithDefaultUnit.defaultUnit;
          }
        }
      }

      if (nestLevelKeys[nextLevel]) {
        _getNestedEntries.createNestedProperty(obj[currentLevelKey], nestLevelKeys, value, nextLevel);
      } else {
        if (currentLevel > 1) {
          obj.value[normalizedCurrentLevelKey] = value;
        } else {
          const isSpecWithChoiceType = productSpecsMap.current.specs.some(
            (specObj) => specObj.name === currentLevelKey && specObj.type === 'CHOICE'
          );

          obj[normalizedCurrentLevelKey].value = isSpecWithChoiceType ? [value] : value;
        }
      }
    };

    return _getNestedEntries;
  }, []);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    (async () => {
      const productSpecifications = await productSpecsService
        .getProductsSpecifications()
        .then(productSpecsService.structureProductsSpecifications);

      productSpecsMap.current.categoryToSpecs = productSpecifications.categoryToSpecs;
      productSpecsMap.current.specs = productSpecifications.specs.map((specObj) => ({
        ...specObj,
        fieldName: swapSpaceForGap(specObj.name),
        fieldType: FIELD_TYPE_MAP[specObj.type],
      }));

      setFormInitials((prevFormInitials) => ({
        ...prevFormInitials,
        ...Object.fromEntries(
          productSpecsMap.current.specs.reduce((specEntries, spec) => {
            const names = spec.descriptions
              ? spec.descriptions.map((description) => `${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${description}`)
              : [spec.fieldName];

            names.forEach((name) => {
              specEntries.push([name, '']);
            });

            return specEntries;
          }, [])
        ),
      }));
    })();
  }, []);

  const filterOutUnrelatedFields = (values) => {
    const specFieldNamesForSelectedCategory = getSpecsForSelectedCategory(values.category).reduce(
      (specEntries, spec) => {
        const names = spec.descriptions
          ? spec.descriptions.map(
              (description) =>
                `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}${SPEC_NAMES_SEPARATORS.LEVEL}${description}`
            )
          : [`${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${spec.fieldName}`];

        names.forEach((name) => {
          specEntries.push(name);
        });

        return specEntries;
      },
      []
    );
    const filteredValues = Object.entries(values).filter(([key]) =>
      specFieldNamesForSelectedCategory.some((fieldName) => fieldName === key)
    );
    const filteredFormInitials = Object.entries(values).filter(([key]) => ORIGINAL_FORM_INITIALS_KEYS.includes(key));

    return Object.fromEntries([...filteredFormInitials, ...filteredValues]);
  };

  const normalizeSubmittedValues = (values) => {
    const entries = Object.entries(values);
    const entriesWithNaturalKeys = entries.filter(([key]) => !key.includes(SPEC_NAMES_SEPARATORS.LEVEL));
    const nestedEntries = getNestedEntries(entries);

    const normalizedValues = {
      ...Object.fromEntries(entriesWithNaturalKeys),
      ...nestedEntries,
    };
    normalizedValues.technicalSpecs = Object.entries(normalizedValues.technicalSpecs).map(
      ([key, { value, defaultUnit }]) => ({
        heading: key,
        data: value,
        defaultUnit,
      })
    );

    return normalizedValues;
  };

  const onSubmitHandler = (values, { setSubmitting }) => {
    let submission;

    if (isProductModification) {
      submission = doSubmit(values, normalizeSubmittedValues(filterOutUnrelatedFields(values)).technicalSpecs);
    } else {
      const newProductData = normalizeSubmittedValues(filterOutUnrelatedFields(values));
      submission = doSubmit(newProductData);
    }

    submission
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          throw res.__ERROR_TO_HANDLE;
        }

        if (isProductModification) {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: translations.modificationSuccess,
            buttons: [
              {
                text: translations.navigateToProduct,
                dataCy: 'button:navigate-to-product',
                onClick: () => {
                  setPopupData(null);
                  history.replace({
                    pathname: `${ROUTES.PRODUCTS}/${initialData.url}`,
                  });
                },
              },
              {
                text: translations.modifyProductAgain,
                dataCy: 'button:modify-product-again',
                onClick: () => {
                  setPopupData(null);
                  window.scroll({ top: 0, behavior: 'smooth' });
                },
              },
            ],
          });
        } else {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: translations.additionSuccess,
            buttons: [
              {
                text: translations.navigateToProduct,
                dataCy: 'button:navigate-to-product',
                onClick: () => {
                  setPopupData(null);
                  history.replace({
                    pathname: `${ROUTES.PRODUCTS}/${res.productUrl}`,
                  });
                },
              },
              {
                text: translations.addAnotherProduct,
                dataCy: 'button:add-another-product',
                onClick: () => {
                  setPopupData(null);
                  setFormRenderIndex((prev) => ++prev);
                  window.scroll({ top: 0, behavior: 'smooth' });
                },
              },
            ],
          });
        }

        return res;
      })
      .catch((errorMessage) => {
        console.error(errorMessage);
        setPopupData({
          type: POPUP_TYPES.FAILURE,
          message: translations.formSubmissionError,
          buttons: [getClosePopupBtn(setPopupData)],
        });
      })
      .finally(() => setSubmitting(false));
  };

  const validateHandler = (values) => {
    const errors = {};

    if (!values.category) {
      errors.category = translations.emptyCategoryError;
    }

    if (!values.images?.length) {
      errors.imagesEmpty = translations.emptyImagesError;
    }

    const { isColourFieldError, colourFieldKey } = validateHandler.colorFieldTextValidator(values);
    if (isColourFieldError) {
      errors[colourFieldKey] = translations.colourIsNotTextError;
    }

    return errors;
  };
  validateHandler.colorFieldTextValidator = (values) => {
    const colourFieldKey = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}colour`;
    const isColorFieldText = /^\D+$/.test(values[colourFieldKey]);

    return { isColourFieldError: !isColorFieldText, colourFieldKey };
  };

  const addOrUpdateTranslation = isProductModification ? translations.updateProduct : translations.addProduct;

  return (
    <section className="product-form pev-fixed-container">
      <PEVForm
        className="product-form__form"
        onSubmit={onSubmitHandler}
        initialValues={formInitials}
        validate={validateHandler}
        key={formRenderIndex}
      >
        {(formikProps) => (
          <>
            <PEVHeading className="pev-centered-padded-text" level={2}>
              {translations.getIntro(isProductModification)}
            </PEVHeading>

            <Paper className="product-form__fields-group">
              <BaseInfo data={{ initialData: formikProps.values, isProductModification }} />
            </Paper>
            <Paper className="product-form__fields-group">
              <Field name="shortDescription" data={{ initialData: formikProps.values }} component={ShortDescription} />
            </Paper>
            <Paper className="product-form__fields-group">
              <CategorySelector
                data={{ initialData: formikProps.values }}
                methods={{ setProductCurrentSpecs, getSpecsForSelectedCategory }}
              />
            </Paper>
            <Paper className="product-form__fields-group">
              <TechnicalSpecs
                data={{ productCurrentSpecs, initialData: initialData.technicalSpecs }}
                methods={{ handleChange: formikProps.handleChange, setFieldValue: formikProps.setFieldValue }}
              />
            </Paper>
            <Paper className="product-form__fields-group">
              <Images data={{ initialData: initialData.images }} />
            </Paper>
            <Paper className="product-form__fields-group">
              <Field
                name="relatedProductsNames"
                data={{ initialData: formikProps.values }}
                component={RelatedProductsNames}
              />
            </Paper>

            <PEVButton
              type="submit"
              className="product-form__save-btn"
              a11y={addOrUpdateTranslation}
              onClick={() => !formikProps.touched.category && formikProps.setFieldTouched('category')}
              data-cy="button:product-form__save"
            >
              <SaveIcon fontSize="large" />
              {addOrUpdateTranslation}
            </PEVButton>
          </>
        )}
      </PEVForm>
      <Popup {...popupData} />
    </section>
  );
};
ProductForm.initialFormEntries = [
  ['name', ''],
  ['price', ''],
  ['availability', ''],
  ['shortDescription', []],
  ['category', ''],
  ['images', []],
  ['relatedProductsNames', []],
];

const NewProduct = () => {
  const doSubmit = (newProductData) => {
    const fd = new FormData();
    const { images, ...plainData } = newProductData;

    fd.append('plainData', JSON.stringify(plainData));
    images.forEach((img, index) => fd.append(`image${index}`, img));
    return httpService.addProduct(fd);
  };

  return <ProductForm doSubmit={doSubmit} />;
};
const ModifyProduct = () => {
  const { state: productData, pathname } = useLocation();
  const [mergedProductData, setMergedProductData] = useState(productData);
  const [modificationError, setModificationError] = useState(false);
  const getChangedFields = useCallback(
    (values) => {
      const flatTechnicalSpecs = mergedProductData.technicalSpecs.reduce((output, spec) => {
        const obj = {};
        const PREFIX = `${FIELD_NAME_PREFIXES.TECHNICAL_SPECS}${swapSpaceForGap(spec.heading)}`;

        if (typeof spec.data === 'object' && !Array.isArray(spec.data)) {
          Object.entries(spec.data).forEach(([key, value]) => {
            obj[`${PREFIX}${SPEC_NAMES_SEPARATORS.LEVEL}${key}`] = value;
          });
        } else if (Array.isArray(spec.data)) {
          obj[PREFIX] = spec.data.join(', ');
        } else {
          obj[PREFIX] = spec.data;
        }

        return {
          ...output,
          ...obj,
        };
      }, {});

      const normalizedInitialProductData = { ...mergedProductData, ...flatTechnicalSpecs };
      delete normalizedInitialProductData.technicalSpecs;

      const changedFields = Object.entries(values).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return normalizedInitialProductData[key].toString() !== value.toString();
        }

        return normalizedInitialProductData[key] !== value;
      });

      return changedFields;
    },
    [mergedProductData]
  );

  useEffect(() => {
    if (productData) {
      return;
    }

    const productUrl = routeHelpers.extractProductUrlFromPathname(pathname);
    if (!productUrl) {
      throw Error(`Could not extract productUrl based on pathname: "${pathname}"!`);
    }

    httpService.getProductByUrl(productUrl).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setMergedProductData(res[0]);
    });
  }, []);

  const normalizeTechnicalSpecsProps = (changedFields, technicalSpecsField) => {
    const fieldEntriesWithoutTechnicalSpecs = changedFields.filter(
      ([key]) => !key.startsWith(FIELD_NAME_PREFIXES.TECHNICAL_SPECS)
    );

    if (fieldEntriesWithoutTechnicalSpecs.length === changedFields.length) {
      return changedFields;
    }

    const technicalSpecsEntry = ['technicalSpecs', technicalSpecsField];
    return [...fieldEntriesWithoutTechnicalSpecs, technicalSpecsEntry];
  };

  const doSubmit = (values, technicalSpecsField) => {
    const changedFields = normalizeTechnicalSpecsProps(getChangedFields(values), technicalSpecsField);

    if (changedFields.length) {
      setModificationError(false);

      return httpService.modifyProduct(values.name, Object.fromEntries(changedFields)).then((res) => {
        setMergedProductData(res);
        return res;
      });
    }

    setModificationError(true);
    return Promise.reject('modify impossible, due to not changed data');
  };

  return mergedProductData ? (
    <>
      <ProductForm initialData={mergedProductData} doSubmit={doSubmit} />
      {modificationError && <PEVFormFieldError>{translations.modificationError}</PEVFormFieldError>}
    </>
  ) : (
    translations.lackOfData
  );
};

export { NewProduct, ModifyProduct };
