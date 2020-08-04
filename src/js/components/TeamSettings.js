import React, { Component } from "react";
import {
  Button,
  Form,
  Select,
  Grid,
  Segment,
  Message,
} from "semantic-ui-react";
import DismissibleMessage from "./MessageDismissible";
import { FormFieldHelper } from "./common/helpers";
import { connect } from "react-redux";
import { selectTeam } from "../redux/actions";

class TeamSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeamDisplayed: "",
      joinTeamRequest: {},
      newTeamName: "",
      newTeamNameError: "",
      newTeamSuccess: false,
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleTeamRequest = this.handleTeamRequest.bind(this);
    this.handleTeamCreate = this.handleTeamCreate.bind(this);
    this.handleTeamCreateChange = this.handleTeamCreateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createTeamButtonEnabledStatus = this.createTeamButtonEnabledStatus.bind(
      this
    );
    this.requestToJoinTeamEnabledStatus = this.requestToJoinTeamEnabledStatus.bind(
      this
    );
    this.teamCreateError = this.teamCreateError.bind(this);
    this.teamCreateSuccess = this.teamCreateSuccess.bind(this);
    this.handleDismissMsg = this.handleDismissMsg.bind(this);
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

  handleTeamCreateChange(event) {
    //debugger;
    const { value } = event.target;

    this.setState(
      (prevState) => ({
        ...prevState,
        newTeamName: value,
        newTeamNameError: "",
      }),
      this.teamCreateError
    );
  }

  handleDismissMsg() {
    this.setState((prevState) => ({
      ...prevState,
      newTeamName: "",
      newTeamNameError: "",
      newTeamSuccess: false,
    }));
  }

  requestToJoinTeamEnabledStatus() {
    if (this.state.joinTeamRequest.team_id) {
      return false;
    }
    return true;
  }

  createTeamButtonEnabledStatus() {
    if (this.state.newTeamName) {
      return false;
    }
    return true;
  }

  teamCreateError() {
    if (this.state.newTeamNameError) {
      debugger;
      return (
        <Message
          negative
          header="Error!"
          content={this.state.newTeamNameError}
        ></Message>
      );
    }
  }

  teamCreateSuccess() {
    if (!this.state.newTeamNameError) {
      return (
        <DismissibleMessage
          header="Success!"
          style="success"
          content="Team was successfully created"
        />
      );
    }
  }

  handleTeamCreate() {
    this.props
      .onAddTeam(this.state.newTeamName)
      .then((result) => {
        // this is so wrong
        var el = document.getElementById("settings-teamRequest");
        // and bad
        el.value = "";
        this.setState((prevState) => ({
          ...prevState,
          newTeamName: "",
          newTeamSuccess: true,
        }));
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "Request failed with status code 403") {
          this.setState((prevState) => ({
            ...prevState,
            newTeamNameError: "This team name is already taken",
          }));
        }
      });
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
            {this.props.currentTeams.length ? (
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
                      className="Settings-button"
                      disabled={this.requestToJoinTeamEnabledStatus()}
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
                    value={this.state.newTeamName}
                    onChange={this.handleTeamCreateChange}
                  />
                </div>
                <div className="eight wide column">
                  <Button
                    primary
                    onClick={this.handleTeamCreate}
                    className="Settings-button"
                    disabled={this.createTeamButtonEnabledStatus()}
                  >
                    Create New Team
                  </Button>
                </div>
              </div>
            </div>
            {this.teamCreateError()}
          </Form>
          {this.state.newTeamSuccess ? (
            <DismissibleMessage
              header="Success!"
              style="success"
              content="Team was successfully created"
              onDimiss={this.handleDismissMsg}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentTeam: state.teams.currentTeam,
});

export default connect(mapStateToProps)(TeamSettings);
