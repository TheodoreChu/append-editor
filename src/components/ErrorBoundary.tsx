import React, { ErrorInfo } from 'react';
import { GearIcon } from './Icons';
import { clickSettingsButton } from '../lib/clickButton';

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
              <hr></hr>
              <p>
                Errors such as <code>TypeError</code> and{' '}
                <code>Cannot read property 'type' of undefined</code> usually
                occur when the editor is unable to process and render your notes
                because it contains incorrect or incomplete HTML. If you are
                writing in HTML, then please continue to write and refresh the
                View Mode when the HTML tags are closed.
              </p>
              <p>
                If you are using the Dynamic editing mode, then please switch to
                the Plain Textarea or Monaco editing modes in the Settings
                <button
                  className="inline-text-and-svg"
                  onClick={clickSettingsButton}
                  title="Open Settings"
                >
                  <span>(</span>
                  <GearIcon role="button" />
                  <span>)</span>
                </button>
                and remove or fix the text that is causing the error.
              </p>
              <p>
                If the error persists or is not related to the content of your
                note, then please{' '}
                <a
                  href="https://github.com/TheodoreChu/append-editor/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  report the issue on GitHub
                </a>{' '}
                and we will try to fix it.{' '}
                <span role="img" aria-label="smile emoji">
                  🙂
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
