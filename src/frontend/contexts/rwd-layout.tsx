import React, { createContext, useState, useMemo, useEffect } from 'react';

const RWDLayoutContext = createContext(undefined);

const mediaQueryList = (() => {
  const documentStyles = window.getComputedStyle(document.documentElement);
  const mediaQueriesNames = documentStyles.getPropertyValue('--media-queries-var-names').trim().split(' ');
  const mqls = mediaQueriesNames.map((queryName) => {
    const mediaQuery = documentStyles
      .getPropertyValue(queryName)
      .trim()
      .replace(/\\a|\s{2,}/g, '');

    const mql: TMQLWithName = window.matchMedia(mediaQuery);
    const deviceName = queryName.match(/(?<=--)\w+/)?.[0];

    if (!deviceName) {
      throw Error(`Media query deviceName "${deviceName}" for queryName "${queryName}" not found!`);
    }

    mql.__deviceName = deviceName;

    return mql;
  });

  return mqls;
})();

const useRWDMediaQuery = () => {
  const [currentMediaQueryName, setCurrentMediaQueryName] = useState(
    (mediaQueryList.find(({ matches }) => matches) || mediaQueryList[0]).__deviceName
  );

  useEffect(() => {
    function onMQLChange({ matches, media }) {
      if (matches) {
        const matchedMediaName = mediaQueryList.find((mql) => media === mql.media)?.__deviceName;

        if (!matchedMediaName) {
          throw Error(`matchedMediaName for media "${media}" not found!`);
        }

        setCurrentMediaQueryName(matchedMediaName);
      }
    }

    mediaQueryList.forEach((mql) => mql.addEventListener('change', onMQLChange));

    return () => mediaQueryList.forEach((mql) => mql.removeEventListener('change', onMQLChange));
  }, []);

  const mediaQueryCheckers = useMemo(
    () =>
      mediaQueryList.reduce((output, { __deviceName: mqName }) => {
        const upperCasedMQName = `${mqName[0].toUpperCase()}${mqName.slice(1)}`;
        const getterName = `is${upperCasedMQName}Layout`;

        return {
          ...output,
          get [getterName]() {
            return currentMediaQueryName === mqName;
          },
        };
      }, {}),
    [currentMediaQueryName]
  );

  return mediaQueryCheckers;
};

function RWDLayoutProvider({ children }) {
  return <RWDLayoutContext.Provider value={useRWDMediaQuery()}>{children}</RWDLayoutContext.Provider>;
}

function useRWDLayout() {
  const context = React.useContext(RWDLayoutContext);

  if (context === undefined) {
    throw new Error('useRWDLayout must be used within a RWDLayoutProvider!');
  }

  return context;
}

export { RWDLayoutProvider, useRWDLayout };