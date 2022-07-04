import React, { useState, useEffect } from 'react';

import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';

import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  scrollToTopBtn: 'scroll to top',
};

function ScrollToTop() {
  const { isMobileLayout } = useRWDLayout();
  const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(false);

  useEffect(() => {
    document.addEventListener('scroll', toggleScrollBtnVisibility, { passive: true });

    return () => document.removeEventListener('scroll', toggleScrollBtnVisibility, { passive: true });
  }, []);

  const toggleScrollBtnVisibility = () => setIsScrollBtnVisible(window.scrollY > 0);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isScrollBtnVisible}>
      <Fab
        onClick={handleScrollToTop}
        color="primary"
        className="scroll-to-top-btn"
        size={isMobileLayout ? 'small' : 'large'}
        aria-label={translations.scrollToTopBtn}
        title={translations.scrollToTopBtn}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

export { ScrollToTop };
