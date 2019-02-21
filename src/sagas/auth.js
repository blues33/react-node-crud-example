import {
  call, all, takeLatest, put,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { toastr } from 'react-redux-toastr';

import {
  LOGIN,
  LOGIN_SUCCESS,
  REGISTER,
  REGISTER_SUCCESS,
  CHANGE_PASSWORD,
} from '../global/constants';
import { anonymousRequest, authorizedRequest } from '../utils/api';

function* login(action) {
  try {
    const loginReponse = yield call(anonymousRequest, 'post', '/users/login', { body: action.payload });
    yield put({ type: LOGIN_SUCCESS, payload: loginReponse.data.data });
    yield call(toastr.success, '', 'Login success');
    yield put(push('/'));
  } catch (error) {
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* register(action) {
  try {
    const registerResponse = yield call(anonymousRequest, 'post', '/users/register', { body: action.payload });
    yield put({ type: REGISTER_SUCCESS, payload: registerResponse.data.data });
    yield call(toastr.success, '', 'Successfully registered your user');
    yield put(push('/'));
  } catch (error) {
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* changePassword(action) {
  try {
    yield call(authorizedRequest, 'put', '/users/password', { body: action.payload });
    yield call(toastr.success, '', 'Successfully changed password');
  } catch (error) {
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

export default function* authSaga() {
  yield all([
    yield takeLatest(LOGIN, login),
    yield takeLatest(REGISTER, register),
    yield takeLatest(CHANGE_PASSWORD, changePassword),
  ]);
}
