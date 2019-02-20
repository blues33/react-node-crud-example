import express from 'express';
import {
  getRestaurant,
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurant';
import rolesMiddleware from '../middlewares/roles';

export default () => {

  const router = express.Router();

  router.get('/', getRestaurants);
  router.post('/', rolesMiddleware(['admin', 'owner']), createRestaurant);
  router.get('/:id', getRestaurant);
  router.put('/:id', rolesMiddleware(['admin', 'owner']), updateRestaurant);
  router.delete('/:id', rolesMiddleware(['admin', 'owner']), deleteRestaurant);

  return router;
}

