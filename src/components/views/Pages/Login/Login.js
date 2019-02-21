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
        <Col md="6">
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
                  <Col xs="6" className="text-right">
                    <Link to="/register">
                      <Button color="link" className="px-0">Don't have an account?</Button>
                    </Link>
                  </Col>
                </Row>
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
