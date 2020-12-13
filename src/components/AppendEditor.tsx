import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import PrintDialog from './PrintDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';
import Settings from './Settings';
import { MonacoDiffEditor } from './Monaco';
import ErrorBoundary from './ErrorBoundary';
import Menu from './Menu';

import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/gfm/gfm';

// CodeMirror addons

// For markdown
import 'codemirror/addon/edit/continuelist';

// For search
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';

// For styling selected text
import 'codemirror/addon/selection/mark-selection';
import {
  EyeIcon,
  GearIcon,
  HelpIcon,
  MenuIcon,
  PencilIcon,
  PlusIcon,
} from './Icons';

import { isLongString, renderLongMarkdown } from '../lib/renderMarkdown';

export enum HtmlElementId {
  appendButton = 'appendButton',
  appendTextArea = 'appendTextArea',
  appendix = 'appendix',
  content = 'content',
  editButton = 'editButton',
  editTextArea = 'editTextArea',
  header = 'header',
  helpButton = 'helpButton',
  menuButton = 'menuButton',
  newLine = 'newLine',
  newParagraph = 'newParagraph',
  printButton = 'printButton',
  settingsButton = 'settingsButton',
  view = 'view',
  viewButton = 'viewButton',
}

export enum HtmlClassName {
  fixed = 'fixed',
  fixedHeader = 'fixed-header',
}

export enum EditingModes {
  usePlainText = 'usePlainText',
  useCodeMirror = 'useCodeMirror',
  useDynamicEditor = 'useDynamicEditor',
  useMonacoEditor = 'useMonacoEditor',
}

export type DefaultSettings = {
  customStyles: string;
  editingMode: string;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  monacoEditorLanguage: string;
};

export interface SaveSettingsInterface extends DefaultSettings {
  saveAsDefault: boolean;
}

export type menuOptions = {
  borderlessMode?: boolean;
  fixedHeightMode?: boolean;
  fullWidthMode?: boolean;
  overflowMode?: boolean;
  showMenuOptionsEdit?: boolean;
  showMenuOptionsShare?: boolean;
  showMenuOptionsView?: boolean;
};

export interface AppendInterface {
  text: string;
  appendCodeMirror?: any;
  appendNewLine: boolean;
  appendNewParagraph: boolean;
  appendMode: boolean;
  appendRows: number;
  appendText: string;
  borderlessMode?: boolean;
  bypassDebounce: boolean;
  confirmPrintUrl: boolean;
  currentState?: object;
  customStyles: string;
  defaultSettings: DefaultSettings;
  editMode?: any;
  editingMode?: string;
  editCodeMirror?: any;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  fixedHeightMode?: boolean;
  fullWidthMode?: boolean;
  overflowMode?: boolean;
  keyMap?: Object;
  monacoEditorLanguage: string;
  printURL: boolean;
  refreshEdit: boolean;
  refreshView: boolean;
  saveAsDefault?: boolean;
  savingEditorOptions?: boolean;
  showAppendix: boolean;
  showDiff: boolean;
  showHeader: boolean;
  showHelp: boolean;
  showMenu?: boolean;
  showMenuOptionsEdit?: boolean;
  showMenuOptionsShare?: boolean;
  showMenuOptionsView?: boolean;
  settingsMode: boolean;
  viewMode?: boolean;
}

/**
 * Some properties are optional so
 * they do not need to be set
 * when switching between notes.
 */

const initialState = {
  text: '',
  appendNewLine: false,
  appendNewParagraph: false,
  appendMode: false,
  appendRows: 8,
  appendText: '',
  bypassDebounce: false, // We keep this as false in initialState so debounce works in the demo
  confirmPrintUrl: false,
  customStyles: '',
  defaultSettings: {
    customStyles: '',
    editingMode: 'usePlainText',
    fontEdit: '',
    fontSize: '',
    fontView: '',
    monacoEditorLanguage: 'markdown',
  },
  fontEdit: '',
  fontSize: '',
  fontView: '',
  monacoEditorLanguage: 'markdown',
  printURL: true,
  refreshEdit: false,
  refreshView: false,
  showAppendix: true,
  showHeader: true,
  showHelp: false,
  showDiff: false,
  settingsMode: false,
};

let last_known_scroll_position = 0;

const debugMode = false;

let keyMap = new Map();

export default class AppendEditor extends React.Component<{}, AppendInterface> {
  editorKit: any;
  refreshEditorTimer: NodeJS.Timeout | undefined;
  saveTimer: NodeJS.Timeout | undefined;

  constructor(props: AppendInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  /**
   * This loads the first time the editor is loaded
   * This does not load every time a new note is loaded */
  componentDidMount = () => {
    if (debugMode) {
      console.log('AppendEditor.tsx: \n - this.componentDidMount() triggered');
    }
    this.onViewMode();
    this.loadDefaultMenuState();
    document.addEventListener('scroll', this.onScroll);
  };

  componentWillUnmount = () => {
    document.removeEventListener('scroll', this.onScroll);
  };

  configureEditorKit = () => {
    if (debugMode) {
      console.log('AppendEditor.tsx: \n - this.configureEditorKit() triggered');
    }
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded
       * We turn bypassDebounce to true so
       * the editor always renders the markdown for the latest note
       */
      setEditorRawText: (text: string) => {
        this.setState(
          {
            ...initialState,
            bypassDebounce: true,
            text,
          },
          () => {
            if (debugMode) {
              console.log(
                '#################################################################################\n' +
                  'AppendEditor.tsx:',
                '\n - loaded text:',
                text +
                  '\n - this.configureEditorKit() callback triggered:' +
                  '\n - this.state.savingsDefaultSettings: ' +
                  this.state.savingEditorOptions +
                  '\n - this.state: ' +
                  JSON.stringify(this.state, null, ' ')
              );
            }
            /** Clear the debounce from the previous note and componentDidMount
             * Then call and flush the debounce so the correct markdown will render
             * the first time after turning the bypass off */
            isLongString.cancel();
            isLongString(text);
            isLongString.flush();
            renderLongMarkdown.cancel();
            if (isLongString(text)) {
              renderLongMarkdown(text);
              renderLongMarkdown.flush();
            }
            /** This prevents metadata from loading when saving editor options or default settings */
            if (!this.state.savingEditorOptions) {
              this.loadEditorOptions();
              this.loadDefaultSettings();
              this.loadMetaData();
            }
            /** Turn the debounce bypass off
             * This loads every time, even when saving editor options or default settings
             * because bypassDebounce is set to true every time
             */
            setTimeout(() => {
              this.setState({
                bypassDebounce: false,
              });
            }, 1000);
          }
        );
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'plaintext',
      supportsFilesafe: false,
    });
  };

  /** Expect this to run three times when loading a note:
   * once when loading editor options,
   * once when loading default settings, and
   * once when loading meta data
   * Use the timer to prevent the function from being executed when it is called
   * repeatedly, as when loading a note or saving a menu option */
  refreshEditor = () => {
    if (isLongString(this.state.text)) {
      if (this.refreshEditorTimer) {
        clearTimeout(this.refreshEditorTimer);
      }
      this.refreshEditorTimer = setTimeout(() => {
        if (!this.state.savingEditorOptions) {
          this.refreshEdit();
          this.refreshView();
          this.activateStyles();
        }
      }, 20);
    } else {
      if (this.refreshEditorTimer) {
        clearTimeout(this.refreshEditorTimer);
      }
      this.refreshEditorTimer = setTimeout(() => {
        if (!this.state.savingEditorOptions) {
          this.refreshEdit();
          this.refreshView();
          this.activateStyles();
        }
      }, 10);
    }
  };

