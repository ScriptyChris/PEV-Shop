import { hot } from 'react-hot-loader';
import React, { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';

const App = () => (
  <StrictMode>
    <Router>
      <Header />
      <Main />
      <Footer />
    </Router>
  </StrictMode>
);

// eslint-disable-next-line
export default hot(module)(App);
