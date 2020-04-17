import React from 'react';

let keyMap = new Map();

export default class EditNote extends React.Component {
  static defaultProps = {
    // none
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
      autoSave: this.props.autoSave,
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value

    this.setState(state => ({
      text: value
    }));
  };

  onSave = e => {
    e.preventDefault();
    const { text } = this.state;
    this.props.onSave({text});
  };

  //const submit = document.querySelector('#submit');
  //submit.click();

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    console.log("Keys pressed: " + e.key + "KeyMap for key: " + keyMap.get(e.key)) + "KeyMap for Shift: " + keyMap.get('Shift');
    
    // Save note if Control and Enter are pressed
    if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      this.onSave(e);
    }
    // Save note if Control and S are pressed
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      this.onSave(e);
    }
    // Click Edit if 'Escape' is pressed
    else if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false)
      var editButton = document.getElementById("editButton");
      editButton.click();
    }
    // Click view if 'Control' and 'p' are pressed
    else if (keyMap.get('Control') && keyMap.get('p')) {
      e.preventDefault();
      var viewButton = document.getElementById("viewButton");
      viewButton.click();
    }
    // Add four spaces if tab is pressed without shift
    else if (!keyMap.get('Shift') && keyMap.get('Tab')) {
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
    // Add one stars if Control + i is pressed
    else if (keyMap.get('Control') && keyMap.get('i')) {
      e.preventDefault();
      document.execCommand("insertText", false, "*")
    }
    // Add inline code if Control + Shift and k are pressed
    else if ((keyMap.get('Control') && keyMap.get('Shift') && keyMap.get('k')) ||
    (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('k'))) {
      e.preventDefault();
      document.execCommand("insertText", false, "\`")
    }
    // Add link if Control + k are pressed
    else if (keyMap.get('Control') && keyMap.get('k')) {
      e.preventDefault();
      document.execCommand("insertText", false, "[]()")
    }
    // Add ordered list item if Control + Shift + l or Control + Alt + l are pressed
    else if ((keyMap.get('Control') && keyMap.get('Shift') && keyMap.get('l')) ||
    (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('l'))){
      e.preventDefault();
      document.execCommand("insertText", false, "\n1. ")
    }
    // Add unordered list item if Control + l are pressed
    else if (keyMap.get('Control') && keyMap.get('l')) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n- ")
    }
    // Add strikethrough if Control + Shift + u or Control + Alt + u are pressed
    else if ((keyMap.get('Control') && keyMap.get('Shift') && keyMap.get('u')) ||
      (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('u'))) {
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
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
    if (this.state.autoSave){
      this.onSave(e);
    }
  }

  onDragEnd = (e) => {
    if (this.state.autoSave){
      this.onSave(e);
    }
  }

  render() {
    const {text} = this.state;
    
    return (
      <div className="sk-panel main">
        <div className="sk-panel-content edit">
          <textarea
            id="EditTextArea"
            name="front"
            className="sk-input contrast textarea editnote"
            placeholder="Welcome to the Append Editor! 😄"
            value={text}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            onDragEnd={this.onDragEnd}
            type="text"
          />
        </div>
        <div className="sk-panel-row">
          <div className="sk-button-group stretch">
            <button type="button" 
            onClick={this.onSave}
            className="sk-button info" 
            id="submit">
              <div className="sk-label">
                Save
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}