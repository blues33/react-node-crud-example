import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

import { signup } from "../../../../actions/user";
import renderInput from "../../../common/FormInput";
import { renderSelect } from "../../../common/FormSelect";
import { registerFormValidate } from "../../../../utils/validate";

const roles = [{
  label: 'Regular',
  value: 'regular',
}, {
  label: 'Owner',
  value: 'owner',
}];

const Register = ({ submitting, loading, handleSubmit }) => (
  <div className="app flex-row align-items-center">
    <Container>
      <Row className="justify-content-center">
        <Col md="6">
          <Card className="mx-4">
            <CardBody className="p-4">
              <h1>Register</h1>
              <p className="text-muted">Create your account</p>
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
                <Button
                  color="success"
                  disabled={submitting || loading}
                  onClick={handleSubmit}
                >
                  Create Account
                </Button>
                <Link to="/login" disabled={submitting || loading}>
                  Already have an account?
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

const RegisterForm = reduxForm({
  form: "registerForm",
  onSubmit: (values, dispatch, props) => {
    const { role, email, password, fullname } = values;
    props.registerUser({
      role,
      email,
      password,
      fullname,
    });
  },
  validate: registerFormValidate
})(Register);

export default connect(
  ({ authentication }) => ({ ...authentication }),
  dispatch => ({
    registerUser: form => dispatch(signup(form)),
  })
)(RegisterForm);
