import {
  GET_ALL_RESTAURANTS,
  ADD_RESTAURANT,
  DELETE_RESTAURANT,
  UPDATE_RESTAURANT,
  GET_RESTAURANT,
} from '../global/constants';

export const getRestaurantsList = () => ({
  type: GET_ALL_RESTAURANTS,
});

export const addRestaurant = (restaurant) => ({
  type: ADD_RESTAURANT,
  restaurant,
});

export const deleteRestaurant = (id) => ({
  type: DELETE_RESTAURANT,
  id,
});

export const updateRestaurant = (restaurant) => ({
  type: UPDATE_RESTAURANT,
  restaurant,
});

export const getRestaurantInfo = (id) => ({
  type: GET_RESTAURANT,
  id,
})
