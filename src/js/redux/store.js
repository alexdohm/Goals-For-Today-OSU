import { createStore, combineReducers } from 'redux';
import { toDos } from './reducers';

const reducers = {
  toDos
};
const rootReducer = combineReducers(reducers);

export const configureStore = () => createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());