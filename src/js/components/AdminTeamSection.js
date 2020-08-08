import React, { Component } from "react";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { Icon, Button } from "semantic-ui-react";
import { dateToQueryString } from "./common/helpers";
import DismissibleMessage from "./MessageDismissible";
import AdminTeamMember from "./AdminTeamMember";
import axios from "axios";

const BASE_URL = `${window.location.protocol}//${window.location.host}`;

class AdminTeamSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdminWarningMsg: false,
      adminDemotedSelf: false,
    };
    this.deleteMember = this.deleteMember.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.approveMember = this.approveMember.bind(this);
    this.removePending = this.removePending.bind(this);
    this.toggleAdminWarning = this.toggleAdminWarning.bind(this);
  }

  deleteMember(userId) {
    axios
      .delete(
        `${BASE_URL}/teams/${
          this.props.currentTeam
        }/users/${userId}?date=${dateToQueryString(new Date())}`
      )
      .then(() => {
        console.log("User deleted");
        this.props.updateData();
      });
  }

  toggleAdminWarning(value) {
    if (value === undefined) {
      this.setState((prevState) => ({
        ...prevState,
        showAdminWarningMsg: false,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        showAdminWarningMsg: value,
      }));
    }
  }

  changeStatus(userId, value) {
    const body = {
      admin_ind: value == "ADMIN" ? 1 : 0,
    };
    const token = localStorage.getItem("jwtToken");
    const raw = JSON.stringify(body);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      "/teams/" + this.props.currentTeam + "/users/" + userId,
      requestOptions
    ).then((data) => {
      this.props.updateData();
    });
  }

  approveMember(userId) {
    const body = {
      approved_ind: 1,
    };
    const token = localStorage.getItem("jwtToken");
    const raw = JSON.stringify(body);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      "/teams/" + this.props.currentTeam + "/users/" + userId,
      requestOptions
    )
      .then((data) => {
        console.log(data);
        this.props.updateData();
      })
      .catch((err) => {
        console.warn(err);
        this.props.updateData();
      });
  }

  removePending(userId) {
    axios
      .delete(
        `${BASE_URL}/teams/` +
          this.props.currentTeam +
          `/users/${userId}/pending`
      )
      .then(() => {
        console.log("Pending request deleted");
        this.props.updateData();
      });
  }

  render() {
    const { team, firstName, lastName, status } = this.props;
    return (
      <div className="Admin-teamSection Admin-form">
        <h2 className="Settings-header">{team.team_name}</h2>
        <div className="Admin-teamMembers">
          <AdminTeamMember
            name={firstName + " " + lastName}
            id={this.props.currentUserId}
            deleteMember={this.deleteMember}
            status={status}
            changeStatus={this.changeStatus}
            isCurrentUser={true}
            isSoleAdmin={this.props.soleAdmin}
            updateData={this.props.updateData}
            toggleAdminWarning={this.toggleAdminWarning}
          />
          {this.state.showAdminWarningMsg ? (
            <div>
              <DismissibleMessage
                header="Error!"
                style="negative"
                content="You must assign Admin status to one other member before changing your own status."
                handleDismiss={this.toggleAdminWarning}
              />
            </div>
          ) : null}
          {team.team_members.map((member) => {
            return (
              <AdminTeamMember
                key={member.member_id}
                id={member.member_id}
                name={member.first_name + " " + member.last_name}
                deleteMember={this.deleteMember}
                status={member.status}
                changeStatus={this.changeStatus}
                updateData={this.props.updateData}
                isNotCurrentUser={true}
                approveMember={this.approveMember}
                removePending={this.removePending}
                toggleAdminWarning={this.toggleAdminWarning}
              />
            );
          })}
        </div>
        <div className="Admin-inviteButtonWrapper">
          <Button
            primary
            onClick={this.props.openInviteModal}
            className="Admin-inviteButton"
          >
            Invite
          </Button>
        </div>
      </div>
    );
  }
}

export default AdminTeamSection;
