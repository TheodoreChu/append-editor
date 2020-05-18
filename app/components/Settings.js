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
              <option value="SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace"/>
              <option value="Times New Roman"/>
              <option value="Arial"/>
              <option value="Arial Black"/>
              <option value="-apple-system"/>
              <option value="Bell MT"/>
              <option value="Baskerville Old Face"/>
              <option value="Bahnschrift Light"/>
              <option value="BlinkMacSystemFont"/>
              <option value="Bodoni MT"/>
              <option value="Calibri"/>
              <option value="Calibri Light"/>
              <option value="Calisto MT"/>
              <option value="Cambria"/>
              <option value="Candara"/>
              <option value="Candara Light"/>
              <option value="Cantarell"/>
              <option value="Centaur"/>
              <option value="Century"/>
              <option value="Century Gothic"/>
              <option value="Comic Sans MS"/>
              <option value="Consolas"/>
              <option value="Constantia"/>
              <option value="Courier New"/>
              <option value="Corbel"/>
              <option value="Corbel Light"/>
              <option value="DengXian"/>
              <option value="Ebrima"/>
              <option value="Droid Sans"/>
              <option value="Fira Sans"/>
              <option value="Gabriola"/>
              <option value="Garamond"/>
              <option value="Georgia"/>
              <option value="Helvetica"/>
              <option value="Helvetica Neue"/>
              <option value="Impact"/>
              <option value="KaTeX_AMS"/>
              <option value="KaTeX_Caligraphic"/>
              <option value="KaTeX_Fraktur"/>
              <option value="KaTeX_Main"/>
              <option value="KaTeX_Math"/>
              <option value="KaTeX_SansSerif"/>
              <option value="KaTeX_Script"/>
              <option value="KaTeX_Typewriter"/>
              <option value="Lato"/>
              <option value="Liberation Mono"/>
              <option value="Lucida Caligraphy"/>
              <option value="Lucida Sans"/>
              <option value="Menlo"/>
              <option value="Monaco"/>
              <option value="Monospace"/>
              <option value="New York"/>
              <option value="Oxygen"/>
              <option value="Palatino"/>
              <option value="Roboto"/>
              <option value="Sans-Serif"/>
              <option value="Segoe UI"/>
              <option value="SFMono-Regular"/>
              <option value="Serif"/>
              <option value="Sylfaen"/>
              <option value="Tahoma"/>
              <option value="Times New Roman"/>
              <option value="Trebuchet MS"/>
              <option value="Ubuntu"/>
              <option value="Verdana"/>
              <option value="Yu Gothic"/>
            </datalist>
        <div className="sk-panel-row">
          <div className="sk-h1"><h2>{title}</h2></div>
          <button id="undoDialog" onClick={onCancel} title="Close">
            <img src="icons/ic-close.svg"/>
          </button>
        </div>
        <div className="sk-panel-row">
            <div className="sk-h2">Need help? Check out the <a href={helpLink}target="_blank" rel="noopener">documentation</a>. <br></br>For the default settings, click&nbsp;
            <button onClick={this.clearAllSettings} title="Reset all Settings">
              <img src="icons/ic-undo.svg" />
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
              <button onClick={this.clearFontEdit} title="Reset font for Edit/Append">
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
            <button onClick={this.clearFontView} title="Reset font for View/Print">
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