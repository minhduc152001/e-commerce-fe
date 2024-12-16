import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error details (optional: send it to an error-tracking service)
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  handleReload = () => {
    // Reset the state and reload the app
    this.setState({ hasError: false, errorMessage: "" });
    window.location.reload(); // Force the app to refresh
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h1 style={{ color: "red" }}>Something went wrong!</h1>
          <p>{this.state.errorMessage}</p>
          <button
            onClick={this.handleReload}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Click to Continue
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
