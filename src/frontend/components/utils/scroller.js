import React, { createRef, useEffect, useState } from 'react';

const SCROLL_DIRECTION = { LEFT: -1, RIGHT: 1 };

function ScrollButton({ elementToScroll, directionPointer, isVisible, text }) {
  const SCROLL_VARIABLE = {
    NAME: '--scrollValue',
    BASE_VALUE: 15,
  };

  const scrollToDirection = () => {
    const oldScrollValue = Number(elementToScroll.style.getPropertyValue(SCROLL_VARIABLE.NAME));
    const newScrollValue = oldScrollValue + SCROLL_VARIABLE.BASE_VALUE * directionPointer;

    elementToScroll.style.setProperty(SCROLL_VARIABLE.NAME, newScrollValue);
  };

  return (
    <button
      onClick={scrollToDirection}
      className={`scroller-btn ${isVisible ? 'scroller-btn--visible' : ''}`}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}

export default function Scroller({ render }) {
  const [listRef, setListRef] = useState(createRef());
  const [scrollingBtnVisible, setScrollingBtnVisible] = useState(false);

  useEffect(() => {
    checkIfElementOverflows();
    window.addEventListener('resize', checkIfElementOverflows);

    return () => {
      window.removeEventListener('resize', checkIfElementOverflows);
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) {
      setListRef(createRef());
    }
  });

  const checkIfElementOverflows = () => {
    const target = listRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    toggleScrollButtons(doesElementOverflow);
  };

  const toggleScrollButtons = (showScrollingButtons) => {
    setScrollingBtnVisible(showScrollingButtons);
  };

  return (
    <>
      <ScrollButton
        elementToScroll={listRef.current}
        directionPointer={SCROLL_DIRECTION.LEFT}
        isVisible={scrollingBtnVisible}
        text={'&larr;'}
      />
      <div className="scrollable">{render(listRef)}</div>
      <ScrollButton
        elementToScroll={listRef.current}
        directionPointer={SCROLL_DIRECTION.RIGHT}
        isVisible={scrollingBtnVisible}
        text={'&rarr;'}
      />
    </>
  );
}
