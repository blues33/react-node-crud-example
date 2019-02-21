import _ from 'lodash';

import {
  SET_USERS_LIST,
  SET_CURRENT_USER,
  USER_ADDED,
  USER_UPDATED,
  USER_DELETED,
  LOGOUT,
} from '../global/constants';

const initialState = {
  users: [],
  currentUser: null,
};

export default function usersReducer(state = initialState, action) {
  let users = _.map(state.users, _.clone);
  switch (action.type) {
    case USER_ADDED:
      users.push(action.user);
      return {
        ...state,
        users,
      };
    case SET_USERS_LIST:
      return {
        ...state,
        users: action.users,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.user,
      };
    case USER_UPDATED:
      users = users.map((user) => {
        if (user._id === action.user._id) {
          return action.user;
        }
        return user;
      });
      return {
        ...state,
        users,
      };
    case USER_DELETED:
      const index = users.findIndex((user) => user._id === action.user._id);
      if (index >= 0) {
        users.splice(index, 1);
      }
      return {
        ...state,
        users,
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
