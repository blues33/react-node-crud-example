import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Card, CardHeader, CardBody,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

import renderInput from '../../common/FormInput';
import { changePassword } from '../../../actions/user';
import { passwordFormValidate } from '../../../utils/validate';

export class PasswordForm extends React.Component {
  render() {
    return (
      <div className="animated fadeIn h-100 w-100">
        <Card className="w-50">
          <CardHeader>
            Change Password
          </CardHeader>
          <CardBody>
            <Field
              name="oldPassword"
              type="password"
              label="Old password"
              component={renderInput}
            />
            <Field
              name="newPassword"
              type="password"
              label="New password"
              component={renderInput}
            />
            <Field
              name="confirmPassword"
              type="password"
              label="Confirm password"
              component={renderInput}
            />
            <div className="d-flex justify-content-between align-items-center">
              <Button color="primary" onClick={this.props.handleSubmit}>
                Change
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'PasswordForm',
  onSubmit: (values, dispatch, props) => {
    props.changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  },
  validate: passwordFormValidate,
})(PasswordForm);

export default connect(
  ({ authentication }, props) => {
    return {
      ...authentication,
    };
  },
  dispatch => ({
    changePassword: values => dispatch(changePassword(values)),
  }),
)(ReduxForm);
