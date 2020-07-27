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
      goalToCommentsMap[-1] = goalToCommentsMap[-1].concat(
        member.user_comments
      );
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
            .map((key) =>
              goalToCommentsMap[key].map((comment) => {
                if (key == this.props.selectedToDoId) {
                  return (
                    <Comment
                      key={comment.comment_id}
                      firstName={comment.first_name}
                      lastName={comment.last_name}
                      body={comment.message}
                    />
                  );
                }
              })
            )
            .flat()}
        </div>
        <CommentForm
          updateData={this.props.updateData}
          selectedToDoId={this.props.selectedToDoId}
          currentUserId={this.props.currentUserId}
          currentTeamId={this.props.currentTeamId}
        />
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

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCommentText: "",
    };

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  handleCommentChange(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      newCommentText: value,
    }));
  }

  postComment() {
    const body = {
      team_id: this.props.currentTeamId,
      author: this.props.currentUserId,
      comment_date: new Date(),
      comment_text: this.state.newCommentText,
    };

    const raw = JSON.stringify(body);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/goals/" + this.props.selectedToDoId + "/comments", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        this.setState((prevState) => ({
          ...prevState,
          newCommentText: "",
        }));
        this.props.updateData();
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <Form className="Comment-form" reply>
        <Form.TextArea
          onChange={this.handleCommentChange}
          value={this.state.newCommentText}
        />
        <Button
          content="Add Reply"
          labelPosition="left"
          icon={EDIT_ICON}
          onClick={this.postComment}
          primary
        />
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedToDoId: state.toDos.selectedToDoId,
  currentTeamId: state.teams.currentTeam,
});

export default connect(mapStateToProps)(Comments);
