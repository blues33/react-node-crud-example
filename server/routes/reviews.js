import express from 'express';
import {
  getPendingReviews,
  getReview,
  updateReview,
  deleteReview,
  replyToReview
} from '../controllers/review';
import rolesMiddleware from '../middlewares/roles';

export default () => {

  const router = express.Router();

  router.get('/pending', rolesMiddleware(['owner']), getPendingReviews);
  router.get('/:id', getReview);
  router.put('/:id', rolesMiddleware(['admin']), updateReview);
  router.delete('/:id', rolesMiddleware(['admin']), deleteReview);
  router.post('/:id/reply', rolesMiddleware(['owner']), replyToReview);

  return router;
}