import axios from 'axios';

import store from '../store';
import { API_ENDPOINT } from '../global/constants';
import { logout } from '../actions/user';

export const anonymousRequest = (method, path, options = {}) => {
  const config = {
    method,
    url: API_ENDPOINT + path,
  };
  if (options.body) {
    config.data = options.body;
  }
  config.headers = { 'Content-Type': 'application/json' };
  return axios(config);
};

export const authorizedRequest = async (method, path, options = {}) => {
  const config = {
    method,
    url: API_ENDPOINT + path,
  };
  if (options.body) {
    config.data = options.body;
  }
  const { authentication: { token } } = store.getState();

  config.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const request = axios(config);
  request.catch((error) => {
    if (error.response.status === 401) {
      console.log('authorization failed');
      store.dispatch(logout());
    }
  });

  return request;
};
