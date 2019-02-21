import Joi from 'joi';
import _ from 'lodash';
import mongoose from 'mongoose';

import User from '../models/user';
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
      res.status(400).send(
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

    options['$and'] = [
      { rateAvg: { '$gte': req.query.min || 0 } },
      { rateAvg: { '$lte': req.query.max || 5 } },
    ];

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
      data.owner = req.user._id;
    } else if (data.owner) {
      const ownerUser = await User.findById(data.owner);
      if (ownerUser && ownerUser.role === 'owner') {
        data.owner = mongoose.Types.ObjectId(data.owner);
      } else {
        res.status(400).send(
          response(false, "Owner does not exist")
        );
        return;
      }
    }

    const restaurant = new Restaurant(data);
    await restaurant.save();

    res.status(201).send(
      response(true, restaurant)
    );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Name is already used")
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
    if (req.user.role === 'admin') {
      const ownerUser = await User.findById(data.owner);
      
      if (ownerUser && ownerUser.role === 'owner') {
        data.owner = mongoose.Types.ObjectId(data.owner);
      } else {
        res.status(400).send(
          response(false, "Owner does not exist")
        );
        return;
      }
    }

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
      res.status(400).send(
        response(false, "Can't find the restaurant")
      );

      return;
    }

    res.send( response(true, restaurant) );
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).send(
        response(false, "Name is already used")
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
      res.status(400).send(
        response(false, "Can't find the restaurant")
      );
    }
  } catch(err) {
    next(err);
  }
}

export const calculateAggregate = async (id) => {
  try {
    const restaurant = await Restaurant.findById(id);
    if (restaurant) {
      const reviews = await Review.find({restaurant: id});
      let highestReview = null, lowestReview = null, average = 0;
      if (reviews && reviews.length > 0) {
        for (let i = 0; i < reviews.length; i ++) {
          if (!highestReview || highestReview.rate < reviews[i].rate) {
            highestReview = reviews[i];
          }
          if (!lowestReview || lowestReview.rate > reviews[i].rate) {
            lowestReview = reviews[i];
          }
          average += reviews[i].rate;
        }
        average = Math.round(average / reviews.length * 100) / 100;
      }
      restaurant.highestReview = highestReview;
      restaurant.lowestReview = lowestReview;
      restaurant.rateAvg = average;

      restaurant.save();
    }
  } catch (err) {
    console.log('error: ', err);
  }
}
