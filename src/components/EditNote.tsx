import React from 'react';
import { AppendInterface } from './AppendEditor';
import { MonacoEditor } from './Monaco';

const editTextAreaID = 'editTextArea';

interface PropsState extends AppendInterface {
  keyMap: any;
  debugMode: boolean;
  onKeyDown: Function;
  onKeyUp: Function;
  onKeyDownEditTextArea: Function;
  onKeyDownTextArea: Function;
  saveText: Function;
}

interface ChildState {
  text: string;
}

export default class EditNote extends React.Component<any, ChildState> {
  static defaultProps = {
    // none
  };

  constructor(props: PropsState) {
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
            : this.props.useMonacoEditor
            ? 'MonacoEditor printModeOff'
            : 'printModeOff')
        }
      >
        <div className={'sk-panel-content edit'}>
          {this.props.useMonacoEditor ? (
            <MonacoEditor text={text} saveText={this.saveText} />
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
              //type="text"
              style={{ fontFamily: this.props.fontEdit }}
            />
          )}
        </div>
      </div>
    );
  }
}
