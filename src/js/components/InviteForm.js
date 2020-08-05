import React, { Component } from "react";
import _ from "lodash";
import { Button, Form, Message, Search } from "semantic-ui-react";

import Heading from "./common/Heading";

const initialState = {
  isLoading: false,
  results: [],
  value: "",
  inviteDisabled: true,
};

class InviteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      value: "",
      inviteDisabled: true,
    };
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.buttonDisableCheck = this.buttonDisableCheck.bind(this);
  }

  renderResults(res) {
    return (
      <div>
        {`${res.title}`}
        <br />
        {res.email}
      </div>
    );
  }

  buttonDisableCheck() {
    if (
      this.props.nonTeamMembers.filter((el) => el.email === this.state.value)
        .length
    ) {
      this.setState({ inviteDisabled: false });
    } else {
      this.setState({ inviteDisabled: true });
    }
  }

  handleResultSelect(event, { result }) {
    event.target.value = result.email;
    this.props.handleEmailChange(event);
    this.setState(
      { value: result.email, inviteDisabled: false },
      this.buttonDisableCheck()
    );
  }

  handleSearchChange(event, { value }) {
    this.setState({ isLoading: true, value }, this.buttonDisableCheck);

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(`${result.title} ${result.email}`);

      this.setState(
        {
          isLoading: false,
          results: _.filter(
            this.props.nonTeamMembers.map((el) => ({
              title: `${el.first_name} ${el.last_name}`,
              key: el.member_id,
              ...el,
            })),
            isMatch
          ),
        },
        this.buttonDisableCheck
      );
    }, 100);
  }

  render() {
    const { isLoading, value, results, inviteDisabled } = this.state;

    return (
      <div className="Invite-overlay">
        <div className="Invite-formWrapper">
          <Form className="Invite-form">
            <Heading hLevel={2} baseClass="Invite">
              Invite Member
            </Heading>
            <Search
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 10, {
                loading: true,
              })}
              results={results}
              value={value}
              resultRenderer={this.renderResults}
            />
            {this.props.errorText ? (
              <Message negative content={this.props.errorText} />
            ) : null}
            <div className="Invite-inviteButtons">
              <Button
                negative
                className="Invite-cancel"
                type="button"
                onClick={this.props.closeModal}
              >
                Cancel
              </Button>
              <Button
                positive
                className="Invite-submit"
                type="submit"
                onClick={this.props.handleAction}
                disabled={inviteDisabled}
              >
                Invite Member
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default InviteForm;
