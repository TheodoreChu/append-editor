import React from 'react';

const appendButtonID = 'appendButton';
const appendTextAreaID = 'appendTextArea';
const newLineID = 'newLine';
const newParagraphID = 'newParagraph';

export default class AppendText extends React.Component {
  static defaultProps = {
    // none
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
      newLine: this.props.newLine,
      newParagraph: this.props.newParagraph,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      },
      () => {
        // This callback saves the append text and checkboxes
        this.autoSaveAppendTextAndCheckboxes();
      }
    );
  };

  // This is an almost duplicate of the above editor. Here we don't save the checkboxes to improve performance
  handleTextAreaChange = (event) => {
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
    appendTextArea.focus();
  };

  autoSaveAppendText = () => {
    const text = this.state.text;
    this.props.autoSaveAppendText(text);
  };

  autoSaveAppendTextAndCheckboxes = () => {
    const text = this.state.text;
    const newLine = this.state.newLine;
    const newParagraph = this.state.newParagraph;
    this.props.autoSaveAppendTextAndCheckboxes(text, newLine, newParagraph);
  };

  onKeyDown = (e) => {
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
    this.props.onKeyDownTextArea(e);
    // Click Edit if 'Escape' is pressed
    if (this.props.keyMap.get('Escape')) {
      e.preventDefault();
      this.props.keyMap.delete('Escape');
      const appendButton = document.getElementById(appendButtonID);
      if (appendButton) {
        appendButton.click();
      }
    }
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
    // TODO: Fix this
    /*
    // Toggle Append New Line if Ctrl + Alt + N are pressed
    else if (this.props.keyMap.get('Control') && !this.props.keyMap.get('Shift') && this.props.keyMap.get('Alt') && this.props.keyMap.get('n')) {
      e.preventDefault();
      const newLine = document.getElementById(newLineID);
      if (newLine) {
        newLine.click();
      }
    }
    // Toggle Append New Line if Ctrl + Alt + P are pressed
    else if (this.props.keyMap.get('Control') && !this.props.keyMap.get('Shift') && this.props.keyMap.get('Alt') && this.props.keyMap.get('p')) {
      e.preventDefault();
      const newParagraph = document.getElementById(newParagraphID);
      if (newParagraph) {
        newParagraph.click();
      }
    }*/
  };

  onKeyUp = (event) => {
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
            rows={this.props.rows}
            spellCheck="true"
            value={text}
            onChange={this.handleTextAreaChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            style={{ fontFamily: this.props.fontEdit }}
            type="text"
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
              type="button"
              type="button"
              id="appendTextButton"
              onClick={this.appendTextToNote}
              className="sk-button info"
              className="sk-button info"
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
