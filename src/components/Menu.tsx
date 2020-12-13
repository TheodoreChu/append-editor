import React from 'react';
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';
import {
  ChevronToggleButton,
  CopyButton,
  EyeButton,
  PencilButton,
  PrintButton,
} from './Buttons';

// Import types
import { HtmlElementId } from './AppendEditor';

enum HtmlClassName {
  chevronToggleButton = 'menu-button chevron-toggle-button',
  menuButton = 'menu-button',
  on = ' on',
  off = ' off',
}

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
  showMenuOptionsEdit?: boolean;
  //showMenuOptionsMonacoEditor?: boolean;
  showMenuOptionsShare?: boolean;
  showMenuOptionsView?: boolean;
  text: string;
  toggleBorderlessMode: () => void;
  toggleFixedHeightMode: () => void;
  toggleFullWidthMode: () => void;
  toggleOverflowMode: () => void;
  toggleShowMenu: () => void;
  toggleShowMenuOptionsEdit: () => void;
  //toggleShowMenuOptionsMonacoEditor?: () => void;
  toggleShowMenuOptionsView: () => void;
  toggleShowMenuOptionsShare: () => void;
  useMonacoEditor: useMonacoEditor;
  useDynamicEditor: useDynamicEditor;
  viewMode?: boolean;
}

interface MenuState {
  message?: string;
  displayMessageShare: boolean;
  displayMessageEdit: boolean;
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  clearTooltipTimer: NodeJS.Timeout | undefined;
  constructor(props: MenuProps) {
    super(props);
    this.state = {
      message: '',
      displayMessageEdit: false,
      displayMessageShare: false,
    };
  }

  resetMessageTimer = () => {
    if (this.clearTooltipTimer) {
      clearTimeout(this.clearTooltipTimer);
    }
    this.clearTooltipTimer = setTimeout(() => {
      this.setState({
        displayMessageEdit: false,
        displayMessageShare: false,
      });
    }, 2000);
  };

  showMessageEdit = () => {
    this.setState(
      {
        displayMessageEdit: true,
        displayMessageShare: false,
      },
      () => {
        this.resetMessageTimer();
      }
    );
  };
  showMessageShare = () => {
    this.setState(
      {
        displayMessageEdit: false,
        displayMessageShare: true,
      },
      () => {
        this.resetMessageTimer();
      }
    );
  };

  copyToClipboard = (text: string) => {
    const textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    this.showMessageShare();
    textField.remove();
  };

  copyText = () => {
    if (this.props.text) {
      this.setState({ message: 'Copied Text to clipboard.' }, () => {
        this.copyToClipboard(this.props.text);
      });
    } else {
      this.setState({ message: 'No text to copy.' }, () => {
        this.showMessageShare();
      });
    }
  };

