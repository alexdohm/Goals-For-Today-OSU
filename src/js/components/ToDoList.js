import React, { Component } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ADD_ICON } from "./common/constants";
import Heading from "./common/Heading";
import IconButton from "./common/IconButton";
import { FormFieldHelper } from "./common/helpers";
import { selectToDo } from "../redux/actions";
import ToDoItem from "./ToDoItem";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      showAddModal: false,
      newTaskName: "",
      newTaskDescription: "",
      date: new Date()
    };

    this.selectItem = this.selectItem.bind(this);
    this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
    this.handleNewTaskDescriptionChange = this.handleNewTaskDescriptionChange.bind(
      this
    );
    this.openAddModal = this.openAddModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  selectItem(index) {
    this.setState({
      selected: index,
    });
  }

  openAddModal() {
    this.setState((prevState) => ({
      ...prevState,
      showAddModal: true,
      newTaskName: "",
      newTaskDescription: "",
    }));
  }

  handleNewTaskNameChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      newTaskName: value,
    }));
  }

  handleNewTaskDescriptionChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      newTaskDescription: value,
    }));
  }

  handleAddTask() {
    //TODO: implement
    alert("you clicked the submit new task button");
  }

  handleCancel() {
    this.setState((prevState) => ({
      ...prevState,
      showAddModal: false,
    }));
  }

  handleDateChange(date) {
    this.setState({
      startDate: date
    });
  };

  render() {
    const { currentUserId, team } = this.props;
    const memberToGoalsMap = {};
    memberToGoalsMap[currentUserId] = team.goals;

    for (const member of team.team_members) {
      memberToGoalsMap[member.member_id] = member.goals;
    }
    return (
      <div className="ToDoList">
        <div className="ToDoList-datePickerContainer">
          <DatePicker
            className="ToDoList-datePicker"
            selected={this.state.date}
            onChange={this.handleChange}
            placeholderText="Select Date"
          />
        </div>
        <Heading baseClass="ToDoList" hLevel={1}>
          To do list for today
        </Heading>
        <div className="ToDoList-items">
          {Object.keys(memberToGoalsMap)
            .map((key) =>
              memberToGoalsMap[key].map((goal) => {
                if (key == this.props.selectedUserId) {
                  return (
                    <ToDoItem
                      key={goal.goal_id}
                      id={goal.goal_id}
                      selected={this.props.selectedToDoId == goal.goal_id}
                      title={goal.task_name}
                      description={goal.task_description}
                      showButtons={currentUserId == key}
                      onClick={() => this.props.onToDoSelected(goal.goal_id)}
                    />
                  );
                }
              })
            )
            .flat()}
        </div>
        {this.props.selectedUserId == this.props.currentUserId
          ? <IconButton
              baseClass="ToDoList"
              color="green"
              icon={ADD_ICON}
              onClick={this.openAddModal}
            />
          : null
        }
        <IconButton
          baseClass="ToDoList"
          color="green"
          icon={ADD_ICON}
          onClick={this.openAddModal}
        />
        {this.state.showAddModal ? (
          <AddToDoForm
            handleAddTask={this.handleAddTask}
            handleNewTaskNameChange={this.handleNewTaskNameChange}
            handleNewTaskDescriptionChange={this.handleNewTaskDescriptionChange}
            handleCancel={this.handleCancel}
          />
        ) : null}
      </div>
    );
  }
}

const AddToDoForm = (props) => {
  return (
    <div className="ToDoList-overlay">
      <div className="ToDoList-formWrapper">
        <Form className="ToDoList-form">
          <Heading hLevel={2} baseClass="ToDoList">
            Add New Task
          </Heading>
          <FormFieldHelper
            baseClass="ToDoList"
            idPrefix="todo"
            name="task name"
            onChange={props.handleNewTaskNameChange}
          />
          <Form.TextArea
            className="ToDoList-taskDescription"
            placeholder="task description"
            onChange={props.handleNewTaskDescriptionChange}
          />
          <div className="ToDoList-addFormButtons">
            <Button
              negative
              className="ToDoList-cancel"
              type="button"
              onClick={props.handleCancel}
            >
              Cancel
            </Button>
            <Button
              positive
              className="ToDoList-submit"
              type="submit"
              onClick={props.handleAddTask}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedToDoId: state.toDos.selectedToDoId,
  selectedUserId: state.toDos.selectedUserId,
});

const mapDispatchToProps = (dispatch) => ({
  onToDoSelected: (toDoID) => dispatch(selectToDo(toDoID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
