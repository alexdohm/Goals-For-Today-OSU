import React, { Component } from "react";
import Heading from "./common/Heading";
import { Button, Select, Loader, Confirm } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Text from "./common/Text";
import IconButton from "./common/IconButton";
import { USER_ICON, TRASH_ICON } from "./common/constants";

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

class AdminTeamMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusValue: this.props.status,
      showDeleteConfirm: false,
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
      // admin trying to demote themselves but
      // there are no other admins on the team
      this.props.toggleAdminWarning(true);

      this.setState((prevState) => ({
        ...prevState,
        statusValue: "ADMIN",
      }));
    } else if (this.props.isCurrentUser && value === "MEMBER") {
      // Admin has changed their role to non-admin and
      // there is at least one other admin, so remove
      // admin perks and redirect
      this.props.changeStatus(this.props.id, value);
      this.setState((prevState) => ({
        ...prevState,
        statusValue: value,
        adminDemotedSelf: true,
      }));
      this.props.toggleAdminWarning(false);
      this.props.changeStatus(this.props.id, value);
    } else {
      this.setState((prevState) => ({
        ...prevState,
        statusValue: value,
      }));
      this.props.toggleAdminWarning(false);
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
              <div className="Admin-modal">
                <Confirm
                  open={true}
                  onConfirm={this.handleConfirmDelete}
                  handleDismiss={
                    this.props.handleDismiss ? this.props.handleDismiss : null
                  }
                  onCancel={this.handleConfirmClose}
                  content={`This action is permanent. Once someone is removed from a team they cannot be added back. Do you want to permanently remove ${this.props.name}?`}
                  header={"WARNING!"}
                  confirmButton={"Remove"}
                  size={"tiny"}
                />
              </div>
            ) : null}
            <div>
              {this.state.adminDemotedSelf ? <Redirect to="/home" /> : null}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default AdminTeamMember;
