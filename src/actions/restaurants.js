import {
  GET_ALL_RESTAURANTS,
  ADD_RESTAURANT,
  DELETE_RESTAURANT,
  UPDATE_RESTAURANT,
  GET_RESTAURANT,
} from '../global/constants';

export const getRestaurantsList = (values) => ({
  type: GET_ALL_RESTAURANTS,
  query: values,
});

export const addRestaurant = (restaurant) => ({
  type: ADD_RESTAURANT,
  restaurant,
});

export const deleteRestaurant = (id, callback) => ({
  type: DELETE_RESTAURANT,
  id,
  callback,
});

export const updateRestaurant = (restaurant) => ({
  type: UPDATE_RESTAURANT,
  restaurant,
});

export const getRestaurantInfo = (id) => ({
  type: GET_RESTAURANT,
  id,
})
