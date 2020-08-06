import React, { Component } from "react";
import { Message } from "semantic-ui-react";

class DismissibleMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDismiss() {
    this.setState({ visible: false });
    if (this.props.handleDismiss) {
      this.props.handleDismiss();
    }
  }

  render() {
    if (this.state.visible) {
      if (this.props.style === "negative") {
        return (
          <Message
            onDismiss={this.handleDismiss}
            header={this.props.header}
            content={this.props.content}
            negative
          />
        );
      } else {
        return (
          <Message
            onDismiss={this.handleDismiss}
            header={this.props.header}
            content={this.props.content}
            success
          />
        );
      }
    }
    return <p></p>;
  }
}

export default DismissibleMessage;
