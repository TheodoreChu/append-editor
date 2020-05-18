import React from 'react';

var keyMap = new Map();

export default class Settings extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      fontEdit: this.props.fontEdit,
      fontView: this.props.fontView,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    });
    console.log("name" + event.target.name)
  }

  handleSubmit(event) {
    event.preventDefault();
    var fontEditMessage = "";
    var fontViewMessage = "";
    console.log("fontEdit: " + this.state.fontEdit);
    console.log("fontView: " + this.state.fontView)
    if (this.state.fontEdit === "" || this.state.fontEdit === undefined) {
      fontEditMessage = "Default";
    }
    else if (this.state.fontEdit) {
      fontEditMessage = this.state.fontEdit;
    }
    if (this.state.fontView === "" || this.state.fontView === undefined) {
      fontViewMessage = "Default";
    }
    else if (this.state.fontView) {
      fontViewMessage = this.state.fontView;
    }
    const {fontEdit, fontView} = this.state
    alert('Your chosen font for Edit/Append is: ' + fontEditMessage + "\n" +
    'Your chosen font for View/Print is: ' + fontViewMessage);
    this.props.onConfirm({fontEdit}, {fontView});
  }

  clearFontEdit = () =>  {
    this.setState({
      fontEdit: "",
    });
    var fontEdit = document.getElementById("fontEdit");
    fontEdit.value = "";
    fontEdit.focus();
  }

  clearFontView = () =>  {
    this.setState({
      fontView: "",
    });
    var fontView = document.getElementById("fontView");
    fontView.value = "";
    fontView.focus();
  }

  clearAllSettings = () => {
    // We clear fontView before fontEdit so the focus afterwards is on fontEdit (the first setting)
    this.clearFontView();
    this.clearFontEdit();
  }

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    console.log("Keys pressed: " + e.key + "KeyMap for key: " + keyMap.get(e.key)) + "KeyMap for Shift: " + keyMap.get('Shift');
    
    // Save settings if Control and 's' are pressed
    if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      this.handleSubmit(e);
    }
    // Save settings if Control and Enter are pressed
    else if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  }
  
  render () {
    //<h3>↶</h3>
    const { title, onCancel, confirmText, cancelText, helpLink } = this.props
    return (
  <div className="note-overlay">
    <div className="note-dialog sk-panel">
      <div className="sk-panel-content">
        <div className="sk-panel-section">
        <datalist id="fonts">, 
              <option value="Monospace"/>
              <option value="Arial"/>
              <option value="Arial Black"/>
              <option value="-apple-system"/>
              <option value="BlinkMacSystemFont"/>
              <option value="Calibri"/>
              <option value="Cantarell"/>
              <option value="Comic Sans MS"/>
              <option value="Consolas"/>
              <option value="Courier New"/>
              <option value="Droid Sans"/>
              <option value="Fira Sans"/>
              <option value="Garamond"/>
              <option value="Georgia"/>
              <option value="Helvetica"/>
              <option value="Helvetica Neue"/>
              <option value="Impact"/>
              <option value="Liberation Mono"/>
              <option value="Menlo"/>
              <option value="Monospace"/>
              <option value="Oxygen"/>
              <option value="Roboto"/>
              <option value="Sans-Serif"/>
              <option value="Segoe UI"/>
              <option value="SFMono-Regular"/>
              <option value="Serif"/>
              <option value="Tahoma"/>
              <option value="Times New Roman"/>
              <option value="Trebuchet MS"/>
              <option value="Ubuntu"/>
              <option value="Verdana"/>
            </datalist>
        <div className="sk-panel-row">
          <div className="sk-h1"><h2>{title}</h2></div>
          <button id="undoDialog" onClick={onCancel}>
            <img src="icons/ic-close.svg"/>
          </button>
        </div>
        <div className="sk-panel-row">
            <div className="sk-h2">Need help? Check out the <a href={helpLink}target="_blank" rel="noopener">documentation</a>. <br></br>For the default settings, click&nbsp;
            <button onClick={this.clearAllSettings}>
              <img src="icons/ic-undo.svg"/>
            </button>
            </div>
          </div>
        <div className="sk-panel-row settings">
          <div className="sk-h2">Choose a font for Edit/Append: </div>
            <div>
              <input 
                list="fonts" 
                id="fontEdit" 
                name="fontEdit" 
                value={this.state.fontEdit} 
                onChange={this.handleChange}
                //onKeyDown={this.onKeyDown}
                //onKeyUp={this.onKeyUp}
                />
              <button onClick={this.clearFontEdit}>
              <img src="icons/ic-undo.svg"/>
            </button>
            </div>
        </div>
        <div className="sk-panel-row settings">
          <div className="sk-h2">Choose a font for View/Print: </div>
          <div>
            <input 
              list="fonts" 
              id="fontView" 
              name="fontView" 
              value={this.state.fontView} 
              onChange={this.handleChange}
              //onKeyDown={this.onKeyDown}
              //onKeyUp={this.onKeyUp}
            />
            <button onClick={this.clearFontView}>
            <img src="icons/ic-undo.svg"/>
            </button>
          </div>
        </div>
        </div>
      </div>
      <div className="sk-panel-footer">
        <div className="sk-button-group stretch">
          <button className="sk-button neutral" onClick={onCancel}>
            <div className="sk-label">{cancelText}</div>
          </button>
          <button className="sk-button info" onClick={this.handleSubmit}>
            <div className="sk-label">{confirmText}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
  }
} 