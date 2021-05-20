import React, { createRef, useEffect, useRef, useState } from 'react';

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
  const headRowRefs = useRef([]);
  const bodyRowRefs = useRef([]);
  const resizeObserverRef = useRef(null);

  const REF_TYPE = {
    HEAD: 'head',
    BODY: 'body',
  };
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
    elementRef.current.parentNode.dataset.scrollableParent = 'true';

    setupResizeObserver();
    checkIfElementOverflows();

    return () => {
      window.removeEventListener('resize', checkIfElementOverflows);
      elementRef.current.removeEventListener('transitionend', handleElementToParentOffsetChange);
      resizeObserverRef.current.disconnect();
    };
  }, []);

  const createRefGetter = (refType) => {
    return function refGetter(ref) {
      if (!ref) {
        return null;
      }

      if (refType === REF_TYPE.HEAD) {
        updateHeadOrBodyRefs(headRowRefs, ref);
      } else if (refType === REF_TYPE.BODY) {
        updateHeadOrBodyRefs(bodyRowRefs, ref);
      } else {
        throw TypeError(`Got incorrect "refType" variable "${refType}"!`);
      }

      return ref;
    };

    function updateHeadOrBodyRefs(refs, ref) {
      if (!refs.current.some((refOfType) => refOfType === ref)) {
        refs.current = refs.current.concat(ref);
      }
    }
  };

  const setupResizeObserver = () => {
    if (
      headRowRefs.current.length > 0 &&
      bodyRowRefs.current.length > 0 &&
      headRowRefs.current.length === bodyRowRefs.current.length
    ) {
      const equalizeTableHeaderRowsHeightToAssociatedBodyRows = (entries) => {
        const refIndexes = bodyRowRefs.current
          .map((ref) => entries.findIndex(({ target }) => target === ref))
          .filter((refIndex) => refIndex > -1);

        refIndexes.forEach((refIndex) => {
          headRowRefs.current[refIndex].style.height = `${bodyRowRefs.current[refIndex].clientHeight}px`;
        });
      };

      resizeObserverRef.current = new window.ResizeObserver(equalizeTableHeaderRowsHeightToAssociatedBodyRows);
      bodyRowRefs.current.forEach((bodyRow) => resizeObserverRef.current.observe(bodyRow));
    } else {
      throw Error(
        `headRowRefs or bodyRowRefs are empty or have different sizes. headRowRefs: ${[
          ...headRowRefs.current,
        ]}, bodyRowRefs: ${[...bodyRowRefs.current]}`
      );
    }
  };

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
      {render({
        elementRef,
        forwardProps,
        headRowRefGetter: createRefGetter(REF_TYPE.HEAD),
        bodyRowRefGetter: createRefGetter(REF_TYPE.BODY),
      })}
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
