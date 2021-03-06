import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  ADMIN_ICON,
  GROUP_ICON,
  SETTING_ICON,
  SIGN_OUT_ICON,
  USER_ICON,
  MENU_ICON,
  CLOSE_ICON,
} from "./common/constants";
import IconButton from "./common/IconButton";
import Text from "./common/Text";
import {
  selectUser,
  setAuthorizationToken,
  setCurrentUser,
} from "../redux/actions";

class TeamTaskbar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.navigateToSettings = this.navigateToSettings.bind(this);
    this.navigateToTeamOverview = this.navigateToTeamOverview.bind(this);
    this.navigateToAdmin = this.navigateToAdmin.bind(this);
    this.navigateToHome = this.navigateToHome.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

    this.state = {
      isExpanded: false,
    };
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.logout();
  }

  navigateToSettings() {
    this.props.history.push("/settings");
  }

  navigateToTeamOverview() {
    this.props.history.push("/team-overview");
  }

  navigateToAdmin() {
    this.props.history.push("/admin");
  }

  navigateToHome() {
    this.props.history.push("/home");
  }

  toggleMenu() {
    this.setState((prevState) => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  }

  render() {
    const {
      currentUserId,
      currentUserFirstName,
      currentUserLastName,
      team,
    } = this.props;

    return (
      <div
        className={`TeamTaskbar${
          this.state.isExpanded ? "" : " TeamTaskbar--collapsed"
        }`}
      >
        <IconButton
          baseClass="TeamTaskbar"
          modifier="toggle"
          onClick={this.toggleMenu}
          icon={this.state.isExpanded ? CLOSE_ICON : MENU_ICON}
        />
        <div className="TeamTaskbar-container">
          <div className="TeamTaskbar-members">
            {/* render current user's card first */}
            <TaskbarItem
              key={currentUserId}
              onClick={
                this.props.taskbarNavigatesHome
                  ? this.navigateToHome
                  : () => this.props.onUserSelected(currentUserId)
              }
              icon={USER_ICON}
              isSelected={currentUserId == this.props.selectedUserId}
            >
              {currentUserFirstName} {currentUserLastName}
            </TaskbarItem>

            {/* then render rest of teammates */}
            {team.team_members
              ? team.team_members
                  .filter((obj) => obj.status !== "REQUESTED")
                  .map((user, index) => (
                    <TaskbarItem
                      key={user.member_id}
                      onClick={
                        this.props.taskbarNavigatesHome
                          ? this.navigateToHome
                          : () => this.props.onUserSelected(user.member_id)
                      }
                      icon={USER_ICON}
                      isSelected={user.member_id == this.props.selectedUserId}
                    >
                      {user.first_name} {user.last_name}
                    </TaskbarItem>
                  ))
              : null}
          </div>
          <div className="TeamTaskbar-bottom">
            {team.team_name ? (
              <TaskbarItem
                icon={GROUP_ICON}
                onClick={this.navigateToTeamOverview}
              >
                {team.team_name}
              </TaskbarItem>
            ) : null}
            {team.team_admin ? (
              <TaskbarItem icon={ADMIN_ICON} onClick={this.navigateToAdmin}>
                Admin
              </TaskbarItem>
            ) : null}
            <div className="TeamTaskbar-buttons">
              <IconButton
                baseClass="TeamTaskbar"
                onClick={this.handleLogout}
                icon={SIGN_OUT_ICON}
              />
              <IconButton
                baseClass="TeamTaskbar"
                onClick={this.navigateToSettings}
                icon={SETTING_ICON}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const TaskbarItem = (props) => {
  const className = `TaskbarItem${
    props.isSelected ? " TaskbarItem--selected" : ""
  }`;

  return (
    <div className={className} onClick={props.onClick}>
      <Icon className="TaskbarItem-icon" name={props.icon} size="large" />
      <Text baseClass="TaskbarItem">{props.children}</Text>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedUserId: state.toDos.selectedUserId,
  auth: state.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  onUserSelected: (userID) => dispatch(selectUser(userID)),
  logout: () => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TeamTaskbar)
);
