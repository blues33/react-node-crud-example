import {
  GET_ALL_REVIEWS,
  ADD_REVIEW,
  DELETE_REVIEW,
  UPDATE_REVIEW,
  GET_REVIEW,
  FETCH_PENDING_REVIEWS,
  SUBMIT_REPLY,
} from '../global/constants';

export const getReviewsList = (id) => ({
  type: GET_ALL_REVIEWS,
  restaurantId: id,
});

export const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

export const deleteReview = (id) => ({
  type: DELETE_REVIEW,
  id,
});

export const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

export const getReview = (id) => ({
  type: GET_REVIEW,
  id,
});

export const fetchPendingReviews = (userId) => ({
  type: FETCH_PENDING_REVIEWS,
  userId,
});

export const submitReply = (reply) => ({
  type: SUBMIT_REPLY,
  reviewId: reply.reviewId,
  replyComment: reply.replyComment,
});
