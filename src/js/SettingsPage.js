import React, { Component } from "react";
import { Dimmer, Form, Loader, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import Heading from "./components/common/Heading";
import UserSettings from "./components/UserSettings";
import TeamSettings from "./components/TeamSettings";
import PendingInvites from "./components/PendingInvites";
import SettingsDeleteButton from "./components/SettingsDeleteButton";
import {
  selectUser,
  setAuthorizationToken,
  setCurrentUser,
  selectTeam,
} from "./redux/actions";
const BASE_URL = `${window.location.protocol}//${window.location.host}`;
const token = localStorage.getItem("jwtToken");

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teams: null,
      userInfo: null,
      pending: null,
      deleteUserError: "",
    };

    this.deleteAccount = this.deleteAccount.bind(this);
    this.addPending = this.addPending.bind(this);
    this.removePending = this.removePending.bind(this);
    this.addTeam = this.addTeam.bind(this);
  }

  async componentDidMount() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch("/teams", requestOptions);
    const json = await response.json();
    this.setState({ data: json });

    const response2 = await fetch(
      "/users/" + this.props.currentUserId + "/teams",
      requestOptions
    );
    const json2 = await response2.json();
    this.setState({ teams: json2.items });

    const response4 = await fetch(
      "/users/" + this.props.currentUserId + "/pending",
      requestOptions
    );
    const json4 = await response4.json();
    this.setState({ pending: json4 });

    //this needs to be listed last
    const response3 = await fetch(
      "/users/" + this.props.currentUserId,
      requestOptions
    );
    const json3 = await response3.json();
    this.setState({ userInfo: json3 });

    if (!this.state.teams) {
      this.props.selectTeam(-1);
    }
  }

  deleteAccount() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    axios
      .delete(`${BASE_URL}/users/${this.props.currentUserId}/?date=` + today)
      .then(() => {
        console.log("User Deleted");
        this.props.logout();
      })
      .catch((error) => {
        this.setState({
          deleteUserError:
            "You must revoke admin privileges in all teams > 1 member where you are the only admin",
        });
      });
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

  async addTeam(teamName) {
    const curDate = moment(new Date()).format("YYYY-MM-DD");

    console.log(`Adding ${teamName} on ${curDate}`);
    try {
      const addNewTeamOutcome = await axios.post("/teams", {
        name: teamName,
        date: curDate,
        member_id: this.props.currentUserId,
      });

      const allTeams = await axios.get(
        `/users/${this.props.currentUserId}/teams`
      );
      this.setState((prevState) => ({
        ...prevState,
        teams: allTeams.data.items,
      }));
    } catch (err) {
      throw err;
    }
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
            currentTeams={this.state.teams ? this.state.teams : []}
            pending={this.state.pending}
            onAddPending={this.addPending}
            onAddTeam={this.addTeam}
            errors={this.state.newTeamError}
          />
          <div className="ui hidden divider"></div>
          <PendingInvites
            pending={this.state.pending}
            onRemovePending={this.removePending}
          />
          <SettingsDeleteButton onClick={this.deleteAccount} />
          {this.state.deleteUserError ? (
            <Message negative content={this.state.deleteUserError} />
          ) : null}
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

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  },
});

const mapStateToProps = (state) => {
  let id = null;
  if (
    state.auth &&
    state.auth.user &&
    state.auth.user.user &&
    state.auth.user.user.length
  ) {
    id = state.auth.user.user[0].member_id;
  }

  return {
    currentUserId: id,
  };
};

export default connect(mapStateToProps, { mapDispatchToProps, selectTeam })(
  SettingsPage
);
