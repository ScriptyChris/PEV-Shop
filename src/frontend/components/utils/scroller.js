import React, { createRef, useEffect, useState } from 'react';

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

export default function Scroller({ render }) {
  const [listRef, setListRef] = useState(createRef());
  const [scrollingBtnVisible, setScrollingBtnVisible] = useState(false);
  const [leftBtnDisabled, setLeftBtnDisabled] = useState(true);
  const [rightBtnDisabled, setRightBtnDisabled] = useState(false);
  const SCROLL_VARIABLE = {
    NAME: '--scrollValue',
    BASE_VALUE: 15,
    LEFT_EDGE: 0,
  };
  const SCROLL_DIRECTION = { LEFT: 1, RIGHT: -1 };

  useEffect(() => {
    checkIfElementOverflows(true);
    window.addEventListener('resize', checkIfElementOverflows);
    listRef.current.addEventListener('transitionend', handleElementToParentOffsetChange);

    return () => {
      window.removeEventListener('resize', checkIfElementOverflows);
      listRef.current.removeEventListener('transitionend', handleElementToParentOffsetChange);
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) {
      setListRef(createRef());
    }
  });

  const checkIfElementOverflows = (ignoreHandlingOffset) => {
    const target = listRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    toggleScrollButtons(doesElementOverflow, ignoreHandlingOffset);
  };

  const toggleScrollButtons = (showScrollingButtons, ignoreHandlingOffset) => {
    setScrollingBtnVisible(showScrollingButtons);

    if (!ignoreHandlingOffset) {
      handleElementToParentOffsetChange();
    }
  };

  const handleElementToParentOffsetChange = () => {
    const elementRef = listRef.current;
    const { left: elementLeftOffset, right: elementRightOffset } = elementRef.getBoundingClientRect();
    const { left: parentLeftOffset, right: parentRightOffset } = elementRef.parentNode.getBoundingClientRect();
    const leftOffsetGreaterThanParent = Math.round(elementLeftOffset) >= Math.round(parentLeftOffset);
    const rightOffsetLessThanParent = Math.round(elementRightOffset) <= Math.round(parentRightOffset);

    setLeftBtnDisabled(leftOffsetGreaterThanParent);
    setRightBtnDisabled(rightOffsetLessThanParent);

    if (leftOffsetGreaterThanParent) {
      scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    } else if (rightOffsetLessThanParent) {
      const rightEdge = elementRef.parentNode.offsetWidth - elementRef.offsetWidth;
      scrollToDirection(null, rightEdge);
    }
  };

  const scrollToDirection = (direction, value) => {
    const oldScrollValue = Number(listRef.current.style.getPropertyValue(SCROLL_VARIABLE.NAME));
    const newScrollValue = oldScrollValue + SCROLL_VARIABLE.BASE_VALUE * direction;

    const scrollValue = direction === null ? value : newScrollValue;

    listRef.current.style.setProperty(SCROLL_VARIABLE.NAME, scrollValue);
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
      <div className="scrollable">{render(listRef)}</div>
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
