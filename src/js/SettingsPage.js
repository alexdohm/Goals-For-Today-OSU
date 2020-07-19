import React from "react";

import Heading from "./components/common/Heading";
import UserSettings from './components/UserSettings';
import TeamSettings from './components/TeamSettings';

export const SettingsPage = (props) => {
  return (
    <div className="Settings">
      <Heading hLevel={2} baseClass='Settings'>
        Settings
      </Heading>
      <UserSettings />
      <Heading hLevel={2} baseClass='Settings'>
        My Teams
      </Heading>
      <TeamSettings />
    </div>
  )
};

export default SettingsPage;
