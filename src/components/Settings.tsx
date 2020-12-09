import React from 'react';
import { MonacoEditor } from './Monaco';
import {
  DefaultSettings,
  EditingMode,
  useDynamicEditor,
  useMonacoEditor,
} from './AppendEditor';

const editingModeID = 'editingMode';
const fontEditID = 'fontEdit';
const fontSizeID = 'fontSize';
const fontViewID = 'fontView';
const useCodeMirrorID = 'useCodeMirror';

const usePlainTextID = 'usePlainText';
const monacoEditorLanguageID = 'monacoEditorLanguage';
const customStylesID = 'customStyles';
const resetAllSettingsID = 'resetAllSettings';
const saveAsDefaultID = 'saveAsDefault';

interface SettingsProps {
  defaultSettings: DefaultSettings;
  customStyles: string;
  editingMode: EditingMode;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  monacoEditorLanguage: string;
  useCodeMirror: boolean;

  useDynamicEditor: useDynamicEditor;
  useMonacoEditor: useMonacoEditor;

  cancelText: string;
  confirmText: string;
  debugMode: boolean;
  keyMap: Map<any, any>;
  onCancel: () => void;
  onConfirm: Function;
  title: string;
  helpLink: string;
}

interface SettingsState {
  customStyles: string;
  editingMode: EditingMode | any;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  monacoEditorLanguage: string;
  useCodeMirror: boolean;
  saveAsDefault: boolean;
  showCustomStyles: boolean;
  [x: string]: string | boolean;
}

const startRegExp = new RegExp(/```css\n/gm);
const cssRegExp = new RegExp(/```css/gm);
const endRegExp = new RegExp(/\n```/gm);
const codeRegExp = new RegExp(/```/gm);

export default class Settings extends React.Component<
  SettingsProps,
  SettingsState
