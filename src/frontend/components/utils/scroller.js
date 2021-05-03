import React, { createRef, useEffect, useState } from 'react';

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
    console.log('? listRef:', listRef);

    if (!listRef.current) {
      setListRef(createRef());
    }
  });

  const checkIfElementOverflows = () => {
    const target = listRef.current.parentNode;
    const doesElementOverflow = target.clientWidth < target.scrollWidth;

    if (doesElementOverflow) {
      console.log('overflow happens...');
    }

    toggleScrollButtons(doesElementOverflow);

    // console.log(
    //   'on resize... /listRef:',
    //   listRef.current,
    //   ' /parent clientWidth: ',
    //   listRef.current.parentNode.clientWidth,
    //   ' /parent scrollWidth:',
    //   listRef.current.parentNode.scrollWidth
    // );
  };

  const toggleScrollButtons = (showScrollingButtons) => {
    console.log('showScrollingButtons?', showScrollingButtons);

    // if (showScrollingButtons !== scrollingBtnVisible) {
    setScrollingBtnVisible(showScrollingButtons);
    // }
  };

  return (
    <>
      <button className={`scroller-btn ${scrollingBtnVisible ? 'scroller-btn--visible' : ''}`}>&larr;</button>
      {render(listRef)}
      <button className={`scroller-btn ${scrollingBtnVisible ? 'scroller-btn--visible' : ''}`}>&rarr;</button>
    </>
  );
}
