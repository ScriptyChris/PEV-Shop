/**
 * @module
 */
import '@frontend/assets/styles/views/popup.scss';

import React, { useCallback, memo, useState, useEffect, useRef } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Zoom from '@material-ui/core/Zoom';

import { PEVButton } from '@frontend/components/utils/pevElements';
import { httpServiceSubscriber } from '@frontend/features/httpService';

const POPUP_TYPES = {
  NEUTRAL: 'NEUTRAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

/**
 * Factory for popup's default closing button.
 */
const getClosePopupBtn = (setPopupData) => {
  if (typeof setPopupData !== 'function') {
    throw TypeError(`setPopupData should be a function! Received: ${setPopupData}`);
  }

  return {
    onClick: () => setPopupData(null),
    // TODO: [UX] use translation
    text: 'Close',
    dataCy: 'button:popup-close',
  };
};

// const getClassNameByType = (type) => {
//   switch (type) {
//     case POPUP_TYPES.SUCCESS: {
//       return '--success';
//     }

//     case POPUP_TYPES.FAILURE: {
//       return '--failure';
//     }

//     default: {
//       return '';
//     }
//   }
// };

/**
 * Generic error popup component is hooked on {@link HttpService} to present user any errors in more friendly way.
 */
const GenericErrorPopup = memo(function GenericErrorPopup() {
  const [popupData, setPopupData] = useState(null);
  const subscriptionHandler = useCallback((exceptionValue) => {
    if (exceptionValue?.error && !exceptionValue.isGenericErrorHandlerActive) {
      return {
        __ERROR_TO_HANDLE: exceptionValue.error,
      };
    }

    setPopupData({
      type: POPUP_TYPES.FAILURE,
      message: 'Sorry, but an unexpected error occured :(',
      // TODO: [UX] format the generic error properly
      altMessage: JSON.stringify(exceptionValue && exceptionValue.exception),
      buttons: [getClosePopupBtn(setPopupData)],
    });

    return {
      __EXCEPTION_ALREADY_HANDLED: true,
    };
  }, []);

  useEffect(() => {
    httpServiceSubscriber.subscribe(httpServiceSubscriber.SUBSCRIPTION_TYPE.EXCEPTION, subscriptionHandler);

    return () => {
      httpServiceSubscriber.unSubscribe(httpServiceSubscriber.SUBSCRIPTION_TYPE.EXCEPTION, subscriptionHandler);
    };
  }, []);

  return <Popup {...popupData} />;
});

export { POPUP_TYPES, getClosePopupBtn, GenericErrorPopup };

export default function Popup(props) {
  if (!Object.keys(props).length) {
    return null;
  }

  const {
    type = POPUP_TYPES.NEUTRAL /* TODO: [UX] associate popup type with it's title color */,
    // title,
    message,
    altMessage,
    buttons,
    singleAltBtn,
    dataCy,
  } = props;

  if (!Object.keys(POPUP_TYPES).includes(type)) {
    throw TypeError(
      `'type' prop must be one of POPUP_TYPES!\n
      Received ${type}`
    );
  }

  if (typeof message !== 'string' || message.length === 0) {
    throw TypeError(
      `'message' prop must be defined as a non empty string!\n
      Received ${JSON.stringify(message)}`
    );
  }

  if (buttons && singleAltBtn) {
    throw Error(`'buttons' and 'singleAltBtn' cannot be both provided at the same time!`);
  } else if (!buttons && !singleAltBtn) {
    throw Error(
      `Either 'buttons' or 'singleAltBtn' must be provided!\n
      Received: '${JSON.stringify(buttons)}' and '${JSON.stringify(singleAltBtn)}.`
    );
  } else if (Array.isArray(buttons) && buttons.length === 0) {
    throw TypeError(
      `'buttons' prop must be a non-empty array!\n
      Received ${JSON.stringify(buttons)}`
    );
  }

  const firstBtnRef = useRef();
  const handleOpen = () => firstBtnRef.current.focus();

  return (
    <Dialog
      open
      TransitionComponent={Zoom}
      data-cy={dataCy}
      TransitionProps={{ onEntered: handleOpen }}
      aria-labelledby="popup-description" /* TODO: [a11y] use aria-describedby, which requires React > v16 */
      PaperProps={{ className: 'popup' }}
    >
      <DialogContent>
        <DialogContentText data-cy="popup:message" id="popup-description" color="textPrimary">
          {message}
        </DialogContentText>
      </DialogContent>
      {altMessage && (
        <DialogContent>
          <DialogContentText>{altMessage}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        {singleAltBtn && (
          <PEVButton
            onClick={singleAltBtn.onClick}
            key={singleAltBtn.text}
            data-cy={singleAltBtn.dataCy}
            ref={firstBtnRef}
            variant="text"
            size="small"
            style={{ margin: 'auto' }}
          >
            {singleAltBtn.text}
          </PEVButton>
        )}

        {buttons?.map((btn, index) => (
          <PEVButton
            onClick={btn.onClick}
            key={btn.text}
            data-cy={btn.dataCy}
            ref={index === 0 ? firstBtnRef : null}
            size="small"
            color={index === 0 ? 'primary' : 'default'}
          >
            {btn.text}
          </PEVButton>
        ))}
      </DialogActions>
    </Dialog>
  );
}
