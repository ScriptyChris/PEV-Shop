import 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './assets/styles/main.scss';
import Header from './components/views/header';
import Main from './components/views/main';
import Footer from './components/views/footer';

const App = (
  <>
    <Router>
      <Header />
      <Main />
      <Footer />
    </Router>
  </>
);

hot(ReactDOM.render(App, document.querySelector('#app')));
