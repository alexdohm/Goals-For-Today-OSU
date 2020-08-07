import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
import DatePicker from "react-datepicker";

import Heading from "./components/common/Heading";
import TeamTaskbar from "./components/TeamTaskbar";
import Comments from "./components/Comments";
import { dateToQueryString } from "./components/common/helpers";
import UserStats from "./components/UserStats";
const token = localStorage.getItem("jwtToken");

class TeamOverviewPage extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    this.state = {
      data: null,
      teamInfo: null,
      teamComments: null,
      stats: null,
      beginDate: lastWeek,
      endDate: today,
    };

    this.handleBeginDateChange = this.handleBeginDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.updateStatistics = this.updateStatistics.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  handleBeginDateChange(date) {
    this.setState(
      (prevState) => ({
        beginDate:
          date.getTime() < prevState.endDate.getTime()
            ? date
            : prevState.beginDate,
      }),
      this.updateStatistics
    );
  }

  handleEndDateChange(date) {
    this.setState(
      (prevState) => ({
        endDate:
          date.getTime() > prevState.beginDate.getTime()
            ? date
            : prevState.endDate,
      }),
      this.updateStatistics
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
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
        fetch("/teams/" + this.props.currentTeam + "/comments", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              teamComments: data,
            });
          });
      })
      .then(() => {
        this.updateStatistics();
      });
  }

  updateStatistics() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "/teams/" +
        this.props.currentTeam +
        "/statistics?beginDate=" +
        dateToQueryString(this.state.beginDate) +
        "&endDate=" +
        dateToQueryString(this.state.endDate),
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          stats: data,
        });
      });
  }

  generateUserStatsToday() {
    return this.state.stats.completedPerMemberDate.map( userData => {
      return <UserStats userData={userData} />
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
            isTeamOverview={true}
          />
          <div className="TeamOverview-container">
            <div class="TeamOverview-datepickers">
              <div class="TeamOverview-beginDate">
                <Heading baseClass="TeamOverview" hLevel={3}>
                  Begin Date
                </Heading>
                <DatePicker
                  className="ToDoList-datePicker"
                  selected={this.state.beginDate}
                  onChange={this.handleBeginDateChange}
                  placeholderText="Select Date"
                />
              </div>
              <div className="TeamOverview-endDate">
                <Heading baseClass="TeamOverview" hLevel={3}>
                  End Date
                </Heading>
                <DatePicker
                  className="ToDoList-datePicker"
                  selected={this.state.endDate}
                  onChange={this.handleEndDateChange}
                  placeholderText="Select Date"
                />
              </div>
            </div>
            <Heading hLevel={1} baseClass="TeamOverview" modifier="teamName">
              {this.state.teamInfo.team_name}
            </Heading>
            <Heading hLevel={2} baseClass="TeamOverview" modifier="userStats">
              Goals Completed Today Per User
            </Heading>
            <div className="TeamOverview-userStats">
              {this.generateUserStatsToday()}
            </div>
            <div className="TeamOverview-stats">TODO: place charts here</div>
            
          </div>
          <Comments
            currentUserId={data.member_id}
            team={data.team}
            updateData={this.fetchData}
            isTeamOverview={true}
            teamComments={
              this.state.teamComments ? this.state.teamComments : {}
            }
          />
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

export default connect(mapStateToProps)(TeamOverviewPage);
