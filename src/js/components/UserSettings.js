import React, { Component } from 'react';
import { Form, Button, Icon } from "semantic-ui-react";

import { FormFieldHelper } from './common/helpers';
import { USER_ICON } from './common/constants';

class UserSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usernameInput: "",
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUsernameChange() {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      usernameInput: value,
    }));
  }

  handleUpdate() {
    //TODO: implement
    alert('you clicked the update button');
  }

  render() {
    return (
      <div className='Settings-userSettings Settings-form'>
        <div className='Settings-userWrapper'>
          <Form className="Settings-username">
            <FormFieldHelper
              baseClass="Settings"
              idPrefix="settings"
              name="username"
              onChange={this.handleEmailChange}
            />
            <Button
              positive
              className="Settings-usernameUpdate"
              type="submit"
              onClick={this.handleUpdate}
            >
              Update
            </Button>
          </Form>
          <div className='Settings-userAvatar'>
            <Icon name={USER_ICON} size='massive' />
          </div>
        </div>
      </div>
    )
  }
}

export default UserSettings;