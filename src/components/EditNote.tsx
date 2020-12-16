import React from 'react';
import { EditingModes, HtmlClassName } from './AppendEditor';
import { MonacoEditor } from './Monaco';
import DynamicEditor from './DynamicEditor';

import { HtmlElementId } from './AppendEditor';

interface EditProps {
  debugMode: boolean;
  editingMode?: string;
  fontSize: string;
  keyMap: any;
  monacoEditorLanguage: string;
  onKeyDown: Function;
  onKeyUp: Function;
  onKeyDownEditTextArea: Function;
  onKeyDownTextArea: Function;
  saveText: Function;
  text: string;
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

  onBlur = (e: React.FocusEvent) => {
    const content = document.getElementById(HtmlElementId.content);
    if (content) {
      content.classList.remove(HtmlClassName.focused);
    }
  };

  onFocus = (e: React.FocusEvent) => {
    const content = document.getElementById(HtmlElementId.content);
    if (content) {
      content.classList.add(HtmlClassName.focused);
    }
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
          (this.props.editingMode === EditingModes.useMonacoEditor
            ? 'monacoEditor'
            : this.props.editingMode === EditingModes.useDynamicEditor
            ? 'dynamicEditor'
            : 'otherEditor')
        }
      >
        <div
          className={
            'sk-panel-content edit' +
            (this.props.editingMode === EditingModes.useMonacoEditor
              ? ' MonacoEditorContainerParentDiv'
              : '')
          }
          id={HtmlElementId.edit}
        >
          {this.props.editingMode === EditingModes.useMonacoEditor ? (
            <MonacoEditor
              fontSize={this.props.fontSize}
              language={this.props.monacoEditorLanguage}
              saveText={this.saveText}
              text={text}
              viewMode={this.props.viewMode}
            />
          ) : this.props.editingMode === EditingModes.useDynamicEditor ? (
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
              id={HtmlElementId.editTextArea}
              name="text"
              className={'sk-input contrast textarea editnote'}
              placeholder="Welcome to the Append Editor! 😄"
              rows={15}
              spellCheck="true"
              value={text}
              onBlur={this.onBlur}
              onChange={this.handleInputChange}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.onKeyUp}
            />
          )}
        </div>
      </div>
    );
  }
}