  copyHtml = () => {
    if (!this.props.viewMode) {
      this.setState(
        { message: 'Unable to copy HTML. Please turn view mode on.' },
        () => this.showMessageShare()
      );
    } else if (!this.props.text) {
      this.setState({ message: 'No HTML to copy. Your note is empty.' }, () => {
        this.showMessageShare();
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
          this.showMessageEdit();
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
            this.showMessageEdit();
          } catch (e) {
            this.setState({ message: 'Error formatting text: ' + e }, () => {
              this.showMessageEdit();
            });
            console.log('Error formatting text: ' + e);
          }
        }
      );
    } else {
      this.setState({ message: 'No text to format.' }, () => {
        this.showMessageEdit();
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
        this.showMessageEdit();
      });
    } else {
      this.setState({ message: 'No checked checkboxes found.' }, () => {
        this.showMessageEdit();
      });
    }
  };

  render() {
    // You can render any custom fallback UI
    return [
      <div className="menu-overlay" onClick={this.props.toggleShowMenu} />,
      <div id={'menu'}>
        <ChevronToggleButton
          caption={'Appearance'}
          className={HtmlClassName.chevronToggleButton}
          condition={this.props.showMenuOptionsView}
          onClick={this.props.toggleShowMenuOptionsView}
          title={'Toggle show options for the appearance of the editor'}
        />
        {this.props.showMenuOptionsView && [
          <EyeButton
            caption={'Borderless'}
            className={
              HtmlClassName.menuButton +
              (this.props.borderlessMode ? HtmlClassName.on : HtmlClassName.off)
            }
            condition={this.props.borderlessMode}
            messageOn={'on'}
            messageOff={'off'}
            onClick={this.props.toggleBorderlessMode}
            title="Toggle Borderless mode. Blends borders and margins into the background for a cleaner look"
          />,
          <EyeButton
            caption={'Fixed Height'}
            className={
              HtmlClassName.menuButton +
              (this.props.fixedHeightMode
                ? HtmlClassName.on
                : HtmlClassName.off)
            }
            condition={this.props.fixedHeightMode}
            messageOn={'on'}
            messageOff={'off'}
            onClick={this.props.toggleFixedHeightMode}
            title="Toggle Fixed Height mode. Limits the height of the content container for easier side-by-side editing"
          />,
          <EyeButton
            caption={'Full Width'}
            className={
              HtmlClassName.menuButton +
              (this.props.fullWidthMode ? HtmlClassName.on : HtmlClassName.off)
            }
            condition={this.props.fullWidthMode}
            messageOn={'on'}
            messageOff={'off'}
            onClick={this.props.toggleFullWidthMode}
            title="Toggle Full Width mode for unrestricted editing. Borderless mode plus unset maximum container widths"
          />,
          <EyeButton
            caption={'Horizontal Overflow'}
            className={
              HtmlClassName.menuButton +
              (this.props.overflowMode ? HtmlClassName.on : HtmlClassName.off)
            }
            condition={this.props.overflowMode}
            messageOn={'visible'}
            messageOff={'auto'}
            onClick={this.props.toggleOverflowMode}
            title="Toggle Horizontal Overflow. Visible is great for editing and viewing large tables and preformatted text. Works best with Full Width mode"
          />,
        ]}
        <ChevronToggleButton
          caption={'Share'}
          className={HtmlClassName.chevronToggleButton}
          condition={this.props.showMenuOptionsShare}
          onClick={this.props.toggleShowMenuOptionsShare}
          title={'Toggle Show Share Options'}
        />
        {this.props.showMenuOptionsShare && [
          <CopyButton
            caption={'Copy note text'}
            className={HtmlClassName.menuButton}
            fill={'var(--sn-stylekit-success-color)'}
            onClick={this.copyText}
            title="Copy the text of your note to your device's clipboard"
          />,
          <CopyButton
            caption={'Copy rendered HTML'}
            className={HtmlClassName.menuButton}
            fill={'var(--sn-stylekit-success-color)'}
            onClick={this.copyHtml}
            title="Copy the rendered HTML from your note text to your device's clipboard"
          />,
          <PrintButton
            caption={'Print rendered note'}
            className={'menu-button off'}
            fill={'var(--sn-stylekit-foreground-color)'}
            id={HtmlElementId.printButton}
            onClick={this.props.onConfirmPrintUrl}
            title="Print rendered note. Works best on Chromium browsers (e.g., MS Edge, Google Chrome). Not available on mobile."
          />,
          <div
            className={`notification ${
              this.state.displayMessageShare ? 'visible' : 'hidden'
            }`}
          >
            <p>
              <b>{this.state.message}</b>
            </p>
          </div>,
        ]}
        <ChevronToggleButton
          caption={'Actions'}
          className={HtmlClassName.chevronToggleButton}
          condition={this.props.showMenuOptionsEdit}
          onClick={this.props.toggleShowMenuOptionsEdit}
          title={'Toggle show Editing Actions'}
        />
        {this.props.showMenuOptionsEdit && [
          <PencilButton
            caption={'Format markdown text'}
            className={HtmlClassName.menuButton}
            fill="var(--sn-stylekit-warning-color)"
            onClick={this.formatText}
            title="Format markdown text with Prettier. WARNING: this may cause undesired changes to your note text. Use the Note History feature to revert unwanted changes."
          />,
          <PencilButton
            caption={'Uncheck all checkboxes'}
            className={HtmlClassName.menuButton}
            fill="var(--sn-stylekit-danger-color)"
            onClick={this.uncheckBoxes}
            title="Uncheck all checkboxes. DANGER: this may cause undesired changes to your note text. Use the Note History feature to revert unwanted changes."
          />,
          <div
            className={`notification ${
              this.state.displayMessageEdit ? 'visible' : 'hidden'
            }`}
          >
            <p>
              <b>{this.state.message}</b>
            </p>
          </div>,
        ]}
        <div className="extra-space"></div>
      </div>,
    ];
  }
}
