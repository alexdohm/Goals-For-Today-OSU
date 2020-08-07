import React from "react";
import Heading from "./common/Heading";
import { Accordion, Icon } from "semantic-ui-react";

const ErrorModal = (props) => {
  return (
    <div className="Error">
      <div className="Error-modal">
        <Heading hLevel={2} baseClass="Error">
          {props.heading}
        </Heading>
        <p>Uh oh! Well that didn't work. Here's the message:</p>
        <p>{`${props.message}`} </p>
        <Accordion styled>
          <Accordion.Title
            active={props.activeIndex === 1}
            index={1}
            onClick={props.onClick}
          >
            <Icon name="dropdown" />
            View more details
          </Accordion.Title>

          <Accordion.Content active={props.activeIndex === 1}>
            {props.details}
          </Accordion.Content>
        </Accordion>
      </div>
    </div>
  );
};

export default ErrorModal;
