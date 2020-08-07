import React, { Component } from "react";
import Heading from "./common/Heading";
import { Redirect } from "react-router-dom";
import Text from "./common/Text";
import { Icon, Button, Select, Loader, Confirm } from "semantic-ui-react";
import { USER_ICON, TRASH_ICON } from "./common/constants";
import IconButton from "./common/IconButton";
import { dateToQueryString } from "./common/helpers";
import DismissibleMessage from "./MessageDismissible";
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
    this.removePending = this.removePending.bind(this);
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
          />
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
      showDeleteConfirm: false,
      showAdminWarningMsg: false,
      adminDemotedSelf: false,
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleApproveMember = this.handleApproveMember.bind(this);
    this.handleConfirmClose = this.handleConfirmClose.bind(this);
    this.handleConfirmOpen = this.handleConfirmOpen.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  handleDropdownChange(e, { value }) {
    if (
      this.props.isCurrentUser &&
      this.props.isSoleAdmin &&
      value === "MEMBER"
    ) {
      this.setState((prevState) => ({
        ...prevState,
        showAdminWarningMsg: true,
        statusValue: "ADMIN",
      }));
    } else if (this.props.isCurrentUser && value === "MEMBER") {
      this.props.changeStatus(this.props.id, value);
      this.setState((prevState) => ({
        ...prevState,
        statusValue: value,
        adminDemotedSelf: true,
      }));
      this.props.changeStatus(this.props.id, value);
    } else {
      this.setState((prevState) => ({
        ...prevState,
        statusValue: value,
      }));
      this.props.changeStatus(this.props.id, value);
      this.props.updateData();
    }
  }

  handleApproveMember(e) {
    this.props.approveMember(this.props.id);
    this.setState(
      (prevState) => ({
        ...prevState,
        statusValue: "MEMBER",
      }),
      this.props.updateData()
    );
  }

  handleConfirmClose() {
    this.setState((prevState) => ({
      ...prevState,
      showDeleteConfirm: false,
    }));
  }

  handleConfirmDelete() {
    this.setState(
      (prevState) => ({
        ...prevState,
        showDeleteConfirm: false,
      }),
      this.props.deleteMember(this.props.id)
    );
  }

  handleConfirmOpen() {
    this.setState((prevState) => ({
      ...prevState,
      showDeleteConfirm: true,
    }));
  }

  render() {
    if (this.props.status !== this.state.statusValue) {
      return <Loader active inline="centered" />;
    } else {
      return (
        <div className="Admin-teamMember">
          <div className="ui grid middle aligned Admin-grid">
            <div className="five wide column">
              <div className="row">
                <Text baseClass="Admin">{this.props.name}</Text>
              </div>
            </div>
            <div className="seven wide column">
              {this.props.status == "REQUESTED" ? (
                <Button
                  primary
                  className="Admin-approve"
                  onClick={this.handleApproveMember}
                >
                  Approve
                </Button>
              ) : (
                <Select
                  className="Admin-statusSelect"
                  options={statusOptions}
                  fluid
                  value={this.props.status}
                  onChange={this.handleDropdownChange}
                />
              )}
            </div>
            <div className="four wide column">
              {this.props.isNotCurrentUser ? (
                <IconButton
                  baseClass="Admin"
                  icon={TRASH_ICON}
                  size="large"
                  onClick={
                    this.state.statusValue == "REQUESTED"
                      ? () => this.props.removePending(this.props.id)
                      : () => this.handleConfirmOpen()
                  }
                />
              ) : null}
            </div>
            {this.state.showDeleteConfirm ? (
              <div>
                <Confirm
                  open={true}
                  onConfirm={this.handleConfirmDelete}
                  onCancel={this.handleConfirmClose}
                  content={`This action is permanent. Once someone is removed from a team they cannot be added back. Do you want to permanently remove ${this.props.name}?`}
                  header={"WARNING!"}
                  confirmButton={"Remove"}
                />
              </div>
            ) : null}
            <div>
              {this.state.showAdminWarningMsg ? (
                <div>
                  <DismissibleMessage
                    header="Error!"
                    style="negative"
                    content="You must assign Admin status to one other member before changing your own status."
                  />
                </div>
              ) : null}
              {this.state.adminDemotedSelf ? <Redirect to="/home" /> : null}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default AdminTeamSection;
