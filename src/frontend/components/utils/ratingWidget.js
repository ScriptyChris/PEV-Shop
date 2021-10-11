import React, { useState } from 'react';

const RATING_NUMBER_INCREASEMENT = 0.5;
const CLASS_NAMES = Object.freeze({
  WIDGET: 'rating-widget',
  BUTTON: 'rating-widget__btn',
  ICON: 'rating-widget__icon',
});

export default function RatingWidget({ scale = 5, field: formikField, form: { setFieldValue } }) {
  if (Number.parseInt(scale) !== scale) {
    throw TypeError(`'scale' prop must be an integer! Received '${scale}'`);
  }

  const [lastActiveRatingValue, setLastActiveRatingValue] = useState(-1);
  const [lastHoverRatingValue, setLastHoverRatingValue] = useState(-1);
  const ratingValues = Array(scale * 2)
    .fill(1)
    .reduce((output, _, index) => {
      const prevNum = index === 0 ? index : output[index - 1];
      const nextNumber = prevNum + RATING_NUMBER_INCREASEMENT;

      return [...output, nextNumber];
    }, []);

  const onRatingHover = (ratingValue) => {
    setLastHoverRatingValue(ratingValue);
  };

  const onRatingClick = (ratingValue) => {
    const newRatingValue = ratingValue === lastActiveRatingValue ? -1 : ratingValue;

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
            onMouseOut={() => onRatingHover(-1)}
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
