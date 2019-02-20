import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button
} from "reactstrap";
import { Link } from 'react-router-dom';

import { login } from "../../../../actions/user";
import renderInput from "../../../common/FormInput";
import { loginFormValidate } from "../../../../utils/validate";

const Login = ({ submitting, loading, handleSubmit, history }) => (
  <div className="app flex-row align-items-center">
    <Container>
      <Row className="justify-content-center">
        <Col md="8">
          <CardGroup>
            <Card className="p-4">
              <CardBody>
                <h1>Login</h1>
                <p className="text-muted">Sign In to your account</p>
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  component={renderInput}
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  component={renderInput}
                />
                <Row>
                  <Col xs="6">
                    <Button
                      color="primary"
                      className="px-4"
                      disabled={submitting || loading}
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
              <CardBody className="text-center">
                <div>
                  <h4>Still don't have an account?</h4>
                  <Link to="/register">
                    <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </CardGroup>
        </Col>
      </Row>
    </Container>
  </div>
);

const LoginForm = reduxForm({
  form: "loginForm",
  onSubmit: (values, dispatch, props) => {
    props.loginUser(values);
  },
  validate: loginFormValidate
})(Login);

export default connect(
  ({ authentication }) => ({ ...authentication }),
  dispatch => ({
    loginUser: form => dispatch(login(form)),
  })
)(LoginForm);
