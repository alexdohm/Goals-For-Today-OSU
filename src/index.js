require('./styles/main.scss');
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { persistGate, PersistGate} from 'redux-persist/lib/integration/react';

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

const store = configureStore();
const persistor = persistStore(store);

if (wrapper) {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate 
        loading={<div>Loading...</div>}
        persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    wrapper
  );
} 