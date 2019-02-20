import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr';

import authentication from './authentication';
import restaurants from './restaurants';
import users from './users';
import reviews from './reviews';

export default (history) => combineReducers({
  authentication,
  restaurants,
  users,
  reviews,
  router: connectRouter(history),
  form: formReducer,
  toastr: toastrReducer,
});
