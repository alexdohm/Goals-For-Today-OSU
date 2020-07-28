import React, { Component } from "react";
import { Form, Button, Icon, Select } from "semantic-ui-react";
import { FormFieldHelper } from "./common/helpers";
import { TIME_OPTIONS, USER_ICON } from "./common/constants";

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameInput: "",
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.timeOptions = TIME_OPTIONS;
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
    alert("you clicked the update button");
  }

  buildTeamOptions(teams) {
    let teamOptions = [];
    for (const team of teams) {
      teamOptions.push({
        text: team.team_name,
        value: team.team_id,
        key: team.team_id,
      });
    }

    return teamOptions;
  }

  render() {
    return (
      <div className="Settings-userSettings Settings-form">
        <div className="Settings-userWrapper">
          {this.props.user ? (
            <Form className="Settings-emailTime">
              <div className="ui equal width grid">
                <div className="row">
                  <div className="column">
                    <label>Morning Time</label>
                  </div>
                  <div className="column">
                    <Select
                      placeholder="Select Reminder Email Time"
                      value={this.props.user.morning_time.slice(0, 5)}
                      options={this.timeOptions}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="column">
                    <label>Evening Time</label>
                  </div>
                  <div className="column">
                    <Select
                      placeholder="Select Reminder Email Time"
                      value={this.props.user.evening_time.slice(0, 5)}
                      options={this.timeOptions}
                    />
                  </div>
                </div>
              </div>
            </Form>
          ) : null}
        </div>
        {/* TODO: I think this should go in the TeamSettings component */}
        {this.props.teams ? (
          <Form className="Settings-currentTeamSelect">
            <div className="ui equal width grid">
              <div className="row">
                <div className="column">
                  <label>Switch To Dashboard</label>
                </div>
                <div className="column">
                  <Select
                    placeholder="Select Team"
                    options={this.buildTeamOptions(this.props.teams)}
                  />
                </div>
              </div>
            </div>
          </Form>
        ) : null}
      </div>
    );
  }
}

export default UserSettings;
