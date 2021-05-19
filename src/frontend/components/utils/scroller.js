import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';

function ScrollButton({ directionPointer, handleClick, isVisible, isDisabled, text }) {
  return (
    <button
      onClick={() => handleClick(directionPointer)}
      className={`scroller-btn ${isVisible ? 'scroller-btn--visible' : ''}`}
      disabled={isDisabled}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}

export default function Scroller({ render, forwardProps }) {
  const [elementRef] = useState(createRef());
  const [scrollingBtnVisible, setScrollingBtnVisible] = useState(false);
  const [leftBtnDisabled, setLeftBtnDisabled] = useState(true);
  const [rightBtnDisabled, setRightBtnDisabled] = useState(false);
  const resizedObservedRefs = useRef([]);

  const SCROLL_VARIABLE = {
    NAME: '--scrollValue',
    BASE_VALUE: 15,
    LEFT_EDGE: 0,
  };
  const SCROLL_DIRECTION = { LEFT: 1, RIGHT: -1 };

  useEffect(() => {
    window.addEventListener('resize', checkIfElementOverflows);
    elementRef.current.addEventListener('transitionend', handleElementToParentOffsetChange);
    elementRef.current.dataset.scrollable = 'true';

    console.warn('resizedObservedRefs:', resizedObservedRefs);

    checkIfElementOverflows();

    return () => {
      window.removeEventListener('resize', checkIfElementOverflows);
      elementRef.current.removeEventListener('transitionend', handleElementToParentOffsetChange);
    };
  }, []);

  const resizedObservedRef = useCallback((ref) => {
    // const refIndex = [...ref.parentNode.children].findIndex(child => child === ref);
    resizedObservedRefs.current = resizedObservedRefs.current.concat({
      body: ref,
      header: null,
    });

    return ref;
  }, []);

  const checkIfElementOverflows = (resizeEvent) => {
    const target = elementRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    toggleScrollButtons(doesElementOverflow, resizeEvent);
  };

  const toggleScrollButtons = (showScrollingButtons, resizeEvent) => {
    setScrollingBtnVisible(showScrollingButtons);

    if (resizeEvent) {
      handleElementToParentOffsetChange();
    }
  };

  const handleElementToParentOffsetChange = () => {
    const { left: elementLeftOffset, right: elementRightOffset } = elementRef.current.getBoundingClientRect();
    const { left: parentLeftOffset, right: parentRightOffset } = elementRef.current.parentNode.getBoundingClientRect();
    const leftOffsetGreaterThanParent = Math.round(elementLeftOffset) >= Math.round(parentLeftOffset);
    const rightOffsetLessThanParent = Math.round(elementRightOffset) <= Math.round(parentRightOffset);

    setLeftBtnDisabled(leftOffsetGreaterThanParent);
    setRightBtnDisabled(rightOffsetLessThanParent);

    if (leftOffsetGreaterThanParent) {
      scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    } else if (rightOffsetLessThanParent) {
      const rightEdge = elementRef.current.parentNode.offsetWidth - elementRef.current.offsetWidth;
      scrollToDirection(null, rightEdge);
    }
  };

  const scrollToDirection = (direction, value) => {
    const oldScrollValue = Number(elementRef.current.style.getPropertyValue(SCROLL_VARIABLE.NAME));
    const newScrollValue = oldScrollValue + SCROLL_VARIABLE.BASE_VALUE * direction;

    const scrollValue = direction === null ? value : newScrollValue;

    elementRef.current.style.setProperty(SCROLL_VARIABLE.NAME, scrollValue);
  };

  return (
    <>
      <ScrollButton
        directionPointer={SCROLL_DIRECTION.LEFT}
        isVisible={scrollingBtnVisible}
        isDisabled={leftBtnDisabled}
        text={'&larr;'}
        handleClick={scrollToDirection}
      />
      {render({ elementRef, forwardProps, resizedObservedRef })}
      <ScrollButton
        directionPointer={SCROLL_DIRECTION.RIGHT}
        isVisible={scrollingBtnVisible}
        isDisabled={rightBtnDisabled}
        text={'&rarr;'}
        handleClick={scrollToDirection}
      />
    </>
  );
}
