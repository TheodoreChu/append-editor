import React from 'react';
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';

// Import types
import { HtmlElementId } from './AppendEditor';

interface MenuProps {
  borderlessMode?: boolean;
  editingMode: EditingMode;
  fixedHeightMode?: boolean;
  fullWidthMode?: boolean;
  monacoEditorLanguage: string;
  onConfirmPrintUrl: () => void;
  overflowMode?: boolean;
  refreshEdit: () => void;
  refreshView: () => void;
  saveText: (text: string) => void;
  text: string;
  toggleBorderlessMode: () => void;
  toggleFixedHeightMode: () => void;
  toggleFullWidthMode: () => void;
  toggleOverflowMode: () => void;
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
          className={this.props.borderlessMode ? ' on' : ' off'}
          onClick={this.props.toggleBorderlessMode}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
              fill={
                this.props.borderlessMode
                  ? 'var(--sn-stylekit-info-color)'
                  : 'var(--sn-stylekit-foreground-color)'
              }
            />
          </svg>
          <span className="menu-button-caption">
            Borderless:
            <b>&nbsp;{this.props.borderlessMode ? 'on' : 'off'}</b>
          </span>
        </button>
        <button
          className={this.props.fixedHeightMode ? ' on' : ' off'}
          onClick={this.props.toggleFixedHeightMode}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
              fill={
                this.props.fixedHeightMode
                  ? 'var(--sn-stylekit-info-color)'
                  : 'var(--sn-stylekit-foreground-color)'
              }
            />
          </svg>
          <span className="menu-button-caption">
            Fixed Height:
            <b>&nbsp;{this.props.fixedHeightMode ? 'on' : 'off'}</b>
          </span>
        </button>
        <button
          className={this.props.fullWidthMode ? ' on' : ' off'}
          onClick={this.props.toggleFullWidthMode}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
              fill={
                this.props.fullWidthMode
                  ? 'var(--sn-stylekit-info-color)'
                  : 'var(--sn-stylekit-foreground-color)'
              }
            />
          </svg>
          <span className="menu-button-caption">
            Full Width:
            <b>&nbsp;{this.props.fullWidthMode ? 'on' : 'off'}</b>
          </span>
        </button>
        <button
          className={this.props.overflowMode ? ' on' : ' off'}
          onClick={this.props.toggleOverflowMode}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
              fill={
                this.props.overflowMode
                  ? 'var(--sn-stylekit-info-color)'
                  : 'var(--sn-stylekit-foreground-color)'
              }
            />
          </svg>
          <span className="menu-button-caption">
            Horizontal Overflow:
            <b>&nbsp;{this.props.overflowMode ? 'visible' : 'auto'}</b>
          </span>
        </button>
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
          <span className="menu-button-caption">Print rendered note</span>
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
