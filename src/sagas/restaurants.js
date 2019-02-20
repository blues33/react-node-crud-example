import { call, all, takeLatest, put } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import { push } from 'connected-react-router';

import {
  GET_ALL_RESTAURANTS,
  SET_RESTAURANTS_LIST,
  GET_RESTAURANT,
  SET_CURRENT_RESTAURANT,
  ADD_RESTAURANT,
  UPDATE_RESTAURANT,
  DELETE_RESTAURANT,
} from '../global/constants';
import { authorizedRequest } from '../utils/api';

function* getAllRestaurants(action) {
  try {
    const response = yield call(authorizedRequest, 'get', `/restaurants?operator=${action.query.operand}&rate=${action.query.filterRate}`);
    yield put({ type: SET_RESTAURANTS_LIST, payload: response.data.data });
  } catch (error) {
    console.log('get restaurants error: ', error);
  }
}

function* getRestaurant(action) {
  try {
    const response = yield call(authorizedRequest, 'get', `/restaurants/${action.id}`);
    yield put({ type: SET_CURRENT_RESTAURANT, restaurant: response.data.data });
  } catch (error) {
    console.log('get restaurant error: ', error);
  }
}

function* addRestaurant(action) {
  try {
    yield call(authorizedRequest, 'post', '/restaurants', { body: action.restaurant });
    yield call(toastr.success, '', 'Successfully created new restaurant');
    yield put(push('/restaurants'));
  } catch (error) {
    console.log('add restaurant error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* updateRestaurant(action) {
  try {
    yield call(authorizedRequest, 'put', `/restaurants/${action.restaurant.id}`, { body: action.restaurant });
    yield call(toastr.success, '', 'Successfully updated restaurant');
    yield put(push('/restaurants'));
  } catch (error) {
    console.log('edit restaurant error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* deleteRestaurant(action) {
  try {
    yield call(authorizedRequest, 'delete', `/restaurants/${action.id}`);
    yield call(toastr.success, '', 'Successfully removed restaurant');
    yield call(action.callback, true);
  } catch (error) {
    console.log('delete restaurant error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

export default function* restaurantSaga() {
  yield all([
    yield takeLatest(GET_ALL_RESTAURANTS, getAllRestaurants),
    yield takeLatest(GET_RESTAURANT, getRestaurant),
    yield takeLatest(ADD_RESTAURANT, addRestaurant),
    yield takeLatest(UPDATE_RESTAURANT, updateRestaurant),
    yield takeLatest(DELETE_RESTAURANT, deleteRestaurant),
  ]);
}
