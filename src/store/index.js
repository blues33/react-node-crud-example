import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { createBrowserHistory } from 'history';

import createRootReducer from '../reducers';
import rootSaga from '../sagas';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authentication'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  thunkMiddleware,
  sagaMiddleware,
  routerMiddleware(history),
  logger,
];
const enhancers = [];

if (process.env.NODE_ENV === 'development') {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);
const store = createStore(
  connectRouter(history)(persistedReducer),
  initialState,
  composedEnhancers
);

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
