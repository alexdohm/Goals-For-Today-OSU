import React, { Component } from "react";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { Icon, Button, Select } from "semantic-ui-react";
import { USER_ICON, TRASH_ICON } from "./common/constants";
import IconButton from "./common/IconButton";
import { dateToQueryString } from "./common/helpers";
import axios from "axios";

const BASE_URL = `${window.location.protocol}//${window.location.host}`;

const statusOptions = [
  {
    key: "MEMBER",
    value: "MEMBER",
    text: "Member",
  },
  {
    key: "ADMIN",
    value: "ADMIN",
    text: "Admin",
  },
];

class AdminTeamSection extends Component {
  constructor(props) {
    super(props);
    this.deleteMember = this.deleteMember.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.approveMember = this.approveMember.bind(this);
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

  changeStatus(userId, value) {
    const body = {
      admin_ind: value == "ADMIN" ? 1 : 0,
    };

    const raw = JSON.stringify(body);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  approveMember(userId) {
    const body = {
      approved_ind: 1,
    };

    const raw = JSON.stringify(body);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
      .then((response) => response.json())
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
      .delete(`${BASE_URL}/teams/` + teamId + `/users/${userId}/pending`)
      .then(() => {
        console.log("Pending request deleted");
      });
  }

  render() {
    const { team, firstName, status } = this.props;
    return (
      <div className="Admin-teamSection Admin-form">
        <Heading hLevel={2} baseClass="Admin">
          {team.team_name}
        </Heading>
        <div className="Admin-teamMembers">
          <AdminTeamMember
            name={firstName}
            id={this.props.currentUserId}
            deleteMember={this.deleteMember}
            status={status}
            changeStatus={this.changeStatus}
          />
          {team.team_members.map((member) => {
            return (
              <AdminTeamMember
                key={member.member_id}
                id={member.member_id}
                name={member.first_name}
                deleteMember={this.deleteMember}
                status={member.status}
                changeStatus={this.changeStatus}
                isNotCurrentUser={true}
                approveMember={this.approveMember}
                removePending={this.removePending}
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

class AdminTeamMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusValue: this.props.status,
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleDropdownChange(e, { value }) {
    this.setState((prevState) => ({
      ...prevState,
      statusValue: value,
    }));
    this.props.changeStatus(this.props.id, value);
  }

  render() {
    return (
      <div className="Admin-teamMember">
        <Icon className="Admin-teamMemberIcon" name={USER_ICON} size="large" />
        <Text baseClass="Admin">{this.props.name}</Text>
        {this.state.statusValue == "REQUESTED" ? (
          <Button
            primary
            className="Admin-approve"
            onClick={() => this.props.approveMember(this.props.id)}
          >
            Approve
          </Button>
        ) : (
          <Select
            className="Admin-statusSelect"
            options={statusOptions}
            value={this.state.statusValue}
            onChange={this.handleDropdownChange}
          />
        )}
        {this.props.isNotCurrentUser ? (
          <IconButton
            baseClass="Admin"
            icon={TRASH_ICON}
            onClick={
              this.state.statusValue == "REQUESTED"
                ? () => this.props.removePending(this.props.id)
                : () => this.props.deleteMember(this.props.id)
            }
          />
        ) : null}
      </div>
    );
  }
}

export default AdminTeamSection;
