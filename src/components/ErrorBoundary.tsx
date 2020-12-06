import React, { ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Learn more about Error Boundaries here:
 * https://reactjs.org/docs/error-boundaries.html
 */

export default class ErrorBoundary extends React.Component<
  any,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log('Error:', error, '\nError Info:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="sk-panel main">
          <div className="sk-panel-content view">
            <div id="errorBoundary">
              <h1>Something went wrong.</h1>
              <p>
                Error Name: <code>{this.state.error?.name}</code>
              </p>
              <p>
                Error Message: <code>{this.state.error?.message}</code>
              </p>
              <p>Please see the developer console for details.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
