import React, { Component } from "react";
import { Dimmer, Loader } from "semantic-ui-react";

import Heading from "./components/common/Heading";
import UserSettings from "./components/UserSettings";
import TeamSettings from "./components/TeamSettings";
import SettingsDeleteButton from './components/SettingsDeleteButton';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
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
          <UserSettings />
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

export default SettingsPage;
