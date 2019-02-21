import {
  SET_RESTAURANTS_LIST,
  SET_CURRENT_RESTAURANT,
  LOGOUT,
} from '../global/constants';

const initialState = {
  restaurants: [],
  currentRestaurant: null,
};

export default function restaurantsReducer(state = initialState, action) {
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
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
