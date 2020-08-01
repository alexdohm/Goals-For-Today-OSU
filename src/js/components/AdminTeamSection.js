import React, { Component } from "react";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { Icon, Button, Select } from "semantic-ui-react";
import { USER_ICON, TRASH_ICON } from "./common/constants";
import IconButton from "./common/IconButton";

const statusOptions = [
  {
    key: 'MEMBER',
    value: 'MEMBER',
    text: 'Member'
  },
  {
    key: 'ADMIN',
    value: 'ADMIN',
    text: 'Admin'
  }
];

class AdminTeamSection extends Component {
  constructor(props) {
    super(props);
    this.deleteMember = this.deleteMember.bind(this);
  }

  deleteMember() {
    //TODO: implement
    alert("you clicked the delete member button");
  }

  render() {
    const { team, firstName, status } = this.props;
    return (
      <div className="Admin-teamSection Admin-form">
        <Heading hLevel={2} baseClass="Admin">
          {team.team_name}
        </Heading>
        <div className="Admin-teamMembers">
          <AdminTeamMember name={firstName} onClick={this.deleteMember} status={status} changeStatus={this.props.changeStatus} />
          {team.team_members.map((member) => {
            return (
              <AdminTeamMember
                key={member.member_id}
                name={member.first_name}
                onClick={this.deleteMember}
                status={member.status}
                changeStatus={this.props.changeStatus}
                isNotCurrentUser={true}
              />
            );
          })}
        </div>
        <div className="Admin-inviteButtonWrapper">
          <Button 
            primary
            onClick={this.props.openInviteModal}
            className="Admin-inviteButton">
            Invite
          </Button>
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
      <Select className="Admin-statusSelect" options={statusOptions} defaultValue={props.status} onChange={props.changeStatus} />
      {props.isNotCurrentUser ? (
        <IconButton
          baseClass="Admin"
          icon={TRASH_ICON}
          onClick={props.deleteMember}
        />
      ) : null}
    </div>
  );
};

export default AdminTeamSection;
