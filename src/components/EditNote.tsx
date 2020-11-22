import React from 'react';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';
import { MonacoEditor } from './Monaco';
import DynamicEditor from './DynamicEditor';

const editTextAreaID = 'editTextArea';

interface EditProps {
  debugMode: boolean;
  editingMode: EditingMode;
  fontSize: string;
  keyMap: any;
  monacoEditorLanguage: string;
  onKeyDown: Function;
  onKeyUp: Function;
  onKeyDownEditTextArea: Function;
  onKeyDownTextArea: Function;
  printMode: boolean;
  saveText: Function;
  text: string;
  useDynamicEditor: useDynamicEditor;
  useMonacoEditor: useMonacoEditor;
  viewMode: boolean | undefined;
}

interface EditState {
  text: string;
}

export default class EditNote extends React.Component<EditProps, EditState> {
  static defaultProps = {
    // none
  };

  constructor(props: EditProps) {
    super(props);

    this.state = {
      text: this.props.text,
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target.value;

    this.setState(
      {
        text: value,
      },
      () => {
        this.props.saveText(this.state.text);
      }
    );
  };

  saveText = (text: string) => {
    this.setState(
      {
        text,
      },
      () => {
        this.props.saveText(this.state.text);
      }
    );
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    this.props.onKeyDown(e);
    this.props.onKeyDownEditTextArea(e);
    this.props.onKeyDownTextArea(e);
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
          'sk-panel main edit ' +
          (this.props.printMode
            ? 'printModeOn'
            : this.props.editingMode === this.props.useMonacoEditor
            ? 'monacoEditor printModeOff'
            : this.props.editingMode === this.props.useDynamicEditor
            ? 'dynamicEditor printModeOff'
            : 'otherEditor printModeOff')
        }
      >
        <div
          className={
            'sk-panel-content edit ' +
            (this.props.editingMode === this.props.useMonacoEditor
              ? 'monacoEditor'
              : '')
          }
        >
          {this.props.editingMode === this.props.useMonacoEditor ? (
            <MonacoEditor
              fontSize={this.props.fontSize}
              language={this.props.monacoEditorLanguage}
              saveText={this.saveText}
              text={text}
              viewMode={this.props.viewMode}
            />
          ) : this.props.editingMode === this.props.useDynamicEditor ? (
            <div id="dynamicEditor">
              <DynamicEditor
                debugMode={this.props.debugMode}
                text={text}
                onChange={this.saveText}
                readOnly={false}
              />
            </div>
          ) : (
            <textarea
              id={editTextAreaID}
              name="text"
              className="sk-input contrast textarea editnote"
              placeholder="Welcome to the Append Editor! 😄"
              rows={15}
              spellCheck="true"
              value={text}
              onChange={this.handleInputChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.onKeyUp}
            />
          )}
        </div>
      </div>
    );
  }
}
