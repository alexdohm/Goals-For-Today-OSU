import React, { Component } from "react";
import { Button, Form, Select, Grid, Segment } from "semantic-ui-react";

import { FormFieldHelper } from "./common/helpers";
import { connect } from "react-redux";
import { selectTeam } from "../redux/actions";

class TeamSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeamDisplayed: "",
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleTeamRequest = this.handleTeamRequest.bind(this);
    this.handleTeamCreate = this.handleTeamCreate.bind(this);
    this.teamOptions = [];
    for (const team of this.props.teams) {
      this.teamOptions.push({
        key: team.team_id,
        value: team.team_id,
        text: team.team_name,
      });
    }
  }

  handleTeamChange(event, data) {
    const { value } = data;
    this.setState((prevState) => ({
      ...prevState,
      currentTeamDisplayed: value,
    }));
    this.props.dispatch(selectTeam(value));
  }

  handleTeamCreate() {
    //TODO: implement
    alert("you created a team");
  }

  handleTeamRequest() {
    //TODO: implement
    alert("you requested to join a team");
  }

  buildTeamOptions(teams) {
    console.log(this.props.currentTeams);
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
      <div className="Settings-teamSettings Settings-form">
        <h3 className="Settings-header">Team Settings</h3>
        <div className="Settings-teamWrapper">
          <h5>Switch To Dashboard</h5>
          {this.props.currentTeams ? (
            <Form className="Settings-teamForm">
              <div className="ui grid Settings-teamSelect">
                <div className="eight wide column">
                  <Select
                    options={this.buildTeamOptions(this.props.currentTeams)}
                    value={this.props.currentTeam}
                    onChange={this.handleTeamChange}
                  />
                </div>
              </div>
            </Form>
          ) : null}
          <Form className="Settings-teamForm">
            <h5>Request To Join Team</h5>
            <div className="Settings-teamSelect">
              <div className="ui grid">
                <div className="eight wide column">
                  <Select placeholder="Teams" options={this.teamOptions} />
                </div>
                <div className="eight wide column">
                  <Button
                    primary
                    onClick={this.handleTeamRequest}
                    class="Settings-button"
                  >
                    Request To Join Team
                  </Button>
                </div>
              </div>
            </div>
          </Form>
          <Form className="Settings-teamForm">
            <h5>Create New Team</h5>
            <div className="Settings-teamUpdate">
              <div className="ui grid Settings-teamGrid">
                <div className="eight wide column">
                  <FormFieldHelper
                    baseClass="Settings"
                    idPrefix="settings"
                    name="teamRequest"
                    placeholder="New Team Name"
                    onChange={this.handleTeamCreateChange}
                  />
                </div>
                <div className="eight wide column">
                  <Button primary onClick={this.handleTeamCreate}>
                    Create New Team
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentTeam: state.teams.currentTeam,
});

export default connect(mapStateToProps)(TeamSettings);
// export default TeamSettings;
