import React from 'react';
import { AppendInterface } from './AppendEditor';

const appendTextAreaID = 'appendTextArea';
const newLineID = 'newLine';
const newParagraphID = 'newParagraph';

interface PropsState extends AppendInterface {
  appendTextToNote: Function;
  keyMap: any;
  debugMode: boolean;
  autoSaveAppendText: Function;
  autoSaveCheckBoxes: Function;
  onKeyDown: Function;
  onKeyUp: Function;
  onKeyDownAppendTextArea: Function;
  onKeyDownTextArea: Function;
}

interface ChildState {
  text: string;
  newLine: boolean;
  newParagraph: boolean;
  [x: number]: any;
}

export default class AppendText extends React.Component<any, ChildState> {
  static defaultProps = {
    // none
  };

  constructor(props: PropsState) {
    super(props);

    this.state = {
      text: this.props.text,
      newLine: this.props.appendNewLine,
      newParagraph: this.props.appendNewParagraph,
    };
  }

  handleInputChange = (event: any) => {
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

  appendTextToNote = () => {
    this.props.appendTextToNote();
    this.setState({
      text: '',
    });
    const appendTextArea = document.getElementById(appendTextAreaID);
    if (appendTextArea) {
      appendTextArea.focus();
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
          (this.props.printMode ? 'printModeOn' : 'printModeOff')
        }
      >
        <div className="sk-panel-content edit">
          <textarea
            id={appendTextAreaID}
            name="text"
            className="sk-input contrast textarea append"
            placeholder="Append to your note"
            rows={this.props.appendRows}
            spellCheck="true"
            value={text}
            onChange={this.handleTextAreaChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            style={{ fontFamily: this.props.fontEdit }}
            //type="text"
          />
        </div>
        <div className="sk-panel-row">
          <form className="checkBoxForm">
            <label>
              <input
                id={newLineID}
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
                id={newParagraphID}
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
              <div className="sk-label">Append</div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
