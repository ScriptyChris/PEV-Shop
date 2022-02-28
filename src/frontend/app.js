import { hot } from 'react-hot-loader';
import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';
import { MobileLayoutProvider } from './contexts/mobile-layout';

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <MobileLayoutProvider>
        <Header />
        <Main />
        <Footer />
      </MobileLayoutProvider>
    </BrowserRouter>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
