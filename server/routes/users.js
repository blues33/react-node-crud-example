import express from 'express';

import rolesMiddleware from '../middlewares/roles';
import {
  login,
  register,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  verifyEmail,
  resendEmail,
  updateProfile,
  changePassword
} from '../controllers/user';

export default (passport) => {
  const router = express.Router();

  const authenticate = passport.authenticate('jwt', { session: false });

  router.post('/login', login);
  router.post('/register', register);
  router.post('/profile', authenticate, updateProfile);

  const middlewares = [
    authenticate,
    rolesMiddleware(['admin'])
  ];

  router.get('/', middlewares, getAllUsers);
  router.post('/', middlewares, createUser);
  router.get('/:id', middlewares, getUser);
  router.put('/:id', middlewares, updateUser);
  router.delete('/:id', middlewares, deleteUser);

  return router;
}
