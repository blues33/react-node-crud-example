import { all } from 'redux-saga/effects';

import authSaga from './auth';
import restaurantSaga from './restaurants';
import usersSaga from './users';
import reviewsSaga from './reviews';

export default function* rootSaga() {
  yield all([
    authSaga(),
    restaurantSaga(),
    usersSaga(),
    reviewsSaga(),
  ]);
}
