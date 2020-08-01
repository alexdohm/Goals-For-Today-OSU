import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import Heading from "./components/common/Heading";
import TeamTaskbar from "./components/TeamTaskbar";

class TeamOverviewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teamInfo: null
    };
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

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <div className="TeamOverview">
          <TeamTaskbar
              currentUserId={data.member_id}
              currentUserFirstName={data.first_name}
              currentUserLastName={data.last_name}
              team={data.team}
            />
          <Heading hLevel={1} baseClass="TeamOverview">
            {this.props.teamName ? this.props.teamName : "Test Team Name"}
          </Heading>
          <div className="TeamOverview-stats">TODO: place charts here</div>
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
};

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
  }
};

export default connect(mapStateToProps)(TeamOverviewPage);
