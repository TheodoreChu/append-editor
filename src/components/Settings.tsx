import React from 'react';
import { MonacoEditor } from './Monaco';
import {
  DefaultSettings,
  EditingModes,
  SaveSettingsInterface,
} from './AppendEditor';
import { CloseIcon, RefreshIcon } from './Icons';
import { ChevronToggleButton, UndoButton } from './Buttons';

const customStylesID = 'customStyles';
const editingModeID = 'editingMode';
const fontEditID = 'fontEdit';
const fontSizeID = 'fontSize';
const fontViewID = 'fontView';
const monacoEditorLanguageID = 'monacoEditorLanguage';
const resetAllSettingsID = 'resetAllSettings';
const saveAsDefaultID = 'saveAsDefault';

interface SettingsProps {
  defaultSettings: DefaultSettings;
  customStyles: string;
  editingMode?: string;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  monacoEditorLanguage: string;
  cancelText: string;
  confirmText: string;
  debugMode: boolean;
  keyMap: Map<any, any>;
  onCancel: () => void;
  onConfirm: (object: SaveSettingsInterface) => void;
  title: string;
  helpLink: string;
}

interface SettingsState {
  customStyles: string;
  editingMode: string;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  monacoEditorLanguage: string;
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
    let editingMode = 'usePlainText';
    if (this.props.editingMode) {
      editingMode = this.props.editingMode;
    }
    this.state = {
      customStyles: this.props.customStyles,
      editingMode,
      fontEdit: this.props.fontEdit,
      fontSize: this.props.fontSize,
      fontView: this.props.fontView,
      monacoEditorLanguage,
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
          '\n  - Settings editingMode: ' +
          this.state.editingMode +
          '\n  - Settings fontEdit: ' +
          this.state.fontEdit +
          '\n  - Settings fontView: ' +
          this.state.fontView +
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
        } = this.state;
        this.props.onConfirm({
          customStyles,
          editingMode,
          fontEdit,
          fontSize,
          fontView,
          monacoEditorLanguage,
          saveAsDefault,
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
      editingMode: EditingModes.usePlainText,
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
                <CloseIcon role="button" />
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
                <UndoButton
                  onClick={this.clearAllSettings}
                  title="Reset all Settings"
                  id={resetAllSettingsID}
                />
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="text-and-undo-button">
                <p>To load your personal default settings, click:&nbsp;</p>
                <button
                  onClick={this.loadDefaultSettings}
                  title="Load personal default settings"
                >
                  <RefreshIcon role="button" />
                </button>
              </div>
            </section>
            <section className="sk-panel-row settings">
              <div className="text-and-undo-button">
                <p>Editing Mode: </p>
                <UndoButton
                  onClick={this.clearEditingMode}
                  title="Reset Editing Mode to Plain Textarea"
                />
              </div>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={EditingModes.usePlainText}
                  name={editingModeID}
                  value={EditingModes.usePlainText}
                  className="radio"
                  type="radio"
                  checked={this.state.editingMode === EditingModes.usePlainText}
                  onChange={this.handleInputChange}
                />
                Plain Textarea: no formatting (default, mobile recommended)
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={EditingModes.useCodeMirror}
                  name={editingModeID}
                  value={EditingModes.useCodeMirror}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === EditingModes.useCodeMirror
                  }
                  onChange={this.handleInputChange}
                />
                CodeMirror: in-line formatting for Markdown
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label>
                <input
                  id={EditingModes.useDynamicEditor}
                  name={editingModeID}
                  value={EditingModes.useDynamicEditor}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === EditingModes.useDynamicEditor
                  }
                  onChange={this.handleInputChange}
                />
                Dynamic: live formatting for Markdown. <b>warning: </b>
                existing markdown may break (not compatible with KaTeX, lists
                may not render properly; desktop and mobile compatible)
              </label>
            </section>
            <section className="sk-panel-row settings">
              <label htmlFor={EditingModes.useMonacoEditor}>
                <input
                  id={EditingModes.useMonacoEditor}
                  name={editingModeID}
                  value={EditingModes.useMonacoEditor}
                  type="radio"
                  className="radio"
                  checked={
                    this.state.editingMode === EditingModes.useMonacoEditor
                  }
                  onChange={this.handleInputChange}
                />
                Monaco: syntax highlighting for Markdown and many other
                programming languages, intelligent auto-completion,
                sophisticated search and replace (desktop recommended)
              </label>
            </section>
            {this.state.editingMode === EditingModes.useMonacoEditor && [
              <section className="sk-panel-row settings">
                <label htmlFor={monacoEditorLanguageID}>
                  Monaco Editor Language:{' '}
                </label>
                <div className="input-and-undo-button">
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
                  <UndoButton
                    onClick={this.clearMonacoEditorLanguage}
                    title="Reset Monaco Editor Language to Markdown"
                  />
                </div>
              </section>,
            ]}
            <section className="sk-panel-row settings">
              <label htmlFor={fontSizeID}>Choose a base font size: </label>
              <div className="input-and-undo-button">
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
                <UndoButton
                  onClick={this.clearFontSize}
                  title="Reset font size to 16px"
                />
              </div>
            </section>
            {this.state.editingMode !== EditingModes.useMonacoEditor && [
              <section className="sk-panel-row settings">
                <label htmlFor={fontEditID}>
                  Choose a font for Edit/Append:{' '}
                </label>
                <div className="input-and-undo-button">
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
                  <UndoButton
                    onClick={this.clearFontEdit}
                    title="Reset font for Edit/Append"
                  />
                </div>
              </section>,
            ]}
            {this.state.editingMode !== EditingModes.useDynamicEditor && [
              <section className="sk-panel-row settings">
                <label htmlFor={fontViewID}>
                  Choose a font for View/Print:{' '}
                </label>
                <div className="input-and-undo-button">
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
                  <UndoButton
                    onClick={this.clearFontView}
                    title="Reset font for View/Print"
                  />
                </div>
              </section>,
            ]}
            <section className="sk-panel-row settings">
              <ChevronToggleButton
                caption={'Add custom styles (CSS):'}
                className="chevron-toggle-button"
                condition={this.state.showCustomStyles}
                onClick={this.toggleShowCustomStyles}
                title={'Toggle show add custom styles (CSS)'}
              />
              {this.state.showCustomStyles && [
                <div className="text-and-undo-button">
                  <UndoButton
                    onClick={this.clearCustomStyles}
                    title="Reset custom styles (CSS)"
                  />
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
              <div className="input-and-undo-button">
                <label>
                  <input
                    id={saveAsDefaultID}
                    name={saveAsDefaultID}
                    type="checkbox"
                    checked={this.state.saveAsDefault}
                    onChange={this.handleInputChange}
                  />
                </label>
                <UndoButton
                  onClick={this.clearSaveAsDefault}
                  title="Clear save as default"
                />
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
