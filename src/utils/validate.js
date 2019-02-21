import moment from 'moment';

export const loginFormValidate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export const userFormValidate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.fullname || !values.fullname.trim()) {
    errors.fullname = 'Required';
  }
  return errors;
};

export const registerFormValidate = (values) => {
  const errors = {};
  if (!values.role || values.role === '---') {
    errors.role = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.fullname || !values.fullname.trim()) {
    errors.fullname = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Length should be at least 8';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  }
  if (
    !!values.password
    && !!values.confirmPassword
    && values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = 'Password does not match';
  }
  return errors;
};

export const restaurantFormValidate = (values) => {
  const errors = {};
  if (values.owner === '---') {
    errors.owner = 'Required';
  }
  if (!values.name || !values.name.trim()) {
    errors.name = 'Required';
  }

  return errors;
};

export const reviewFormValidate = (values) => {
  const errors = {};
  if (!values.rate) {
    errors.rate = 'Required';
  }
  if (!values.visited) {
    errors.visited = 'Required';
  } else if (moment(values.visited).isAfter(moment())) {
    errors.visited = 'Visit date cannot past today\'s date';
  }
  if (!values.comment || !values.comment.trim()) {
    errors.comment = 'Required';
  }
  return errors;
};

export const replyFormValidate = (values) => {
  const errors = {};
  if (!values.comment || !values.comment.trim()) {
    errors.comment = 'Required';
  }
  return errors;
};

export const passwordFormValidate = (values) => {
  const errors = {};
  if (!values.oldPassword) {
    errors.oldPassword = 'Required';
  }
  if (!values.newPassword) {
    errors.newPassword = 'Required';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Length should be at least 8';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  }
  if (
    !!values.newPassword
    && !!values.confirmPassword
    && values.newPassword !== values.confirmPassword
  ) {
    errors.confirmPassword = 'Password does not match';
  }
  return errors;
};
