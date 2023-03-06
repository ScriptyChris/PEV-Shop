import React, { lazy } from 'react';

const MUIThemeProvider = lazy(() => import('./contexts/mui-theme'));

import { RWDLayoutProvider } from './contexts/rwd-layout';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';

/*
  TODO: [UX] save user session to storage when page is unloaded (like by reloading or closing it).
  It may be done via window's 'beforeunload' event, but it's better to use Page Lifecycle (API)
  https://developers.google.com/web/updates/2018/07/page-lifecycle-api#observing-page-lifecycle-states-in-code
*/
import userSessionService from '@frontend/features/userSessionService';
userSessionService.restoreSession();

export default function Shop() {
  return (
    <MUIThemeProvider>
      <RWDLayoutProvider>
        <Header />
        <Main />
        <Footer />
      </RWDLayoutProvider>
    </MUIThemeProvider>
  );
}