  loadDefaultSettings = () => {
    try {
      const defaultSettingsString = this.editorKit.internal.componentManager.componentDataValueForKey(
        'defaultSettings'
      );
      const defaultEditingMode = this.editorKit.internal.componentManager.componentDataValueForKey(
        'editingMode'
      );
      if (debugMode) {
        console.log(
          'AppendEditor.tsx: \n loadDefaultSetting() default settings loaded: ' +
            '\n  - defaultSettingsString: ' +
            defaultSettingsString,
          '\n    - typeof:',
          typeof defaultSettingsString,
          '\n  - defaultEditingMode:',
          defaultEditingMode,
          '\n    - typeof:',
          typeof defaultEditingMode
        );
      }
      if (typeof defaultSettingsString !== 'undefined') {
        const defaultSettingsObject = JSON.parse(
          defaultSettingsString
        ) as DefaultSettings;
        if (debugMode) {
          console.log(
            'AppendEditor.tsx: \n loadDefaultSetting():',
            'if (defaultSettingsString !== undefined) triggered',
            '\n    - typeof defaultSettings:',
            typeof defaultSettingsObject
          );
        }
        this.setState(
          {
            customStyles: defaultSettingsObject.customStyles,
            editingMode: defaultSettingsObject.editingMode,
            fontEdit: defaultSettingsObject.fontEdit,
            fontSize: defaultSettingsObject.fontSize,
            fontView: defaultSettingsObject.fontView,
            monacoEditorLanguage: defaultSettingsObject.monacoEditorLanguage,
            defaultSettings: defaultSettingsObject,
          },
          () => {
            if (debugMode) {
              console.log(
                'AppendEditor.tsx: \n - loadDefaultSettings() this.state.savingEditorOptions: ' +
                  this.state.savingEditorOptions +
                  '\n defaultSettingsObject:',
                defaultSettingsObject,
                '\n JSON.stringify(this.state.defaultSettings):',
                JSON.stringify(this.state.defaultSettings, null, ' ')
              );
            }
            this.refreshEditor();
          }
        );
      } else if (defaultEditingMode !== undefined) {
        /** This else if loads legacy default settings introduced in v1.1.0
         * We only need to check defaultEditingMode because it is never empty if it is defined
         * */
        const defaultCustomStyles = this.editorKit.internal.componentManager.componentDataValueForKey(
          'customStyles'
        );
        const defaultFontEdit = this.editorKit.internal.componentManager.componentDataValueForKey(
          'fontEdit'
        );
        const defaultFontSize = this.editorKit.internal.componentManager.componentDataValueForKey(
          'fontSize'
        );
        const defaultFontView = this.editorKit.internal.componentManager.componentDataValueForKey(
          'fontView'
        );
        const defaultMonacoEditorLanguage = this.editorKit.internal.componentManager.componentDataValueForKey(
          'monacoEditorLanguage'
        );
        if (debugMode) {
          console.log(
            'AppendEditor.tsx: \n loadDefaultSetting():',
            'else if (defaultEditingMode !== undefined) triggered',
            '\n  - default customStyles: ' + defaultCustomStyles,
            '\n    - typeof:',
            typeof defaultCustomStyles +
              '\n  - default fontSize: ' +
              defaultFontSize +
              '\n  - default fontEdit: ' +
              defaultFontEdit +
              '\n  - default fontView: ' +
              defaultFontView +
              '\n  - default monacoEditorLanguage: ' +
              defaultMonacoEditorLanguage
          );
        }
        this.setState(
          {
            customStyles: defaultCustomStyles,
            editingMode: defaultEditingMode,
            fontEdit: defaultFontEdit,
            fontSize: defaultFontSize,
            fontView: defaultFontView,
            monacoEditorLanguage: defaultMonacoEditorLanguage,
            defaultSettings: {
              customStyles: defaultCustomStyles,
              editingMode: defaultEditingMode,
              fontEdit: defaultFontEdit,
              fontSize: defaultFontSize,
              fontView: defaultFontView,
              monacoEditorLanguage: defaultMonacoEditorLanguage,
            },
          },
          () => {
            if (debugMode) {
              console.log(
                'AppendEditor.tsx: \n - loadDefaultSettings() this.state.savingEditorOptions: ' +
                  this.state.savingEditorOptions
              );
            }
            this.refreshEditor();
          }
        );
      } else {
        if (debugMode) {
          console.log(
            'AppendEditor.tsx: loadDefaultSettings(), else, current state:',
            JSON.stringify(this.state, null, ' ')
          );
        }
        this.refreshEditor();
      }
    } catch (error) {
      // Log outside debug mode
      console.log('Error loading default settings:', error);
    }
  };

  loadEditorOptions = () => {
    try {
      const menuOptionsString = this.editorKit.internal.componentManager.componentDataValueForKey(
        'menuOptions'
      );
      if (typeof menuOptionsString !== 'undefined') {
        const menuOptionsObject = JSON.parse(menuOptionsString) as menuOptions;
        this.setState(
          {
            borderlessMode: menuOptionsObject.borderlessMode,
            fixedHeightMode: menuOptionsObject.fixedHeightMode,
            fullWidthMode: menuOptionsObject.fullWidthMode,
            overflowMode: menuOptionsObject.overflowMode,
            //showMenuOptionsEdit: menuOptionsObject.showMenuOptionsEdit,
            //showMenuOptionsShare: menuOptionsObject.showMenuOptionsShare,
            //showMenuOptionsView: menuOptionsObject.showMenuOptionsView,
          },
          () => {
            this.refreshEditor();
          }
        );
      }
    } catch (error) {
      // Log outside debug mode
      console.log('Error loading editor options:', error);
    }
  };

