import React, { Component } from "react";
import { Button, Form, Select } from "semantic-ui-react";

import { FormFieldHelper } from "./common/helpers";



class TeamSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamRequest: "",
    };

    this.handleTeamCreateChange = this.handleTeamCreateChange.bind(this);
    this.handleTeamRequest = this.handleTeamRequest.bind(this);
    this.handleTeamCreate = this.handleTeamCreate.bind(this);
    this.teamOptions = [];
    for (const team of this.props.teams) {
      this.teamOptions.push({
        key: team.team_id,
        value: team.team_id,
        text: team.team_name
      })
    }
  }

  handleTeamCreateChange() {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      teamRequestInput: value,
    }));
  }

  handleTeamCreate() {
    //TODO: implement
    alert("you created a team");
  }

  handleTeamRequest() {
    //TODO: implement
    alert("you requested to join a team");
  }

  render() {
    return (
      <div className="Settings-teamSettings Settings-form">
        <div className="Settings-teamWrapper">
          <Form className="Settings-teamForm">
            <div className="Settings-teamSelect">
              <Select placeholder="Teams" options={this.teamOptions} />
              <Button primary onClick={this.handleTeamRequest}>
                Request
              </Button>
            </div>
            <div className="Settings-teamUpdate">
              <FormFieldHelper
                baseClass="Settings"
                idPrefix="settings"
                name="teamRequest"
                placeholder="New Team Name"
                onChange={this.handleTeamCreateChange}
              />
              <Button primary onClick={this.handleTeamCreate}>
                Create
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default TeamSettings;
