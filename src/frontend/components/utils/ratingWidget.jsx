/**
 * @module
 */
import '@frontend/assets/styles/views/ratingWidget.scss';

import React, { useState } from 'react';
import classNames from 'classnames';

import { REVIEW_RATING_MAX_VALUE } from '@commons/consts';

const translations = {
  reviewsAmountLabel: 'reviews',
};
const RATING_NUMBER_INCREASEMENT = 0.5;
const CLASS_NAMES = Object.freeze({
  WIDGET: 'rating-widget',
  ICON_BUTTONS: 'rating-widget__icon-buttons',
  STATS: 'rating-widget__stats',
  STAT_NUMERIC__FLUID: 'rating-widget__stat-numeric--fluid',
  STAT_NUMERIC__STANDALONE: 'rating-widget__stat-numeric--standalone',
  ICON_BTN: 'rating-widget__icon-btn',
  ICON: 'rating-widget__icon',
  ICON__SINGLE: 'rating-widget__icon--single',
  ICON__ACTIVE: 'rating-widget__icon--active',
  ICON__ODD: 'rating-widget__icon--odd',
  ICON__HOVER: 'rating-widget__icon--hover',
});

// TODO: [UX] refactor this to MUI's Rating component
export default function RatingWidget({
  isBig = false,
  asSingleIcon = false,
  decorateSingleIcon = false,
  presetValue,
  reviewsAmount,
  scale = REVIEW_RATING_MAX_VALUE,
  externalClassName = '',
  field: formikField,
  form: { setFieldValue } = {},
}) {
  if (Number.parseInt(scale) !== scale) {
    throw TypeError(`'scale' prop must be an integer! Received '${scale}'`);
  } else if (typeof presetValue !== 'number' && presetValue !== undefined) {
    throw TypeError(`'presetValue' prop must be a number or undefined! Received '${presetValue}'`);
  } else if (typeof reviewsAmount !== 'number' && reviewsAmount !== undefined) {
    throw TypeError(`'reviewsAmount' prop must be a number or undefined! Received '${reviewsAmount}'`);
  } else if (typeof isBig !== 'boolean') {
    throw TypeError(`'isBig' prop must be a boolean! Received '${isBig}'`);
  } else if (decorateSingleIcon && !asSingleIcon) {
    throw Error(`'decorateSingleIcon' prop cannot be true when 'asSingleIcon' is false!`);
  }

  const [lastActiveRatingValue, setLastActiveRatingValue] = useState(presetValue);
  const [lastHoverRatingValue, setLastHoverRatingValue] = useState(0);
  const ratingValues = Array(scale * 2)
    .fill(1)
    .map((_, index) => RATING_NUMBER_INCREASEMENT + index / 2);
  const ratingStatSuffix = asSingleIcon ? reviewsAmount : `${reviewsAmount} ${translations.reviewsAmountLabel}`;
  const MAYBE_ACTIVE_SINGLE_ICON = Object.freeze({
    [CLASS_NAMES.ICON__ACTIVE]: reviewsAmount || decorateSingleIcon,
  });

  const onRatingHover = (ratingValue) => {
    setLastHoverRatingValue(ratingValue);
  };

  const onRatingClick = (ratingValue) => {
    const newRatingValue = ratingValue === lastActiveRatingValue ? 0 : ratingValue;

    setLastActiveRatingValue(newRatingValue);
    setFieldValue(formikField.name, newRatingValue);
  };

  const getRatingsMetadata = (ratingValue, index) => {
    const iconClasses = [CLASS_NAMES.ICON];
    const btnEventHandlers = {};

    if (ratingValue <= lastActiveRatingValue) {
      iconClasses.push(CLASS_NAMES.ICON__ACTIVE);
    }

    const isOdd = index % 2 === 1;
    if (isOdd) {
      iconClasses.push(CLASS_NAMES.ICON__ODD);
    }

    const smallOrBig = isBig ? 'big' : 'small';
    iconClasses.push(`${CLASS_NAMES.ICON}--${smallOrBig}`);

    if (presetValue === undefined && ratingValue <= lastHoverRatingValue) {
      iconClasses.push(CLASS_NAMES.ICON__HOVER);
    }

    if (setFieldValue) {
      btnEventHandlers.onMouseOver = () => onRatingHover(ratingValue);
      btnEventHandlers.onMouseOut = () => onRatingHover(0);
      btnEventHandlers.onClick = () => onRatingClick(ratingValue);
    }

    return { iconClasses, btnEventHandlers };
  };

  const presentedRatingValue =
    reviewsAmount === 0 ? '-' : presetValue ?? (lastHoverRatingValue || lastActiveRatingValue || 0);

  return (
    <div className={classNames(CLASS_NAMES.WIDGET, 'pev-flex', externalClassName)}>
      {asSingleIcon ? (
        <div className={CLASS_NAMES.ICON__SINGLE}>
          <i className={classNames(CLASS_NAMES.ICON, MAYBE_ACTIVE_SINGLE_ICON)}></i>
          <i className={classNames(CLASS_NAMES.ICON, CLASS_NAMES.ICON__ODD, MAYBE_ACTIVE_SINGLE_ICON)}></i>
        </div>
      ) : (
        <div className={CLASS_NAMES.ICON_BUTTONS}>
          {ratingValues.map((ratingValue, index) => {
            const { iconClasses, btnEventHandlers } = getRatingsMetadata(ratingValue, index);

            return (
              <button
                className={CLASS_NAMES.ICON_BTN}
                {...btnEventHandlers}
                title={ratingValue}
                aria-label={ratingValue}
                key={ratingValue}
                type="button"
              >
                <i className={iconClasses.join(' ')}></i>
              </button>
            );
          })}

          {formikField && <input {...formikField} type="hidden" />}
        </div>
      )}
      <p className={CLASS_NAMES.STATS}>
        <span
          className={classNames(
            { [CLASS_NAMES.STAT_NUMERIC__FLUID]: presetValue === undefined },
            { [CLASS_NAMES.STAT_NUMERIC__STANDALONE]: asSingleIcon }
          )}
        >
          {presentedRatingValue} / {REVIEW_RATING_MAX_VALUE}
        </span>{' '}
        {reviewsAmount !== undefined && `(${ratingStatSuffix})`}
      </p>
    </div>
  );
}
