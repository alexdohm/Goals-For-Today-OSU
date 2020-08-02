import React, { Component } from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import { USER_ICON, EDIT_ICON, CLOSE_ICON, COMMENT_ICON } from "./common/constants";
import Heading from "./common/Heading";
import Text from "./common/Text";
import { dateToTimestampString } from "./common/helpers";
import IconButton from "./common/IconButton";

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    }

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  sortCommentsByTime(goalToCommentsMap) {
    for (const goal in goalToCommentsMap) {
      goalToCommentsMap[goal].sort((a, b) => {
        let aDate = new Date(a.date_time);
        let bDate = new Date(b.date_time);

        return aDate.getTime() - bDate.getTime();
      });
    }
  }

  toggleMenu() {
    this.setState((prevState) => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  }

  render() {
    const { team, selectedToDoName, selectedToDoDescription } = this.props;
    const goalToCommentsMap = {};

    goalToCommentsMap[-1] = team.user_comments;
    for (const member of team.team_members) {
      goalToCommentsMap[-1] = goalToCommentsMap[-1].concat(
        member.user_comments
      );
      for (const goal of member.goals) {
        goalToCommentsMap[goal.goal_id] = goal.comments;
      }
    }

    for (const goal of team.goals) {
      goalToCommentsMap[goal.goal_id] = goal.comments;
    }

    this.sortCommentsByTime(goalToCommentsMap);

    return (
      <div
        className={`Comments${
          this.state.isExpanded ? "" : " Comments--collapsed"
        }`}
      >
        <IconButton
          baseClass="Comments"
          modifier="toggle"
          onClick={this.toggleMenu}
          icon={this.state.isExpanded ? CLOSE_ICON : COMMENT_ICON}
        />
        <div className="Comments-container">
          <div className="Comments-headings">
            <Heading baseClass="Comments" hLevel={2}>
              {selectedToDoName}
            </Heading>
            {selectedToDoDescription ? (
              <Heading baseClass="Comments" hLevel={4}>
                {selectedToDoDescription}
              </Heading>
            ) : null}
          </div>
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
                        date={new Date(comment.date_time)}
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
            {dateToTimestampString(props.date)}
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

    let fetchPath;
    if (this.props.selectedToDoId == -1) {
      //post a general comment
      fetchPath = "/users/" + this.props.currentUserId + "/comments";
    } else {
      //post comment on a specific goal
      fetchPath = "/goals/" + this.props.selectedToDoId + "/comments";
    }

    fetch(fetchPath, requestOptions)
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
  selectedToDoName: state.toDos.selectedToDoName,
  selectedToDoDescription: state.toDos.selectedToDoDescription,
  currentTeamId: state.teams.currentTeam,
});

export default connect(mapStateToProps)(Comments);
