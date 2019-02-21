import express from 'express';
import {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurant';
import {
  getReviews,
  createReview,
} from '../controllers/review';
import rolesMiddleware from '../middlewares/roles';

export default () => {

  const router = express.Router();

  router.get('/', getRestaurants);
  router.post('/', rolesMiddleware(['admin', 'owner']), createRestaurant);
  router.get('/:id', getRestaurant);
  router.put('/:id', rolesMiddleware(['admin', 'owner']), updateRestaurant);
  router.delete('/:id', rolesMiddleware(['admin', 'owner']), deleteRestaurant);
  router.post('/:id/reviews', rolesMiddleware(['regular']), createReview);
  router.get('/:id/reviews', getReviews);

  return router;
}
