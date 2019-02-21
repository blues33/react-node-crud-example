import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import _ from 'lodash';

import renderInput from '../../common/FormInput';
import { updateUser, getUser } from '../../../actions/user';
import { userFormValidate } from '../../../utils/validate';

export class EditUserForm extends React.Component {

  componentDidMount() {
    this.props.getUser(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.initialValues, nextProps.initialValues)) {
      this.props.change('fullname', nextProps.initialValues.fullname);
      this.props.change('email', nextProps.initialValues.email);
    }
  }

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
    if (!props.currentUser) return;
    const updatedValues = {
      ...values,
      id: props.currentUser._id,
    };
    props.updateUser(updatedValues);
  },
  validate: userFormValidate,
})(EditUserForm);

export default connect(
  ({ authentication, users }, props) => {
    let initialValues = {};
    if (users.currentUser) {
      initialValues = {
        email: users.currentUser.email,
        fullname: users.currentUser.fullname,
      }
    }
    return {
      ...authentication,
      ...users,
      initialValues,
    }
  },
  dispatch => ({
    getUser: (id) => dispatch(getUser(id)),
    updateUser: (values) => dispatch(updateUser(values)),
  }),
)(ReduxForm);
