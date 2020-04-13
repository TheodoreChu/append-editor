import React from 'react';

let keyMap = new Map();

export default class AppendText extends React.Component {
  static defaultProps = {
    // none
  };

  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value

    this.setState(state => ({
      text: value
    }));
  };

  onAppend = e => {
    console.log("append initiated")
    e.preventDefault();
    const { text } = this.state;
    this.props.onAppend({text});
    console.log("append initiation complete")
    this.setState({
      text: '',
    })
    //var textarea = document.getElementByName("Append");
    //textarea.value = '';
  };

  // this is the default behavior for 'input' boxes but not 'textarea'
  // we want it to be control + enter
  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    console.log("Keys pressed:" + e.key + "KeyMap for key:" + keyMap.get(e.key)) + "KeyMap for Shift:" +keyMap.get('Shift');
    if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('Enter', false);
      this.onAppend(e);
    }
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('s', false);
      this.onAppend(e);
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

  render() {
    const {text} = this.state;

    return (
      <div className="sk-panel">
        <div className="sk-panel-content">
              <textarea
                id="AppendTextArea"
                name="Append"
                className="sk-input contrast textarea"
                placeholder="Append to your note"
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
            onClick={this.onAppend}
            className="sk-button info" 
            id="submit">
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