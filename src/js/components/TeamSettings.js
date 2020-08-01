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
      joinTeamRequest: [],
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleTeamRequest = this.handleTeamRequest.bind(this);
    this.handleTeamCreate = this.handleTeamCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // componentDidMount() {
  //   this.teamOptions = [];
  //   for (const team of this.props.currentTeams) {
  //     this.teamOptions.push({
  //       key: team.team_id,
  //       value: team.team_id,
  //       text: team.team_name,
  //     });
  //   }
  // }

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
    this.props.onAddPending(this.state.joinTeamRequest);
  }

  handleChange(event, data) {
    const { value } = data;
    const item = this.props.teams.find((element) => element.team_id === value);
    delete item.self;

    this.setState((prevState) => ({
      ...prevState,
      joinTeamRequest: item,
    }));
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

  buildNonTeamOptions(teams, userTeams) {
    let options = [];
    for (const team of teams) {
      if (
        !userTeams.some((e) => e.team_id === team.team_id) &&
        !this.props.pending.some((e) => e.team_id === team.team_id)
      ) {
        options.push({
          text: team.team_name,
          value: team.team_id,
          key: team.team_id,
        });
      }
    }
    return options;
  }

  render() {
    return (
      <div className="Settings-teamSettings Settings-form">
        <h3 className="Settings-header">Team Settings</h3>
        <div className="Settings-teamWrapper">
          {this.props.currentTeams.length ? <h5>Switch To Dashboard</h5> : null}
          <div>
            {this.props.currentTeams.length 
              ?
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
              :
                null}
            <Form className="Settings-teamForm">
              <h5>Request To Join Team</h5>
              <div className="Settings-teamSelect">
                <div className="ui grid">
                  <div className="eight wide column">
                    <Select
                      placeholder="Select Team"
                      options={this.buildNonTeamOptions(
                        this.props.teams,
                        this.props.currentTeams
                      )}
                      onChange={this.handleChange}
                    />
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
          </div>

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