  // This loads the Settings and Append Text
  loadMetaData = () => {
    this.editorKit.internal.componentManager.streamContextItem((note: any) => {
      // Load editor settings
      if (
        note.content.appendEditorCustomStyles ||
        note.content.appendEditorEditingMode ||
        note.content.appendEditorFontEdit ||
        note.content.appendEditorFontSize ||
        note.content.appendEditorFontView ||
        note.content.appendEditorMonacoEditorLanguage
      ) {
        this.setState(
          {
            customStyles: note.content.appendEditorCustomStyles,
            editingMode: note.content.appendEditorEditingMode,
            fontEdit: note.content.appendEditorFontEdit,
            fontSize: note.content.appendEditorFontSize,
            fontView: note.content.appendEditorFontView,
            monacoEditorLanguage: note.content.appendEditorMonacoEditorLanguage,
          },
          () => {
            if (debugMode) {
              console.log(
                'AppendEditor.tsx: \n - loadMetaData() this.state.savingEditorOptions: ' +
                  this.state.savingEditorOptions
              );
            }
            this.refreshEditor();
            if (debugMode) {
              console.log(
                'editorKit metadata loaded: ' +
                  '\n  - loaded customStyles: ' +
                  this.state.customStyles +
                  '\n  - loaded editingMode: ' +
                  this.state.editingMode +
                  '\n  - loaded fontEdit: ' +
                  this.state.fontEdit +
                  '\n  - loaded fontSize: ' +
                  this.state.fontSize +
                  '\n  - loaded fontView: ' +
                  this.state.fontView +
                  '\n  - loaded monacoEditorLanguage: ' +
                  this.state.monacoEditorLanguage
              );
            }
          }
        );
      }
      // Load append settings
      if (note.content.appendNewLine || note.content.appendNewParagraph) {
        this.setState({
          appendNewLine: note.content.appendNewLine,
          appendNewParagraph: note.content.appendNewParagraph,
        });
      }
      // Finally, load appendText
      this.setState(
        {
          appendText: note.content.appendText,
        },
        () => {
          /**If both text and appendText are empty,
           * such as when creating a new note,
           * and editMode is off,
           * then open the edit mode
           */
          if (
            !this.state.text &&
            !this.state.appendText &&
            !this.state.editMode
          ) {
            this.onEditMode();
          }
        }
      );
      if (debugMode) {
        console.log(
          '  - loaded append text: ' +
            this.state.appendText +
            '\n  - loaded append newline: ' +
            this.state.appendNewLine +
            '\n  - loaded append new paragraph: ' +
            this.state.appendNewParagraph +
            '\n  - loaded editorKit internal appendText: ' +
            this.editorKit.internal.note.content.appendText
        );
      }
    });
  };

  saveText = (text: string) => {
    this.saveNote(text);
    this.setState(
      {
        text: text,
      },
      () => {
        if (this.state.editingMode === EditingModes.useDynamicEditor) {
          this.refreshView();
        } else if (this.state.viewMode && isLongString(text)) {
          /** If the note text is long, then rendering its markdown will debounce
           * If the we stop editing for 550 milliseconds, then
           * automatically refresh the view to force the latest markdown to render
           * We use 550 because the debounce is 500.
           */
          if (this.saveTimer) {
            clearTimeout(this.saveTimer);
          }
          this.saveTimer = setTimeout(() => {
            this.refreshView();
          }, 550);
        }
        if (debugMode) {
          console.log('AppendEditor.tsx: saved text:', this.state.text);
        }
      }
    );
  };

  saveNote = (text: string) => {
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    try {
      this.editorKit.onEditorValueChanged(text);
    } catch (error) {
      // Log outside debug mode
      console.log('Error saving note:', error);
    }
  };

  // Entry operations

  appendTextToNote = () => {
    // Do nothing if there's no append text
    if (this.state.appendText) {
      /*
       * We usually use this.editText() to save the main text
       * However, we want to save the main text and clear the appendText
       * Consecutive calls to the component manager does not work well,
       * so we want to do both with one call to the component manager
       * This means we need multiple versions of this function depending on what we want to save */
      const { appendText } = this.state;
      let textToAppend = '';
      // We test for new paragraph first even though new line is on top and is on by default
      if (this.state.appendNewParagraph) {
        textToAppend = '  \n\n' + appendText;
      } else if (this.state.appendNewLine) {
        textToAppend = '  \n' + appendText;
      } else {
        textToAppend = appendText;
      }
      this.setState(
        {
          text: this.state.text.concat(textToAppend),
          appendText: '',
        },
        () => {
          let note = this.editorKit.internal.note;
          if (note) {
            this.editorKit.internal.componentManager.saveItemWithPresave(
              note,
              () => {
                note.content.text = this.state.text; // this.editorKit.internal.note.content.text
                note.content.appendText = this.state.appendText; // this.editorKit.internal.note.content.appendText
              }
            );
          }
          this.refreshEdit();
          // Refresh view mode if using dynamic
          if (this.state.editingMode === EditingModes.useDynamicEditor) {
            this.refreshView();
          } else if (isLongString(this.state.text)) {
            setTimeout(() => {
              this.refreshView();
              setTimeout(() => {
                this.skipToBottom();
              }, 250);
            }, 550);
          }
          setTimeout(() => {
            this.skipToBottom();
          }, 250);
        }
      );
    }
    // Refresh appendCodeMirror
    if (
      this.state.appendCodeMirror &&
      this.state.editingMode === EditingModes.useCodeMirror
    ) {
      this.state.appendCodeMirror.setValue('');
    }
  };

  autoSaveAppendText = (text: string) => {
    // This code is similar to this.onAppend();, but we only save the appendText and not the main text
    this.setState({
      appendText: text,
    });
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    try {
      let note = this.editorKit.internal.note;
      if (note) {
        this.editorKit.internal.componentManager.saveItemWithPresave(
          note,
          () => {
            note.content.appendText = text;
          }
        );
      }
    } catch (error) {
      // Log outside debug mode
      console.log('Error saving appendText:', error);
    }
  };

  autoSaveCheckBoxes = (newLine: boolean, newParagraph: boolean) => {
    // Here we save the appendText, appendNewLine, and appendNewParagraph
    // We have an additional function for this because we only call it when the user clicks a checkbox
    this.setState({
      appendNewLine: newLine,
      appendNewParagraph: newParagraph,
    });
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    try {
      let note = this.editorKit.internal.note;
      if (note) {
        this.editorKit.internal.componentManager.saveItemWithPresave(
          note,
          () => {
            note.content.appendNewLine = newLine;
            note.content.appendNewParagraph = newParagraph;
          }
        );
      }
    } catch (error) {
      // Log outside debug mode
      console.log('Error saving checkboxes:', error);
    }
  };

  refreshEdit = () => {
    this.setState(
      {
        refreshEdit: !this.state.refreshEdit,
      },
      () => {
        // We could also check for this.state.editMode,
        // but it might not be loaded yet.
        // Checking for editTextArea checks whether editMode has loaded
        const editTextArea = document.getElementById(
          HtmlElementId.editTextArea
        );
        if (
          editTextArea &&
          this.state.editingMode === EditingModes.useCodeMirror
        ) {
          this.configureCodeMirror(HtmlElementId.editTextArea);
        }
      }
    );
  };

  refreshView = () => {
    this.setState({
      refreshView: !this.state.refreshView,
    });
  };

