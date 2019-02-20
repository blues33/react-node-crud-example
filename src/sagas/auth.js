import { call, all, takeLatest, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { toastr } from 'react-redux-toastr';

import {
  LOGIN,
  LOGIN_SUCCESS,
  REGISTER,
  REGISTER_SUCCESS,
} from '../global/constants';
import { anonymousRequest } from '../utils/api';

function* login(action) {
  try {
    const loginReponse = yield call(anonymousRequest, 'post', '/users/login', { body: action.payload });
    yield put({ type: LOGIN_SUCCESS, payload: loginReponse.data.data });
    yield call(toastr.success, '', 'Logged in successfully');
    yield put(push('/'));
  } catch (error) {
    console.log(error.toString());
    yield call(toastr.error, 'Error', 'Invalid email or password');
  }
}

function* register(action) {
  try {
    const registerResponse = yield call(anonymousRequest, 'post', '/users/register', { body: action.payload });
    yield put({ type: REGISTER_SUCCESS, payload: registerResponse.data.data });
    yield call(toastr.success, '', 'Successfully registered your user');
    yield put(push('/'));
  } catch (error) {
    yield call(toastr.error, 'Error', 'Invalid user information');
    yield put(push('/'));
  }
}

export default function* authSaga() {
  yield all([
    yield takeLatest(LOGIN, login),
    yield takeLatest(REGISTER, register),
  ]);
}
