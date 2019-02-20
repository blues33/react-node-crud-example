import Joi from 'joi';
import _ from 'lodash';
import mongoose from 'mongoose';

import Restaurant from '../models/restaurant';
import Review from '../models/review';
import { response } from '../utils/common';

export const getRestaurant = async (req, res, next) => {
  const id = req.params.id;

  try {
    const restaurant = await Restaurant.findById(id).populate({
      path: 'owner',
      select: '-password'
    }).populate('highestReview lowestReview');

    if (restaurant) {
      res.send( response(true, restaurant) );
    } else {
      res.status(404).send(
        response(false, "Can't find the restaurant")
      );
    }
  } catch(err) {
    next(err);
  }
}

export const getRestaurants = async (req, res, next) => {
  try {
    let options = {};

    if (req.query.rate) {
      const operator = `$${req.query.operator}`;
      options.rateAvg = { [operator]: req.query.rate }
    }
    const role = req.user.role;

    if (req.user.role === 'owner') {
      options.owner = req.user._id;
    }

    const restaurants = await Restaurant.find(options).populate({
      path: 'owner',
      select: '-password'
    }).populate('highestReview lowestReview')
    .sort({rateAvg: -1});

    res.send( response(true, restaurants) );
  } catch(err) {
    next(err);
  }
}

export const createRestaurant = async (req, res, next) => {

  const restaurantSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    owner: Joi.string().allow('')
  }).options({ stripUnknown: true });

  try {

    const data = await Joi.validate(req.body, restaurantSchema);

    if (req.user.role === 'owner') {
      data.owner = req.user;
    } else if (data.owner) {
      data.owner = mongoose.Types.ObjectId(data.owner);
    }

    const restaurant = new Restaurant(data);
    await restaurant.save();

    res.status(201).send(
      response(true, restaurant)
    );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(err.status || 500).send(
        response(false, "You can't use this name")
      );
    }
    next(err);
  }

}

export const updateRestaurant = async (req, res, next) => {
  const id = req.params.id;

  const obj = {
    name: Joi.string(),
    description: Joi.string().allow(''),
    owner: Joi.string(),
  };
  if (req.user.role === 'owner') {
    delete obj.owner;
  }
  const inputSchema = Joi.object().keys(obj).options({ stripUnknown: true });

  try {
    const data = await Joi.validate(req.body, inputSchema);

    const restaurant = await Restaurant.findById(id);

    if (restaurant) {
      if (req.user.role === 'admin' || restaurant.owner.equals(req.user._id)) {
        _.assign(restaurant, data);
        await restaurant.save();
      } else {
        res.status(403).send(
          response(false, "Permission denied")
        );
      }
    } else {
      res.status(404).send(
        response(false, "Can't find the restaurant")
      );

      return;
    }

    res.send( response(true, restaurant) );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(err.status || 500).send(
        response(false, "You can't use this name")
      );
    }
    next(err);
  }

}

export const deleteRestaurant = async(req, res, next) => {
  const id = req.params.id;

  try {
    const restaurant = await Restaurant.findById(id);
    if (restaurant) {
      if (req.user.role === 'admin' || restaurant.owner.equals(req.user._id)) {
        await Review.remove({ restaurant: restaurant._id })
        await restaurant.remove();

        res.send( response(true, restaurant) );
      } else {
        res.status(403).send(
          response(false, "Permission denied")
        );
      }
    } else {
      res.status(404).send(
        response(false, "Can't find the restaurant")
      );
    }
  } catch(err) {
    next(err);
  }
}

