import React, { Component } from "react";
import { Checkbox } from "semantic-ui-react";
import { connect } from "react-redux";

import IconButton from "./common/IconButton";
import Text from "./common/Text";
import Heading from "./common/Heading";
import { EDIT_ICON, TRASH_ICON } from "./common/constants";
import ToDoForm from "./ToDoForm";

class ToDoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditModal: false,
      updatedTaskName: "",
      updatedTaskDescription: ""
    }

    this.openEditForm = this.openEditForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTaskDescriptionChange = this.handleTaskDescriptionChange.bind(this);
    this.handleTaskNameChange = this.handleTaskNameChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
  }

  handleUpdateTask() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = {
      name: this.state.updatedTaskName,
      description: this.state.updatedTaskDescription
    }

    const raw = JSON.stringify(body);

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/goals/" + this.props.id, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        this.setState( prevState => ({
          ...prevState,
          showEditModal: false
        }));
        this.props.updateData()
      })
      .catch(error => console.log('error', error));
  }

  openEditForm() {
    this.setState( prevState => ({
      ...prevState,
      showEditModal: true,
      updatedTaskName: this.props.title,
      updatedTaskDescription: this.props.description
    }))
  }

  handleCancel() {
    this.setState((prevState) => ({
      ...prevState,
      showEditModal: false,
    }));
  }

  handleTaskDescriptionChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      updatedTaskDescription: value,
    }));
  }

  handleTaskNameChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      updatedTaskName: value,
    }));
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
          <div className="ToDoItem-info">
            <Heading hlevel={3} baseClass="ToDoItem">
              {this.props.title}
            </Heading>
            <Text baseClass="ToDoItem">{this.props.description}</Text>
          </div>
        </div>
        {this.props.showButtons ? (
          <div className="ToDoItem-buttons">
            <IconButton
              baseClass="ToDoItem"
              onClick={this.openEditForm}
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
        ) : null}
        {this.state.showEditModal ? (
          <ToDoForm
            heading={"Edit Task " + this.props.id}
            handleAction={this.handleUpdateTask}
            handleTaskNameChange={this.handleTaskNameChange}
            handleTaskDescriptionChange={this.handleTaskDescriptionChange}
            closeModal={this.handleCancel}
            submitText="Update"
            nameValue={this.state.updatedTaskName}
            descriptionValue={this.state.updatedTaskDescription}
          />
        ) : null}
      </div>
    );
  }
}

export default ToDoItem;
