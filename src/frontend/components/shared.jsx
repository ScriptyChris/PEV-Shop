import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { PEVButton, PEVLink } from '@frontend/components/utils/pevElements';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import httpService from '@frontend/features/httpService';
import { ROUTES, routeHelpers } from '@frontend/components/pages/_routes';

const translations = {
  editProduct: 'Edit',
  deleteProduct: 'Delete',
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  promptProductDeletion: 'Are you sure you want to delete this product?',
  confirmProductDeletion: 'Yes',
  abortProductDeletion: 'No',
  productDeletionSuccess: 'Product successfully deleted!',
  productDeletionFailed: 'Deleting product failed :(',
  goBackToProducts: 'Go back to products',
  goTologIn: 'Log in',
};

export function DeleteProductFeature({ productUrl }) {
  const history = useHistory();
  const [popupData, setPopupData] = useState(null);

  const handleProductDelete = () => {
    setPopupData({
      type: POPUP_TYPES.NEUTRAL,
      message: translations.promptProductDeletion,
      buttons: [
        {
          text: translations.confirmProductDeletion,
          onClick: () => {
            httpService
              .disableGenericErrorHandler()
              .deleteProduct(productUrl)
              .then((res) => {
                if (res.__EXCEPTION_ALREADY_HANDLED) {
                  return;
                } else if (res.__NO_CONTENT) {
                  setPopupData({
                    type: POPUP_TYPES.SUCCESS,
                    message: translations.productDeletionSuccess,
                    buttons: [
                      {
                        onClick: () => history.push(ROUTES.PRODUCTS),
                        text: translations.goBackToProducts,
                      },
                    ],
                  });
                } else {
                  setPopupData({
                    type: POPUP_TYPES.FAILURE,
                    message: translations.productDeletionFailed,
                    buttons: [getClosePopupBtn(setPopupData)],
                  });
                }
              });
          },
        },
        {
          text: translations.abortProductDeletion,
          onClick: () => setPopupData(null),
        },
      ],
    });
  };

  return (
    <>
      <PEVButton
        color="primary"
        variant="contained"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={handleProductDelete}
      >
        {translations.deleteProduct}
      </PEVButton>
      <Popup {...popupData} />
    </>
  );
}

export function NavigateToModifyProduct({ productData }) {
  return (
    <PEVLink
      to={{ pathname: routeHelpers.createModifyProductUrl(productData.url), state: productData }}
      className="navigate-to-modify-product MuiButton-root MuiButton-contained MuiButton-containedSizeSmall MuiButton-containedPrimary"
      data-cy="button:product-details__edit-product"
    >
      <EditIcon fontSize="small" />
      {translations.editProduct}
    </PEVLink>
  );
}

// TODO: [code structure] put it inside a function (not component) related shared component
export const createEmailServiceUrl = (emailServicePort) =>
  `${window.location.protocol}//${window.location.hostname}:${emailServicePort}`;
