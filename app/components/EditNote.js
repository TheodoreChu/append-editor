import React from 'react';

let keyMap = new Map();

export default class EditNote extends React.Component {
  static defaultProps = {
    // none
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text
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

  getText = () => {
    this.state = {
      text: this.props.text
    };
  }

  // this is the default behavior for 'input' boxes but not 'textarea'
  // we want it to be control + enter
  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    //const submit = document.querySelector('#submit');
    console.log("Keys pressed:" + e.key + "KeyMap for key:" + keyMap.get(e.key)) + "KeyMap for Shift:" +keyMap.get('Shift');
    if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('Enter', false);
      this.onSave(e);
      //submit.click();
    }
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('s', false);
      this.onSave(e);
    }
    else if (!keyMap.get('Shift') && keyMap.get('Tab')) {
      e.preventDefault();
      keyMap.set('Shift', true);
      keyMap.set('Tab', false);

      // Using document.execCommand gives us undo support
      if (!document.execCommand("insertText", false, "\t")) {
        // document.execCommand works great on Chrome/Safari but not Firefox
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var spaces = "    ";

        // Insert 4 spaces
        this.value = this.value.substring(0, start)
          + spaces + this.value.substring(end);

        // Place cursor 4 spaces away from where
        // the tab key was pressed
        this.selectionStart = this.selectionEnd = start + 4;
      }
    }
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  }

  clickSave = () => {
    var saveButton = document.querySelector('#submit');
    saveButton.click();
  }

  autoSave = () => {
    console.log("autosave started")
    var autosave = window.setInterval(this.clickSave(), 20000)
  }

  render() {
    const {text} = this.state;
    //var editText = String(text); 
    //var wait = window.setTimeout(this.autoSave(), 10000)
    
    return (
      <div className="sk-panel">
        <div className="sk-panel-content">
              <textarea
                name="front"
                className="sk-input contrast textarea editnote"
                placeholder="Text"
                value={text}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
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