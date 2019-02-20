import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardHeader, CardBody, FormGroup, Row, Col, Label } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

import renderInput from '../../common/FormInput';
import { updateProfile } from '../../../actions/user';
import { userFormValidate } from '../../../utils/validate';

export class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
  }

  toggleEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  update = () => {
    this.props.handleSubmit();
    this.setState({ editMode: false });
  }

  render() {
    const { editMode } = this.state;
    return (
      <div className="animated fadeIn h-100 w-100">
        <Card className="w-50">
          <CardHeader>
            <strong>{editMode ? 'Edit Profile' : 'Your Profile'}</strong>
          </CardHeader>
          <CardBody>
            {editMode ? (
              <>
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
              <Button color="primary" onClick={this.update}>
                Update
              </Button>
              <Button onClick={this.toggleEdit} className="m-l-20">
                Cancel
              </Button>
            </div>
            </>
            )
            : (
              <>
              <FormGroup row>
                <Col xs="6">
                  <Label><strong>Email</strong></Label>
                </Col>
                <Col xs="6">
                  <p className="form-control-static">{this.props.user.email}</p>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="6">
                  <Label><strong>Full name</strong></Label>
                </Col>
                <Col xs="6">
                  <p className="form-control-static">{this.props.user.fullname}</p>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                  <Button color="warning" onClick={this.toggleEdit}>
                    Edit
                  </Button>
                </Col>
              </FormGroup>
              </>
            )
            }
          </CardBody>
        </Card>
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'ProfileForm',
  onSubmit: (values, dispatch, props) => {
    props.updateProfile(values);
  },
  validate: userFormValidate,
})(ProfileForm);

export default connect(
  ({ authentication }, props) => {
    const initialValues = {
      email: authentication.user.email,
      fullname: authentication.user.fullname,
    };
    return {
      ...authentication,
      initialValues,
    }
  },
  dispatch => ({
    updateProfile: (values) => dispatch(updateProfile(values)),
  }),
)(ReduxForm);
