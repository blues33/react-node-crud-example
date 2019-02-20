import _ from 'lodash';

import {
  SET_REVIEWS,
  SET_CURRENT_REVIEW,
  SET_PENDING_REVIEWS,
  REVIEW_ADDED,
  REVIEW_DELETED,
  REVIEW_UPDATED,
  REVIEW_REPLIED,
  LOGOUT,
} from '../global/constants';

const initialState = {
  reviews: [],
  currentReview: null,
  pendingReviews: [],
};

export default function reviewsReducer(state = initialState, action) {
  let reviews = _.map(state.reviews, _.clone);
  switch (action.type) {
    case SET_REVIEWS:
      return {
        ...state,
        reviews: action.reviews,
      };
    case SET_PENDING_REVIEWS:
      return {
        ...state,
        pendingReviews: action.reviews,
      };
    case SET_CURRENT_REVIEW:
      return {
        ...state,
        currentReview: action.review,
      };
    case REVIEW_REPLIED:
      reviews = reviews.map((review) => {
        if (review._id === action.review._id) {
          return {
            ...action.review,
            user: review.user,
            restaurant: review.restaurant,
          }
        }
        return review;
      });
      const pendingReviews = _.map(state.pendingReviews, _.clone);
      pendingReviews.findIndex(r => r._id === action.review._id);
      pendingReviews.splice(index, 1);
      return {
        ...state,
        reviews,
        pendingReviews,
      };
    case REVIEW_ADDED:
      reviews.push(action.review);
      return {
        ...state,
        reviews,
      };
    case REVIEW_UPDATED:
      reviews = reviews.map((review) => {
        if (review._id === action.review._id) {
          return {
            ...action.review,
            user: review.user,
            restaurant: review.restaurant,
          }
        }
        return review;
      });
      return {
        ...state,
        reviews,
      };
    case REVIEW_DELETED:
      const index = reviews.findIndex((review) => review._id === action.review._id);
      if (index >= 0) {
        reviews.splice(index, 1);
      }
      return {
        ...state,
        reviews,
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
