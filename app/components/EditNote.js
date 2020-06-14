import React from 'react';

const editTextAreaID = "editTextArea";

export default class EditNote extends React.Component {
  static defaultProps = {
    // none
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;

    this.setState(
      {
        text: value,
      }, () => {
        this.saveText(event);
      }
    );
  };

  saveText = (e) => {
    e.preventDefault();
    const { text } = this.state;
    this.props.saveText( text );
  };

  onKeyDown = (e) => {
    this.props.onKeyDown(e);
    this.props.onKeyDownEditTextArea(e);
    this.props.onKeyDownTextArea(e);
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
          'sk-panel main edit ' +
          (this.props.printMode ? 'printModeOn' : 'printModeOff')
        }
      >
        <div className="sk-panel-content edit">
          <textarea
            id={editTextAreaID}
            name="text"
            className="sk-input contrast textarea editnote"
            placeholder="Welcome to the Append Editor! 😄"
            rows="15"
            spellCheck="true"
            value={text}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            type="text"
            style={{fontFamily: this.props.fontEdit}}
          />
        </div>
      </div>
    );
  }
}
