require('./styles/main.scss');
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { persistGate, PersistGate} from 'redux-persist/lib/integration/react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';

import CreateAccountPage from './js/CreateAccountPage.js';
import LoginPage from './js/Loginpage.js';
import HomePage from './js/HomePage.js';
import SettingsPage from './js/SettingsPage';
import TeamOverviewPage from './js/TeamOverviewPage';
import { configureStore } from './js/redux/store.js';
import requireAuth from './js/components/RequireAuth';
import { auth } from './js/redux/reducers';
import { setCurrentUser, setAuthorizationToken } from './js/redux/actions';

const wrapper = document.querySelector('#container');

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={LoginPage} />
          <Route exact path='/home' component={requireAuth(HomePage)} />
          <Route exact path='/create-account' component={CreateAccountPage} />
          <Route exact path='/settings' component={requireAuth(SettingsPage)} />
          <Route exact path='/team-overview' component={requireAuth(TeamOverviewPage)}/>
          <Route render={() => <h3>Goals for today 404 page</h3>} />
        </Switch>
      </div>
    </Router>
  );
}

const store = configureStore();
const persistor = persistStore(store);

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // prevent someone from manually setting a key of 'jwtToken' in localStorage
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch (e) {
    store.dispatch(setCurrentUser({}));
  }
}

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