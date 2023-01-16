/**
 * @module
 */

import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import { PEVIconButton } from '@frontend/components/utils/pevElements';

const translations = {
  scrollLeftBtn: 'scroll left',
  scrollRightBtn: 'scroll right',
};

const REF_TYPE = Object.freeze({
  HEAD: 'head',
  BODY: 'body',
});

const SCROLL_DIRECTION = Object.freeze({ LEFT: 1, RIGHT: -1 });

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

const setParentHeightEqualToScrollable = (scrollableElement) => {
  const remValueInPx = Number.parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
  const observer = new MutationObserver(() => {
    const scrollableMinRemHeight = Math.ceil(scrollableElement.clientHeight / remValueInPx) || 3;

    scrollableElement.parentNode.style.setProperty('--scrollable-min-height', `${scrollableMinRemHeight}rem`);
  });
  observer.observe(scrollableElement, { childList: true, subtree: true });

  return observer;
};

function ScrollButton({ directionPointer, handleClick, isVisible, isDisabled, direction, portalTargetPlace }) {
  if (direction !== 'left' && direction !== 'right') {
    throw Error(`Property 'direction' must be either 'left' or 'right'! Received: '${direction}'.`);
  }

  const IS_LEFT = direction === 'left';
  const TheScrollButton = (
    <Fade in={isVisible} elevation={0}>
      <Paper data-compare-btn-scroll-dir={direction}>
        <PEVIconButton
          onClick={() => handleClick(directionPointer)}
          disabled={isDisabled}
          a11y={IS_LEFT ? translations.scrollLeftBtn : translations.scrollRightBtn}
        >
          {IS_LEFT ? <ChevronLeft /> : <ChevronRight />}
        </PEVIconButton>
      </Paper>
    </Fade>
  );

  return portalTargetPlace?.current ? createPortal(TheScrollButton, portalTargetPlace.current) : TheScrollButton;
}

function getScrollerHookingParent(getScrollerElementRef) {
  return function ScrollerHookingParent({ children, ...restProps }) {
    return (
      <div data-scrollable-parent="true" {...restProps}>
        {React.Children.map(children, (child) => React.cloneElement(child, { ref: getScrollerElementRef }))}
      </div>
    );
  };
}

// TODO: [UX] implement swipe scroll for mobile
// TODO: [UX] implement automatic scrolling to the currently clicked and focused list item
export default function Scroller({ render, scrollerBaseValueMeta, forwardProps, btnsParentRef }) {
  const scrollerElementRef = useRef();
  const getScrollerElementRef = useCallback((scrollerNode) => {
    if (scrollerNode) {
      scrollerElementRef.current = scrollerNode;
      window.addEventListener('resize', handleElementOverflow);
      scrollerNode.addEventListener('transitionend', handleElementToParentOffsetChange);
      scrollerNode.dataset.scrollable = 'true';
    }
  }, []);
  const [scrollingBtnVisible, setScrollingBtnVisible] = useState(false);
  const [leftBtnDisabled, setLeftBtnDisabled] = useState(true);
  const [rightBtnDisabled, setRightBtnDisabled] = useState(false);
  const headRowRefs = useRef([]);
  const bodyRowRefs = useRef([]);
  const resizeObserverRef = useRef(null);
  const [multipleRefsGetterUsed, setMultipleRefsGetterUsed] = useState(false);
  // TODO: [DX] consider if useMemo is needed if scrollBaseValue is used just once
  const scrollBaseValue = scrollerBaseValueMeta.useDefault
    ? 50
    : useMemo(() => getScrollBaseValue(scrollerBaseValueMeta), []);
  const SCROLL_VARIABLE = {
    NAME: '--scrollValue',
    BASE_VALUE: scrollBaseValue,
    LEFT_EDGE: 0,
  };

  useEffect(() => {
    if (!scrollerElementRef.current) {
      return;
    }

    const scrollableSubtreeObserver = setParentHeightEqualToScrollable(scrollerElementRef.current);

    return () => {
      window.removeEventListener('resize', handleElementOverflow);
      scrollerElementRef.current.removeEventListener('transitionend', handleElementToParentOffsetChange);
      scrollableSubtreeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!multipleRefsGetterUsed) {
      return;
    }

    setupResizeObserver();

    return () => resizeObserverRef.current.disconnect();
  }, [multipleRefsGetterUsed]);

  useEffect(() => {
    if (scrollerElementRef.current) {
      handleElementOverflow();
    }
  }, [forwardProps && forwardProps.trackedChanges]);

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

  const handleElementOverflow = () => {
    const target = scrollerElementRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    toggleScrollButtons(doesElementOverflow);
  };

  const toggleScrollButtons = (showScrollingButtons) => {
    setScrollingBtnVisible(showScrollingButtons);
    handleElementToParentOffsetChange();
  };

  const handleElementToParentOffsetChange = () => {
    const { left: elementLeftOffset, right: elementRightOffset } = scrollerElementRef.current.getBoundingClientRect();
    const { left: parentLeftOffset, right: parentRightOffset } =
      scrollerElementRef.current.parentNode.getBoundingClientRect();
    const leftOffsetGreaterThanParent = Math.round(elementLeftOffset) >= Math.round(parentLeftOffset);
    const rightOffsetLessThanParent = Math.round(elementRightOffset) <= Math.round(parentRightOffset);

    setLeftBtnDisabled(leftOffsetGreaterThanParent);
    setRightBtnDisabled(rightOffsetLessThanParent);

    if (leftOffsetGreaterThanParent) {
      scrollToDirection(null, SCROLL_VARIABLE.LEFT_EDGE);
    } else if (rightOffsetLessThanParent) {
      const rightEdge = scrollerElementRef.current.parentNode.offsetWidth - scrollerElementRef.current.offsetWidth;
      scrollToDirection(null, rightEdge);
    }
  };

  const scrollToDirection = (direction, value) => {
    const oldScrollValue = Number(scrollerElementRef.current.style.getPropertyValue(SCROLL_VARIABLE.NAME));
    const newScrollValue = oldScrollValue + SCROLL_VARIABLE.BASE_VALUE * direction;

    const scrollValue = direction === null ? value : newScrollValue;

    scrollerElementRef.current.style.setProperty(SCROLL_VARIABLE.NAME, scrollValue);
  };

  const childRenderingArgs = {
    ScrollerHookingParent: React.useMemo(() => getScrollerHookingParent(getScrollerElementRef), []),
    forwardProps,
    get multipleRefsGetter() {
      if (!multipleRefsGetterUsed) {
        setMultipleRefsGetterUsed(true);
      }

      return { createRefGetter, REF_TYPE };
    },
  };

  return (
    <>
      <ScrollButton
        directionPointer={SCROLL_DIRECTION.LEFT}
        isVisible={scrollingBtnVisible}
        isDisabled={leftBtnDisabled}
        direction="left"
        portalTargetPlace={btnsParentRef}
        handleClick={scrollToDirection}
      />

      {render(childRenderingArgs)}

      <ScrollButton
        directionPointer={SCROLL_DIRECTION.RIGHT}
        isVisible={scrollingBtnVisible}
        isDisabled={rightBtnDisabled}
        direction="right"
        portalTargetPlace={btnsParentRef}
        handleClick={scrollToDirection}
      />
    </>
  );
}
