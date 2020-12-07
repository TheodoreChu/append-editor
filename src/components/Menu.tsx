import React from 'react';

interface MenuProps {
  refreshEdit: () => void;
  refreshView: () => void;
  saveText: (text: string) => void;
  text: string;
}

interface MenuState {
  message?: string;
  displayMessage: boolean;
}

const initialState = {
  message: '',
  displayMessage: false,
};

export default class Menu extends React.Component<MenuProps, MenuState> {
  clearTooltipTimer: NodeJS.Timeout | undefined;
  constructor(props: MenuProps) {
    super(props);
    this.state = initialState;
  }

  showMessage = () => {
    this.setState(
      {
        displayMessage: true,
      },
      () => {
        if (this.clearTooltipTimer) {
          clearTimeout(this.clearTooltipTimer);
        }
        this.clearTooltipTimer = setTimeout(() => {
          this.setState({
            displayMessage: false,
          });
        }, 1000);
      }
    );
  };

  copyToClipboard = (text: string) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    this.showMessage();
    textField.remove();
  };

  copyText = () => {
    if (this.props.text) {
      this.setState({ message: 'Copied Text to clipboard.' }, () => {
        this.copyToClipboard(this.props.text);
      });
    } else {
      this.setState({ message: 'No text to copy.' }, () => {
        this.showMessage();
      });
    }
  };

  copyHtml = () => {
    const renderedNote = document.getElementById('renderedNote');
    if (renderedNote?.firstElementChild?.innerHTML) {
      this.setState({ message: 'Copied HTML to clipboard.' });
      this.copyToClipboard(renderedNote?.firstElementChild.innerHTML);
    } else {
      this.setState({ message: 'No HTML to copy.' }, () => {
        this.showMessage();
      });
    }
  };

  uncheckBoxes = () => {
    const { text } = this.props;
    const checkedBoxes = new RegExp(/- \[x\]/gm);
    if (checkedBoxes.test(text)) {
      const newText = text.replace(checkedBoxes, '- [ ]');
      this.props.saveText(newText);
      this.props.refreshEdit();
      this.props.refreshView();
      this.setState({ message: 'Unchecked all checkboxes.' }, () => {
        this.showMessage();
      });
    } else {
      this.setState({ message: 'No checked boxes found.' }, () => {
        this.showMessage();
      });
    }
  };

  render() {
    // You can render any custom fallback UI
    return (
      <div id={'menu'}>
        <button onClick={this.copyText}>Copy note text</button>
        <button onClick={this.copyHtml}>Copy rendered HTML</button>
        <button onClick={this.uncheckBoxes}>Uncheck all Checkboxes</button>
        <div
          className={`notification ${
            this.state.displayMessage ? 'visible' : 'hidden'
          }`}
        >
          <p>
            <b>{this.state.message}</b>
          </p>
        </div>
      </div>
    );
  }
}
