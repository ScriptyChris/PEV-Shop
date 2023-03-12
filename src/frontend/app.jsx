import '@frontend/assets/styles/views/app.scss';

import { hot } from 'react-hot-loader';
import React, { StrictMode, lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

const Shop = lazy(() => import('./shop'));

function ShopSuspenseFallback() {
  const appLoaderElemContent = window.__appLoaderAPI.getContent();
  window.__appLoaderAPI.removeFromDOM();

  return (
    <div
      // transform HTML to JSX, with tradeoff being redundant <div> wrapper
      dangerouslySetInnerHTML={{
        __html: appLoaderElemContent,
      }}
      // mitigate CSS layout nesting
      style={{ display: 'contents' }}
    ></div>
  );
}

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<ShopSuspenseFallback />}>
        <Shop />
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
