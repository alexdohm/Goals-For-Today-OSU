import React from "react";
import { Button, Modal } from "semantic-ui-react";

function ConfirmModal(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={props.open}
      trigger={props.trigger}
    >
      <Modal.Header>{props.header}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>{props.message}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => props.onClose()}>
          No
        </Button>
        <Button onClick={() => props.onAction()} positive>
          {props.buttonLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ConfirmModal;
