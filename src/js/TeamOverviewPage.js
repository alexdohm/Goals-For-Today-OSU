import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimmer, Loader, Tab, Icon } from "semantic-ui-react";
import DatePicker from "react-datepicker";

import Heading from "./components/common/Heading";
import TeamTaskbar from "./components/TeamTaskbar";
import Comments from "./components/Comments";
import { dateToQueryString, dateToAxisString } from "./components/common/helpers";
import UserStats from "./components/UserStats";
import UserPercentageStats from "./components/UserPercentageStats";
import TeamStats from "./components/TeamStats";
import { setInitialView } from "./components/common/helpers";

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
    this.fetchData(true);
  }

  fetchData(isInitialLoad = false) {
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
      })
      .then(() => {
        if (isInitialLoad) {
          setInitialView();
        }
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
      })
      .then(() => {
        if (isInitialLoad) {
          setInitialView();
        }
      });;
  }

  updateStatistics() {
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
    return this.state.stats.completedPerMemberDate.map((userData) => {
      return <UserStats userData={userData} />;
    });
  }

  getTabPanes() {

    const panes = [];

    if (this.state.stats.completedPerMemberDate && this.state.stats.completedPerMemberDate.length) {
      panes.push({
        menuItem: { key: 'user pie charts', icon: 'chart pie large', content: ''},
        render: () => {
          return (
            <div className="TeamOverview-userStatsCotainer">
              <Heading hLevel={2} baseClass="TeamOverview" modifier="userStatsHeading">
                  Goals Completed on {dateToAxisString(this.state.endDate)} Per User
              </Heading>
              <div className="TeamOverview-userStats">
                {this.generateUserStatsToday()}
              </div>
            </div>
          )
        }
      });
    }

    if (this.state.stats.completedPerMemberInPeriod && this.state.stats.completedPerMemberInPeriod.length) {
      panes.push({
        menuItem: { key: 'user pie charts', icon: 'chart line large', content: '' },
        render: () => {
          return (
            <div className="TeamOverview-stats">
              <UserPercentageStats
                perMemberInPeriod={this.state.stats.completedPerMemberInPeriod}
              />
            </div>
          )
        }
      });
    }

    if (this.state.stats.teamCompletedInPeriod && this.state.stats.teamCompletedInPeriod.length) {
      panes.push({
        menuItem: { key: 'user pie charts', icon: 'group large', content: '' },
        render: () => {
          return (
            <div className="TeamOverview-teamStats">
              <TeamStats
                teamCompletedInPeriod={this.state.stats.teamCompletedInPeriod}
              />
            </div>
          )
        }
      });
    }

    return panes;
  }

  render() {
    if (this.state.data && this.state.teamInfo && this.state.stats) {
      console.log(this.state);
      const { data } = this.state;
      window.scrollTo(0, 0);
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
                <Heading baseClass="TeamOverview" modifier="beginDateHeading" hLevel={3}>
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
                <Heading baseClass="TeamOverview" modifier="endDateHeading" hLevel={3}>
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
            <Tab panes={this.getTabPanes()} />
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
