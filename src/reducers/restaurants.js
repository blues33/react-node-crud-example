import _ from 'lodash';

import {
  SET_RESTAURANTS_LIST,
  SET_CURRENT_RESTAURANT,
  RESTAURANT_ADDED,
  RESTAURANT_DELETED,
  LOGOUT,
  RESTAURANT_UPDATED,
} from '../global/constants';

const initialState = {
  restaurants: [],
  currentRestaurant: null,
};

export default function restaurantsReducer(state = initialState, action) {
  let restaurants = _.map(state.restaurants, _.clone);
  switch (action.type) {
    case SET_RESTAURANTS_LIST:
      return {
        ...state,
        restaurants: action.payload,
      };
    case SET_CURRENT_RESTAURANT:
      return {
        ...state,
        currentRestaurant: action.restaurant,
      };
    case RESTAURANT_ADDED:
      restaurants.push(action.restaurant);
      return {
        ...state,
        restaurants,
      };
    case RESTAURANT_UPDATED:
      restaurants = restaurants.map((restaurant) => {
        if (restaurant._id === action.restaurant._id) {
          return {
            ...action.restaurant,
            highestReview: restaurant.highestReview,
            lowestReview: restaurant.lowestReview,
            owner: restaurant.owner,
          }
        }
        return restaurant;
      });
      return {
        ...state,
        restaurants,
      };
    case RESTAURANT_DELETED:
      const index = restaurants.findIndex((restaurant) => restaurant._id === action.restaurant._id);
      if (index >= 0) {
        restaurants.splice(index, 1);
      }
      return {
        ...state,
        restaurants,
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
