import React from 'react';
import { EditingModes } from './AppendEditor';
import DynamicEditor from './DynamicEditor';
import { MonacoEditor } from './Monaco';

import { HtmlElementId } from './AppendEditor';

interface AppendProps {
  appendNewLine: boolean;
  appendNewParagraph: boolean;
  appendRows: number;
  appendTextToNote: Function;
  editingMode?: string;
  fontSize: string;
  keyMap: Map<any, any>;
  debugMode: boolean;
  autoSaveAppendText: Function;
  autoSaveCheckBoxes: Function;
  monacoEditorLanguage: string;
  onKeyDown: Function;
  onKeyUp: Function;
  onKeyDownAppendTextArea: Function;
  onKeyDownTextArea: Function;
  text: string;
}

interface AppendState {
  text: string;
  newLine: boolean;
  newParagraph: boolean;
  [x: string]: string | boolean;
}

export default class AppendText extends React.Component<
  AppendProps,
  AppendState
> {
  static defaultProps = {
    // none
  };

  constructor(props: AppendProps) {
    super(props);

    this.state = {
      text: this.props.text,
      newLine: this.props.appendNewLine,
      newParagraph: this.props.appendNewParagraph,
      useMonacoEditor: this.props.editingMode === EditingModes.useMonacoEditor,
      useDynamicEditor:
        this.props.editingMode === EditingModes.useDynamicEditor,
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      },
      () => {
        // This callback saves the checkboxes
        this.autoSaveCheckBoxes();
      }
    );
  };

  // This is an almost duplicate of the above editor. Here we don't save the checkboxes to improve performance
  handleTextAreaChange = (event: any) => {
    const target = event.target;
    const value = target.value;
    this.setState(
      {
        text: value,
      },
      () => {
        // This callback saves the append text
        this.autoSaveAppendText();
      }
    );
  };

  saveText = (text: string) => {
    this.setState(
      {
        text,
      },
      () => {
        this.props.autoSaveAppendText(this.state.text);
      }
    );
  };

  appendTextToNote = () => {
    this.props.appendTextToNote();
    this.setState({
      text: '',
    });
    const appendTextArea = document.getElementById(
      HtmlElementId.appendTextArea
    );
    if (appendTextArea) {
      appendTextArea.focus();
    }
    // Refresh Monaco Editor after appending text to note
    if (this.state.useMonacoEditor) {
      this.setState(
        {
          useMonacoEditor: false,
        },
        () => {
          this.setState({
            useMonacoEditor: true,
          });
        }
      );
    }
    // Refresh Dynamic Editor after appending text to note
    if (this.state.useDynamicEditor) {
      this.setState(
        {
          useDynamicEditor: false,
        },
        () => {
          this.setState({
            useDynamicEditor: true,
          });
        }
      );
    }
  };

  autoSaveAppendText = () => {
    const text = this.state.text;
    this.props.autoSaveAppendText(text);
  };

  autoSaveCheckBoxes = () => {
    const newLine = this.state.newLine;
    const newParagraph = this.state.newParagraph;
    this.props.autoSaveCheckBoxes(newLine, newParagraph);
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    this.props.keyMap.set(e.key, true);
    if (this.props.debugMode) {
      console.log(
        'Keys pressed: ' +
          e.key +
          'KeyMap for key: ' +
          this.props.keyMap.get(e.key)
      );
      console.log('Append Text Value: ' + this.state.text);
    }

    this.props.onKeyDown(e);
    this.props.onKeyDownAppendTextArea(e);
    this.props.onKeyDownTextArea(e);
    // Append Text if Ctrl and 'Enter' are pressed
    if (this.props.keyMap.get('Control') && this.props.keyMap.get('Enter')) {
      e.preventDefault();
      this.appendTextToNote();
    }
    // Append Text if Ctrl and 's' are pressed
    else if (this.props.keyMap.get('Control') && this.props.keyMap.get('s')) {
      e.preventDefault();
      this.appendTextToNote();
    }
  };

  onKeyUp = (event: React.KeyboardEvent) => {
    this.props.keyMap.delete(event.key);
    this.props.onKeyUp(event);
  };

  render() {
    const { text } = this.state;

    return (
      <div
        className={
          'sk-panel main appendix ' +
          (this.props.editingMode === EditingModes.useMonacoEditor
            ? 'monacoEditor'
            : this.props.editingMode === EditingModes.useDynamicEditor
            ? 'dynamicEditor'
            : 'otherEditor')
        }
      >
        <div
          className={
            'sk-panel-content edit ' +
            (this.props.editingMode === EditingModes.useMonacoEditor
              ? 'monacoEditor'
              : '')
          }
        >
          {this.state.useMonacoEditor ? (
            // We use this.state instead of this.props so we can easily refresh it on Append
            <MonacoEditor
              fontSize={this.props.fontSize}
              language={this.props.monacoEditorLanguage}
              saveText={this.saveText}
              text={text}
            />
          ) : this.state.useDynamicEditor ? (
            <div id="appendDynamicEditor">
              <DynamicEditor
                debugMode={this.props.debugMode}
                onChange={this.saveText}
                readOnly={false}
                text={text}
              />
            </div>
          ) : (
            <textarea
              id={HtmlElementId.appendTextArea}
              name="text"
              className="sk-input contrast textarea append"
              placeholder="Append to your note"
              rows={this.props.appendRows}
              spellCheck="true"
              value={text}
              onChange={this.handleTextAreaChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.onKeyUp}
            />
          )}
        </div>
        <div className="sk-panel-row">
          <form className="checkBoxForm">
            <label>
              <input
                id={HtmlElementId.newLine}
                name="newLine"
                type="checkbox"
                checked={this.state.newLine}
                onChange={this.handleInputChange}
              />
              New Line
            </label>
            <br />
            <label>
              <input
                id={HtmlElementId.newParagraph}
                name="newParagraph"
                type="checkbox"
                checked={this.state.newParagraph}
                onChange={this.handleInputChange}
              />
              New Paragraph
            </label>
          </form>
          <div className="sk-button-group stretch">
            <button
              type="button"
              id="appendTextButton"
              onClick={this.appendTextToNote}
              className="sk-button info"
            >
              <div>Append</div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
