import React, { Component } from "react";
import { Button, Form, Select } from "semantic-ui-react";

import { TIME_LIST, TIME_OPTIONS } from "./common/constants";
import axios from "axios";
const BASE_URL = `${window.location.protocol}//${window.location.host}`;

class AdminEmailSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updatedEveningTime: "",
      updatedTimeZone: "",
    };

    this.handleEveningTimeChange = this.handleEveningTimeChange.bind(this);
    this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
    this.timeOptions = TIME_OPTIONS;
    this.timeZones = TIME_LIST;

    console.log(this.props);
  }

  handleEveningTimeChange(event, data) {
    const { value } = data;
    this.setState(
      (prevState) => ({
        ...prevState,
        updatedEveningTime: value,
      }),
      () => {
        axios.patch(`${BASE_URL}/teams/${this.props.teamInfo.team_id}`, {
          evening_time: this.state.updatedEveningTime,
        });
      }
    );
  }

  handleTimeZoneChange(event, data) {
    const { value } = data;
    this.setState(
      (prevState) => ({
        ...prevState,
        updatedTimeZone: value,
      }),
      () => {
        axios.patch(`${BASE_URL}/teams/${this.props.teamInfo.team_id}`, {
          time_zone: this.state.updatedTimeZone,
        });
      }
    );
  }

  render() {
    return (
      // <div className="Admin-form Admin-emailSection">
      //   <Form className="Admin-emailForm">
      //     <Select placeholder="Select Time" options={this.timeOptions} />
      //   </Form>
      // </div>
      <div className="Settings-userSettings Settings-form">
        <h3 className="Settings-header">Time Settings</h3>
        <div className="Settings-userWrapper">
          <Form className="Settings-emailTime">
            <div className="ui equal width grid">
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
                        : this.props.teamInfo.evening_time.slice(0, 5)
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <label>Select Time Zone</label>
                </div>
                <div className="column">
                  <Select
                    options={this.timeZones}
                    onChange={this.handleTimeZoneChange}
                    value={
                      this.state.updatedTimeZone
                        ? this.state.updatedTimeZone
                        : this.props.teamInfo.time_zone
                    }
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default AdminEmailSection;