  configureCodeMirror = (id: string) => {
    if (id === HtmlElementId.editTextArea) {
      if (debugMode) {
        console.log('this.state.text: ' + this.state.text);
      }
      const editTextArea = document.getElementById(id) as HTMLTextAreaElement;
      if (editTextArea) {
        const editCodeMirror = CodeMirror.fromTextArea(editTextArea, {
          autocorrect: true,
          autocapitalize: true,
          extraKeys: {
            Enter: 'newlineAndIndentContinueMarkdownList',
            'Alt-F': 'findPersistent',
          },
          lineNumbers: false,
          lineWrapping: true,
          mode: 'gfm',
          spellcheck: true,
          //@ts-ignore
          styleSelectedText: true,
          tabindex: 0,
          theme: 'default',
          value: this.state.text,
        });
        editCodeMirror.setSize('100%', '100%');
        editCodeMirror.on('change', () => {
          const editCodeMirrorText = editCodeMirror.getValue();
          if (debugMode) {
            console.log('editCodeMirror value: ' + editCodeMirrorText);
          }
          editCodeMirror.save();
          this.saveText(editCodeMirrorText);
        });
        editCodeMirror.on('keydown', (cm: Editor, event: KeyboardEvent) => {
          this.onKeyDown(event);
          this.onKeyDownEditTextArea(event);
          this.onKeyDownTextArea(event);
        });
        editCodeMirror.on('keyup', (cm: Editor, event: KeyboardEvent) => {
          this.onKeyUp(event);
        });
        this.setState({
          editCodeMirror: editCodeMirror,
        });
      }
    } else if (id === HtmlElementId.appendTextArea) {
      const appendTextArea = document.getElementById(
        HtmlElementId.appendTextArea
      ) as HTMLTextAreaElement;
      if (appendTextArea) {
        const appendCodeMirror = CodeMirror.fromTextArea(appendTextArea, {
          autocorrect: true,
          autocapitalize: true,
          extraKeys: {
            Enter: 'newlineAndIndentContinueMarkdownList',
            'Alt-F': 'findPersistent',
          },
          lineNumbers: false,
          lineWrapping: true,
          mode: 'gfm',
          spellcheck: true,
          //@ts-ignore
          styleSelectedText: true,
          tabindex: 0,
          theme: 'default',
          value: this.state.appendText,
        });
        appendCodeMirror.setSize('100%', '100%');
        appendCodeMirror.on('change', () => {
          const appendCodeMirrorText = appendCodeMirror.getValue();
          appendCodeMirror.save();
          this.autoSaveAppendText(appendCodeMirrorText);
        });
        appendCodeMirror.on('keydown', (cm: Editor, event: KeyboardEvent) => {
          this.onKeyDown(event);
          this.onKeyDownAppendTextArea(event);
          this.onKeyDownTextArea(event);
        });
        appendCodeMirror.on('keyup', (cm: Editor, event: KeyboardEvent) => {
          this.onKeyUp(event);
        });
        this.setState({
          appendCodeMirror: appendCodeMirror,
        });
      }
    }
  };

  makeContentEditable = () => {
    const content = document.getElementById(HtmlElementId.content);
    if (content) {
      content.setAttribute('contenteditable', 'true');
      content.setAttribute('spellcheck', 'true');
    }
    const appendix = document.getElementById(HtmlElementId.appendix);
    if (appendix) {
      appendix.setAttribute('contenteditable', 'true');
      appendix.setAttribute('spellcheck', 'true');
    }
    // Change contenteditable to false for rendered note
    const renderedNote = document.getElementById('renderedNote');
    if (renderedNote) {
      renderedNote.setAttribute('contenteditable', 'false');
    }
    const appendCustom = document.getElementById('appendCustom');
    if (appendCustom) {
      appendCustom.setAttribute('contenteditable', 'false');
    }
  };

  removeContentEditable = (id: string) => {
    const container = document.getElementById(id);
    if (container) {
      container.setAttribute('contenteditable', 'false');
    }
  };

  // Event Handlers
  onEditMode = () => {
    // if Append box is empty, close it and open Edit mode
    // if Edit mode is on, then close it, open View mode, and Append mode
    if (!this.state.editMode) {
      if (this.state.appendMode && !this.state.appendText) {
        this.setState({
          appendMode: false,
        });
      }
      this.setState(
        {
          editMode: true,
        },
        () => {
          const editTextArea = document.getElementById(
            HtmlElementId.editTextArea
          );
          if (editTextArea) {
            editTextArea.focus();
            if (this.state.editingMode === EditingModes.useCodeMirror) {
              this.configureCodeMirror(HtmlElementId.editTextArea);
            }
          }
        }
      );
    } else if (this.state.editMode) {
      /**If edit mode is on and Monaco Editor is off,
       * then turn edit mode off and turn view mode on.
       * This automatically renders the text. We do not
       * do this when Monaco is on because refreshing edit Mode
       * with Monaco Editor off allows us to resize the Monaco Editor.
       */
      if (!(this.state.editingMode === EditingModes.useMonacoEditor)) {
        this.setState({
          viewMode: true,
        });
      }
      if (this.state.editCodeMirror) {
        this.state.editCodeMirror.toTextArea();
      }
      this.setState(
        {
          editMode: false,
        },
        () => {
          // if not using append mode, focus on editButton
          if (!this.state.appendMode) {
            const editButton = document.getElementById(
              HtmlElementId.editButton
            );
            if (editButton) {
              editButton.focus();
            }
          }
        }
      );
    }
  };

  onAppendMode = (scrollDown = true, closeEdit = true, focus = true) => {
    if (!this.state.appendMode) {
      if (closeEdit) {
        this.setState({
          editMode: false,
        });
      }
      this.setState(
        {
          appendMode: true,
        },
        () => {
          if (scrollDown) {
            this.scrollToBottom();
          }
          if (focus) {
            const appendTextArea = document.getElementById(
              HtmlElementId.appendTextArea
            );
            if (appendTextArea) {
              appendTextArea.focus();
              if (this.state.editingMode === EditingModes.useCodeMirror) {
                this.configureCodeMirror(HtmlElementId.appendTextArea);
              }
            }
          }
        }
      );
    } else if (this.state.appendMode) {
      if (this.state.appendCodeMirror) {
        this.state.appendCodeMirror.toTextArea();
      }
      this.setState(
        {
          appendMode: false,
        },
        () => {
          if (this.state.editingMode === EditingModes.useMonacoEditor) {
            this.refreshEdit();
          }
          if (focus) {
            const appendButton = document.getElementById(
              HtmlElementId.appendButton
            );
            if (appendButton) {
              appendButton.focus();
            }
          }
        }
      );
    }
  };

  onViewMode = () => {
    if (!this.state.viewMode) {
      this.setState(
        {
          viewMode: true,
        },
        () => {
          if (this.state.editingMode === EditingModes.useMonacoEditor) {
            this.refreshEdit();
          }
          if (this.state.appendMode && !this.state.editMode) {
            this.skipToBottom();
          }
        }
      );
    }
    if (this.state.viewMode) {
      this.setState(
        {
          viewMode: false,
        },
        () => {
          if (this.state.editingMode === EditingModes.useMonacoEditor) {
            this.refreshEdit();
          }
          if (!this.state.editMode && !this.state.appendMode) {
            this.onEditMode();
          }
        }
      );
    }
  };

  toggleShowHelp = () => {
    this.setState(
      {
        showHelp: !this.state.showHelp,
      },
      () => {
        this.refreshView();
        const helpButton = document.getElementById(HtmlElementId.helpButton);
        if (helpButton) {
          helpButton.focus();
        }
      }
    );
  };

  toggleShowMenu = () => {
    this.setState(
      {
        showMenu: !this.state.showMenu,
      },
      () => {
        const menuButton = document.getElementById(HtmlElementId.menuButton);
        if (menuButton) {
          menuButton.focus();
        }
      }
    );
  };

  loadDefaultMenuState = () => {
    this.setState({
      showMenuOptionsEdit: false,
      showMenuOptionsShare: true,
      showMenuOptionsView: true,
    });
  };

  toggleShowMenuOptionsEdit = () => {
    this.setState({ showMenuOptionsEdit: !this.state.showMenuOptionsEdit });
  };

  toggleShowMenuOptionsShare = () => {
    this.setState({ showMenuOptionsShare: !this.state.showMenuOptionsShare });
  };

