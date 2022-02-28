import React, { createContext, useState, useEffect } from 'react';

const MobileLayoutContext = createContext(undefined);

const mediaQueryList = (() => {
  const MOBILE_MEDIA_QUERY_BOUNDARY = '(max-width: 375px)';
  const mql = window.matchMedia(MOBILE_MEDIA_QUERY_BOUNDARY);

  return mql;
})();

const useMobileMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(mediaQueryList.matches);

  useEffect(() => {
    mediaQueryList.addEventListener('change', () => {
      setIsMobile(mediaQueryList.matches);
    });
  }, []);

  return isMobile;
};

function MobileLayoutProvider({ children }) {
  const isMobileLayout = useMobileMediaQuery();

  return <MobileLayoutContext.Provider value={isMobileLayout}>{children}</MobileLayoutContext.Provider>;
}

function useMobileLayout() {
  const context = React.useContext(MobileLayoutContext);

  if (context === undefined) {
    throw new Error('useMobileLayout must be used within a MobileLayoutProvider!');
  }

  return context;
}

export { MobileLayoutProvider, useMobileLayout };
