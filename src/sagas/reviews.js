import { call, all, takeLatest, put } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import { push } from 'connected-react-router';

import {
  GET_ALL_REVIEWS,
  SET_REVIEWS,
  GET_REVIEW,
  SET_CURRENT_REVIEW,
  ADD_REVIEW,
  REVIEW_ADDED,
  UPDATE_REVIEW,
  REVIEW_UPDATED,
  DELETE_REVIEW,
  REVIEW_DELETED,
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
    yield put({ type: REVIEW_ADDED, review: response.data.data });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
  } catch (error) {
    console.log('add review error: ', error);
    yield call(toastr.error, 'Error', 'Could not add a new review');
  }
}

function* updateReview(action) {
  try {
    const response = yield call(authorizedRequest, 'put', `/reviews/${action.review._id}`, { body: action.review });
    yield put({ type: REVIEW_UPDATED, review: response.data.data });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
  } catch (error) {
    console.log('edit review error: ', error);
    yield call(toastr.error, 'Error', 'Could not edit the review');
  }
}

function* deleteReview(action) {
  try {
  const response = yield call(authorizedRequest, 'delete', `/reviews/${action.id}`);
    yield put({ type: REVIEW_DELETED, review: response.data.data });
    yield put({ type: GET_RESTAURANT, id: response.data.data.restaurant });
  } catch (error) {
    console.log('delete review error: ', error);
    yield call(toastr.error, 'Error', 'Could not delete the review');
  }
}

function* fetchPendingReviews(action) {
  try {
    const response = yield call(authorizedRequest, 'get', '/reviews/pending');
    yield put({ type: SET_PENDING_REVIEWS, reviews: response.data.data });
  } catch (error) {
    console.log('get pending reviews error: ', error);
  }
}

function* submitReply(action) {
  try {
    const response = yield call(authorizedRequest, 'post', `/reviews/${action.reviewId}/reply`, {body: {replyComment: action.replyComment} });
    yield put({ type: REVIEW_REPLIED, review: response.data.data });
  } catch (error) {
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
