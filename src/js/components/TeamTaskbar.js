import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { GROUP_ICON, SETTING_ICON, SIGN_OUT_ICON, USER_ICON } from './common/constants';
import IconButton from './common/IconButton';
import Text from './common/Text';
import { selectUser } from '../redux/actions';
import { logout } from '../redux/actions';

const testUsers = [ //TODO: replace with real data from database
  {
    id: 0,
    name: 'Emre'
  },
  {
    id: 1,
    name: 'Kelly'
  },
  {
    id: 2,
    name: 'Alexandra'
  }
];

const testTeamName = 'Team Quasar'; //TODO: replace with real data from database

class TeamTaskbar extends Component {

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e) {
    //TODO: implement
    e.preventDefault();
    console.log('logging out');
    this.props.logout();
  }

  handleSettings() {
    //TODO: implement
    alert('You clicked the settings button');
  }

  render() {
    return (
      <div className='TeamTaskbar'>
        <div className='TeamTaskbar-members'>
          {testUsers.map( (user, index) => (
            <TaskbarItem 
              key={index} 
              onClick={() => this.props.onUserSelected(user.id)} 
              icon={USER_ICON}
              isSelected={user.id == this.props.selectedUserId}>
                {user.name}
            </TaskbarItem>
          ))}
        </div>
        <div className='TeamTaskbar-bottom'>
          <TaskbarItem icon={GROUP_ICON}>{testTeamName}</TaskbarItem>
          <div className='TeamTaskbar-buttons'>
            <IconButton baseClass='TeamTaskbar' onClick={this.handleLogout} icon={SIGN_OUT_ICON} />
            <IconButton baseClass='TeamTaskbar' onClick={this.handleSettings} icon={SETTING_ICON} />
          </div>
        </div>
      </div>
    )
  }
}

const TaskbarItem = (props) => {

  const className = `TaskbarItem${props.isSelected ? ' TaskbarItem--selected' : ''}`

  return (  
    <div className={className} onClick={props.onClick}>
      <Icon className='TaskbarItem-icon' name={props.icon} size='large' />
      <Text baseClass='TaskbarItem'>{props.children}</Text>
    </div>
  );
}

const mapStateToProps = state => ({
  selectedUserId: state.toDos.selectedUserId,
  auth: state.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  onUserSelected: userID => dispatch(selectUser(userID)),
  logout
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamTaskbar);