import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { FormFieldHelper } from "./common/helpers";
import { login, selectTeam, selectToDo, selectUser } from "../redux/actions";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailInput: "",
      passwordInput: "", //TODO: this is a suuuuper insecure way of getting user's password. anyone with react chrome devtools could see it. definitely something we can improve on
      errors: {
        emailPasswordNotFound: "",
      },
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleEmailChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      emailInput: value,
    }));
  }

  handlePasswordChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      passwordInput: value,
    }));
  }

  handleLogin() {
    this.props.selectTeam(-1);
    this.props.login(this.state).then(
      () => {
        this.props.history.push("/home");
      },
      (err) => {
        console.error(err);

        let errors = this.state.errors;
        errors.emailPasswordNotFound =
          err.message === "Request failed with status code 404"
            ? "Email and password not recognized"
            : err.message;

        this.setState((prevState) => ({
          ...prevState,
          errors,
        }));
      }
    );
  }

  render() {
    const { errors } = this.state;
    const enableSubmit =
      this.state.emailInput && this.state.passwordInput ? true : false;

    return (
      <Form className="Login-form">
        <FormFieldHelper
          baseClass="Login"
          idPrefix="login"
          name="email"
          onChange={this.handleEmailChange}
        />
        <FormFieldHelper
          baseClass="Login"
          idPrefix="login"
          name="password"
          type="password"
          onChange={this.handlePasswordChange}
        />
        <Button
          positive
          className="Login-submit"
          type="submit"
          onClick={this.handleLogin}
          disabled={!enableSubmit}
        >
          Login
        </Button>
        {errors.emailPasswordNotFound.length > 0 ? (
          <Message negative content={errors.emailPasswordNotFound} />
        ) : null}
      </Form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { login, selectTeam })(LoginForm));
