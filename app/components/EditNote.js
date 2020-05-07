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
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value

    this.setState({
      text: value
    }, () => {
      try {
        this.onSave(event);
      }
      catch (error) {
        console.error(error);
      }
    });
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
    
    // Click Edit if 'Escape' is pressed
    if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false);
      var editButton = document.getElementById("editButton");
      editButton.click();
    }
    // Add four spaces if tab is pressed without shift
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
    // Save note if Control and Enter are pressed
    if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      this.onSave(e);
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
    // Add strikethrough if Control + Alt + u are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('u')) {
      e.preventDefault();
      document.execCommand("insertText", false, "~~")
    }
    // Click view if 'Control' and 'p' are pressed
    else if (keyMap.get('Control') && keyMap.get('p')) {
      e.preventDefault();
      var viewButton = document.getElementById("viewButton");
      viewButton.click();
    }
    // Add quote Control + q, Control + ' or Control + " are pressed
    else if ((keyMap.get('Control') && keyMap.get('q')) ||
     (keyMap.get('Control') && keyMap.get('\'')) ||
     (keyMap.get('Control') && keyMap.get('\"'))) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n> ")
    }
    // Save note if Control and S are pressed
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      this.onSave(e);
    }
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
    this.onSave(e);
  }

  onDragEnd = (e) => {
    this.onSave(e);
  }

  render() {
    const {text} = this.state;
    
    return (
      <div className="sk-panel main edit">
        <div className="sk-panel-content edit">
          <textarea
            id="editTextArea"
            name="front"
            className="sk-input contrast textarea editnote"
            placeholder="Welcome to the Append Editor! 😄"
            rows="25"
            spellCheck="true"
            value={text}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            onDragEnd={this.onDragEnd}
            type="text"
          />
        </div>
      </div>
    );
  }
}

/*
        <div className="sk-panel-row">
          <div className="sk-button-group stretch">
            <button type="button" 
            onClick={this.onSave}
            className="sk-button info" 
            id="save">
              <div className="sk-label">
                Save
              </div>
            </button>
          </div>
        </div>
        */