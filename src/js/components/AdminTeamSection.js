import React, { Component } from "react";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { Icon, Button, Select } from "semantic-ui-react";
import { USER_ICON, TRASH_ICON } from "./common/constants";
import IconButton from "./common/IconButton";

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
  }

  deleteMember() {
    //TODO: implement
    alert("you clicked the delete member button");
  }

  changeStatus(userId, value) {

    const body = {
      admin_ind: value == 'ADMIN' ? 1 : 0 
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
    fetch("/teams/" + this.props.currentTeam + "/users/" + userId, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
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
      statusValue: this.props.status
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
        <Select
          className="Admin-statusSelect"
          options={statusOptions}
          value={this.state.statusValue}
          onChange={this.handleDropdownChange}
        />
        {this.props.isNotCurrentUser ? (
          <IconButton
            baseClass="Admin"
            icon={TRASH_ICON}
            onClick={this.props.deleteMember}
          />
        ) : null}
      </div>
    );
  }
};

export default AdminTeamSection;
