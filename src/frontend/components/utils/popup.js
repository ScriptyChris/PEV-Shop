import React from 'react';

const POPUP_TYPES = {
  NEUTRAL: 'NEUTRAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

function getClassNameByType(type) {
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
}

export default function Popup({ type = POPUP_TYPES.NEUTRAL, message, buttons = [] }) {
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

  const baseClassName = `popup`;

  return (
    <div className="popup-container">
      <aside className={`${baseClassName} ${baseClassName}${getClassNameByType(type)}`}>
        <p className={`${baseClassName}__message`}>{message}</p>

        <div className={`${baseClassName}__buttons`}>
          {buttons.map((btn) => (
            <button onClick={btn.onClick} key={btn.text}>
              {btn.text}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
