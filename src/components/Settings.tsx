import React from 'react';
import { AppendInterface } from './AppendEditor';
import { MonacoEditor } from './Monaco';

const fontEditID = 'fontEdit';
const fontSizeID = 'fontSize';
const fontViewID = 'fontView';
const useCodeMirrorID = 'useCodeMirror';
const useMonacoEditorID = 'useMonacoEditor';
const customStylesID = 'customStyles';
const resetAllSettingsID = 'resetAllSettings';

interface PropsState extends AppendInterface {
  onConfirm: Function;
  /* For passing to child components */
  debugMode: boolean;
  keyMap: any;
  onCancel: any;
  title: string;
  helpLink: string;
  confirmText: string;
  cancelText: string;
}

interface ChildState {
  customStyles: string;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  useCodeMirror: boolean;
  showCustomStyles: boolean;
  useMonacoEditor: boolean;
  [x: string]: string | boolean;
}

export default class Settings extends React.Component<any, ChildState> {
  constructor(props: PropsState) {
    super(props);
    this.state = {
      customStyles: this.props.customStyles,
      fontEdit: this.props.fontEdit,
      fontSize: this.props.fontSize,
      fontView: this.props.fontView,
      useCodeMirror: this.props.useCodeMirror,
      useMonacoEditor: this.props.useMonacoEditor,
      showCustomStyles: true,
    };
    //this.handleInputChange = this.handleInputChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    if (this.props.debugMode) {
      console.log('Settings event name: ' + event.target.name);
    }
  };

  saveText = (text: string) => {
    this.setState({
      customStyles: text,
    });
  };

  handleSubmit = () => {
    if (this.props.debugMode) {
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
      useMonacoEditor,
    } = this.state;
    this.props.onConfirm(
      { customStyles },
      { fontEdit },
      { fontSize },
      { fontView },
      { useCodeMirror },
      { useMonacoEditor }
    );
  };

  clearCustomStyles = () => {
    this.setState(
      {
        customStyles: '```css\n\n\n\n```',
      },
      () => {
        this.setState(
          {
            showCustomStyles: !this.state.showCustomStyles,
          },
          () => {
            this.setState({
              showCustomStyles: !this.state.showCustomStyles,
            });
          }
        );
      }
    );
    const customStyles = document.getElementById(
      customStylesID
    ) as HTMLTextAreaElement;
    if (customStyles) {
      customStyles.value = '';
      customStyles.focus();
    }
  };

  clearFontEdit = () => {
    this.setState({
      fontEdit: '',
    });
    const fontEdit = document.getElementById(fontEditID) as HTMLTextAreaElement;
    fontEdit.value = '';
    fontEdit.focus();
  };

  clearFontSize = () => {
    this.setState({
      fontSize: '',
    });
    const fontSize = document.getElementById(fontSizeID) as HTMLTextAreaElement;
    fontSize.value = '';
    fontSize.focus();
  };

  clearFontView = () => {
    this.setState({
      fontView: '',
    });
    const fontView = document.getElementById(fontViewID) as HTMLTextAreaElement;
    fontView.value = '';
    fontView.focus();
  };

  clearUseCodeMirror = () => {
    this.setState({
      useCodeMirror: false,
    });
    const useCodeMirror = document.getElementById(
      useCodeMirrorID
    ) as HTMLInputElement;
    useCodeMirror.checked = false;
    useCodeMirror.focus();
  };

  clearUseMonacoEditor = () => {
    this.setState({
      useMonacoEditor: false,
    });
    const useMonacoEditor = document.getElementById(
      useMonacoEditorID
    ) as HTMLInputElement;
    useMonacoEditor.checked = false;
    useMonacoEditor.focus();
  };

  clearAllSettings = () => {
    // We clear from bottom settings to top settings so the focus afterwards is on top
    this.clearCustomStyles();
    this.clearFontView();
    this.clearFontEdit();
    this.clearFontSize();
    this.clearUseMonacoEditor();
    this.clearUseCodeMirror();
    const resetAllSettings = document.getElementById(resetAllSettingsID);
    if (resetAllSettings) {
      resetAllSettings.focus();
    }
  };

  onKeyDown = (e: React.KeyboardEvent) => {
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

  onKeyUp = (e: React.KeyboardEvent) => {
    this.props.keyMap.set(e.key, false);
  };

  onBlur = (e: React.FocusEvent) => {
    this.props.keyMap.clear();
  };

  componentWillUnmount = () => {
    this.props.keyMap.clear();
  };

  render() {
    //<h3>↶</h3>
    const { title, onCancel, confirmText, cancelText, helpLink } = this.props;
    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = `    require.config({ paths: { vs: 'monaco-editor/min/vs' } });

    require(['vs/editor/editor.main'], function () {
      const originalModel = monaco.editor.createModel(
        'heLLo world!',
        'python'
      );
      const modifiedModel = monaco.editor.createModel(
        'hello orlando!',
        'python'
      );
      var diffEditor = monaco.editor.createDiffEditor(document.getElementById('diff-container'));
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    });`;
    const styleElement = document.createElement('div');
    styleElement.setAttribute('id', 'diff-container');
    styleElement.setAttribute(
      'style',
      'width: 800px; height: 600px; border: 1px solid grey'
    );
    document.body.appendChild(styleElement);
    document.head.appendChild(scriptElement);
    return (
      <div id="settings" className="sk-panel main settings">
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
              <div>
                <h1>{title}</h1>
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
              <div>
                Need help? Check out the{' '}
                <a href={helpLink} target="_blank" rel="noopener noreferrer">
                  documentation
                </a>
                . For the default settings, click undo:&nbsp;
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
              <label htmlFor={useMonacoEditorID}>
                Enable in-line formatting with Monaco:{' '}
              </label>
              <div>
                <label>
                  <input
                    id={useMonacoEditorID}
                    name={useMonacoEditorID}
                    type="checkbox"
                    checked={this.state.useMonacoEditor}
                    onChange={this.handleInputChange}
                  />
                </label>
                <button
                  onClick={this.clearUseMonacoEditor}
                  title="Turn off Monaco Editor"
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
              <label htmlFor={useCodeMirrorID}>
                Enable in-line formatting with CodeMirror:{' '}
              </label>
              <div>
                <label>
                  <input
                    id={useCodeMirrorID}
                    name={useCodeMirrorID}
                    type="checkbox"
                    checked={this.state.useCodeMirror}
                    onChange={this.handleInputChange}
                  />
                </label>
                <button
                  onClick={this.clearUseCodeMirror}
                  title="Turn off CodeMirror"
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
              <label htmlFor={fontSizeID}>Choose a base font size: </label>
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
              <label htmlFor={fontEditID}>
                Choose a font for Edit/Append:{' '}
              </label>
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
              <label htmlFor={fontViewID}>Choose a font for View/Print: </label>
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
              <div>
                Add custom styles (CSS) between <code>```css</code> and{' '}
                <code>```</code>: &nbsp;
                <button
                  onClick={this.clearCustomStyles}
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
              {!this.state.showCustomStyles && (
                <MonacoEditor
                  tabSize={2}
                  text={this.state.customStyles}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                  saveText={this.saveText}
                />
              )}
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
