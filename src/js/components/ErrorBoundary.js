import React, { Component } from "react";
import ErrorModal from "./ErrorModal";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
      errorDetails: "",
      activeIndex: -1,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  handleClick(e, titleProps) {
    let newIndex = this.state.activeIndex === 1 ? -1 : 1;

    this.setState({ activeIndex: newIndex });
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      ...prevState,
      errorMessage: error.message,
      errorDetails: JSON.stringify(errorInfo),
    }));
    try {
      // You can also log the error to an error reporting service
      console.log(`Error: ${error} ErrorInfo: ${JSON.stringify(errorInfo)}`);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI

      return (
        <div>
          <ErrorModal
            message={this.state.errorMessage}
            heading="Oops! Something went wrong."
            activeIndex={this.state.activeIndex}
            details={this.state.errorDetails}
            onClick={this.handleClick}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
