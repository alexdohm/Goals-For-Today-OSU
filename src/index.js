require('./styles/main.scss');
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import CreateAccountPage from './js/CreateAccountPage.js';
import LoginPage from './js/Loginpage.js';
import HomePage from './js/HomePage.js';
import { configureStore } from './js/redux/store.js';

const wrapper = document.querySelector('#container');

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={LoginPage} />
          <Route path='/home' component={HomePage} />
          <Route path='/create-account' component={CreateAccountPage} />
        </Switch>
      </div>
    </Router>
  );
}

if (wrapper) {
  ReactDOM.render(
    <Provider store={configureStore()}>
      <App />
    </Provider>,
    wrapper
  );
} 