  toggleShowMenuOptionsView = () => {
    this.setState({ showMenuOptionsView: !this.state.showMenuOptionsView });
  };

  toggleBorderlessMode = () => {
    this.setState(
      {
        borderlessMode: !this.state.borderlessMode,
      },
      () => {
        this.activateFixedHeader();
        this.saveMenuOptions();
      }
    );
  };

  toggleFixedHeightMode = () => {
    this.setState(
      {
        fixedHeightMode: !this.state.fixedHeightMode,
      },
      () => {
        this.activateFixedHeader();
        this.saveMenuOptions();
      }
    );
  };

  toggleFullWidthMode = () => {
    this.setState(
      {
        fullWidthMode: !this.state.fullWidthMode,
      },
      () => {
        this.activateFixedHeader();
        this.saveMenuOptions();
      }
    );
  };

  toggleOverflowMode = () => {
    this.setState(
      {
        overflowMode: !this.state.overflowMode,
      },
      () => {
        this.activateFixedHeader();
        this.saveMenuOptions();
      }
    );
  };

  saveMenuOptions = () => {
    let currentMenuOptions: menuOptions;
    currentMenuOptions = {
      borderlessMode: this.state.borderlessMode,
      fixedHeightMode: this.state.fixedHeightMode,
      fullWidthMode: this.state.fullWidthMode,
      overflowMode: this.state.overflowMode,
      /**These are turned off to prevent excess re-rendering of the note when opening/closing the menu */
      //showMenuOptionsEdit: this.state.showMenuOptionsEdit,
      //showMenuOptionsShare: this.state.showMenuOptionsShare,
      //showMenuOptionsView: this.state.showMenuOptionsView,
    };
    this.saveEditorOption('menuOptions', JSON.stringify(currentMenuOptions));
  };

  saveEditorOption = (
    optionKey: string,
    optionValue: string | boolean | undefined
  ) => {
    this.setState(
      {
        savingEditorOptions: true,
      },
      () => {
        try {
          this.editorKit.internal.componentManager.setComponentDataValueForKey(
            optionKey,
            optionValue
          );
          /** this.configureEditorKit() is triggered
           * every time setComponentDataValueForKey is triggered, but
           * savingEditorOptions prevents the callback from triggering.
           * Then, after the timeout, the new default settings or options can
           * take into effect immediately.
           * However, if you switch the note within the timeout, you will get an error.
           * I have tried 150 and 200 but they both are not long enough. 250 is short enough
           * to work, but not long enough to be easily noticeable.
           * We do not load editor options because they are optional and persist through
           * this.configureEditorKit().
           * */
          setTimeout(() => {
            this.setState(
              {
                savingEditorOptions: false,
              },
              () => {
                this.loadDefaultSettings();
                this.loadMetaData();
              }
            );
          }, 250);
        } catch (error) {
          console.log(
            'Error saving editor option. Your optionKey:',
            optionKey,
            '\n - Your optionValue: ',
            optionValue,
            '\n - The error: ',
            error
          );
          this.setState(
            {
              savingEditorOptions: false,
            },
            () => {
              /** We use refreshEditor() if there's an error (such as in the demo)
               * But not in the actual editor because loadDefaultSettings and loadMetaData
               * will run refreshEditor() twice, and if there's no issue saving editor options,
               * then there's probably no issue loading default settings and metadata.
               * */
              this.refreshEditor();
              this.loadDefaultSettings();
              this.loadMetaData();
            }
          );
        }
      }
    );
  };

  onSettingsMode = () => {
    // Here we save the current state. We reload the current state if we cancel
    if (!this.state.settingsMode) {
      this.removeFixedHeader();
      this.setState(
        {
          currentState: this.state,
        },
        () => {
          this.setState(
            {
              appendMode: false,
              editMode: false,
              fullWidthMode: false,
              fixedHeightMode: false,
              settingsMode: true,
              showAppendix: false, // Hides the scroll up/down buttons
              showHeader: false,
              showMenu: false,
              viewMode: false,
            },
            () => {
              const undoDialog = document.getElementById('undoDialog');
              if (undoDialog) {
                undoDialog.focus();
              }
            }
          );
        }
      );
    } else if (this.state.settingsMode) {
      this.setState(
        {
          ...this.state.currentState,
          settingsMode: false,
        },
        () => {
          this.refreshEdit();
          const settingsButton = document.getElementById(
            HtmlElementId.settingsButton
          );
          if (settingsButton) {
            settingsButton.focus();
          }
        }
      );
    }
  };

