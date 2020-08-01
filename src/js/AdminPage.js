import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

import Heading from "./components/common/Heading";
import AdminTeamSection from "./components/AdminTeamSection";
import AdminEmailSection from "./components/AdminEmailSection";
import AdminDeleteButton from "./components/AdminDeleteButton";
import InviteForm from "./components/InviteForm";
import TeamTaskbar from "./components/TeamTaskbar";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teamInfo: null,
      showInviteModal: false,
      inviteEmail: "",
      inviteError: "",
    };
    this.deleteTeam = this.deleteTeam.bind(this);
    this.openInviteModal = this.openInviteModal.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.inviteTeamMember = this.inviteTeamMember.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  componentDidMount() {
    fetch(
      "/users/login/" +
        this.props.userEmail +
        "/team_id/" +
        this.props.currentTeam
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          data: data,
        });
      });
    fetch("/teams/" + this.props.currentTeam)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          teamInfo: data,
        });
      });
  }

  deleteTeam() {
    //TODO: implement
    alert("you deleted a team");
  }

  inviteTeamMember() {
    fetch("/users/" + this.state.inviteEmail + "?type=email")
      .then((response) => response.json())
      .then((data) => {
        if (data.Error) {
          this.setState({
            inviteError: "No user exists with that email",
          });
        } else {
          const body = {
            date_added: new Date(),
          };
          const raw = JSON.stringify(body);
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };
          fetch(
            "/teams/" + this.props.currentTeam + "/users/" + data.member_id,
            requestOptions
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              this.setState({
                inviteError: "",
                showInviteModal: false,
              });
            })
            .catch((err) => {
              console.warn(err);
              this.setState({
                inviteError: "",
                showInviteModal: false,
              });
            });
        }
      });
  }

  changeStatus() {
    //TODO: implement
    alert("you changed a user's status");
  }

  handleEmailChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      inviteEmail: value,
    }));
  }

  openInviteModal() {
    this.setState({
      showInviteModal: true,
    });
  }

  closeModal() {
    this.setState({
      showInviteModal: false,
    });
  }

  render() {
    if (this.state.data) {
      return (
        <div className="Admin">
          <TeamTaskbar
            currentUserId={this.state.data.member_id}
            currentUserFirstName={this.state.data.first_name}
            currentUserLastName={this.state.data.last_name}
            team={this.state.data.team}
          />
          <div className="Admin-col">
            <Heading hLevel={2} baseClass="Settings">
              Admin Page
            </Heading>
            <AdminTeamSection
              team={this.state.data.team}
              firstName={this.state.data.first_name}
              status={this.state.data.team.team_admin ? "ADMIN" : "MEMBER"}
              openInviteModal={this.openInviteModal}
              inviteTeamMember={this.inviteTeamMember}
              changeStatus={this.changeStatus}
            />
            <div className="ui hidden divider"></div>
            <AdminEmailSection teamInfo={this.state.teamInfo} />
            <div className="ui hidden divider"></div>
            <AdminDeleteButton onClick={this.deleteTeam} />
            {this.state.showInviteModal ? (
              <InviteForm
                handleEmailChange={this.handleEmailChange}
                closeModal={this.closeModal}
                handleAction={this.inviteTeamMember}
                errorText={this.state.inviteError}
              />
            ) : null}
          </div>
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
  userEmail: state.auth.user.user[0].email,
  currentTeam: state.teams.currentTeam,
});

export default connect(mapStateToProps)(AdminPage);
