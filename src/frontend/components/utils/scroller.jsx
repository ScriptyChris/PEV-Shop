import React, { createRef, useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

const translations = {
  scrollLeftBtn: 'scroll left',
  scrollRightBtn: 'scroll right',
};

const getScrollBaseValue = ({ selector = '', varName = '' } = {}) => {
  if (typeof selector !== 'string' || selector.length === 0 || typeof varName !== 'string' || varName.length === 0) {
    return NaN;
  }

  for (const sheet of document.styleSheets) {
    const scrollerBaseValue = [...sheet.cssRules].find(
      (rule) => rule.selectorText === selector && rule.style && [...rule.style].includes(varName)
    );

    if (scrollerBaseValue) {
      return Number.parseInt(scrollerBaseValue.style.getPropertyValue(varName));
    }
  }

  throw Error(
    `Values of {selector: '${selector}'} and {varName: '${varName}'} were not matched in any CSS on the page!`
  );
};

function ScrollButton({ directionPointer, handleClick, isVisible, isDisabled, direction }) {
  if (direction !== 'left' && direction !== 'right') {
    throw Error(`Property 'direction' must be either 'left' or 'right'! Received: '${direction}'.`);
  }

  const IS_LEFT = direction === 'left';

  return (
    <Fade in={isVisible} elevation={0}>
      <Paper>
        <IconButton
          onClick={() => handleClick(directionPointer)}
          aria-label={IS_LEFT ? translations.scrollLeftBtn : translations.scrollRightBtn}
          title={IS_LEFT ? translations.scrollLeftBtn : translations.scrollRightBtn}
          disabled={isDisabled}
        >
          {IS_LEFT ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Paper>
    </Fade>
  );
}

export default function Scroller({ render, scrollerBaseValueMeta, forwardProps }) {
  const [elementRef] = useState(createRef());
  const [scrollingBtnVisible, setScrollingBtnVisible] = useState(false);
  const [leftBtnDisabled, setLeftBtnDisabled] = useState(true);
  const [rightBtnDisabled, setRightBtnDisabled] = useState(false);
  const headRowRefs = useRef([]);
  const bodyRowRefs = useRef([]);
  const resizeObserverRef = useRef(null);
  // TODO: consider if useMemo is really needed if value is only used on first render
  const handleInitialRender = useMemo(() => {
    const initialRenderClassName = 'initial-render';

    return {
      on: () => elementRef.current.classList.add(initialRenderClassName),
      off: () => {
        elementRef.current.classList.remove(initialRenderClassName);
        window.requestAnimationFrame(handleElementOverflow);
      },
    };
  }, []);
  const [multipleRefsGetterUsed, setMultipleRefsGetterUsed] = useState(false);
  // TODO: consider if useMemo is needed if scrollBaseValue is used just once
  const scrollBaseValue = useMemo(() => getScrollBaseValue(scrollerBaseValueMeta), []);

  const REF_TYPE = Object.freeze({
    HEAD: 'head',
    BODY: 'body',
  });
  const SCROLL_VARIABLE = {
    NAME: '--scrollValue',
    BASE_VALUE: scrollBaseValue || 15,
    LEFT_EDGE: 0,
  };
  const SCROLL_DIRECTION = { LEFT: 1, RIGHT: -1 };

  useLayoutEffect(handleInitialRender.on, []);

  useEffect(() => {
    window.addEventListener('resize', handleElementOverflow);
    elementRef.current.addEventListener('transitionend', handleElementToParentOffsetChange);
    elementRef.current.dataset.scrollable = 'true';
    elementRef.current.parentNode.dataset.scrollableParent = 'true';

    setupResizeObserver();
    handleInitialRender.off();

    return () => {
      window.removeEventListener('resize', handleElementOverflow);
      elementRef.current.removeEventListener('transitionend', handleElementToParentOffsetChange);

      if (multipleRefsGetterUsed) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => handleElementOverflow(), [forwardProps && forwardProps.trackedChanges]);

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
    if (multipleRefsGetterUsed) {
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
    }
  };

  const handleElementOverflow = () => {
    const target = elementRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    toggleScrollButtons(doesElementOverflow);
  };

  const toggleScrollButtons = (showScrollingButtons) => {
    setScrollingBtnVisible(showScrollingButtons);
    handleElementToParentOffsetChange();
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
        direction="left"
        handleClick={scrollToDirection}
      />
      {render({
        elementRef,
        forwardProps,
        get multipleRefsGetter() {
          if (!multipleRefsGetterUsed) {
            setMultipleRefsGetterUsed(true);
          }

          return { createRefGetter, REF_TYPE };
        },
      })}
      <ScrollButton
        directionPointer={SCROLL_DIRECTION.RIGHT}
        isVisible={scrollingBtnVisible}
        isDisabled={rightBtnDisabled}
        direction="right"
        handleClick={scrollToDirection}
      />
    </>
  );
}
