import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';
import Main from './components/main';
import Footer from './components/footer';

const RootComponents = (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);

ReactDOM.render(RootComponents, document.querySelector('#root'));
