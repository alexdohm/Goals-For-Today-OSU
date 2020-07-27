import React from "react";
import { Button } from "semantic-ui-react";

const SettingsDeleteButton = (props) => {
  return (
    <Button
      negative
      type="button"
      className="Settings-deleteButton"
      onClick={props.onClick}
    >
      Delete Account
    </Button>
  );
};

export default SettingsDeleteButton;
