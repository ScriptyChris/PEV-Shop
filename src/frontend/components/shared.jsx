import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { PEVButton } from '@frontend/components/utils/pevElements';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import httpService from '@frontend/features/httpService';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = {
  editProduct: 'Edit',
  deleteProduct: 'Delete',
  promptToLoginBeforeProductObserveToggling: 'You need to log in to toggle product observing state',
  promptProductDeletion: 'Are you sure you want to delete this product?',
  confirmProductDeletion: 'Yes',
  abortProductDeletion: 'No',
  productDeletionSuccess: 'Product successfully deleted!',
  productDeletionFailed: 'Deleting product failed :(',
  goBackToShop: 'Go back to shop',
  goTologIn: 'Log in',
};

export function DeleteProductFeature({ productName }) {
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
              .deleteProduct(productName)
              .then((res) => {
                if (res.__EXCEPTION_ALREADY_HANDLED) {
                  return;
                } else if (res.__NO_CONTENT) {
                  setPopupData({
                    type: POPUP_TYPES.SUCCESS,
                    message: translations.productDeletionSuccess,
                    buttons: [
                      {
                        onClick: () => history.push(ROUTES.SHOP),
                        text: translations.goBackToShop,
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
      <PEVButton size="small" startIcon={<DeleteIcon />} onClick={handleProductDelete}>
        {translations.deleteProduct}
      </PEVButton>
      <Popup {...popupData} />
    </>
  );
}

export function NavigateToModifyProduct({ productName }) {
  const history = useHistory();

  const handleNavigateToProductModify = () => {
    history.push(ROUTES.MODIFY_PRODUCT, productName);
  };

  return (
    <PEVButton
      size="small"
      startIcon={<EditIcon />}
      onClick={handleNavigateToProductModify}
      data-cy="button:product-details__edit-product"
    >
      {translations.editProduct}
    </PEVButton>
  );
}
