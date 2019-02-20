import { call, all, takeLatest, put } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import { push } from 'connected-react-router';

import {
  GET_ALL_USERS,
  SET_USERS_LIST,
  ADD_USER,
  USER_ADDED,
  UPDATE_USER,
  USER_UPDATED,
  DELETE_USER,
  USER_DELETED,
} from '../global/constants';
import { authorizedRequest } from '../utils/api';

function* getAllUsers(action) {
  try {
    const response = yield call(authorizedRequest, 'get', '/users');
    yield put({ type: SET_USERS_LIST, users: response.data.data });
  } catch (error) {
    console.log('get users error: ', error);
  }
}

function* addUser(action) {
  try {
    const response = yield call(authorizedRequest, 'post', '/users', { body: action.user });
    yield put({ type: USER_ADDED, user: response.data.data });
    yield call(toastr.success, '', 'Successfully created user');
    yield put(push('/users'));
  } catch (error) {
    console.log('add user error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* updateUser(action) {
  try {
    const response = yield call(authorizedRequest, 'put', `/users/${action.user.id}`, { body: action.user });
    yield put({ type: USER_UPDATED, user: response.data.data });
    yield call(toastr.success, '', 'Successfully updated user');
    yield put(push('/users'));
  } catch (error) {
    console.log('update user error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* deleteUser(action) {
  try {
    const response = yield call(authorizedRequest, 'delete', `/users/${action.id}`);
    yield put({ type: USER_DELETED, user: response.data.data });
    yield call(toastr.success, '', 'Successfully removed user');
  } catch (error) {
    console.log('delete user error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

export default function* adminSaga() {
  yield all([
    yield takeLatest(GET_ALL_USERS, getAllUsers),
    yield takeLatest(ADD_USER, addUser),
    yield takeLatest(UPDATE_USER, updateUser),
    yield takeLatest(DELETE_USER, deleteUser),
  ]);
}
