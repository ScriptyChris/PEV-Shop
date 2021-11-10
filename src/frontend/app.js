import { hot } from 'react-hot-loader';
import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Main />
      <Footer />
    </BrowserRouter>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
