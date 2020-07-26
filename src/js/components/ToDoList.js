import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ADD_ICON } from "./common/constants";
import Heading from "./common/Heading";
import IconButton from "./common/IconButton";
import { selectToDo } from "../redux/actions";
import ToDoItem from "./ToDoItem";
import ToDoForm from "./ToDoForm";

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
    this.handleAddTask = this.handleAddTask.bind(this);
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
    const { newTaskName, newTaskDescription } = this.state;
    const { currentUserId, currentTeamId } = this.props;

    const body = {
      name: newTaskName,
      description: newTaskDescription,
      create_date: new Date(),
      team_id: currentTeamId,
      member_id: currentUserId
    }

    const raw = JSON.stringify(body); 
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/goals", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        this.setState({
          showAddModal: false
        });
        this.props.updateData();
      })
      .catch(error => console.log('error', error));
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
          ? <div className="ToDoList-addButtonContainer">
              <IconButton
                baseClass="ToDoList"
                color="green"
                icon={ADD_ICON}
                onClick={this.openAddModal}
              />
            </div>
          : null
        }
        {this.state.showAddModal ? (
          <ToDoForm
            heading="Add New Task"
            handleAction={this.handleAddTask}
            handleTaskNameChange={this.handleNewTaskNameChange}
            handleTaskDescriptionChange={this.handleNewTaskDescriptionChange}
            closeModal={this.handleCancel}
            submitText="Submit"
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedToDoId: state.toDos.selectedToDoId,
  selectedUserId: state.toDos.selectedUserId,
  currentTeamId: state.teams.currentTeam
});

const mapDispatchToProps = (dispatch) => ({
  onToDoSelected: (toDoID) => dispatch(selectToDo(toDoID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
