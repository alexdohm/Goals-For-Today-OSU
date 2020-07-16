import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { FormFieldHelper } from "./common/helpers";
import { login } from "../redux/actions";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailInput: "",
      passwordInput: "", //TODO: this is a suuuuper insecure way of getting user's password. anyone with react chrome devtools could see it. definitely something we can improve on
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
    //TODO: implement
    console.log("you clicked the login button");
    this.props.login(this.state).then(
      () => {
        console.log("we are here");
        this.props.history.push("/home");
      },
      (err) => {
        console.error(err);
      }
    );
  }

  render() {
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
        >
          Login
        </Button>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { login })(LoginForm));
