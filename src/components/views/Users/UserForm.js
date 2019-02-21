import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import renderInput from '../../common/FormInput';
import { renderSelect } from '../../common/FormSelect';
import { addUser } from '../../../actions/user';
import { registerFormValidate } from '../../../utils/validate';

const roles = [{
  label: 'Regular',
  value: 'regular',
}, {
  label: 'Owner',
  value: 'owner',
}];

export class UserForm extends React.Component {
  componentDidMount() {

  }

  handleCancel = (e) => {
    this.props.history.push('/users');
  };

  render() {
    return (
      <div className="animated fadeIn h-100 w-100">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/users">Users</Link></BreadcrumbItem>
          <BreadcrumbItem active>New</BreadcrumbItem>
        </Breadcrumb>
        <h2>Create new user</h2>
        <Field
          name="role"
          label="Role"
          options={roles}
          component={renderSelect}
        />
        <Field
          name="email"
          type="email"
          label="Email"
          component={renderInput}
        />
        <Field
          name="fullname"
          type="text"
          label="Full name"
          component={renderInput}
        />
        <Field
          name="password"
          type="password"
          label="Password"
          component={renderInput}
        />
        <Field
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          component={renderInput}
        />
        <div className="d-flex justify-content-between align-items-center">
          <Button color="primary" onClick={this.props.handleSubmit}>
            Create
          </Button>
          <Button onClick={this.handleCancel} className="m-l-20">
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const UserReduxForm = reduxForm({
  form: 'UserForm',
  onSubmit: (values, dispatch, props) => {
    props.addUser({
      ...values,
    });
  },
  validate: registerFormValidate,
})(UserForm);

export default connect(
  ({ authentication, users }) => ({
    ...authentication,
    ...users,
  }),
  dispatch => ({
    addUser: values => dispatch(addUser(values)),
  }),
)(UserReduxForm);
