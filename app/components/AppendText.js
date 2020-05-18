import React from 'react';

let keyMap = new Map();

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

  handleInputChange = event => {
    const target = event.target;
    //const value = target.value
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    }
    // This callback is used to save the append text and checkboxes
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    , () => {
        try {
          this.onSaveAppendTextAndCheckboxes();
        }
        catch (error) {
          console.error(error);
        }
    });
  };

  // This is an almost duplicate of the above editor. Here we don't save the checkboxes to improve performance
  handleTextAreaChange = event => {
    const target = event.target;
    const value = target.value
    this.setState({
      text: value,
    }
    // This callback is used to save the append text
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    , () => {
        try {
          this.onSaveAppendText();
        }
        catch (error) {
          console.error(error);
        }
    });
  };

  onAppend = (e) => {
    e.preventDefault();
    const { text } = this.state;
    var appendText = '';
    // We test for new paragraph first even though new line is on top and is on by default
    if (this.state.newParagraph && text) {
      appendText = '  \n\n' + text;
    }
    else if (this.state.newLine && text) {
      appendText = '  \n' + text;
    }
    else {
      appendText = text;
    }
    this.props.onAppend(appendText);
    this.setState({
      text: '',
    });
    const appendTextArea = document.getElementById("appendTextArea");
    appendTextArea.focus();
  };

  onSaveAppendText = () => {
    const text = this.state.text;
    this.props.onSaveAppendText(text);
  };

  onSaveAppendTextAndCheckboxes = () => {
    //console.log("newline: " + this.state.newLine);
    //console.log("new paragraph: " + this.state.newParagraph);
    const text = this.state.text;
    const newLine = this.state.newLine;
    const newParagraph = this.state.newParagraph;
    this.props.onSaveAppendTextAndCheckboxes(text, newLine, newParagraph);
  };

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    //console.log("Keys pressed: " + e.key + "KeyMap for key: " + keyMap.get(e.key)) + "KeyMap for Shift: " + keyMap.get('Shift');
    
    // Click Append if 'Escape' is pressed
    if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false);
      var appendButton = document.getElementById("appendButton");
      appendButton.click();
    }
    // Add four spaces if Control and Tab are pressed without Shift
    else if (keyMap.get('Control') && !keyMap.get('Shift') && keyMap.get('Tab')) {
      e.preventDefault();
      // Using document.execCommand gives us undo support
      document.execCommand("insertText", false, "\t")
        // document.execCommand works great on Chrome/Safari but not Firefox
    }
    // Add two spaces and line break if Shift and Enter are pressed
    else if (keyMap.get('Shift') && keyMap.get('Enter')) {
      e.preventDefault();
      document.execCommand("insertText", false, "  \n")
    }
    // Append text if Control and Enter are pressed
    else if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      this.onAppend(e);
    }
    // Add two stars if Control + b are pressed
    else if (keyMap.get('Control') && keyMap.get('b')) {
      e.preventDefault();
      document.execCommand("insertText", false, "**")
    }
    // Add header when pressing Control + H
    else if (keyMap.get('Control') && keyMap.get('h')) {
      e.preventDefault();
      document.execCommand("insertText", false, "#")
    }
    // Add image code if Control + Alt and i are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('i')) {
      e.preventDefault();
      document.execCommand("insertText", false, "![]()")
    }
    // Add one stars if Control + i is pressed
    else if (keyMap.get('Control') && keyMap.get('i')) {
      e.preventDefault();
      document.execCommand("insertText", false, "*")
    }
    // Add inline code if Control + Alt and k are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('k')) {
      e.preventDefault();
      document.execCommand("insertText", false, "\`")
    }
    // Add link if Control + k are pressed
    else if (keyMap.get('Control') && keyMap.get('k')) {
      e.preventDefault();
      document.execCommand("insertText", false, "[]()")
    }
    // Add ordered list item if Control + Alt + l are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('l')){
      e.preventDefault();
      document.execCommand("insertText", false, "\n1. ")
    }
    // Add unordered list item if Control + l are pressed
    else if (keyMap.get('Control') && keyMap.get('l')) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n- ")
    }
    // Add strike through if Control + Alt + u are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('u')) {
      e.preventDefault();
      document.execCommand("insertText", false, "~~")
    }
    // Add quote Control + q, Control + ' or Control + " are pressed
    else if ((keyMap.get('Control') && keyMap.get('q')) ||
     (keyMap.get('Control') && keyMap.get('\'')) ||
     (keyMap.get('Control') && keyMap.get('\"'))) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n> ")
    }
    // Append text if Control and S are pressed
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      this.onAppend(e);
    }
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  }

  render() {
    const {text} = this.state;

    return (
      <div className={"sk-panel main appendix " + (this.props.printMode ? 'printModeOn' : 'printModeOff' )}>
        <div className="sk-panel-content edit">
          <textarea
            id="appendTextArea"
            name="text"
            className="sk-input contrast textarea append"
            placeholder="Append to your note 🙂"
            rows={this.props.rows}
            spellCheck="true"
            value={text}
            onChange={this.handleTextAreaChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            style={{fontFamily: this.props.fontEdit}}
            type="text"
          />
        </div>
        <div className="sk-panel-row">
          <form className="checkBoxForm">
            <label>
              <input
                name="newLine"            
                type="checkbox"
                checked={this.state.newLine}
                onChange={this.handleInputChange} />
                New Line
            </label>
            <br />
            <label>
              <input
                name="newParagraph"            
                type="checkbox"
                checked={this.state.newParagraph}
                onChange={this.handleInputChange} />
                New Paragraph
            </label>
          </form>
          <div className="sk-button-group stretch">
            <button 
            type="button" 
            id="appendTextButton"
            onClick={this.onAppend}
            className="sk-button info" 
            >
              <div className="sk-label">
                Append
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}