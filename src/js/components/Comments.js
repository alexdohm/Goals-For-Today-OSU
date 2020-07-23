import React, { Component } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import { USER_ICON, EDIT_ICON } from "./common/constants";
import Heading from "./common/Heading";
import Text from "./common/Text";

//TODO these should be determined by the currently selected todo item via redux
const heading = "Comments";
const subHeading = "These are some comments";

class Comments extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { team } = this.props;
    const goalToCommentsMap = {};

    goalToCommentsMap[-1] = team.user_comments;
    for (const member of team.team_members) {
      goalToCommentsMap[-1] = goalToCommentsMap[-1].concat(member.user_comments);
    }

    for (const goal of team.goals) {
      goalToCommentsMap[goal.goal_id] = goal.comments;
    }

    return (
      <div className="Comments">
        <Heading baseClass="Comments" hLevel={2}>
          {heading}
        </Heading>
        <Heading baseClass="Comments" hLevel={4}>
          {subHeading}
        </Heading>
        <div className="Comments-list">
          {Object.keys(goalToCommentsMap)
            .map( key => 
              goalToCommentsMap[key].map( comment => {
                if (key == this.props.selectedToDoId) {
                  console.log('should be returning');
                  return (
                    <Comment
                      key={comment.comment_id}
                      firstName={comment.first_name}
                      lastName={comment.last_name}
                      body={comment.message}/>
                  );
                }
              })
            ).flat()}
        </div>
        <CommentForm />
      </div>
    );
  }
}

const Comment = (props) => {
  return (
    <div className="Comment">
      <Icon className="Comment-userIcon" name={USER_ICON} size="large" />
      <div className="Comment-contentWrapper">
        <div className="Comment-top">
          <Heading baseClass="Comment" hLevel={5}>
            {props.firstName} {props.lastName}
          </Heading>
          <span className="Comment-timestamp">
            {/* TODO: put timestamp here */}
          </span>
        </div>
        <Text baseClass="Comments">{props.body}</Text>
      </div>
    </div>
  );
};

const CommentForm = (props) => {
  return (
    <Form className="Comment-form" reply>
      <Form.TextArea />
      <Button
        content="Add Reply"
        labelPosition="left"
        icon={EDIT_ICON}
        primary
      />
    </Form>
  );
};

const mapStateToProps = (state) => ({
  selectedToDoId: state.toDos.selectedToDoId,
});

export default connect(mapStateToProps)(Comments);