  // We don't save the current state and reload it after confirm settings are saved
  // This requires us to manually reload editMode and appendMode
  // This is important for settings, especially useCodeMirror
  onSaveSettings = ({
    customStyles,
    editingMode,
    fontEdit,
    fontSize,
    fontView,
    monacoEditorLanguage,
    saveAsDefault,
  }: SaveSettingsInterface) => {
    this.setState(
      {
        customStyles,
        editingMode,
        fontEdit,
        fontSize,
        fontView,
        monacoEditorLanguage,
        showAppendix: true,
        showHeader: true,
        settingsMode: false,
        viewMode: true,
      },
      () => {
        this.refreshEditor();
        const settingsButton = document.getElementById(
          HtmlElementId.settingsButton
        );
        if (settingsButton) {
          settingsButton.focus();
        }
      }
    );
    let note = this.editorKit.internal.note;
    if (note) {
      if (debugMode) {
        console.log(
          'AppendEditor.tsx: \n - onSaveSettings() this.editorKit.internal.componentManager.saveItemWithPresave() triggered'
        );
      }
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendEditorCustomStyles = customStyles;
        note.content.appendEditorEditingMode = editingMode;
        note.content.appendEditorFontEdit = fontEdit;
        note.content.appendEditorFontSize = fontSize;
        note.content.appendEditorFontView = fontView;
        note.content.appendEditorMonacoEditorLanguage = monacoEditorLanguage;
      });
      if (debugMode) {
        console.log(
          'AppendEditor.tsx: \n - onSaveSettings() this.editorKit.internal.componentManager.saveItemWithPresave() completed'
        );
      }
    }
    if (saveAsDefault) {
      this.setState(
        {
          defaultSettings: {
            customStyles,
            editingMode,
            fontEdit,
            fontSize,
            fontView,
            monacoEditorLanguage,
          },
        },
        () => {
          if (debugMode) {
            console.log(
              'AppendEditor.tsx: \n - onSaveSettings() this.state.savingEditorOptions: ' +
                this.state.savingEditorOptions +
                '\n JSON.stringify(this.state.defaultSettings):',
              JSON.stringify(this.state.defaultSettings)
            );
          }
          this.saveEditorOption(
            'defaultSettings',
            JSON.stringify(this.state.defaultSettings)
          );
        }
      );
    }
  };

  activateStyles = () => {
    if (debugMode) {
      console.log('AppendEditor.tsx: \n - this.activateStyles() triggered');
    }
    const sheetToBeRemoved = document.getElementById('customStyleSheet');
    if (sheetToBeRemoved) {
      const sheetParent = sheetToBeRemoved.parentNode;
      if (sheetParent) {
        sheetParent.removeChild(sheetToBeRemoved);
      }
    }
    // Follow the order that appears in the Settings to make the Settings cascade
    let fontSizeStyle = '';
    if (this.state.fontSize) {
      fontSizeStyle =
        '.CodeMirror, .DynamicEditor, .MonacoEditorContainer, .ProseMirror, #editTextArea, #appendTextArea, #renderedNote {font-size: ' +
        this.state.fontSize +
        ';}\n';
    }
    let fontEditStyle = '';
    if (this.state.fontEdit) {
      fontEditStyle =
        '.CodeMirror, .DynamicEditor, .ProseMirror, #editTextArea, #appendTextArea {font-family: ' +
        this.state.fontEdit +
        ';}\n';
    }
    let fontViewStyle = '';
    if (this.state.fontView) {
      fontViewStyle =
        '#renderedNote {font-family: ' + this.state.fontView + ';}\n';
    }
    if (
      this.state.customStyles ||
      this.state.fontEdit ||
      this.state.fontSize ||
      this.state.fontView
    ) {
      const sheet = document.createElement('style');
      sheet.setAttribute('id', 'customStyleSheet');
      // Follow the order that appears in the Settings to make the Settings cascade
      sheet.innerHTML =
        fontSizeStyle + fontEditStyle + fontViewStyle + this.state.customStyles;
      document.body.appendChild(sheet);
    }
  };

  onCancelPrint = () => {
    this.setState(
      {
        confirmPrintUrl: false,
      },
      () => {
        const printButton = document.getElementById(HtmlElementId.printButton);
        if (printButton) {
          printButton.focus();
        }
      }
    );
  };

  onConfirmPrintUrl = () => {
    this.setState(
      {
        confirmPrintUrl: true,
      },
      () => {
        const undoDialog = document.getElementById('undoDialog');
        if (undoDialog) {
          undoDialog.focus();
        }
      }
    );
  };

  onPrintUrlTrue = () => {
    this.setState(
      {
        confirmPrintUrl: false,
        printURL: true,
      },
      () => {
        this.printRenderedHtml();
      }
    );
  };

  onPrintUrlFalse = () => {
    this.setState(
      {
        confirmPrintUrl: false,
        printURL: false,
      },
      () => {
        this.printRenderedHtml();
      }
    );
  };

  printRenderedHtml = () => {
    window.print();
    const printButton = document.getElementById(HtmlElementId.printButton);
    if (printButton) {
      printButton.focus();
    }
  };

  goDown = () => {
    document.body.scrollTop = 10000000; // for Safari
    if (this.state.editMode) {
      const editTextArea = document.getElementById(HtmlElementId.editTextArea);
      if (editTextArea) {
        editTextArea.scrollTop = 10000000;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(
        HtmlElementId.appendTextArea
      );
      if (appendTextArea) {
        appendTextArea.scrollTop = 10000000;
      }
    }
    if (this.state.fixedHeightMode) {
      const view = document.getElementById(HtmlElementId.view);
      if (view) {
        view.scrollTop = 10000000;
      }
    }
    const view = document.getElementById(HtmlElementId.view);
    if (view) {
      view.scrollTop = 10000000;
    }
  };

  scrollToBottom = () => {
    this.goDown();
    const appendix = document.getElementById(HtmlElementId.appendix);
    if (appendix) {
      appendix.scrollIntoView({
        behavior: 'smooth',
        block: 'end', // Bottom
        inline: 'nearest',
      });
    }
  };

  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToBottom = () => {
    this.goDown();
    const appendix = document.getElementById(HtmlElementId.appendix);
    if (appendix) {
      appendix.scrollIntoView({
        behavior: 'auto',
        block: 'end', // Bottom
        inline: 'nearest',
      });
    }
  };

  goUp = () => {
    document.body.scrollTop = 0; // for Safari
    if (this.state.editMode) {
      const editTextArea = document.getElementById(HtmlElementId.editTextArea);
      if (editTextArea) {
        editTextArea.scrollTop = 0;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(
        HtmlElementId.appendTextArea
      );
      if (appendTextArea) {
        appendTextArea.scrollTop = 0;
      }
    }
    if (this.state.fixedHeightMode) {
      const view = document.getElementById(HtmlElementId.view);
      if (view) {
        view.scrollTop = 0;
      }
    }
  };

  scrollToTop = () => {
    this.goUp();
    const top = document.getElementById('top');
    if (top) {
      top.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Top
        inline: 'nearest',
      });
    }
  };

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToTop = () => {
    this.goUp();
    const top = document.getElementById('top');
    if (top) {
      top.scrollIntoView({
        behavior: 'auto',
        block: 'start', // Top
        inline: 'nearest',
      });
    }
  };

  onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.set(e.key, true);
    // Click the top Append if 'Control' and 'e' are pressed
    if (keyMap.get('Control') && keyMap.get('e')) {
      e.preventDefault();
      this.onEditMode();
    }
    // Click the top Append if 'Control' and 'u' are pressed
    else if (
      keyMap.get('Control') &&
      !keyMap.get('Alt') &&
      (keyMap.get('u') || keyMap.get('m'))
    ) {
      e.preventDefault();
      this.onAppendMode();
    }
    // Click view if 'Control' and 'p' are pressed
    else if (keyMap.get('Control') && !keyMap.get('Alt') && keyMap.get('p')) {
      e.preventDefault();
      this.onViewMode();
    } else if (keyMap.get('Control') && keyMap.get('.')) {
      e.preventDefault();
      this.setState({
        appendRows: this.state.appendRows + 1,
      });
    } else if (keyMap.get('Control') && keyMap.get(',')) {
      e.preventDefault();
      if (this.state.appendRows > 5) {
        this.setState({
          appendRows: this.state.appendRows - 1,
        });
      }
    } else if (keyMap.get('Control') && keyMap.get('<')) {
      // Edit only mode
      e.preventDefault();
      this.setState(
        {
          appendMode: false,
          editMode: false,
          viewMode: false,
        },
        () => {
          this.onEditMode();
        }
      );
    } else if (keyMap.get('Control') && keyMap.get('>')) {
      // Append only mode
      e.preventDefault();
      this.setState(
        {
          appendMode: false,
          editMode: false,
          viewMode: false,
        },
        () => {
          this.onAppendMode();
        }
      );
    } else if (keyMap.get('Control') && keyMap.get('[')) {
      e.preventDefault();
      this.skipToTop();
    } else if (keyMap.get('Control') && keyMap.get(']')) {
      e.preventDefault();
      this.skipToBottom();
    } else if (
      keyMap.get('Control') &&
      !keyMap.get('Alt') &&
      !keyMap.get('Shift') &&
      keyMap.get('w')
    ) {
      keyMap.delete('w');
    }
  };

  onKeyDownAppendTextArea = (e: React.KeyboardEvent | KeyboardEvent) => {
    // Close Append Mode if 'Escape' is pressed
    if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.delete('Escape');
      this.onAppendMode();
    }
    // Save note if Control and Enter are pressed
    else if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      if (this.state.editingMode === EditingModes.useCodeMirror) {
        this.appendTextToNote();
      }
    }
    // Save note if Control and S are pressed
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      if (this.state.editingMode === EditingModes.useCodeMirror) {
        this.appendTextToNote();
      }
    }
    // Toggle Append New Line if Ctrl + Alt + N are pressed
    else if (
      keyMap.get('Control') &&
      !keyMap.get('Shift') &&
      keyMap.get('Alt') &&
      keyMap.get('n')
    ) {
      e.preventDefault();
      const newLine = document.getElementById(HtmlElementId.newLine);
      if (newLine) {
        newLine.click();
      }
    }
    // Toggle Append New Line if Ctrl + Alt + P are pressed
    else if (
      keyMap.get('Control') &&
      !keyMap.get('Shift') &&
      keyMap.get('Alt') &&
      keyMap.get('p')
    ) {
      e.preventDefault();
      const newParagraph = document.getElementById(HtmlElementId.newParagraph);
      if (newParagraph) {
        newParagraph.click();
      }
    }
  };

  onKeyDownEditTextArea = (e: React.KeyboardEvent | KeyboardEvent) => {
    // Close EditMode if 'Escape' is pressed
    if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false);
      this.onEditMode();
    }
  };

  onKeyDownTextArea = (e: React.KeyboardEvent | KeyboardEvent) => {
    // Add two spaces and line break if Shift and Enter are pressed
    if (keyMap.get('Shift') && keyMap.get('Enter')) {
      e.preventDefault();
      document.execCommand('insertText', false, '  \n');
    }
    // Add two stars if Control + b are pressed
    else if (keyMap.get('Control') && keyMap.get('b')) {
      e.preventDefault();
      document.execCommand('insertText', false, '**');
    }
    // Add header when pressing Control + H
    else if (keyMap.get('Control') && keyMap.get('h')) {
      e.preventDefault();
      document.execCommand('insertText', false, '#');
    }
    // Add image code if Control + Alt and i are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('i')) {
      e.preventDefault();
      document.execCommand('insertText', false, '![]()');
    }
    // Add one stars if Control + i is pressed
    else if (keyMap.get('Control') && keyMap.get('i')) {
      e.preventDefault();
      document.execCommand('insertText', false, '*');
    }
    // Add inline code if Control + Alt and k are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('k')) {
      e.preventDefault();
      document.execCommand('insertText', false, '`');
    }
    // Add link if Control + k are pressed
    else if (keyMap.get('Control') && keyMap.get('k')) {
      e.preventDefault();
      document.execCommand('insertText', false, '[]()');
    }
    // Add ordered list item if Control + Alt + l are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('l')) {
      e.preventDefault();
      document.execCommand('insertText', false, '\n1. ');
    }
    // Add unordered list item if Control + l are pressed
    else if (keyMap.get('Control') && keyMap.get('l')) {
      e.preventDefault();
      document.execCommand('insertText', false, '\n- ');
    }
    // Add strike through if Control + Alt + u are pressed
    else if (keyMap.get('Control') && keyMap.get('Alt') && keyMap.get('u')) {
      e.preventDefault();
      document.execCommand('insertText', false, '~~');
    }
    // Add quote Control + q, Control + ' or Control + " are pressed
    else if (
      (keyMap.get('Control') && keyMap.get('q')) ||
      (keyMap.get('Control') && keyMap.get("'")) ||
      (keyMap.get('Control') && keyMap.get('"'))
    ) {
      e.preventDefault();
      document.execCommand('insertText', false, '\n> ');
    }
  };

  onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.delete(e.key);
  };

  onBlur = (e: React.FocusEvent) => {
    keyMap.clear();
  };

  onScroll = (e: Event) => {
    if (!this.state.settingsMode) {
      if (window.scrollY < last_known_scroll_position) {
        // If scrolling up, fix header
        this.activateFixedHeader();
      } else if (
        // If scrolling down, unfix header
        window.scrollY > last_known_scroll_position &&
        !this.state.showMenu
      ) {
        this.removeFixedHeader();
      }
      last_known_scroll_position = window.scrollY;
    }
  };

  activateFixedHeader = () => {
    const header = document.getElementById(HtmlElementId.header);
    const content = document.getElementById(HtmlElementId.content);
    // Activate only if we have both
    if (header && content) {
      header.classList.add(HtmlClassName.fixed);
      content.classList.add(HtmlClassName.fixedHeader);
    }
  };

  removeFixedHeader = () => {
    const header = document.getElementById(HtmlElementId.header);
    const content = document.getElementById(HtmlElementId.content);
    /** Remove both even if you don't have both
     * This is needed for loading settings
     */
    if (header) {
      header.classList.remove(HtmlClassName.fixed);
    }
    if (content) {
      content.classList.remove(HtmlClassName.fixedHeader);
    }
  };

  render() {
    return [
      <span id="top"></span>,
      <div
        tabIndex={0}
        className="sn-component"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
      >
        {this.state.showHeader && [
          <div id={HtmlElementId.header} className={'header'}>
            <div className="sk-button-group">
              <button
                type="button"
                id={HtmlElementId.editButton}
                onClick={this.onEditMode}
                title="Toggle Edit Mode"
                className={'sk-button ' + (this.state.editMode ? 'on' : 'off')}
              >
                <PencilIcon condition={this.state.editMode} role="button" />
              </button>
              <button
                type="button"
                id={HtmlElementId.viewButton}
                onClick={this.onViewMode}
                title="Toggle View Mode"
                className={'sk-button ' + (this.state.viewMode ? 'on' : 'off')}
              >
                <EyeIcon condition={this.state.viewMode} role="button" />
              </button>
              <button
                type="button"
                id={HtmlElementId.appendButton}
                onClick={() => this.onAppendMode()}
                title="Toggle Append Mode"
                className={
                  'sk-button ' + (this.state.appendMode ? 'on' : 'off')
                }
              >
                <PlusIcon condition={this.state.appendMode} role={'button'} />
              </button>
              <div className="sk-button divider">
                <svg
                  role="img"
                  aria-label="Vertical line divider"
                  width="1"
                  height="24"
                  viewBox="0 0 1 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="1"
                    height="24"
                    fill={'var(--sn-stylekit-foreground-color)'}
                  />
                </svg>
              </div>
              <button
                type="button"
                id={HtmlElementId.helpButton}
                onClick={this.toggleShowHelp}
                title="Help"
                className={'sk-button ' + (this.state.showHelp ? 'on' : 'off')}
              >
                <HelpIcon condition={this.state.showHelp} role={'button'} />
              </button>
              <button
                type="button"
                id={HtmlElementId.settingsButton}
                onClick={this.onSettingsMode}
                title="Settings"
                className={
                  'sk-button ' + (this.state.settingsMode ? 'on' : 'off')
                }
              >
                <GearIcon condition={this.state.settingsMode} role="button" />
              </button>
              <div className="sk-button divider">
                <svg
                  role="img"
                  aria-label="Vertical line divider"
                  width="1"
                  height="24"
                  viewBox="0 0 1 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="1"
                    height="24"
                    fill={'var(--sn-stylekit-foreground-color)'}
                  />
                </svg>
              </div>
              <button
                type="button"
                id="scrollToBottomButtonHeader"
                onClick={this.skipToBottom}
                title="Scroll to Bottom"
                className={'sk-button off'}
              >
                <svg
                  role="button"
                  aria-label="Arrow pointing down for scroll to bottom button"
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
              </button>
              <button
                type="button"
                id="scrollToTopButtonHeader"
                onClick={this.skipToTop}
                title="Scroll to Top"
                className={'sk-button off'}
              >
                <svg
                  role="button"
                  aria-label="Arrow pointing up for scroll to top button"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.826 13.3335L10.001 9.5085L6.17597 13.3335L5.00097 12.1502L10.001 7.15017L15.001 12.1502L13.826 13.3335Z"
                    fill={'var(--sn-stylekit-foreground-color)'}
                  />
                </svg>
              </button>
              <button
                type="button"
                id={HtmlElementId.menuButton}
                onClick={this.toggleShowMenu}
                title="Toggle Menu"
                className={'sk-button ' + (this.state.showMenu ? 'on' : 'off')}
              >
                <MenuIcon condition={this.state.showMenu} role="button" />
              </button>
            </div>
          </div>,
        ]}
        <div
          id={HtmlElementId.content}
          className={
            'content' +
            (this.state.borderlessMode ? ' borderless' : '') +
            (this.state.fixedHeightMode ? ' fixed-height' : '') +
            (this.state.fullWidthMode ? ' full-width' : '') +
            (this.state.overflowMode ? ' overflow' : '')
          }
        >
          {this.state.showMenu && (
            <Menu
              borderlessMode={this.state.borderlessMode}
              editingMode={this.state.editingMode}
              fixedHeightMode={this.state.fixedHeightMode}
              fullWidthMode={this.state.fullWidthMode}
              monacoEditorLanguage={this.state.monacoEditorLanguage}
              onConfirmPrintUrl={this.onConfirmPrintUrl}
              overflowMode={this.state.overflowMode}
              refreshEdit={this.refreshEdit}
              refreshView={this.refreshView}
              saveText={this.saveText}
              showMenuOptionsEdit={this.state.showMenuOptionsEdit}
              showMenuOptionsShare={this.state.showMenuOptionsShare}
              showMenuOptionsView={this.state.showMenuOptionsView}
              text={this.state.text}
              toggleBorderlessMode={this.toggleBorderlessMode}
              toggleFixedHeightMode={this.toggleFixedHeightMode}
              toggleFullWidthMode={this.toggleFullWidthMode}
              toggleOverflowMode={this.toggleOverflowMode}
              toggleShowMenu={this.toggleShowMenu}
              toggleShowMenuOptionsEdit={this.toggleShowMenuOptionsEdit}
              toggleShowMenuOptionsShare={this.toggleShowMenuOptionsShare}
              toggleShowMenuOptionsView={this.toggleShowMenuOptionsView}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.settingsMode && (
            <Settings
              cancelText="Cancel"
              confirmText="Save"
              customStyles={this.state.customStyles}
              debugMode={debugMode}
              defaultSettings={this.state.defaultSettings}
              editingMode={this.state.editingMode}
              fontEdit={this.state.fontEdit}
              fontSize={this.state.fontSize}
              fontView={this.state.fontView}
              helpLink={'https://appendeditor.com/#settings'}
              keyMap={keyMap}
              onConfirm={this.onSaveSettings}
              onCancel={this.onSettingsMode}
              title={`Append Editor Settings`}
              monacoEditorLanguage={this.state.monacoEditorLanguage}
            />
          )}
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              debugMode={debugMode}
              editingMode={this.state.editingMode}
              fontSize={this.state.fontSize}
              keyMap={keyMap}
              monacoEditorLanguage={this.state.monacoEditorLanguage}
              onKeyDown={this.onKeyDown}
              onKeyDownEditTextArea={this.onKeyDownEditTextArea}
              onKeyDownTextArea={this.onKeyDownTextArea}
              onKeyUp={this.onKeyUp}
              saveText={this.saveText}
              text={this.state.text}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              debugMode={debugMode}
              editingMode={this.state.editingMode}
              fontSize={this.state.fontSize}
              keyMap={keyMap}
              monacoEditorLanguage={this.state.monacoEditorLanguage}
              onKeyDown={this.onKeyDown}
              onKeyDownEditTextArea={this.onKeyDownEditTextArea}
              onKeyDownTextArea={this.onKeyDownTextArea}
              onKeyUp={this.onKeyUp}
              saveText={this.saveText}
              text={this.state.text}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.viewMode && !this.state.refreshView && (
            <ErrorBoundary>
              <ViewNote
                bypassDebounce={this.state.bypassDebounce}
                debugMode={debugMode}
                editingMode={this.state.editingMode}
                monacoEditorLanguage={this.state.monacoEditorLanguage}
                printURL={this.state.printURL}
                showHelp={this.state.showHelp}
                saveText={this.saveText}
                text={this.state.text}
              />
            </ErrorBoundary>
          )}
          {this.state.viewMode && this.state.refreshView && (
            <ErrorBoundary>
              <ViewNote
                debugMode={debugMode}
                bypassDebounce={this.state.bypassDebounce}
                editingMode={this.state.editingMode}
                monacoEditorLanguage={this.state.monacoEditorLanguage}
                printURL={this.state.printURL}
                showHelp={this.state.showHelp}
                saveText={this.saveText}
                text={this.state.text}
              />
            </ErrorBoundary>
          )}
          {this.state.confirmPrintUrl && (
            <PrintDialog
              title={`Would you like to print URLs?`}
              onUndo={this.onCancelPrint}
              onConfirm={this.onPrintUrlTrue}
              onCancel={this.onPrintUrlFalse}
              helpLink={'https://appendeditor.com/#printing'}
              confirmText="Yes, print URLs"
              cancelText="No, thanks"
            />
          )}
          {this.state.showDiff && [
            <MonacoDiffEditor
              text={this.state.text}
              modifiedText={this.state.appendText}
              saveText={this.saveText}
            />,
          ]}
        </div>
        {this.state.showAppendix && [
          <div
            id={HtmlElementId.appendix}
            className={
              'appendix' +
              (this.state.borderlessMode ? ' borderless' : '') +
              (this.state.fullWidthMode ? ' full-width' : '')
            }
          >
            {this.state.appendMode && (
              <AppendText
                appendTextToNote={this.appendTextToNote}
                autoSaveAppendText={this.autoSaveAppendText}
                autoSaveCheckBoxes={this.autoSaveCheckBoxes}
                debugMode={debugMode}
                editingMode={this.state.editingMode}
                fontSize={this.state.fontSize}
                keyMap={keyMap}
                appendNewLine={this.state.appendNewLine}
                appendNewParagraph={this.state.appendNewParagraph}
                monacoEditorLanguage={this.state.monacoEditorLanguage}
                onKeyDown={this.onKeyDown}
                onKeyDownAppendTextArea={this.onKeyDownAppendTextArea}
                onKeyDownTextArea={this.onKeyDownTextArea}
                onKeyUp={this.onKeyUp}
                appendRows={this.state.appendRows}
                text={this.state.appendText}
              />
            )}
            <button
              className="sk-button info"
              id="scrollToTopButton"
              onClick={this.scrollToTop}
              title="Scroll to Top"
              type="button"
            >
              <div> ▲ </div>
            </button>
            <button
              className="sk-button info"
              id="scrollToBottomButton"
              onClick={this.scrollToBottom}
              title="Scroll to Bottom"
              type="button"
            >
              <div> ▼ </div>
            </button>
          </div>,
        ]}
      </div>,
    ];
  }
}