> {
  constructor(props: SettingsProps) {
    super(props);
    let monacoEditorLanguage = 'markdown';
    if (this.props.monacoEditorLanguage) {
      monacoEditorLanguage = this.props.monacoEditorLanguage;
    }
    this.state = {
      customStyles: this.props.customStyles,
      editingMode: this.props.editingMode as any,
      fontEdit: this.props.fontEdit,
      fontSize: this.props.fontSize,
      fontView: this.props.fontView,
      monacoEditorLanguage,
      useCodeMirror: this.props.useCodeMirror,
      saveAsDefault: false,
      showCustomStyles: false, // false by default for a mobile-first experience
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    if (name === editingModeID) {
      if (value === this.props.useMonacoEditor) {
        this.setState({
          useCodeMirror: false,
          useMonacoEditor: true,
        });
      } else if (value === useCodeMirrorID) {
        this.setState({
          useCodeMirror: true,
          useMonacoEditor: false,
        });
      } else {
        this.setState({
          useCodeMirror: false,
          useMonacoEditor: false,
        });
      }
    }
    if (this.props.debugMode) {
      console.log(
        'Settings event name: ' +
          event.target.name +
          ' Value: ' +
          event.target.value
      );
    }
  };

  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (this.props.debugMode) {
          console.log(
            'Saved select. Name: ' +
              event.target.name +
              ' Value: ' +
              event.target.value
          );
        }
      }
    );
  };

  toggleShowCustomStyles = () => {
    this.setState({
      showCustomStyles: !this.state.showCustomStyles,
    });
  };

  cleanCustomStyles = (text: string) => {
    if (text) {
      return text
        .replace(startRegExp, '')
        .replace(cssRegExp, '')
        .replace(endRegExp, '')
        .replace(codeRegExp, '');
    } else {
      return text;
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
        'Settings.tsx handleSubmit() triggered: ' +
          '\n  - Settings fontEdit: ' +
          this.state.fontEdit +
          '\n  - Settings fontView: ' +
          this.state.fontView +
          '\n  - Your useMonacoEditor is: ' +
          this.state.useMonacoEditor +
          '\n  - Your useCodeMirror is: ' +
          this.state.useCodeMirror +
          '\n  - Your chosen font for Edit/Append is: ' +
          fontEditMessage +
          '\n  - Your chosen font for View/Print is: ' +
          fontViewMessage +
          '\n'
      );
    }
    this.setState(
      {
        // clean the custom styles prior to saving them
        customStyles: this.cleanCustomStyles(this.state.customStyles),
      },
      () => {
        if (this.props.debugMode) {
          console.log('Your custom styles: ' + this.state.customStyles);
        }
        const {
          customStyles,
          editingMode,
          fontEdit,
          fontSize,
          fontView,
          monacoEditorLanguage,
          saveAsDefault,
          useCodeMirror,
        } = this.state;
        this.props.onConfirm({
          customStyles,
          editingMode,
          fontEdit,
          fontSize,
          fontView,
          monacoEditorLanguage,
          saveAsDefault,
          useCodeMirror,
        });
      }
    );
  };

  loadDefaultSettings = () => {
    const defaultSettings = this.props.defaultSettings;
    this.setState(
      {
        ...defaultSettings,
      },
      () => {
        this.refreshCustomStyles();
      }
    );
  };

  refreshCustomStyles = () => {
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
  };

  clearCustomStyles = () => {
    this.setState(
      {
        customStyles: '',
      },
      () => {
        this.refreshCustomStyles();
        if (this.props.debugMode) {
          console.log('customStyles reset: ' + this.state.customStyles);
        }
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
    if (fontEdit) {
      fontEdit.value = '';
      fontEdit.focus();
    }
  };

  clearFontSize = () => {
    this.setState({
      fontSize: '',
    });
    const fontSize = document.getElementById(fontSizeID) as HTMLSelectElement;
    if (fontSize) {
      fontSize.value = '';
      fontSize.focus();
    }
  };

  clearFontView = () => {
    this.setState({
      fontView: '',
    });
    const fontView = document.getElementById(fontViewID) as HTMLTextAreaElement;
    if (fontView) {
      fontView.value = '';
      fontView.focus();
    }
  };

  clearEditingMode = () => {
    this.setState({
      editingMode: usePlainTextID,
      useCodeMirror: false,
    });
  };

  clearMonacoEditorLanguage = () => {
    this.setState({
      monacoEditorLanguage: 'markdown',
    });
    const monacoEditorLanguage = document.getElementById(
      monacoEditorLanguageID
    ) as HTMLSelectElement;
    if (monacoEditorLanguage) {
      monacoEditorLanguage.value = 'markdown';
      monacoEditorLanguage.focus();
    }
  };

  clearSaveAsDefault = () => {
    this.setState({
      saveAsDefault: false,
    });
    const saveAsDefault = document.getElementById(
      saveAsDefaultID
    ) as HTMLInputElement;
    saveAsDefault.checked = false;
    saveAsDefault.focus();
  };

  clearAllSettings = () => {
    // We clear from bottom settings to top settings so the focus afterwards is on top
    this.clearSaveAsDefault();
    this.clearCustomStyles();
    this.clearFontView();
    this.clearFontEdit();
    this.clearFontSize();
    this.clearMonacoEditorLanguage();
    this.clearEditingMode();
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
    return (
      <div id="settings" className="sk-panel main settings">
        <div className="sk-panel-content">
          <div className="sk-panel-section">
            <datalist id="fonts">
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
            <div className="sk-panel-row title-section">
              <h1>{title}</h1>
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
            <section className="sk-panel-row settings">
              <div className="text-and-undo-button">
                <p>
                  Need help? Check out the{' '}
                  <a href={helpLink} target="_blank" rel="noopener noreferrer">
                    documentation
                  </a>
                  . To clear all settings, click undo:&nbsp;
                </p>
                <button
                  onClick={this.clearAllSettings}
                  title="Reset all Settings"
                  id={resetAllSettingsID}
                >
                  <span className="undo-button">
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
                  </span>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="text-and-undo-button">
                <p>To load your personal default settings, click:&nbsp;</p>
                <button
                  onClick={this.loadDefaultSettings}
                  title="Load personal default settings"
                >
                  <span className="undo-button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99992 14.9999C8.67384 14.9999 7.40207 14.4731 6.46438 13.5355C5.5267 12.5978 4.99992 11.326 4.99992 9.99992C4.99992 9.16658 5.20825 8.35825 5.58325 7.66658L4.36659 6.44992C3.71659 7.47492 3.33325 8.69158 3.33325 9.99992C3.33325 11.768 4.03563 13.4637 5.28587 14.714C6.53612 15.9642 8.23181 16.6666 9.99992 16.6666V19.1666L13.3333 15.8332L9.99992 12.4999V14.9999ZM9.99992 3.33325V0.833252L6.66658 4.16658L9.99992 7.49992V4.99992C11.326 4.99992 12.5978 5.5267 13.5355 6.46438C14.4731 7.40207 14.9999 8.67383 14.9999 9.99992C14.9999 10.8333 14.7916 11.6416 14.4166 12.3333L15.6333 13.5499C16.2833 12.5249 16.6666 11.3083 16.6666 9.99992C16.6666 8.23181 15.9642 6.53612 14.714 5.28587C13.4637 4.03563 11.768 3.33325 9.99992 3.33325Z"
                        fill={'var(--sn-stylekit-foreground-color)'}
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="text-and-undo-button">
                <p>Editing Mode: </p>
                <button
                  onClick={this.clearEditingMode}
                  title="Reset Editing Mode to Plain Textarea"
                >
                  <span className="undo-button">
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
                  </span>
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={usePlainTextID}
                  name={editingModeID}
                  value={usePlainTextID}
                  className="radio"
                  type="radio"
                  checked={
                    this.state.editingMode === usePlainTextID ||
                    this.state.editingMode === undefined
                  }
                  onChange={this.handleInputChange}
                />
                Plain Textarea: no formatting (default, mobile recommended)
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={useCodeMirrorID}
                  name={editingModeID}
                  value={useCodeMirrorID}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === useCodeMirrorID ||
                    this.state.useCodeMirror
                  }
                  onChange={this.handleInputChange}
                />
                CodeMirror: in-line formatting for Markdown
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={this.props.useDynamicEditor}
                  name={editingModeID}
                  value={this.props.useDynamicEditor}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === this.props.useDynamicEditor
                  }
                  onChange={this.handleInputChange}
                />
                Dynamic: live formatting for Markdown. <b>warning: </b>
                existing markdown may break (not compatible with KaTeX, lists
                may not render properly; desktop and mobile compatible)
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label htmlFor={this.props.useMonacoEditor}>
                <input
                  id={this.props.useMonacoEditor}
                  name={editingModeID}
                  value={this.props.useMonacoEditor}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === this.props.useMonacoEditor
                  }
                  onChange={this.handleInputChange}
                />
                Monaco: syntax highlighting for Markdown and many other
                programming languages, intelligent auto-completion,
                sophisticated search and replace (desktop recommended)
              </label>
            </section>
            {this.state.editingMode === this.props.useMonacoEditor && [
              <section className="sk-panel-row settings">
                <label htmlFor={monacoEditorLanguageID}>
                  Monaco Editor Language:{' '}
                </label>
                <div>
                  <label>
                    <select
                      id={monacoEditorLanguageID}
                      name={monacoEditorLanguageID}
                      value={this.state.monacoEditorLanguage}
                      onChange={this.handleSelectChange}
                    >
                      <option>abap</option>
                      <option>aes</option>
                      <option>apex</option>
                      <option>azcli</option>
                      <option>bat</option>
                      <option>c</option>
                      <option>cameligo</option>
                      <option>clojure</option>
                      <option>coffeescript</option>
                      <option>cpp</option>
                      <option>csharp</option>
                      <option>csp</option>
                      <option>css</option>
                      <option>dart</option>
                      <option>dockerfile</option>
                      <option>fsharp</option>
                      <option>go</option>
                      <option>graphql</option>
                      <option>handlebars</option>
                      <option>hcl</option>
                      <option>html</option>
                      <option>ini</option>
                      <option>java</option>
                      <option>javascript</option>
                      <option>json</option>
                      <option>julia</option>
                      <option>kotlin</option>
                      <option>less</option>
                      <option>lexon</option>
                      <option>lua</option>
                      <option>markdown</option>
                      <option>mips</option>
                      <option>msdax</option>
                      <option>mysql</option>
                      <option>objective-c</option>
                      <option>pascal</option>
                      <option>pascaligo</option>
                      <option>perl</option>
                      <option>pgsql</option>
                      <option>php</option>
                      <option>plaintext</option>
                      <option>postiats</option>
                      <option>powerquery</option>
                      <option>powershell</option>
                      <option>pug</option>
                      <option>python</option>
                      <option>r</option>
                      <option>razor</option>
                      <option>redis</option>
                      <option>redshift</option>
                      <option>restructuredtext</option>
                      <option>ruby</option>
                      <option>rust</option>
                      <option>sb</option>
                      <option>scala</option>
                      <option>scheme</option>
                      <option>scss</option>
                      <option>shell</option>
                      <option>sol</option>
                      <option>sql</option>
                      <option>st</option>
                      <option>swift</option>
                      <option>systemverilog</option>
                      <option>tcl</option>
                      <option>twig</option>
                      <option>typescript</option>
                      <option>vb</option>
                      <option>verilog</option>
                      <option>xml</option>
                      <option>yaml</option>
                    </select>
                  </label>
                  <button
                    onClick={this.clearMonacoEditorLanguage}
                    title="Reset Monaco Editor Language to Markdown"
                  >
                    <span className="undo-button">
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
                    </span>
                  </button>
                </div>
              </section>,
            ]}
            <section className="sk-panel-row settings">
              <label htmlFor={fontSizeID}>Choose a base font size: </label>
              <div>
                <select
                  id={fontSizeID}
                  name={fontSizeID}
                  value={this.state.fontSize}
                  onChange={this.handleSelectChange}
                >
                  <option></option>
                  <option>12px</option>
                  <option>13px</option>
                  <option>14px</option>
                  <option>15px</option>
                  <option>16px</option>
                  <option>17px</option>
                  <option>18px</option>
                  <option>19px</option>
                  <option>20px</option>
                  <option>21px</option>
                  <option>22px</option>
                  <option>23px</option>
                  <option>24px</option>
                  <option>25px</option>
                  <option>26px</option>
                  <option>27px</option>
                  <option>28px</option>
                  <option>29px</option>
                  <option>30px</option>
                </select>
                <button
                  onClick={this.clearFontSize}
                  title="Reset font size to 16px"
                >
                  <span className="undo-button">
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
                  </span>
                </button>
              </div>
            </section>
            {this.state.editingMode !== this.props.useMonacoEditor && [
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
                    type="text"
                  />
                  <button
                    onClick={this.clearFontEdit}
                    title="Reset font for Edit/Append"
                  >
                    <span className="undo-button">
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
                    </span>
                  </button>
                </div>
              </section>,
            ]}
            {this.state.editingMode !== this.props.useDynamicEditor && [
              <section className="sk-panel-row settings">
                <label htmlFor={fontViewID}>
                  Choose a font for View/Print:{' '}
                </label>
                <div>
                  <input
                    list="fonts"
                    id={fontViewID}
                    name={fontViewID}
                    value={this.state.fontView}
                    onChange={this.handleInputChange}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                    type="text"
                  />
                  <button
                    onClick={this.clearFontView}
                    title="Reset font for View/Print"
                  >
                    <span className="undo-button">
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
                    </span>
                  </button>
                </div>
              </section>,
            ]}
            <section className="sk-panel-row settings">
              <button
                className="toggle-button"
                onClick={this.toggleShowCustomStyles}
              >
                {this.state.showCustomStyles ? (
                  <span className="chevron-button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.17622 7.15015L10.0012 10.9751L13.8262 7.15015L15.0012 8.33348L10.0012 13.3335L5.00122 8.33348L6.17622 7.15015Z"
                        fill={'var(--sn-stylekit-foreground-color)'}
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="chevron-button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.90918 14.0667L10.7342 10.2417L6.90918 6.4167L8.09251 5.2417L13.0925 10.2417L8.09251 15.2417L6.90918 14.0667Z"
                        fill={'var(--sn-stylekit-foreground-color)'}
                      />
                    </svg>
                  </span>
                )}
                <p className={'button-caption'}>Add custom styles (CSS):</p>
              </button>
              {this.state.showCustomStyles && [
                <div className="text-and-undo-button">
                  <button
                    onClick={this.clearCustomStyles}
                    title="Reset custom styles (CSS)"
                  >
                    <span className="undo-button">
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
                    </span>
                  </button>
                </div>,
              ]}
            </section>
            {this.state.showCustomStyles && [
              <section className="sk-panel-row settings">
                <MonacoEditor
                  tabSize={2}
                  language="css"
                  text={this.state.customStyles}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                  saveText={this.saveText}
                />
              </section>,
            ]}
            <section className="sk-panel-row settings">
              <label htmlFor={saveAsDefaultID}>
                Save these settings as your personal default:{' '}
              </label>
              <div>
                <label>
                  <input
                    id={saveAsDefaultID}
                    name={saveAsDefaultID}
                    type="checkbox"
                    checked={this.state.saveAsDefault}
                    onChange={this.handleInputChange}
                  />
                </label>
                <button
                  onClick={this.clearSaveAsDefault}
                  title="Clear save as default"
                >
                  <span className="undo-button">
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
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
        <div className="sk-panel-footer">
          <div className="sk-button-group stretch">
            <button className="sk-button neutral" onClick={onCancel}>
              <div>{cancelText}</div>
            </button>
            <button className="sk-button info" onClick={this.handleSubmit}>
              <div>{confirmText}</div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
