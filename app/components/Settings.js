import React from 'react';

const fontEditID = 'fontEdit';
const fontSizeID = 'fontSize';
const fontViewID = 'fontView';
const useCodeMirrorID = 'useCodeMirror';
const customStylesID = 'customStyles';
const resetAllSettingsID = 'resetAllSettings';

const debugMode = true;

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customStyles: this.props.customStyles,
      fontEdit: this.props.fontEdit,
      fontSize: this.props.fontSize,
      fontView: this.props.fontView,
      useCodeMirror: this.props.useCodeMirror,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    if (debugMode) {
      console.log('Settings event name: ' + event.target.name);
    }
  };

  handleSubmit = () => {
    if (debugMode) {
      let fontEditMessage = '';
      let fontViewMessage = '';
      console.log('Settings fontEdit: ' + this.state.fontEdit);
      console.log('Settings fontView: ' + this.state.fontView);
      if (this.state.fontEdit === '' || this.state.fontEdit === undefined) {
        fontEditMessage = 'Default';
      } else if (this.state.fontEdit) {
        fontEditMessage = this.state.fontEdit;
      }
      if (this.state.fontView === '' || this.state.fontView === undefined) {
        fontViewMessage = 'Default';
      } else if (this.state.fontView) {
        fontViewMessage = this.state.fontView;
      }
      console.log(
        'Your useCodeMirror is: ' +
          this.state.useCodeMirror +
          '\n' +
          'Your chosen font for Edit/Append is: ' +
          fontEditMessage +
          '\n' +
          'Your chosen font for View/Print is: ' +
          fontViewMessage +
          '\n'
      );
    }
    const {
      customStyles,
      fontEdit,
      fontSize,
      fontView,
      useCodeMirror,
    } = this.state;
    this.props.onConfirm(
      { customStyles },
      { fontEdit },
      { fontSize },
      { fontView },
      { useCodeMirror }
    );
  };

  clearCustomStyles = () => {
    this.setState({
      customStyles: '',
    });
    const customStyles = document.getElementById(customStylesID);
    customStyles.value = '';
    customStyles.focus();
  };

  clearFontEdit = () => {
    this.setState({
      fontEdit: '',
    });
    const fontEdit = document.getElementById(fontEditID);
    fontEdit.value = '';
    fontEdit.focus();
  };

  clearFontSize = () => {
    this.setState({
      fontSize: '',
    });
    const fontSize = document.getElementById(fontSizeID);
    fontSize.value = '';
    fontSize.focus();
  };

  clearFontView = () => {
    this.setState({
      fontView: '',
    });
    const fontView = document.getElementById(fontViewID);
    fontView.value = '';
    fontView.focus();
  };

  clearUseCodeMirror = () => {
    this.setState({
      useCodeMirror: false,
    });
    const useCodeMirror = document.getElementById(useCodeMirrorID);
    useCodeMirror.value = true;
    useCodeMirror.focus();
  };

  clearAllSettings = () => {
    // We clear fontView before fontEdit so the focus afterwards is on fontEdit (the first setting)
    this.clearCustomStyles();
    this.clearFontView();
    this.clearFontEdit();
    this.clearFontSize();
    this.clearUseCodeMirror();
    const resetAllSettings = document.getElementById(resetAllSettingsID);
    if (resetAllSettings) {
      resetAllSettings.focus();
    }
  };

  onKeyDown = (e) => {
    this.props.keyMap.set(e.key, true);
    //console.log("Keys pressed: " + e.key + "KeyMap for key: " + keyMap.get(e.key)) + "KeyMap for Shift: " + keyMap.get('Shift');
    // Save settings if Control and 's' are pressed
    if (this.props.keyMap.get('Control') && this.props.keyMap.get('s')) {
      e.preventDefault();
      this.handleSubmit();
    }
    // Save settings if Control and Enter are pressed
    else if (
      this.props.keyMap.get('Control') &&
      this.props.keyMap.get('Enter')
    ) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  onKeyUp = (e) => {
    this.props.keyMap.set(e.key, false);
  };

  onBlur = (e) => {
    this.props.keyMap.clear();
  };

  componentWillUnmount = () => {
    this.props.keyMap.clear();
  };

  render() {
    //<h3>↶</h3>
    const { title, onCancel, confirmText, cancelText, helpLink } = this.props;
    return (
      <div tabIndex={0} className="sk-panel main settings" onBlur={this.onBlur}>
        <div className="sk-panel-content">
          <div className="sk-panel-section">
            <datalist id="fonts">
              ,
              <option
                value={
                  'SFMono-Regular, Consolas, Liberation Mono, Menlo, "Ubuntu Mono", courier, monospace;'
                }
              />
              <option value="Times New Roman" />
              <option value="Arial" />
              <option value="Arial Black" />
              <option value="-apple-system" />
              <option value="Bell MT" />
              <option value="Baskerville Old Face" />
              <option value="Bahnschrift Light" />
              <option value="BlinkMacSystemFont" />
              <option value="Bodoni MT" />
              <option value="Calibri" />
              <option value="Calibri Light" />
              <option value="Calisto MT" />
              <option value="Cambria" />
              <option value="Candara" />
              <option value="Candara Light" />
              <option value="Cantarell" />
              <option value="Centaur" />
              <option value="Century" />
              <option value="Century Gothic" />
              <option value="Comic Sans MS" />
              <option value="Consolas" />
              <option value="Constantia" />
              <option value="Courier New" />
              <option value="Corbel" />
              <option value="Corbel Light" />
              <option value="DengXian" />
              <option value="Ebrima" />
              <option value="Droid Sans" />
              <option value="Fira Sans" />
              <option value="Gabriola" />
              <option value="Garamond" />
              <option value="Georgia" />
              <option value="Helvetica" />
              <option value="Helvetica Neue" />
              <option value="Impact" />
              <option value="KaTeX_AMS" />
              <option value="KaTeX_Caligraphic" />
              <option value="KaTeX_Fraktur" />
              <option value="KaTeX_Main" />
              <option value="KaTeX_Math" />
              <option value="KaTeX_SansSerif" />
              <option value="KaTeX_Script" />
              <option value="KaTeX_Typewriter" />
              <option value="Lato" />
              <option value="Liberation Mono" />
              <option value="Lucida Caligraphy" />
              <option value="Lucida Sans" />
              <option value="Menlo" />
              <option value="Monaco" />
              <option value="Monospace" />
              <option value="New York" />
              <option value="Oxygen" />
              <option value="Palatino" />
              <option value="Roboto" />
              <option value="Sans-Serif" />
              <option value="Segoe UI" />
              <option value="SFMono-Regular" />
              <option value="Serif" />
              <option value="Sylfaen" />
              <option value="Tahoma" />
              <option value="Times New Roman" />
              <option value="Trebuchet MS" />
              <option value="Ubuntu" />
              <option value="Verdana" />
              <option value="Yu Gothic" />
            </datalist>
            <datalist id="fontSizes">
              <option value="8px" />
              <option value="9px" />
              <option value="10px" />
              <option value="11px" />
              <option value="12px" />
              <option value="13px" />
              <option value="14px" />
              <option value="15px" />
              <option value="16px" />
              <option value="17px" />
              <option value="18px" />
              <option value="19px" />
              <option value="20px" />
              <option value="21px" />
              <option value="22px" />
              <option value="23px" />
              <option value="24px" />
              <option value="25px" />
              <option value="26px" />
              <option value="27px" />
              <option value="28px" />
              <option value="29px" />
              <option value="30px" />
            </datalist>
            <div className="sk-panel-row">
              <div className="sk-h1">
                <h2>{title}</h2>
              </div>
              <button id="undoDialog" onClick={onCancel} title="Close">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2459 5.92917C15.5704 5.6047 15.5704 5.07864 15.2459 4.75417C14.9214 4.4297 14.3954 4.4297 14.0709 4.75417L10.0001 8.82501L5.92925 4.75417C5.60478 4.4297 5.07872 4.4297 4.75425 4.75417C4.42978 5.07864 4.42978 5.6047 4.75425 5.92917L8.82508 10L4.75425 14.0708C4.42978 14.3953 4.42978 14.9214 4.75425 15.2458C5.07872 15.5703 5.60478 15.5703 5.92925 15.2458L10.0001 11.175L14.0709 15.2458C14.3954 15.5703 14.9214 15.5703 15.2459 15.2458C15.5704 14.9214 15.5704 14.3953 15.2459 14.0708L11.1751 10L15.2459 5.92917Z"
                    fill={'var(--sn-stylekit-foreground-color)'}
                  />
                </svg>
              </button>
            </div>
            <div className="sk-panel-row">
              <div className="sk-h2">
                Need help? Check out the{' '}
                <a href={helpLink} target="_blank" rel="noopener">
                  documentation
                </a>
                . <br></br>For the default settings, click&nbsp;
                <button
                  onClick={this.clearAllSettings}
                  title="Reset all Settings"
                  id={resetAllSettingsID}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                      fill={'var(--sn-stylekit-foreground-color)'}
                    />
                  </svg>
                </button>
              </div>
            </div>
            <section className="sk-panel-row settings">
              <div className="sk-h2">Enable in-line formatting: </div>
              <div>
                <label>
                  <input
                    id="useCodeMirror"
                    name="useCodeMirror"
                    type="checkbox"
                    checked={this.state.useCodeMirror}
                    onChange={this.handleInputChange}
                  />
                </label>
                <button
                  onClick={this.clearUseCodeMirror}
                  title="Turn off in-line formatting"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                      fill={'var(--sn-stylekit-foreground-color)'}
                    />
                  </svg>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="sk-h2">
                <label for={fontSizeID}>Choose a base font size: </label>
              </div>
              <div>
                <input
                  list="fontSizes"
                  id={fontSizeID}
                  name={fontSizeID}
                  value={this.state.fontSize}
                  onChange={this.handleInputChange}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                />
                <button
                  onClick={this.clearFontSize}
                  title="Reset font size to 16px"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                      fill={'var(--sn-stylekit-foreground-color)'}
                    />
                  </svg>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="sk-h2">Choose a font for Edit/Append: </div>
              <div>
                <input
                  list="fonts"
                  id={fontEditID}
                  name={fontEditID}
                  value={this.state.fontEdit}
                  onChange={this.handleInputChange}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                />
                <button
                  onClick={this.clearFontEdit}
                  title="Reset font for Edit/Append"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                      fill={'var(--sn-stylekit-foreground-color)'}
                    />
                  </svg>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="sk-h2">Choose a font for View/Print: </div>
              <div>
                <input
                  list="fonts"
                  id={fontViewID}
                  name={fontViewID}
                  value={this.state.fontView}
                  onChange={this.handleInputChange}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                />
                <button
                  onClick={this.clearFontView}
                  title="Reset font for View/Print"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                      fill={'var(--sn-stylekit-foreground-color)'}
                    />
                  </svg>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="sk-h2">Add custom styles (CSS): </div>
            </section>
            <section className="sk-panel-row settings">
              <textarea
                id={customStylesID}
                name={customStylesID}
                className="sk-input contrast textarea"
                rows={this.props.rows}
                value={this.state.customStyles}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
              />
              <button
                onClick={this.clearCustomStyles}
                title="Reset custom styles"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
                    fill={'var(--sn-stylekit-foreground-color)'}
                  />
                </svg>
              </button>
            </section>
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
    );
  }
}
