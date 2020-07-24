import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux"

import Heading from "./components/common/Heading";
import AdminTeamSection from "./components/AdminTeamSection";
import AdminEmailSection from "./components/AdminEmailSection";
import AdminDeleteButton from "./components/AdminDeleteButton";

class AdminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
    this.deleteTeam = this.deleteTeam.bind(this);
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

  deleteTeam() {
    //TODO: implement
    alert('you deleted a team');
  }

  render() {
    if (this.state.data) {
      return (
        <div className="Admin">
          <Heading hLevel={2} baseClass="Settings">
            Admin Page
          </Heading>
          <AdminTeamSection team={this.state.data.team} firstName={this.state.data.first_name} />
          <AdminEmailSection />
          <AdminDeleteButton onClick={this.deleteTeam} />
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
