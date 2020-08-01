import React from "react";
import { Button, Form, Message } from "semantic-ui-react";

import Heading from "./common/Heading";
import { FormFieldHelper } from "./common/helpers";

const InviteForm = (props) => {
  return (
    <div className="Invite-overlay">
      <div className="Invite-formWrapper">
        <Form className="Invite-form">
          <Heading hLevel={2} baseClass="Invite">
            Invite Member
          </Heading>
          <FormFieldHelper
            baseClass="Invite"
            idPrefix="invite"
            name="Email"
            onChange={props.handleEmailChange}
            placeholder="Enter Email"
          />
          {props.errorText ? (
            <Message negative content={props.errorText} />
          ) : null}
          <div className="Invite-inviteButtons">
            <Button
              negative
              className="Invite-cancel"
              type="button"
              onClick={props.closeModal}
            >
              Cancel
            </Button>
            <Button
              positive
              className="Invite-submit"
              type="submit"
              onClick={props.handleAction}
            >
              Invite Member
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default InviteForm;
