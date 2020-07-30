import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { signup } from "../redux/actions";
import { FormFieldHelper } from "./common/helpers.js";

const validEmailRegExp = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
class CreateAccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "", //TODO: this is a suuuuper insecure way of getting user's password. anyone with react chrome devtools could see it. definitely something we can improve on
      errors: {
        emailFormat: "",
        passwordMatch: "",
        emailTaken: "",
      },
    };
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(
      this
    );
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
  }

  handleFirstNameChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      firstName: value,
    }));
  }

  handleLastNameChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      lastName: value,
    }));
  }

  handleEmailChange(event) {
    const { value } = event.target;

    this.setState(
      (prevState) => ({
        ...prevState,
        email: value,
      }),
      this.errorCheckEmail
    );
  }

  handlePasswordChange(event) {
    const { value } = event.target;

    this.setState((prevState) => ({
      ...prevState,
      password: value,
    }));
  }

  handlePasswordConfirmChange(event) {
    const { value } = event.target;
    this.setState(
      (prevState) => ({
        ...prevState,
        passwordConfirm: value,
      }),
      this.errorCheckConfirmPassword
    );
  }

  errorCheckEmail() {
    let errors = this.state.errors;

    errors.emailFormat = validEmailRegExp.test(this.state.email)
      ? ""
      : "Email address is not valid";

    this.setState((prevState) => ({
      ...prevState,
      errors,
    }));
  }

  errorCheckConfirmPassword() {
    let errors = this.state.errors;

    errors.passwordMatch =
      this.state.password === this.state.passwordConfirm
        ? ""
        : "Passwords do not match";

    this.setState((prevState) => ({
      ...prevState,
      errors,
    }));
  }

  handleCreateAccount() {
    console.log("creating account");
    this.props.signup(this.state).then(
      (response) => {
        console.log(response);
        this.props.history.push("/");
      },
      (err) => {
        console.error(err);
        let errors = this.state.errors;
        errors.emailTaken =
          err.message === "Request failed with status code 403"
            ? "This email address is already registered"
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
      !(errors.emailFormat || errors.emailTaken || errors.passwordMatch) &&
      this.state.firstName &&
      this.state.lastName &&
      this.state.password &&
      this.state.passwordConfirm &&
      this.state.email
        ? false
        : true;
    return (
      <Form className="CreateAccount-form">
        <div className="CreateAccount-nameFields">
          <FormFieldHelper
            baseClass="CreateAccount"
            idPrefix="create-account"
            name="first name"
            onChange={this.handleFirstNameChange}
          />
          <FormFieldHelper
            baseClass="CreateAccount"
            idPrefix="create-account"
            name="last name"
            onChange={this.handleLastNameChange}
          />
        </div>
        <FormFieldHelper
          baseClass="CreateAccount"
          idPrefix="create-account"
          name="email"
          onChange={this.handleEmailChange}
        />
        {errors.emailFormat.length > 0 ? (
          <Message negative content={errors.emailFormat} />
        ) : null}
        <FormFieldHelper
          baseClass="CreateAccount"
          idPrefix="create-account"
          name="password"
          type="password"
          onChange={this.handlePasswordChange}
        />
        <FormFieldHelper
          baseClass="CreateAccount"
          idPrefix="create-account"
          name="confirm password"
          type="password"
          onChange={this.handlePasswordConfirmChange}
        />
        {errors.passwordMatch.length > 0 ? (
          <Message negative content={errors.passwordMatch} />
        ) : null}
        <Button
          positive
          className="CreateAccount-submit"
          type="submit"
          onClick={this.handleCreateAccount}
          disabled={enableSubmit}
        >
          Create Account
        </Button>
        {errors.emailTaken.length > 0 ? (
          <Message negative content={errors.emailTaken} />
        ) : null}
      </Form>
    );
  }
}

CreateAccountForm.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { signup })(CreateAccountForm));
