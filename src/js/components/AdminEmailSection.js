import React, { Component } from "react";
import { Button, Form, Select } from "semantic-ui-react";

import { TIME_OPTIONS } from "./common/constants";

class AdminEmailSection extends Component {
  constructor(props) {
    super(props);

    this.timeOptions = TIME_OPTIONS;
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    //TODO: implement
    alert("you clicked the delete team button");
  }

  render() {
    return (
      <div className="Admin-form Admin-emailSection">
        <Form className="Admin-emailForm">
          <Select placeholder="Select Time" options={this.timeOptions} />
        </Form>
      </div>
    );
  }
}

export default AdminEmailSection;
