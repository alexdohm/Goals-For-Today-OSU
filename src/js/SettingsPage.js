import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

import Heading from "./components/common/Heading";
import UserSettings from "./components/UserSettings";
import TeamSettings from "./components/TeamSettings";
import SettingsDeleteButton from './components/SettingsDeleteButton';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      teams: null,
    };
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  componentDidMount() {
    fetch("/teams")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          data: data,
        });
      });
    fetch("/users/" + this.props.currentUserId + "/teams")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          teams: data.items,
        });
      });
  }

  deleteAccount() {
    //TODO: implement
    alert('delete account button');
  }

  render() {
    if (this.state.data) {
      return (
        <div className="Settings">
          <Heading hLevel={2} baseClass="Settings">
            Settings
          </Heading>
          <UserSettings teams={this.state.teams} />
          <Heading hLevel={2} baseClass="Settings">
            My Teams
          </Heading>
          <TeamSettings teams={this.state.data.items} />
          <SettingsDeleteButton onClick={this.deleteAccount}/>
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
  currentUserId: state.auth.user.user[0].member_id,
})

export default connect(mapStateToProps)(SettingsPage);
