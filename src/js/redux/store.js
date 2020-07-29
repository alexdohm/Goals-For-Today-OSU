import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { toDos, auth, teams } from "./reducers";

const reducers = {
  toDos,
  auth,
  teams,
};

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const configureStore = () =>
//   createStore(persistedReducer, compose(applyMiddleware(thunk)));

// Uncomment to activate the redux devtools
export const configureStore = () =>
  createStore(
    persistedReducer,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
