import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";

import Comments from "./components/Comments";
import TeamTaskbar from "./components/TeamTaskbar";
import ToDoList from "./components/ToDoList";
import { selectTeam, selectUser } from "./redux/actions";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(true);
  }

  fetchData(isInitialLoad = false) {
    fetch("/users/login/" + this.props.userEmail)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          data: data,
        });
        this.props.selectTeam(data.team.team_id);
        if (isInitialLoad) {
          this.props.selectUser(data.member_id);
        }
      });
  }

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <div className="Home">
          <TeamTaskbar
            currentUserId={data.member_id}
            currentUserFirstName={data.first_name}
            team={data.team}
          />
          <ToDoList
            currentUserId={data.member_id}
            team={data.team}
            updateData={this.fetchData}
          />
          <Comments
            currentUserId={data.member_id}
            team={data.team}
            updateData={this.fetchData}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectUser: (userID) => dispatch(selectUser(userID)),
  selectTeam: (teamID) => dispatch(selectTeam(teamID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
