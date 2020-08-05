import React from "react";
import { Button, Form } from "semantic-ui-react";
import PropTypes from "prop-types";

import Heading from "./common/Heading";
import { FormFieldHelper } from "./common/helpers";

const ToDoForm = (props) => {
  return (
    <div className="ToDoList-overlay">
      <div className="ToDoList-formWrapper">
        <Form className="ToDoList-form">
          <Heading hLevel={2} baseClass="ToDoList">
            {props.heading}
          </Heading>
          <FormFieldHelper
            baseClass="ToDoList"
            idPrefix="todo"
            name="task name"
            onChange={props.handleTaskNameChange}
            initialValue={props.nameValue ? props.nameValue : null}
            maxLength="50"
          />
          <Form.TextArea
            className="ToDoList-taskDescription"
            placeholder="task description"
            onChange={props.handleTaskDescriptionChange}
            value={props.descriptionValue ? props.descriptionValue : null}
          />
          <div className="ToDoList-addFormButtons">
            <Button
              negative
              className="ToDoList-cancel"
              type="button"
              onClick={props.closeModal}
            >
              Cancel
            </Button>
            <Button
              positive
              className="ToDoList-submit"
              type="submit"
              onClick={props.handleAction}
              disabled={!props.enableSubmitButton}
            >
              {props.submitText}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

ToDoForm.propTypes = {
  heading: PropTypes.string.isRequired,
  handleTaskNameChange: PropTypes.func.isRequired,
  handleTaskDescriptionChange: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};

export default ToDoForm;
