import {
  START_LOADING,
  FINISH_LOADING,
  LOGIN,
  REGISTER,
  LOGOUT,
  GET_ALL_USERS,
  GET_USER,
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from '../global/constants';

export const startLoading = () => ({
  type: START_LOADING,
});

export const finishLoading = () => ({
  type: FINISH_LOADING,
});

export const logout = () => ({
  type: LOGOUT,
});

export const login = data => ({
  type: LOGIN,
  payload: data,
});

export const signup = user => ({
  type: REGISTER,
  payload: user,
});

export const getUsers = () => ({
  type: GET_ALL_USERS,
});

export const getUser = (id) => ({
  type: GET_USER,
  id,
});

export const addUser = (user) => ({
  type: ADD_USER,
  user,
});

export const deleteUser = (id) => ({
  type: DELETE_USER,
  id,
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  user,
});

export const updateProfile = (user) => ({
  type: UPDATE_PROFILE,
  data: user,
});

export const changePassword = (values) => ({
  type: CHANGE_PASSWORD,
  payload: values,
});
