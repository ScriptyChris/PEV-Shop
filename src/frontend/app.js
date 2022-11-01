import { hot } from 'react-hot-loader';
import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';
import { RWDLayoutProvider } from './contexts/rwd-layout';
import { MUIThemeProvider } from './contexts/mui-theme';
import userSessionService from '@frontend/features/userSessionService';

/*
  TODO: [UX] save user session to storage when page is unloaded (like by reloading or closing it).
  It may be done via window's 'beforeunload' event, but it's better to use Page Lifecycle (API)
  https://developers.google.com/web/updates/2018/07/page-lifecycle-api#observing-page-lifecycle-states-in-code
*/
userSessionService.restoreSession();

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <StylesProvider
        injectFirst
        // TODO: [build code redundancy] use that to prevent MUI from generating internal CSS
        // disableGeneration={true}
      >
        <MUIThemeProvider>
          <RWDLayoutProvider>
            <Header />
            <Main />
            <Footer />
          </RWDLayoutProvider>
        </MUIThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
