import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";

import Comments from "./components/Comments";
import TeamTaskbar from "./components/TeamTaskbar";
import ToDoList from "./components/ToDoList";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    fetch("/users/login/" + this.props.userEmail)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          data: data,
        });
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
          <ToDoList currentUserId={data.member_id} team={data.team} />
          <Comments team={data.team}/>
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
});

export default connect(mapStateToProps)(HomePage);
