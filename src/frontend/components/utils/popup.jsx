import React, { useCallback, memo, useState, useEffect, createRef } from 'react';
import { httpServiceSubscriber } from '@frontend/features/httpService';

const POPUP_TYPES = {
  NEUTRAL: 'NEUTRAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const getClosePopupBtn = (setPopupData) => {
  if (typeof setPopupData !== 'function') {
    throw TypeError(`setPopupData should be a function! Received: ${setPopupData}`);
  }

  return {
    onClick: () => setPopupData(null),
    text: 'Close',
  };
};

const getClassNameByType = (type) => {
  switch (type) {
    case POPUP_TYPES.SUCCESS: {
      return '--success';
    }

    case POPUP_TYPES.FAILURE: {
      return '--failure';
    }

    default: {
      return '';
    }
  }
};

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

  return popupData && <Popup {...popupData} />;
});

export { POPUP_TYPES, getClosePopupBtn, GenericErrorPopup };

export default function Popup({ type = POPUP_TYPES.NEUTRAL, message, altMessage, buttons = [], altButtons }) {
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

  if (!Array.isArray(buttons) || buttons.length === 0) {
    throw TypeError(
      `'buttons' prop must be an non-empty array!\n
      Received ${JSON.stringify(buttons)}`
    );
  }

  const firstBtnRef = createRef();
  const baseClassName = `popup`;

  useEffect(() => {
    firstBtnRef.current.focus();
  }, []);

  return (
    <div className="popup-container">
      <aside className={`${baseClassName} ${baseClassName}${getClassNameByType(type)}`}>
        <p className={`${baseClassName}__message`} data-cy="popup:message">
          {message}
        </p>

        {altMessage && (
          <div className={`${baseClassName}__message--alt`}>
            <p>{altMessage}</p>

            {altButtons && (
              <div className={`${baseClassName}__buttons--alt`}>
                {altButtons.map((altBtn) => (
                  <button onClick={altBtn.onClick} key={altBtn.text} data-cy={altBtn.dataCy}>
                    {altBtn.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`${baseClassName}__buttons`}>
          {buttons.map((btn, index) => (
            <button onClick={btn.onClick} key={btn.text} data-cy={btn.dataCy} ref={index === 0 ? firstBtnRef : null}>
              {btn.text}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
