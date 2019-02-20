import Joi from 'joi';
import _ from 'lodash';
import mongoose from 'mongoose';

import Review from '../models/review';
import Restaurant from '../models/restaurant';
import { response } from '../utils/common';

export const getReview = async (req, res, next) => {
  const id = req.params.id;

  try {
    const review = await Review.findOne({ _id: id }).populate({
      path: 'user',
      select: '-password'
    }).populate('restaurant');

    if (review) {
      res.send( response(true, review) );
    } else {
      res.status(404).send(
        response(false, "Can't find the review")
      );
    }
  } catch(err) {
    next(err);
  }
}

export const getReviews = async (req, res, next) => {
  const restaurantId = req.query.restaurant
  try {
    let options = {
      restaurant: mongoose.Types.ObjectId(restaurantId)
    };

    const reviews = await Review.find(options).populate({
      path: 'user',
      select: '-password'
    }).populate('restaurant')
    .sort({created: -1});

    res.send( response(true, reviews) );
  } catch(err) {
    next(err);
  }
}

export const getPendingReviews = async (req, res, next) => {
  
  if (req.user.role !== 'owner') {
    res.status(403).send(
      response(false, "Permission denied")
    );
  }

  try {
    let options = {
      status: 'pending',
    };

    let reviews = await Review.find(options).populate({
      path: 'user',
      select: '-password'
    }).populate('restaurant')
    .sort({created: -1});
    
    reviews = reviews.filter(review => review.restaurant && review.restaurant.owner && review.restaurant.owner.equals(req.user._id));

    res.send( response(true, reviews) );
  } catch(err) {
    next(err);
  }
}

export const createReview = async (req, res, next) => {

  const reviewSchema = Joi.object().keys({
    rate: Joi.number(),
    visited: Joi.date(),
    comment: Joi.string().required(),
    restaurant: Joi.string().required(),
  }).options({ stripUnknown: true });

  try {

    const data = await Joi.validate(req.body, reviewSchema);

    data.user = req.user;
    data.restaurant = mongoose.Types.ObjectId(data.restaurant);

    const _review = await Review.findOne({
      user: mongoose.Types.ObjectId(req.user._id),
      restaurant: data.restaurant,
    });

    if (_review) {
      res.status(500).send( response( false, 'Review already exists' ) )
    } else {
      const review = new Review(data);
      await review.save();

      const restaurant = await Restaurant.findOne({ _id: review.restaurant }).populate('highestReview lowestReview');
      if (!restaurant.highestReview || restaurant.highestReview.rate < review.rate) {
        restaurant.highestReview = review;
      }
      if (!restaurant.lowestReview || restaurant.lowestReview.rate > review.rate) {
        restaurant.lowestReview = review;
      }
      
      const reviews = await Review.find({
        restaurant: data.restaurant,
      })

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rate, 0);
        restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
      } else {
        restaurant.rateAvg = 0;
      }

      await restaurant.save();
      
      res.status(201).send(
        response(true, review)
      );
    }
  } catch (err) {
    next(err);
  }

}

export const updateReview = async (req, res, next) => {
  const id = req.params.id;
  const obj = {
    rate: Joi.number(),
    comment: Joi.string().required(),
    replyComment: Joi.string().allow(''),
  };
  const inputSchema = Joi.object().keys(obj).options({ stripUnknown: true });

  try {
    const data = await Joi.validate(req.body, inputSchema);

    const review = await Review.findById(id);

    if (review) {
      _.assign(review, data);
      await review.save();

      const restaurant = await Restaurant.findById(review.restaurant).populate('highestReview lowestReview');

      const reviews = await Review.find({
        restaurant: review.restaurant,
      })

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rate, 0);
        restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
      } else {
        restaurant.rateAvg = 0;
      }
      
      if (restaurant.highestReview) {
        if (restaurant.highestReview._id === review._id) {
          if (restaurant.highestReview.rate > review.rate) {
            let _highestReview = null;
            let _highestRate = 0;
            reviews.forEach(r => {
              if (r.rate > _highestRate) {
                _highestRate = r.rate;
                _highestReview = r;
              }
            })
            restaurant.highestReview = _highestReview;
          }
        } else {
          if (restaurant.highestReview.rate < review.rate) {
            restaurant.highestReview = review;
          }
        }
      } else {
        restaurant.highestReview = review;
      }

      if (restaurant.lowestReview) {
        if (restaurant.lowestReview._id === review._id) {
          if (restaurant.lowestReview.rate < review.rate) {
            let _lowestReview = null;
            let _lowestRate = 6;
            reviews.forEach(r => {
              if (r.rate < _lowestRate) {
                _lowestRate = r.rate;
                _lowestReview = r;
              }
            })
            restaurant.lowestReview = _lowestReview;
          }
        } else {
          if (restaurant.lowestReview.rate > review.rate) {
            restaurant.lowestReview = review;
          }
        }
      } else {
        restaurant.lowestReview = review;
      }

      await restaurant.save();
      res.send( response(true, review) );
    } else {
      res.status(404).send(
        response(false, "Can't find the review")
      );
    }
  } catch (err) {
    next(err);
  }

}

export const deleteReview = async(req, res, next) => {
  const id = req.params.id;

  try {
    const review = await Review.findById(id);

    if (review) {
      review.remove();

      const restaurant = await Restaurant.findById(review.restaurant).populate('highestReview lowestReview');

      const reviews = await Review.find({
        restaurant: review.restaurant,
      })

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rate, 0);
        restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
      } else {
        restaurant.rateAvg = 0;
      }
      
      if (restaurant.highestReview) {
        if (restaurant.highestReview._id === review._id) {
          let _highestReview = null;
          let _highestRate = 0;
          reviews.forEach(r => {
            if (r.rate > _highestRate) {
              _highestRate = r.rate;
              _highestReview = r;
            }
          })
          restaurant.highestReview = _highestReview;
        }
      }

      if (restaurant.lowestReview) {
        if (restaurant.lowestReview._id === review._id) {
          let _lowestReview = null;
          let _lowestRate = 6;
          reviews.forEach(r => {
            if (r.rate < _lowestRate) {
              _lowestRate = r.rate;
              _lowestReview = r;
            }
          })
          restaurant.lowestReview = _lowestReview;
        }
      }

      await restaurant.save();

      res.send( response(true, review) );
    } else {
      res.status(404).send(
        response(false, "Can't find the review")
      );
    }
  } catch(err) {
    console.log('errror: ', err);
    next(err);
  }
}

export const replyToReview = async(req, res, next) => {
  const id = req.params.id;
  
  try {
    const review = await Review.findOne({ _id: id }).populate('restaurant');

    if (review) {
      if (review.restaurant.owner.equals(req.user._id)) {
        const obj = {
          replyComment: Joi.string().required(),
        };
        const inputSchema = Joi.object().keys(obj).options({ stripUnknown: true });
        const data = await Joi.validate(req.body, inputSchema);
        data.replyDate = new Date();
        data.status = 'replied';
        _.assign(review, data);
        await review.save();

        res.send( response(true, review) );
      } else {
        res.status(403).send(
          response(false, "Permission denied")
        );
      }
    } else {
      res.status(404).send(
        response(false, "Can't find the review")
      );
    }
  } catch (err) {
    next(err);
  }
}
