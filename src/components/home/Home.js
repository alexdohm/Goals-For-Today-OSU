import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions";

class Home extends Component {
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    return (
      <a href="#" onClick={this.logout.bind(this)}>
        Logout
      </a>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.isAuthenticated,
  };
}

export default connect(mapStateToProps, { logout })(Home);
