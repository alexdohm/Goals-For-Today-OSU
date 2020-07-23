import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux"

import Heading from "./components/common/Heading";
import AdminTeamSection from "./components/AdminTeamSection"

class AdminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
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
      return (
        <div className="Admin">
          <Heading hLevel={2} baseClass="Settings">
            Admin Page
          </Heading>
          <AdminTeamSection team={this.state.data.team} firstName={this.state.data.first_name} />
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

const mapStateToProps = (state) => ({
  userEmail: state.auth.user.user[0].email,
});

export default connect(mapStateToProps)(AdminPage);
