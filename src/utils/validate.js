export const loginFormValidate = values => {
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

export const userFormValidate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.fullname) {
    errors.fullname = 'Required';
  }
  return errors;
};

export const registerFormValidate = values => {
  const errors = {};
  if (!values.role) {
    errors.role = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.username) {
    errors.username = 'Required';
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
    !!values.password &&
    !!values.confirmPassword &&
    values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = 'Password does not match';
  }
  return errors;
};

export const restaurantFormValidate = values => {
  console.log('values: ', values)
  const errors = {};
  // if (role === 'admin' && !values.owner) {
  //   errors.role = 'Required';
  // }
  if (!values.name) {
    errors.name = 'Required';
  }
  
  return errors;
};

export const reviewFormValidate = values => {
  const errors = {};
  if (!values.rate) {
    errors.rate = 'Required';
  }
  if (!values.visited) {
    errors.visited = 'Required';
  }
  if (!values.comment) {
    errors.comment = 'Required';
  }
  return errors;
};
