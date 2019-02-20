import jwt from 'jsonwebtoken';
import config from '../core/config/config.dev';

export const getToken = user =>
  jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  });

export const response = (success, data) => ({
  success,
  data
})

export const decodeToken = vToken => {

  const jwtToken = Buffer.from(vToken, 'base64').toString();

  try {

    const decoded = jwt.verify(jwtToken, config.JWT_SECRET);

    return decoded;  

  } catch (err) {
    return null;
  }
}