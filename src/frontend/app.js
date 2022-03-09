import { hot } from 'react-hot-loader';
import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';
import { MobileLayoutProvider } from './contexts/mobile-layout';
import { MUIThemeProvider } from './contexts/mui-theme';

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <StylesProvider
        injectFirst
        // TODO: [build code redundancy] use that to prevent MUI from generating internal CSS
        // disableGeneration={true}
      >
        <MUIThemeProvider>
          <MobileLayoutProvider>
            <Header />
            <Main />
            <Footer />
          </MobileLayoutProvider>
        </MUIThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
