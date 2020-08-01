import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import Heading from "./components/common/Heading";
import TeamTaskbar from "./components/TeamTaskbar";
import { dateToQueryString } from "./components/common/helpers";

class TeamOverviewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teamInfo: null,
      stats: null,
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
      })
      .then( () => {
        fetch("/teams/" + this.props.currentTeam + "/statistics?beginDate=07-21-2020&endDate=" + dateToQueryString(new Date()))
        .then(response => response.json())
        .then(data => {
          this.setState({
            stats: data
          });
        });
      });
  }

  render() {
    if (this.state.data && this.state.teamInfo && this.state.stats) {
      console.log(this.state);
      const { data } = this.state;
      return (
        <div className="TeamOverview">
          <TeamTaskbar
              currentUserId={data.member_id}
              currentUserFirstName={data.first_name}
              currentUserLastName={data.last_name}
              team={data.team}
            />
          <div classname="TeamOverview-container">
            <Heading hLevel={1} baseClass="TeamOverview">
              {this.state.teamInfo.team_name}
            </Heading>
            <div className="TeamOverview-stats">TODO: place charts here</div>
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
