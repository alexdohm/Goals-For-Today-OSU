import React, { Component } from "react";
import { Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";

import IconButton from "./common/IconButton";
import Text from "./common/Text";
import { EDIT_ICON, TRASH_ICON } from "./common/constants";

class ToDoItem extends Component {
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit() {
    //TODO: implement
    alert(`You pressed the edit button of item number ${this.props.id}`);
  }

  handleDelete() {
    //TODO: implement
    alert(`You pressed the delete button of item number ${this.props.id}`);
  }

  render() {
    const topLevelClass = this.props.selected
      ? "ToDoItem ToDoItem--selected"
      : "ToDoItem";

    return (
      <div
        className={topLevelClass}
        onClick={() => this.props.onClick(this.props.id)}
      >
        <div className="ToDoItem-container">
          <Checkbox />
          <Text baseClass="ToDoItem">{this.props.description}</Text>
        </div>
        <div className="ToDoItem-buttons">
          <IconButton
            baseClass="ToDoItem"
            onClick={this.handleEdit}
            icon={EDIT_ICON}
            size="large"
          />
          <IconButton
            baseClass="ToDoItem"
            onClick={this.handleDelete}
            icon={TRASH_ICON}
            size="large"
          />
        </div>
      </div>
    );
  }
}

export default ToDoItem;
