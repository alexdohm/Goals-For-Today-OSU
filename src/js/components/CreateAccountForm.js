import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { signup } from "../redux/actions";
import { FormFieldHelper } from "./common/helpers.js";

class CreateAccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "", //TODO: this is a suuuuper insecure way of getting user's password. anyone with react chrome devtools could see it. definitely something we can improve on
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
    this.setState((prevState) => ({
      ...prevState,
      email: value,
    }));
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
    this.setState((prevState) => ({
      ...prevState,
      passwordConfirm: value,
    }));
  }

  handleCreateAccount() {
    //TODO: implement
    console.log("creating account");

    this.props.signup(this.state).then(
      () => {
        this.props.history.push("/");
      },
      (err) => {
        console.error(err);
      }
    );
  }

  render() {
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
        <Button
          positive
          className="CreateAccount-submit"
          type="submit"
          onClick={this.handleCreateAccount}
        >
          Create Account
        </Button>
      </Form>
    );
  }
}

CreateAccountForm.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default withRouter(connect(null, { signup })(CreateAccountForm));
