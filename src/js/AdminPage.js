import React, { Component } from "react";
import { Dimmer, Loader, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Heading from "./components/common/Heading";
import AdminTeamSection from "./components/AdminTeamSection";
import AdminEmailSection from "./components/AdminEmailSection";
import AdminDeleteButton from "./components/AdminDeleteButton";
import InviteForm from "./components/InviteForm";
import TeamTaskbar from "./components/TeamTaskbar";
import ConfirmModal from "./components/ConfirmModal";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teamInfo: null,
      nonTeamMembers: null,
      showInviteModal: false,
      inviteEmail: "",
      inviteError: "",
      showDeleteConfirm: false,
      deleteComplete: false,
    };
    this.deleteTeam = this.deleteTeam.bind(this);
    this.handleDeleteTeamConfirmOpen = this.handleDeleteTeamConfirmOpen.bind(
      this
    );
    this.handleDeleteTeamConfirmClose = this.handleDeleteTeamConfirmClose.bind(
      this
    );
    this.openInviteModal = this.openInviteModal.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.inviteTeamMember = this.inviteTeamMember.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const token = localStorage.getItem("jwtToken");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "/users/login/" +
        this.props.userEmail +
        "/team_id/" +
        this.props.currentTeam,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          data: data,
        });
      });
    fetch("/teams/" + this.props.currentTeam, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          teamInfo: data,
        });
      });
    fetch(`/teams/${this.props.currentTeam}/non_members`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          nonTeamMembers: data,
        });
      });
  }

  handleDeleteTeamConfirmOpen() {
    this.setState({
      showDeleteConfirm: true,
    });
  }

  handleDeleteTeamConfirmClose() {
    this.setState({
      showDeleteConfirm: false,
    });
  }

  deleteTeam() {
    this.setState({
      showDeleteConfirm: false,
    });
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;

    axios
      .delete(`${BASE_URL}/teams/${this.props.currentTeam}`)
      .then(() => {
        this.setState({
          deleteComplete: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  inviteTeamMember() {
    const token = localStorage.getItem("jwtToken");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("/users/" + this.state.inviteEmail + "?type=email", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Error) {
          this.setState({
            inviteError: "No user exists with that email",
          });
        } else {
          const body = {
            date_added: new Date(),
            approved_ind: 1,
          };
          const token = localStorage.getItem("jwtToken");
          const raw = JSON.stringify(body);
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${token}`);
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
            .then((data) => {
              this.setState({
                inviteError: "",
                showInviteModal: false,
              });
              this.fetchData();
            })
            .catch((err) => {
              this.setState({
                inviteError: "",
                showInviteModal: false,
              });
              this.fetchData();
            });
        }
      });
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
    if (this.state.data && this.state.teamInfo && this.state.nonTeamMembers) {
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
              lastName={this.state.data.last_name}
              status={this.state.data.team.team_admin ? "ADMIN" : "MEMBER"}
              soleAdmin={this.state.data.sole_admin}
              openInviteModal={this.openInviteModal}
              inviteTeamMember={this.inviteTeamMember}
              currentTeam={this.props.currentTeam}
              currentUserId={this.state.data.member_id}
              updateData={this.fetchData}
            />
            <div className="ui hidden divider"></div>
            <AdminEmailSection teamInfo={this.state.teamInfo} />
            <div className="ui hidden divider"></div>
            {this.state.showInviteModal ? (
              <InviteForm
                handleEmailChange={this.handleEmailChange}
                closeModal={this.closeModal}
                handleAction={this.inviteTeamMember}
                errorText={this.state.inviteError}
                nonTeamMembers={this.state.nonTeamMembers.items}
              />
            ) : null}

            <ConfirmModal
              trigger={
                <AdminDeleteButton onClick={this.handleDeleteTeamConfirmOpen} />
              }
              message="Do you want to delete this team? This cannot be undone."
              header="Are you sure?"
              buttonLabel="Yes"
              onAction={this.deleteTeam}
              open={this.state.showDeleteConfirm}
              onClose={this.handleDeleteTeamConfirmClose}
            />
          </div>
          {this.state.deleteComplete ? <Redirect to="/settings" /> : null}
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

const mapStateToProps = (state) => {
  let email;
  //need to confirm this value exists here, otherwise logout experiences a runtime error with an index out of bounds exception
  if (
    state.auth &&
    state.auth.user &&
    state.auth.user.user &&
    state.auth.user.user.length
  ) {
    email = state.auth.user.user[0].email;
  } else {
    email = null;
  }

  return {
    userEmail: email,
    currentTeam: state.teams.currentTeam,
  };
};

export default connect(mapStateToProps)(AdminPage);
