import React, { useState } from 'react';

const RATING_NUMBER_INCREASEMENT = 0.5;

export default function RatingWidget({ scale = 5, field: formikField, form: { setFieldValue } }) {
  if (Number.parseInt(scale) !== scale) {
    throw TypeError(`'scale' prop must be an integer! Received '${scale}'`);
  }

  const [lastActiveRatingValue, setLastActiveRatingValue] = useState(-1);
  const ratingValues = Array(scale * 2)
    .fill(1)
    .reduce((output, _, index) => {
      const prevNum = index === 0 ? index : output[index - 1];
      const nextNumber = prevNum + RATING_NUMBER_INCREASEMENT;

      return [...output, nextNumber];
    }, []);

  const onRatingClick = (ratingValue) => {
    setLastActiveRatingValue(ratingValue);
    setFieldValue(formikField.name, ratingValue);
  };

  return (
    <div className="rating-widget">
      {ratingValues.map((ratingValue) => {
        return (
          <button
            className={ratingValue <= lastActiveRatingValue ? 'rating-value--active' : ''}
            onClick={() => onRatingClick(ratingValue)}
            key={ratingValue}
            type="button"
          >
            {ratingValue}
          </button>
        );
      })}

      <input {...formikField} type="hidden" />
    </div>
  );
}
