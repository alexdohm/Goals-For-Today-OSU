import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";

import Heading from "./components/common/Heading";
import UserSettings from "./components/UserSettings";
import TeamSettings from "./components/TeamSettings";
import PendingInvites from "./components/PendingInvites";
import SettingsDeleteButton from "./components/SettingsDeleteButton";
const BASE_URL = `${window.location.protocol}//${window.location.host}`;

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teams: null,
      userInfo: null,
      pending: null,
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.addPending = this.addPending.bind(this);
    this.removePending = this.removePending.bind(this);
  }

  async componentDidMount() {
    const response = await fetch("/teams");
    const json = await response.json();
    this.setState({ data: json });

    const response2 = await fetch(
      "/users/" + this.props.currentUserId + "/teams"
    );
    const json2 = await response2.json();
    this.setState({ teams: json2.items });

    const response4 = await fetch(
      "/users/" + this.props.currentUserId + "/pending"
    );
    const json4 = await response4.json();
    this.setState({ pending: json4 });

    //this needs to be listed last
    const response3 = await fetch("/users/" + this.props.currentUserId);
    const json3 = await response3.json();
    this.setState({ userInfo: json3 });
  }

  deleteAccount() {
    //TODO: implement
    alert("delete account button");
  }

  addPending(teamId) {
    const pending = this.state.pending.concat(teamId);
    this.setState((prevState) => ({
      ...prevState,
      pending: pending,
    }));
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    axios
      .put(
        `${BASE_URL}/teams/` +
          teamId.team_id +
          `/users/${this.props.currentUserId}`,
        {
          approved_ind: 0,
          date_added: today,
        }
      )
      .then(() => {
        console.log("Requested to join team");
      });
  }

  removePending(teamId) {
    const pending = this.state.pending.filter(
      (item) => item.team_id !== teamId
    );
    this.setState((prevState) => ({
      ...prevState,
      pending: pending,
    }));

    axios
      .delete(
        `${BASE_URL}/teams/` +
          teamId +
          `/users/${this.props.currentUserId}/pending`
      )
      .then(() => {
        console.log("Pending request deleted");
      });
  }

  render() {
    if (this.state.userInfo) {
      return (
        <div className="Settings">
          <Heading hLevel={2} baseClass="Settings">
            Settings
          </Heading>
          <UserSettings teams={this.state.teams} user={this.state.userInfo} />
          <div className="ui hidden divider"></div>
          <TeamSettings
            teams={this.state.data.items}
            currentTeams={this.state.teams}
            pending={this.state.pending}
            onAddPending={this.addPending}
          />
          <div className="ui hidden divider"></div>
          <PendingInvites
            pending={this.state.pending}
            onRemovePending={this.removePending}
          />
          <SettingsDeleteButton onClick={this.deleteAccount} />
          <div className="ui hidden divider"></div>
        </div>
      );
    } else {
      return (
        <div className="Loader">
          <Dimmer active inverted>
            <Loader inverted content="Loading" />
          </Dimmer>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  currentUserId: state.auth.user.user[0].member_id,
});

export default connect(mapStateToProps)(SettingsPage);
