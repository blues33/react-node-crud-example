import { response } from '../utils/common';

export default (roles) => (req, res, next) => {
  if (roles.indexOf(req.user.role) >= 0){
    next();
  } else {
    res.status(403).send(
      response(false, 'Permission denied')
    );
  }
}