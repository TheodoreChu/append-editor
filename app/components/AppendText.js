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
      // This autoSave boolean is needed in order for Ctrl + S and Ctrl + Enter keyboard shortcuts to work
      // It might not be needed
      //autoSave: true,
    };
  }

  handleInputChange = event => {
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
    this.props.onAppend({text});
    this.setState({
      text: '',
    });
    //const scrollToBottomButton = document.getElementById("scrollToBottomButton");
    //scrollToBottomButton.click();
    const appendTextArea = document.getElementById("appendTextArea");
    appendTextArea.focus();
  };

  onSaveAppendText = () => {
    const text = this.state.text;
    this.props.onSaveAppendText(text);
  };

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    console.log("Keys pressed: " + e.key + "KeyMap for key: " + keyMap.get(e.key)) + "KeyMap for Shift: " + keyMap.get('Shift');
    
    // Click Append if 'Escape' is pressed
    if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false);
      var appendButton = document.getElementById("appendButton");
      appendButton.click();
    }
    // Save Append Text if Tab is pressed
    /*else if (!keyMap.get('Control') && keyMap.get('Tab')) {
      console.log("Tab key: " + keyMap.get('Tab'));
      keyMap.set('Tab', false);
      //this.setState({
     //   autoSave: false,
    //  })
      this.onSaveAppendText();
    }*/
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
     // this.setState({
    //    autoSave: false,
    //  });
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
    // Add strikethrough if Control + Alt + u are pressed
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
     // this.setState({
     //   autoSave: false,
      //});
      this.onAppend(e);
    }
    /*else {
      this.setState({
        autoSave: true,
      })
    }*/
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  //  if (this.state.autoSave) {
   //   this.onSaveAppendText();
    //}
  }

  onDragEnd = (e) => {
  //  if (this.state.autoSave) {
  //    this.onSaveAppendText();
   // }
   return
  }

  render() {
    const {text} = this.state;

    return (
      <div className="sk-panel main appendix">
        <div className="sk-panel-content edit">
          <textarea
            id="appendTextArea"
            name="Append"
            className="sk-input contrast textarea append"
            placeholder="Append to your note 🙂"
            rows="5"
            spellCheck="true"
            value={text}
            onDoubleClick={this.onSaveAppendText}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            //onDragEnd={this.onDragEnd}
            type="text"
          />
        </div>
        <div className="sk-panel-row">
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