import {
  SET_REVIEWS,
  SET_CURRENT_REVIEW,
  SET_PENDING_REVIEWS,
  LOGOUT,
} from '../global/constants';

const initialState = {
  reviews: [],
  currentReview: null,
  pendingReviews: [],
};

export default function reviewsReducer(state = initialState, action) {
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
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
