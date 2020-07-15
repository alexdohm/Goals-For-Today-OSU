import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { ADD_ICON } from './common/constants'
import Heading from './common/Heading';
import IconButton from './common/IconButton';
import { FormFieldHelper } from './common/helpers';
import { selectToDo } from '../redux/actions';
import ToDoItem from './ToDoItem';

const testTodos = [ //TODO: replace with data from database
  {
    description: 'Create a react layout'
  },
  {
    description: 'Create a database'
  },
  {
    description: 'learn to interact with the database'
  }
]

class ToDoList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      showAddModal: false,
      newTaskName: '',
      newTaskDescription: ''
    }

    this.selectItem = this.selectItem.bind(this);
    this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
    this.handleNewTaskDescriptionChange = this.handleNewTaskDescriptionChange.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  selectItem(index) {
    this.setState({
      selected: index
    });
  }

  openAddModal() {
    this.setState(prevState => ({
      ...prevState,
      showAddModal: true,
      newTaskName: '',
      newTaskDescription: '',
    }));
  }

  handleNewTaskNameChange(event) {
    const { value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      newTaskName: value
    }));
  }

  handleNewTaskDescriptionChange(event) {
    const { value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      newTaskDescription: value
    }));
  }

  handleAddTask() {
    //TODO: implement
    alert('you clicked the submit new task button');
  }

  handleCancel() {
    this.setState(prevState => ({
      ...prevState,
      showAddModal: false
    }));
  }

  render() {
    return (
      <div className='ToDoList'>
        <Heading baseClass='ToDoList' hLevel={1}>
          To do list for today
        </Heading>
        <div className='ToDoList-items'>
          {testTodos.map( (item, index) => (
            <ToDoItem 
              key={index} 
              id={index} 
              selected={this.props.selectedToDoId == index} 
              description={item.description} 
              onClick={() => {
                console.log('clicked to do item');
                this.props.onToDoSelected(index);
              }}
            />
          ))}
        </div>
        <IconButton baseClass='ToDoList' color='green' icon={ADD_ICON} onClick={this.openAddModal} />
        {this.state.showAddModal
          ? <AddToDoForm 
              handleAddTask={this.handleAddTask} 
              handleNewTaskNameChange={this.handleNewTaskNameChange}
              handleNewTaskDescriptionChange={this.handleNewTaskDescriptionChange}
              handleCancel={this.handleCancel}
            />
          : null}
      </div>
    )
  }
}

const AddToDoForm = (props) => {
  return (
    <div className="ToDoList-overlay">
      <div className="ToDoList-formWrapper">
        <Form className='ToDoList-form'>
          <Heading hLevel={2} baseClass='ToDoList'>Add New Task</Heading>
          <FormFieldHelper baseClass='ToDoList' idPrefix='todo' name='task name' onChange={props.handleNewTaskNameChange} />
          <Form.TextArea className='ToDoList-taskDescription' placeholder='task description' onChange={props.handleNewTaskDescriptionChange} />
          <div className="ToDoList-addFormButtons">
            <Button negative className='ToDoList-cancel' type='button' onClick={props.handleCancel}>Cancel</Button>
            <Button positive className='ToDoList-submit' type='submit' onClick={props.handleAddTask}>Submit</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  console.log(state);
  return {
    selectedToDoId: state.toDos.selectedToDoId
  }
}

const mapDispatchToProps = dispatch => ({
  onToDoSelected: toDoID => dispatch(selectToDo(toDoID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);