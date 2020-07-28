import React, { Component } from "react";
import { Form, Button, Icon, Select } from "semantic-ui-react";
import { FormFieldHelper } from "./common/helpers";
import { TIME_OPTIONS, USER_ICON } from "./common/constants";
import Heading from "./common/Heading";
import axios from "axios";
const BASE_URL = `${window.location.protocol}//${window.location.host}`;

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updatedMorningTime: "",
      updatedEveningTime: "",
    };

    this.handleMorningTimeChange = this.handleMorningTimeChange.bind(this);
    this.handleEveningTimeChange = this.handleEveningTimeChange.bind(this);
    this.timeOptions = TIME_OPTIONS;
  }

  handleMorningTimeChange(event, data) {
    const { value } = data;
    this.setState(
      (prevState) => ({
        ...prevState,
        updatedMorningTime: value,
      }),
      () => {
        axios.patch(`${BASE_URL}/users/${this.props.user.member_id}`, {
          morning_time: this.state.updatedMorningTime,
        });
      }
    );
  }

  handleEveningTimeChange(event, data) {
    const { value } = data;
    this.setState(
      (prevState) => ({
        ...prevState,
        updatedEveningTime: value,
      }),
      () => {
        axios.patch(`${BASE_URL}/users/${this.props.user.member_id}`, {
          evening_time: this.state.updatedEveningTime,
        });
      }
    );
    // this.props.updateUserMorningTime()
  }

  render() {
    return (
      <div className="Settings-userSettings Settings-form">
        <h3 className="Settings-header">Time Settings</h3>
        <div className="Settings-userWrapper">
          {this.props.user ? (
            <Form className="Settings-emailTime">
              <div className="ui equal width grid">
                <div className="row">
                  <div className="column">
                    <label>Morning Email Time</label>
                  </div>
                  <div className="column">
                    <Select
                      options={this.timeOptions}
                      onChange={this.handleMorningTimeChange}
                      value={
                        this.state.updatedMorningTime
                          ? this.state.updatedMorningTime
                          : this.props.user.morning_time.slice(0, 5)
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="column">
                    <label>Evening Email Time</label>
                  </div>
                  <div className="column">
                    <Select
                      options={this.timeOptions}
                      onChange={this.handleEveningTimeChange}
                      value={
                        this.state.updatedEveningTime
                          ? this.state.updatedEveningTime
                          : this.props.user.evening_time.slice(0, 5)
                      }
                    />
                  </div>
                </div>
              </div>
            </Form>
          ) : null}
        </div>
      </div>
    );
  }
}

export default UserSettings;
