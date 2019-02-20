import Joi from 'joi';
import _ from 'lodash';

import User from '../models/user';
import {
  getToken,
  response,
} from '../utils/common';
import Restaurant from '../models/restaurant';
import Review from '../models/review';

export const login = async (req, res, next) => {
  const loginFields = Joi.object().keys({
    email   : Joi.string().email().required(),
    password: Joi.string().max(255).min(8).required(),
  }).options({ stripUnknown: true });

  try {
    const data = await Joi.validate(req.body, loginFields);
    const user = await User.findOne({ email: data.email });

    if (!user) {
      res.status(400).send(
        response(false, 'Invalid email or password')
      );

      return;
    }

    user.comparePassword(data.password, (err, match) => {
      if (err) next(err);

      if (match) {
        const token = getToken(user);
        res.send(
          response(true, { token, user: user.toObject() })
        );
      } else {
        res.status(400).send(
          response(false, 'Invalid email or password')
        );
      }
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  const registerFields = Joi.object().keys({
    email    : Joi.string().email().required(),
    password : Joi.string().max(255).min(8).required(),
    fullname: Joi.string().max(255).required(),
    role     : Joi.string().valid(['owner', 'regular']).required(),
  }).options({ stripUnknown: true });

  try {
    const data = await Joi.validate(req.body, registerFields);

    const user = new User(data);
    await user.save();

    const token = getToken(user);

    res.status(201).send(
      response(true, { token, user: user.toObject() })
    );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Email already exists")
      );
    }
    next(err);
  }
};

export const createUser = async (req, res, next) => {

  const inputSchema = Joi.object().keys({
    email    : Joi.string().email().required(),
    password : Joi.string().max(255).min(8).required(),
    fullname: Joi.string().max(255).required(),
    role     : Joi.string().valid(['owner', 'regular']).required(),
  }).options({ stripUnknown: true });

  try {

    const data = await Joi.validate(req.body, inputSchema);

    const user = new User(data);
    await user.save();

    res.status(201).send(
      response(true, user.toObject())
    );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Email already exists")
      );
    }
    next(err);
  }

}

export const getAllUsers = async (req, res, next) => {
  try {
    const role = req.query.role;

    if (role && role !== 'owner' && role !== 'regular') {
      res.status(400).send(
        response(false, 'Invalid role')
      );

      return;
    }

    let options = {
      role: {$in: ['owner', 'regular']}
    };

    if (role) {
      options = { role };
    }

    const users = await User.find(options, { password: 0 });

    res.send( response(true, users) );
  } catch(err) {
    next(err);
  }
}

export const getUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (user) {
      if (user.role !== 'admin') {
        res.status(403).send(
          response(false, 'Permission denied')
        );
      } else {
        res.send( response(true, user.toObject()) );
      }
    } else {
      res.status(400).send(
        response(false, "User does not exist")
      );
    }
  } catch(err) {
    next(err);
  }
}

export const updateUser = async (req, res, next) => {

  const inputSchema = Joi.object().keys({
    email: Joi.string().email(),
    fullname : Joi.string().max(255),
    password : Joi.string().max(255).min(8),
    role : Joi.string().valid(['owner', 'regular']),
  }).options({ stripUnknown: true });

  const id = req.params.id;

  try {
    const data = await Joi.validate(req.body, inputSchema);

    const user = await User.findById(id);

    if (user) {
      if (user.role === 'admin') {
        res.status(403).send(
          response(false, 'Permission denied')
        );

        return;
      }

      _.assign(user, data);
      await user.save();

      res.send( response(true, 'User updated successfully') );

    } else {
      res.status(400).send(
        response(false, 'Can\'t find the user' )
      );
    }

  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Email is already used by other user")
      );
    }
    next(err);
  }

}

export const deleteUser = async(req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (user) {
      if (user.role === 'admin') {
        res.status(403).send(
          response(false, 'Permission denied')
        );

        return;
      }

      if (user.role === 'owner') {
        const restaurants = await Restaurant.find({owner: id});
        if (restaurants && restaurants.length > 0) {
          for (let i = 0; i <restaurants.length; i ++) {
            await Review.remove({ restaurant: restaurants[i]._id });
            await restaurants[i].remove();
          }
        }
      }

      user.remove();

      res.send( response(true, user) );
    } else {
      res.status(400).send(
        response(false, "Can't find the user")
      );
    }

  } catch(err) {
    next(err);
  }
}

export const updateProfile = async (req, res, next) => {
  const inputSchema = Joi.object().keys({
    email: Joi.string().email(),
    fullname : Joi.string().max(255),
  });

  try {
    const data = await Joi.validate(req.body, inputSchema);

    _.assign(req.user, data);
    await req.user.save();

    res.send( response(true, req.user) );

  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Email is already used by other user")
      );
    }
    next(err);
  }

}
