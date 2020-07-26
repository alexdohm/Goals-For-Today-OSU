import React, { Component } from "react";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { Icon } from "semantic-ui-react";
import { USER_ICON, TRASH_ICON } from "./common/constants";
import IconButton from "./common/IconButton";

class AdminTeamSection extends Component {

  constructor(props) {
    super(props);
    this.deleteMember = this.deleteMember.bind(this);
  }

  deleteMember() {
    //TODO: implement
    alert('you clicked the delete member button');
  }

  render() {
    const { team, firstName } = this.props;
    return (
      <div className="Admin-teamSection Admin-form">
        <Heading hLevel={2} baseClass="Admin">
          {team.team_name}
        </Heading>
        <div className="Admin-teamMembers">
          <AdminTeamMember name={firstName} onClick={this.deleteMember}/>
          {team.team_members.map( member => {
            return (
              <AdminTeamMember 
                key={member.member_id} 
                name={member.first_name} 
                onClick={this.deleteMember}
                isNotCurrentUser={true}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

const AdminTeamMember = (props) => {
  return (
    <div className="Admin-teamMember">
      <Icon className="Admin-teamMemberIcon" name={USER_ICON} size="large" />
      <Text baseClass="Admin">{props.name}</Text>
      {props.isNotCurrentUser
        ? <IconButton baseClass="Admin" icon={TRASH_ICON} onClick={props.deleteMember} />
        : null 
      }
    </div>
  );
}

export default AdminTeamSection;