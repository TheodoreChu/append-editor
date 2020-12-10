import React from 'react';
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';

// Import types
import { HtmlElementId } from './AppendEditor';

interface MenuProps {
  editingMode: EditingMode;
  fullscreenMode?: boolean;
  restrictedMode?: boolean;
  monacoEditorLanguage: string;
  onConfirmPrintUrl: () => void;
  refreshEdit: () => void;
  refreshView: () => void;
  saveText: (text: string) => void;
  text: string;
  toggleFullscreenMode: () => void;
  toggleRestrictedMode: () => void;
  toggleShowMenu: () => void;
  useMonacoEditor: useMonacoEditor;
  useDynamicEditor: useDynamicEditor;
  viewMode?: boolean;
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
    textField.value = text;
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
    if (!this.props.viewMode) {
      this.setState(
        { message: 'Unable to copy HTML. Please turn view mode on.' },
        () => this.showMessage()
      );
    } else if (!this.props.text) {
      this.setState({ message: 'No HTML to copy. Your note is empty.' }, () => {
        this.showMessage();
      });
    } else {
      const renderedNote = document.getElementById('renderedNote');
      if (renderedNote?.firstElementChild?.innerHTML) {
        this.setState({ message: 'Copied HTML to clipboard.' });
        this.copyToClipboard(renderedNote?.firstElementChild.innerHTML);
      }
    }
  };

  formatText = () => {
    if (
      this.props.monacoEditorLanguage !== 'markdown' &&
      this.props.editingMode === this.props.useMonacoEditor
    ) {
      this.setState(
        {
          message: 'Error: Formatting is only available for markdown',
        },
        () => {
          this.showMessage();
        }
      );
    } else if (this.props.text) {
      this.setState(
        { message: 'Formatted markdown text with Prettier.' },
        () => {
          try {
            const formattedText = prettier.format(this.props.text, {
              parser: 'markdown',
              plugins: [parserMarkdown],
            });
            this.props.saveText(formattedText);
            this.props.refreshEdit();
            this.props.refreshView();
            this.showMessage();
          } catch (e) {
            this.setState({ message: 'Error formatting text: ' + e }, () => {
              this.showMessage();
            });
            console.log('Error formatting text: ' + e);
          }
        }
      );
    } else {
      this.setState({ message: 'No text to format.' }, () => {
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
      this.setState({ message: 'No checked checkboxes found.' }, () => {
        this.showMessage();
      });
    }
  };

  render() {
    // You can render any custom fallback UI
    return [
      <div className="menu-overlay" onClick={this.props.toggleShowMenu} />,
      <div id={'menu'}>
        <button
          type="button"
          id={HtmlElementId.PrintButton}
          onClick={this.props.onConfirmPrintUrl}
          title="Print"
          className={'off'}
        >
          <svg
            role="button"
            aria-label="Printer icon to toggle printer"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.0001 2.5H5.00008V5.83333H15.0001V2.5ZM15.8334 10C15.6124 10 15.4004 9.9122 15.2442 9.75592C15.0879 9.59964 15.0001 9.38768 15.0001 9.16667C15.0001 8.94565 15.0879 8.73369 15.2442 8.57741C15.4004 8.42113 15.6124 8.33333 15.8334 8.33333C16.0544 8.33333 16.2664 8.42113 16.4227 8.57741C16.579 8.73369 16.6668 8.94565 16.6668 9.16667C16.6668 9.38768 16.579 9.59964 16.4227 9.75592C16.2664 9.9122 16.0544 10 15.8334 10ZM13.3334 15.8333H6.66675V11.6667H13.3334V15.8333ZM15.8334 6.66667H4.16675C3.50371 6.66667 2.86782 6.93006 2.39898 7.3989C1.93014 7.86774 1.66675 8.50363 1.66675 9.16667V14.1667H5.00008V17.5H15.0001V14.1667H18.3334V9.16667C18.3334 8.50363 18.07 7.86774 17.6012 7.3989C17.1323 6.93006 16.4965 6.66667 15.8334 6.66667Z"
              fill={'var(--sn-stylekit-foreground-color)'}
            />
          </svg>
          <span className="menu-button-caption">Print rendered HTML</span>
        </button>
        <button onClick={this.copyText}>
          <svg
            name="Copy icon"
            role="img"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66724 3.66626C1.66724 2.56169 2.56267 1.66626 3.66724 1.66626H11.3339C12.4385 1.66626 13.3339 2.56169 13.3339 3.66626V13.3329H3.66724C2.56267 13.3329 1.66724 12.4375 1.66724 11.3329V3.66626ZM16.3339 6.66626C17.4385 6.66626 18.3339 7.56169 18.3339 8.66626V16.3329C18.3339 17.4375 17.4385 18.3329 16.3339 18.3329H8.66724C7.56267 18.3329 6.66724 17.4375 6.66724 16.3329V14.9996H15.0006V6.66626H16.3339ZM3.3339 3.33293V11.6663H11.6672V3.33293H3.3339Z"
              fill="var(--sn-stylekit-success-color)"
            />
          </svg>
          <span className="menu-button-caption">Copy note text</span>
        </button>
        <button onClick={this.copyHtml}>
          <svg
            name="Copy icon"
            role="img"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66724 3.66626C1.66724 2.56169 2.56267 1.66626 3.66724 1.66626H11.3339C12.4385 1.66626 13.3339 2.56169 13.3339 3.66626V13.3329H3.66724C2.56267 13.3329 1.66724 12.4375 1.66724 11.3329V3.66626ZM16.3339 6.66626C17.4385 6.66626 18.3339 7.56169 18.3339 8.66626V16.3329C18.3339 17.4375 17.4385 18.3329 16.3339 18.3329H8.66724C7.56267 18.3329 6.66724 17.4375 6.66724 16.3329V14.9996H15.0006V6.66626H16.3339ZM3.3339 3.33293V11.6663H11.6672V3.33293H3.3339Z"
              fill="var(--sn-stylekit-success-color)"
            />
          </svg>
          <span className="menu-button-caption">Copy rendered HTML</span>
        </button>
        <button onClick={this.formatText}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2583 5.86655C17.5833 5.54155 17.5833 4.99989 17.2583 4.69155L15.3083 2.74155C15 2.41655 14.4583 2.41655 14.1333 2.74155L12.6 4.26655L15.725 7.39155L17.2583 5.86655ZM2.5 14.3749V17.4999H5.625L14.8417 8.27489L11.7167 5.14989L2.5 14.3749Z"
              fill="var(--sn-stylekit-warning-color)"
            />
          </svg>
          <span className="menu-button-caption">Format markdown text</span>
        </button>
        <button onClick={this.uncheckBoxes}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2583 5.86655C17.5833 5.54155 17.5833 4.99989 17.2583 4.69155L15.3083 2.74155C15 2.41655 14.4583 2.41655 14.1333 2.74155L12.6 4.26655L15.725 7.39155L17.2583 5.86655ZM2.5 14.3749V17.4999H5.625L14.8417 8.27489L11.7167 5.14989L2.5 14.3749Z"
              fill="var(--sn-stylekit-danger-color)"
            />
          </svg>
          <span className="menu-button-caption">Uncheck all checkboxes</span>
        </button>
        <button onClick={this.props.toggleRestrictedMode}>
          <span className="menu-button-caption">
            Restricted Height:
            <b>{this.props.restrictedMode ? ' on' : ' off'}</b>
          </span>
        </button>
        <button onClick={this.props.toggleFullscreenMode}>
          <span className="menu-button-caption">
            Full Screen Mode:
            <b>{this.props.fullscreenMode ? ' on' : ' off'}</b>
          </span>
        </button>
        <div
          className={`notification ${
            this.state.displayMessage ? 'visible' : 'hidden'
          }`}
        >
          <p>
            <b>{this.state.message}</b>
          </p>
        </div>
      </div>,
    ];
  }
}
