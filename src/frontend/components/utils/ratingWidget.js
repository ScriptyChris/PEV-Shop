import React, { useState } from 'react';

const RATING_NUMBER_INCREASEMENT = 0.5;
const RATING_MAX_VALUE = 5; /* TODO: get this from API */
const CLASS_NAMES = Object.freeze({
  WIDGET: 'rating-widget',
  BUTTON: 'rating-widget__btn',
  ICON: 'rating-widget__icon',
});

export default function RatingWidget({ scale = RATING_MAX_VALUE, field: formikField, form: { setFieldValue } }) {
  if (Number.parseInt(scale) !== scale) {
    throw TypeError(`'scale' prop must be an integer! Received '${scale}'`);
  }

  const [lastActiveRatingValue, setLastActiveRatingValue] = useState(0);
  const [lastHoverRatingValue, setLastHoverRatingValue] = useState(0);
  const ratingValues = Array(scale * 2)
    .fill(1)
    .map((_, index) => RATING_NUMBER_INCREASEMENT + index / 2);

  const onRatingHover = (ratingValue) => {
    setLastHoverRatingValue(ratingValue);
  };

  const onRatingClick = (ratingValue) => {
    const newRatingValue = ratingValue === lastActiveRatingValue ? 0 : ratingValue;

    setLastActiveRatingValue(newRatingValue);
    setFieldValue(formikField.name, newRatingValue);
  };

  return (
    <div className={CLASS_NAMES.WIDGET}>
      {ratingValues.map((ratingValue, index) => {
        const iconClasses = [CLASS_NAMES.ICON];

        if (ratingValue <= lastActiveRatingValue) {
          iconClasses.push(`${CLASS_NAMES.ICON}--active`);
        }

        if (ratingValue <= lastHoverRatingValue) {
          iconClasses.push(`${CLASS_NAMES.ICON}--hover`);
        }

        const isOdd = index % 2 === 1;
        if (isOdd) {
          iconClasses.push(`${CLASS_NAMES.ICON}--odd`);
        }

        return (
          <button
            className={CLASS_NAMES.BUTTON}
            onMouseOver={() => onRatingHover(ratingValue)}
            onMouseOut={() => onRatingHover(0)}
            onClick={() => onRatingClick(ratingValue)}
            title={ratingValue}
            key={ratingValue}
            type="button"
          >
            <i className={iconClasses.join(' ')}></i>
          </button>
        );
      })}

      <input {...formikField} type="hidden" />
    </div>
  );
}
