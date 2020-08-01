import React, { Component } from "react";
import { Button, Form, Select } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";

class PendingInvites extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
  }

  handleDeleteRequest(team_id) {
    this.props.onRemovePending(team_id);
  }

  render() {
    return (
      <div className="Settings-teamSettings Settings-form">
        <h3 className="Settings-header">Pending Invite Requests</h3>
        <div className="Settings-teamWrapper">
          {this.props.pending.map((team, index) => (
            <Form className="Settings-teamForm">
              <div className="ui grid Settings-teamGrid">
                <div className="eight wide column">{team.team_name}</div>
                <div className="eight wide column">
                  <Button
                    primary
                    onClick={() => this.handleDeleteRequest(team.team_id)}
                  >
                    Delete Request
                  </Button>
                </div>
              </div>
            </Form>
          ))}
        </div>
      </div>
    );
  }
}

export default PendingInvites;
