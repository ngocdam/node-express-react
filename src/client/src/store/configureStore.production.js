// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const enhancer = applyMiddleware(thunk);

const initialState = {};

export default () => {
  return createStore(rootReducer, initialState, enhancer); // eslint-disable-line
}
