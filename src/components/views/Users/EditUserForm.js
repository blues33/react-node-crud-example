import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import _ from 'lodash';

import renderInput from '../../common/FormInput';
import { updateUser } from '../../../actions/user';
import { userFormValidate } from '../../../utils/validate';

export class EditUserForm extends React.Component {
  handleCancel = e => {
    this.props.history.push('/users');
  };

  render() {
    return (
      <div className="animated fadeIn h-100 w-100">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/users">Users</Link></BreadcrumbItem>
          <BreadcrumbItem active>{this.props.initialValues.fullname}</BreadcrumbItem>
        </Breadcrumb>
        <h2>Edit user</h2>
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
        <div className="d-flex justify-content-between align-items-center">
          <Button color="primary" onClick={this.props.handleSubmit}>
            Update
          </Button>
          <Button onClick={this.handleCancel} className="m-l-20">
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'EditUserForm',
  onSubmit: (values, dispatch, props) => {
    const selectedUser = props.users.find((item) => item._id === props.match.params.id)
    if (!selectedUser) return;
    const updatedValues = {
      ...values,
      id: selectedUser._id,
    };
    props.updateUser(updatedValues);
  },
  validate: userFormValidate,
})(EditUserForm);

export default connect(
  ({ authentication, users }, props) => {
    const selectedUser = users.users.find((item) => item._id === props.match.params.id)
    let initialValues = {}
    if (selectedUser) {
      initialValues = {
        email: selectedUser.email,
        fullname: selectedUser.fullname,
      }
    }
    return {
      ...authentication,
      ...users,
      initialValues,
    }
  },
  dispatch => ({
    updateUser: (values) => dispatch(updateUser(values)),
  }),
)(ReduxForm);
