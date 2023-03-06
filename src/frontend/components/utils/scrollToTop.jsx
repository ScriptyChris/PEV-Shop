import '@frontend/assets/styles/views/scrollToTop.scss';

import React, { useState, useEffect, useCallback, useRef } from 'react';

import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';

import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import { subscribeToBodyMutations, unSubscribeFromBodyMutations } from '@frontend/components/utils/bodyObserver';

const translations = {
  scrollToTopBtn: 'scroll to top',
};

const useBtnInfo = () => {
  const originalBtnStyleRight = useRef();
  const getBtnRef = useCallback((btnNode) => {
    if (btnNode) {
      originalBtnStyleRight.current = window.getComputedStyle(btnNode).right;
    }
  }, []);

  return { getBtnRef, originalBtnStyleRight };
};

function ScrollToTop() {
  const { isMobileLayout } = useRWDLayout();
  const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(false);
  const [btnPosCorrection, setBtnPosCorrection] = useState({});
  const { getBtnRef, originalBtnStyleRight } = useBtnInfo();
  const onBodyMutation = useRef(({ paddingRight, marginBottom }) => {
    const currentCorrections = {};
    const originalBtnRight = Number.parseFloat(originalBtnStyleRight.current);
    const targetBtnRight = Number.parseFloat(paddingRight) || 0;
    currentCorrections.right = targetBtnRight ? originalBtnRight + targetBtnRight : null;
    const targetBtnBottom = Number.parseFloat(marginBottom) || 0;
    currentCorrections.bottom = targetBtnBottom ? targetBtnBottom : null;
    const correction = {
      transform: `translateY(${-currentCorrections.bottom}px)`,
      right: currentCorrections.right,
    };

    setBtnPosCorrection((prevPos) => ({ ...prevPos, ...correction }));
  });

  useEffect(() => {
    const subscriptionID = subscribeToBodyMutations(onBodyMutation.current);
    document.addEventListener('scroll', toggleScrollBtnVisibility, { passive: true });

    return () => {
      unSubscribeFromBodyMutations(subscriptionID);
      document.removeEventListener('scroll', toggleScrollBtnVisibility, { passive: true });
    };
  }, []);

  const toggleScrollBtnVisibility = () => setIsScrollBtnVisible(window.scrollY > 0);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isScrollBtnVisible} ref={getBtnRef} style={btnPosCorrection}>
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

export default ScrollToTop;
