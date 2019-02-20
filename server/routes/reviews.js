import express from 'express';
import {
  getReviews,
  getPendingReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  replyToReview
} from '../controllers/review';
import rolesMiddleware from '../middlewares/roles';

export default () => {

  const router = express.Router();

  router.get('/', getReviews);
  router.get('/pending', getPendingReviews);
  router.post('/', rolesMiddleware(['regular']), createReview);
  router.get('/:id', getReview);
  router.put('/:id', rolesMiddleware(['admin']), updateReview);
  router.delete('/:id', rolesMiddleware(['admin']), deleteReview);
  router.post('/:id/reply', replyToReview);

  return router;
}