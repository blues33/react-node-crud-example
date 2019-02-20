import passport from 'passport';

import passportConfig from '../core/config/passport';
import userRoutes from './users';
import restaurantRoutes from './restaurants';
import reviewRoutes from './reviews';

const initRoutes = (app) => {

  passportConfig(passport);
  app.use(passport.initialize());

  app.use('/users', userRoutes(passport));

  const authorization = passport.authenticate('jwt', { session: false });
  app.use('/restaurants', authorization, restaurantRoutes());
  app.use('/reviews', authorization, reviewRoutes());
};

export default initRoutes;
