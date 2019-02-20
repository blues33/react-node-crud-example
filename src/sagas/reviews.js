import { call, all, takeLatest, put } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';

import {
  GET_ALL_REVIEWS,
  SET_REVIEWS,
  GET_REVIEW,
  SET_CURRENT_REVIEW,
  ADD_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  GET_RESTAURANT,
  FETCH_PENDING_REVIEWS,
  SET_PENDING_REVIEWS,
  SUBMIT_REPLY,
  REVIEW_REPLIED,
} from '../global/constants';
import { authorizedRequest } from '../utils/api';

function* getAllReviews(action) {
  try {
    const response = yield call(authorizedRequest, 'get', `/reviews?restaurant=${action.restaurantId}`);
    yield put({ type: SET_REVIEWS, reviews: response.data.data });
  } catch (error) {
    console.log('get reviews error: ', error);
  }
}

function* getReview(action) {
  try {
    const response = yield call(authorizedRequest, 'get', `/reviews/${action.id}`);
    yield put({ type: SET_CURRENT_REVIEW, review: response.data.data });
  } catch (error) {
    console.log('get review error: ', error);
  }
}

function* addReview(action) {
  try {
    const response = yield call(authorizedRequest, 'post', '/reviews', { body: action.review });
    yield put({ type: GET_ALL_REVIEWS, restaurantId: response.data.data.restaurant });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
    yield call(toastr.success, '', 'Successfully added your review');
  } catch (error) {
    console.log('add review error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* updateReview(action) {
  try {
    const response = yield call(authorizedRequest, 'put', `/reviews/${action.review._id}`, { body: action.review });
    yield put({ type: GET_ALL_REVIEWS, restaurantId: response.data.data.restaurant });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
    yield call(toastr.success, '', 'Successfully updated review');
  } catch (error) {
    console.log('edit review error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* deleteReview(action) {
  try {
  const response = yield call(authorizedRequest, 'delete', `/reviews/${action.id}`);
  yield put({ type: GET_ALL_REVIEWS, restaurantId: response.data.data.restaurant });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
    yield call(toastr.success, '', 'Successfully removed review');
  } catch (error) {
    console.log('delete review error: ', error);
    yield call(toastr.error, 'Error', error.response.data.data);
  }
}

function* fetchPendingReviews(action) {
  try {
    const response = yield call(authorizedRequest, 'get', '/reviews/pending');
    yield put({ type: SET_PENDING_REVIEWS, reviews: response.data.data });
  } catch (error) {
    yield call(toastr.error, 'Error', error.response.data.data);
    console.log('get pending reviews error: ', error);
  }
}

function* submitReply(action) {
  try {
    const response = yield call(authorizedRequest, 'post', `/reviews/${action.reviewId}/reply`, {body: {replyComment: action.replyComment} });
    yield put({ type: FETCH_PENDING_REVIEWS });
    yield put({ type: GET_ALL_REVIEWS, restaurantId: response.data.data.restaurant._id });
    yield call(toastr.success, '', 'Successfully submitted your reply');
  } catch (error) {
    yield call(toastr.error, 'Error', error.response.data.data);
    console.log('reply error: ', error);
  }
}

export default function* reviewSaga() {
  yield all([
    yield takeLatest(GET_ALL_REVIEWS, getAllReviews),
    yield takeLatest(GET_REVIEW, getReview),
    yield takeLatest(ADD_REVIEW, addReview),
    yield takeLatest(UPDATE_REVIEW, updateReview),
    yield takeLatest(DELETE_REVIEW, deleteReview),
    yield takeLatest(FETCH_PENDING_REVIEWS, fetchPendingReviews),
    yield takeLatest(SUBMIT_REPLY, submitReply),
  ]);
}
