import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import PrintDialog from './PrintDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';
import Settings from './Settings';
import { MonacoDiffEditor } from './Monaco';

import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';

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

const appendButtonID = 'appendButton';
const editButtonID = 'editButton';
const helpButtonID = 'helpButton';
const printButtonID = 'printButton';
const settingsButtonID = 'settingsButton';
const viewButtonID = 'viewButton';

const headerID = 'header';
const contentID = 'content';
const appendixID = 'appendix';

const editTextAreaID = 'editTextArea';
const appendTextAreaID = 'appendTextArea';

const newLineID = 'newLine';
const newParagraphID = 'newParagraph';

const useCodeMirror = 'useCodeMirror';
const useDynamicEditor = 'useDynamicEditor';
const useMonacoEditor = 'useMonacoEditor';
const usePlainText = 'usePlainText';

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
  confirmPrintURL: false,
  customStyles: '',
  fontEdit: '',
  fontSize: '',
  fontView: '',
  loadedMetaData: false,
  MonacoEditorLanguage: 'markdown',
  printMode: false,
  printURL: true,
  refreshEdit: false,
  refreshView: false,
  showAppendix: true,
  showHeader: true,
  showHelp: false,
  showDiff: false,
  settingsMode: false,
  useCodeMirror: false,
};

const debugMode = false;

let keyMap = new Map();

export interface AppendInterface {
  text: string;
  appendCodeMirror?: any;
  appendNewLine: boolean;
  appendNewParagraph: boolean;
  appendMode: boolean;
  appendRows: number;
  appendText: string;
  confirmPrintURL: boolean;
  currentState?: object;
  customStyles: string;
  editMode?: any;
  editingMode?:
    | 'usePlainText'
    | 'useCodeMirror'
    | 'useDynamicEditor'
    | 'useMonacoEditor'
    | undefined;
  editCodeMirror?: any;
  fontEdit: string;
  fontSize: string;
  fontView: string;
  keyMap?: Object;
  loadedMetaData: boolean;
  MonacoEditorLanguage: string;
  printMode: boolean;
  printURL: boolean;
  refreshEdit: boolean;
  refreshView: boolean;
  showAppendix: boolean;
  showDiff: boolean;
  showHeader: boolean;
  showHelp: boolean;
  showMenu?: boolean;
  settingsMode: boolean;
  useCodeMirror: boolean;
  viewMode?: boolean;
}

export default class AppendEditor extends React.Component<{}, AppendInterface> {
  editorKit: any;

  constructor(props: AppendInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  componentDidMount = () => {
    if (!this.state.text && !this.state.appendText) {
      this.setState({ viewMode: true });
    }
  };

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      setEditorRawText: (text: string) => {
        this.setState(
          {
            ...initialState,
            text,
          },
          () => {
            this.refreshEdit();
            this.refreshView();
            this.activateStyles();
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

  // This loads the Append Text, settings, and useCodeMirror
  loadMetaData = () => {
    this.editorKit.internal.componentManager.streamContextItem((note: any) => {
      // Load editor settings
      if (
        note.content.appendEditorCustomStyles ||
        note.content.appendEditorEditingMode ||
        note.content.appendEditorFontEdit ||
        note.content.appendEditorFontSize ||
        note.content.appendEditorFontView ||
        note.content.appendEditorMonacoEditorLanguage ||
        note.content.appendEditorUseCodeMirror ||
        note.content.appendEditorUseMonacoEditor
      ) {
        this.setState(
          {
            customStyles: note.content.appendEditorCustomStyles,
            editingMode: note.content.appendEditorEditingMode,
            fontEdit: note.content.appendEditorFontEdit,
            fontSize: note.content.appendEditorFontSize,
            fontView: note.content.appendEditorFontView,
            MonacoEditorLanguage: note.content.appendEditorMonacoEditorLanguage,
            useCodeMirror: note.content.appendEditorUseCodeMirror,
          },
          () => {
            this.refreshEdit();
            this.activateStyles();
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
      this.setState({
        appendText: note.content.appendText,
        loadedMetaData: true,
      });
      if (debugMode) {
        console.log('loaded append text: ' + this.state.appendText);
        console.log('loaded append newline: ' + this.state.appendNewLine);
        console.log(
          'loaded append new paragraph: ' + this.state.appendNewParagraph
        );
        console.log(
          'internal appendText: ' +
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
        if (this.state.editingMode === useDynamicEditor) {
          this.refreshView();
        }
        if (debugMode) {
          console.log('saved text in AppendEditor.tsx: ' + this.state.text);
        }
      }
    );
  };

  saveNote = (text: string) => {
    // This will work in an SN context, but breaks the standalone editor, so we need to catch the error
    try {
      this.editorKit.onEditorValueChanged(text);
    } catch (error) {
      console.error(error);
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
          if (this.state.editingMode === useDynamicEditor) {
            this.refreshView();
          }
        }
      );
    }
    // Refresh appendCodeMirror
    if (this.state.appendCodeMirror && this.state.useCodeMirror) {
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
      console.error(error);
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
      console.error(error);
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
        const editTextArea = document.getElementById(editTextAreaID);
        if (this.state.useCodeMirror && editTextArea) {
          this.configureCodeMirror(editTextAreaID);
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
    if (id === editTextAreaID) {
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
    } else if (id === appendTextAreaID) {
      const appendTextArea = document.getElementById(
        appendTextAreaID
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
    const content = document.getElementById(contentID);
    if (content) {
      content.setAttribute('contenteditable', 'true');
      content.setAttribute('spellcheck', 'true');
    }
    const appendix = document.getElementById(appendixID);
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
      if (this.state.appendMode) {
        const appendTextArea = document.getElementById(
          appendTextAreaID
        ) as HTMLInputElement;
        if (
          (appendTextArea && !appendTextArea.value) ||
          !this.state.appendText
        ) {
          this.setState({
            appendMode: false,
          });
        }
      }
      this.setState(
        {
          editMode: true,
        },
        () => {
          const editTextArea = document.getElementById(editTextAreaID);
          if (editTextArea) {
            editTextArea.focus();
          }
          if (this.state.useCodeMirror && editTextArea) {
            this.configureCodeMirror(editTextAreaID);
          }
        }
      );
    } else if (this.state.editMode) {
      /**If edit mode is on and
       * print mode is off, and Monaco Editor is off,
       * then turn edit mode off and turn view mode on.
       * This automatically renders the text. We do not
       * do this when Monaco is on because refreshing edit Mode
       * with Monaco Editor off allows resizing the Monaco Editor.
       */
      if (
        !this.state.printMode &&
        !(this.state.editingMode === useMonacoEditor)
      ) {
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
            const editButton = document.getElementById(editButtonID);
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
            const appendTextArea = document.getElementById(appendTextAreaID);
            if (appendTextArea) {
              appendTextArea.focus();
            }
          }
          if (this.state.useCodeMirror) {
            this.configureCodeMirror(appendTextAreaID);
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
          if (this.state.editingMode === useMonacoEditor) {
            this.refreshEdit();
          }
          if (focus) {
            const appendButton = document.getElementById(appendButtonID);
            if (appendButton) {
              appendButton.focus();
            }
          }
        }
      );
    }
  };

  onPrintMode = () => {
    this.setState(
      {
        showHeader: false,
        showAppendix: false,
        editMode: false,
        printMode: true,
        viewMode: false,
        refreshView: !this.state.refreshView,
      },
      () => {
        window.print();
        this.setState(
          {
            showHeader: true,
            showAppendix: true,
          },
          () => {
            const printButton = document.getElementById(printButtonID);
            if (printButton) {
              printButton.focus();
            }
          }
        );
      }
    );
  };

  onViewMode = () => {
    if (!this.state.viewMode) {
      this.setState(
        {
          viewMode: true,
          printMode: false,
        },
        () => {
          if (this.state.editingMode === useMonacoEditor) {
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
          if (this.state.editingMode === useMonacoEditor) {
            this.refreshEdit();
          }
          if (!this.state.editMode && !this.state.appendMode) {
            this.onEditMode();
          }
        }
      );
    }
  };

  onToggleShowHelp = () => {
    this.setState(
      {
        showHelp: !this.state.showHelp,
      },
      () => {
        this.refreshView();
        const helpButton = document.getElementById(helpButtonID);
        if (helpButton) {
          helpButton.focus();
        }
      }
    );
  };

  onToggleShowMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  };

  onSettingsMode = () => {
    // Here we save the current state. We reload the current state if we cancel
    if (!this.state.settingsMode) {
      this.setState(
        {
          currentState: this.state,
        },
        () => {
          this.setState(
            {
              showAppendix: false, // Hides the scroll up/down buttons
              showHeader: false,
              appendMode: false,
              editMode: false,
              printMode: false,
              viewMode: false,
              settingsMode: true,
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
          const settingsButton = document.getElementById(settingsButtonID);
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
    MonacoEditorLanguage,
    useCodeMirror,
  }: AppendInterface) => {
    this.setState(
      {
        customStyles,
        editingMode,
        fontEdit,
        fontSize,
        fontView,
        MonacoEditorLanguage,
        useCodeMirror,
        showAppendix: true,
        showHeader: true,
        settingsMode: false,
        viewMode: true,
      },
      () => {
        this.activateStyles();
        const settingsButton = document.getElementById(settingsButtonID);
        if (settingsButton) {
          settingsButton.focus();
        }
      }
    );
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendEditorCustomStyles = customStyles;
        note.content.appendEditorEditingMode = editingMode;
        note.content.appendEditorFontEdit = fontEdit;
        note.content.appendEditorFontSize = fontSize;
        note.content.appendEditorFontView = fontView;
        note.content.appendEditorMonacoEditorLanguage = MonacoEditorLanguage;
        note.content.appendEditorUseCodeMirror = useCodeMirror;
      });
    }
  };

  activateStyles = () => {
    const sheetToBeRemoved = document.getElementById('customStyleSheet');
    if (sheetToBeRemoved) {
      const sheetParent = sheetToBeRemoved.parentNode;
      if (sheetParent) {
        sheetParent.removeChild(sheetToBeRemoved);
      }
    }
    const sheet = document.createElement('style');
    sheet.setAttribute('id', 'customStyleSheet');

    const fontEditStyle =
      '.CodeMirror, .DynamicEditor, .ProseMirror, #editTextArea, #appendTextArea {font-family: ' +
      this.state.fontEdit +
      ';}';
    const fontSizeStyle =
      '.CodeMirror, .DynamicEditor, .ProseMirror, #editTextArea, #appendTextArea, #renderedNote {font-size: ' +
      this.state.fontSize +
      ';}';
    const fontViewStyle =
      '#renderedNote {font-family: ' + this.state.fontView + ';}';
    sheet.innerHTML =
      this.state.customStyles +
      '\n' +
      fontEditStyle +
      '\n' +
      fontSizeStyle +
      '\n' +
      fontViewStyle +
      '\n';

    document.body.appendChild(sheet);
  };

  onCancelPrint = () => {
    this.setState(
      {
        confirmPrintURL: false,
      },
      () => {
        const printButton = document.getElementById('printButton');
        if (printButton) {
          printButton.focus();
        }
      }
    );
  };

  onConfirmPrintURL = () => {
    if (!this.state.printMode) {
      this.setState(
        {
          confirmPrintURL: true,
        },
        () => {
          const undoDialog = document.getElementById('undoDialog');
          if (undoDialog) {
            undoDialog.focus();
          }
        }
      );
    } else if (this.state.printMode) {
      this.setState(
        {
          printMode: false,
          viewMode: true,
        },
        () => {
          const printButton = document.getElementById('printButton');
          if (printButton) {
            printButton.focus();
          }
        }
      );
    }
  };

  printURLTrue = () => {
    this.setState({
      confirmPrintURL: false,
      printURL: true,
    });
    this.onPrintMode();
  };

  printURLFalse = () => {
    this.setState({
      confirmPrintURL: false,
      printURL: false,
    });
    this.onPrintMode();
  };

  // Need both content and appendix for mobile
  scrollToBottom = () => {
    document.body.scrollTop = 10000000; // for Safari
    if (this.state.editMode) {
      const editTextArea = document.getElementById(editTextAreaID);
      if (editTextArea) {
        editTextArea.scrollTop = 10000000;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(appendTextAreaID);
      if (appendTextArea) {
        appendTextArea.scrollTop = 10000000;
      }
    }
    const content = document.getElementById(contentID);
    const appendix = document.getElementById(appendixID);
    if (content) {
      content.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      }); // Bottom
    }
    if (appendix) {
      appendix.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      }); // Bottom
    }
  };

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToBottom = () => {
    if (debugMode) {
      console.log('skipped to bottom');
    }
    document.body.scrollTop = 10000000; // for Safari
    if (this.state.editMode) {
      const editTextArea = document.getElementById(editTextAreaID);
      if (editTextArea) {
        editTextArea.scrollTop = 10000000;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(appendTextAreaID);
      if (appendTextArea) {
        appendTextArea.scrollTop = 10000000;
      }
    }
    // We have both content and appendix so the skip works in PrintMode
    const content = document.getElementById(contentID);
    const appendix = document.getElementById(appendixID);
    if (content) {
      content.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      }); // Bottom
    }
    if (appendix) {
      appendix.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      }); // Bottom
    }
  };

  scrollToTop = () => {
    if (this.state.editMode) {
      const editTextArea = document.getElementById(editTextAreaID);
      if (editTextArea) {
        editTextArea.scrollTop = 0;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(appendTextAreaID);
      if (appendTextArea) {
        appendTextArea.scrollTop = 0;
      }
    }
    document.body.scrollTop = 0; // for Safari
    const content = document.getElementById(contentID);
    const header = document.getElementById(headerID);
    if (content) {
      content.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      }); // Top
    }
    if (header) {
      header.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      }); // Top
    }
  };

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToTop = () => {
    if (debugMode) {
      console.log('skipped to top');
    }
    if (this.state.editMode) {
      const editTextArea = document.getElementById(editTextAreaID);
      if (editTextArea) {
        editTextArea.scrollTop = 0;
      }
    }
    if (this.state.appendMode) {
      const appendTextArea = document.getElementById(appendTextAreaID);
      if (appendTextArea) {
        appendTextArea.scrollTop = 0;
      }
    }
    document.body.scrollTop = 0; // for Safari
    const content = document.getElementById(contentID);
    const header = document.getElementById(headerID);
    if (content) {
      content.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      }); // Top
    }
    if (header) {
      header.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      }); // Top
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
          printMode: false,
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
          printMode: false,
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
      if (this.state.useCodeMirror) {
        this.appendTextToNote();
      }
    }
    // Save note if Control and S are pressed
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      if (this.state.useCodeMirror) {
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
      const newLine = document.getElementById(newLineID);
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
      const newParagraph = document.getElementById(newParagraphID);
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

  render() {
    if (!this.state.loadedMetaData) {
      this.loadMetaData();
    }
    return (
      <div
        tabIndex={0}
        className="sn-component"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
      >
        {this.state.showHeader && [
          <div id={headerID}>
            <div className="sk-button-group">
              <button
                type="button"
                id={editButtonID}
                onClick={this.onEditMode}
                title="Toggle Edit Mode"
                className={'sk-button ' + (this.state.editMode ? 'on' : 'off')}
              >
                <svg
                  role="button"
                  aria-label="Pencil icon to toggle edit mode"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7167 7.5L12.5 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.5ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z"
                    fill={
                      this.state.editMode
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </button>
              <button
                type="button"
                id={viewButtonID}
                onClick={this.onViewMode}
                title="Toggle View Mode"
                className={'sk-button ' + (this.state.viewMode ? 'on' : 'off')}
              >
                <svg
                  role="button"
                  aria-label="Eye icon to indicate viewing"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
                    fill={
                      this.state.viewMode
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </button>
              <button
                type="button"
                id={appendButtonID}
                onClick={() => this.onAppendMode()}
                title="Toggle Append Mode"
                className={
                  'sk-button ' + (this.state.appendMode ? 'on' : 'off')
                }
              >
                <svg
                  role="button"
                  aria-label="Plus icon to toggle append mode"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.385 11.385H15.615C16.3799 11.385 17 10.7649 17 10C17 9.23507 16.3799 8.61497 15.615 8.61497H11.385V4.38503C11.385 3.6201 10.7649 3 10 3C9.23507 3 8.61497 3.6201 8.61497 4.38503V8.61497H4.38503C3.6201 8.61497 3 9.23507 3 10C3 10.7649 3.6201 11.385 4.38503 11.385H8.61497V15.615C8.61497 16.3799 9.23507 17 10 17C10.7649 17 11.385 16.3799 11.385 15.615V11.385Z"
                    fill={
                      this.state.appendMode
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
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
                id={helpButtonID}
                onClick={this.onToggleShowHelp}
                title="Help"
                className={'sk-button ' + (this.state.showHelp ? 'on' : 'off')}
              >
                <svg
                  role="button"
                  aria-label="Help icon to show help"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16675 15.0001H10.8334V13.3334H9.16675V15.0001ZM10.0001 1.66675C8.90573 1.66675 7.8221 1.8823 6.81105 2.30109C5.80001 2.71987 4.88135 3.3337 4.10753 4.10753C2.54472 5.67033 1.66675 7.78995 1.66675 10.0001C1.66675 12.2102 2.54472 14.3298 4.10753 15.8926C4.88135 16.6665 5.80001 17.2803 6.81105 17.6991C7.8221 18.1179 8.90573 18.3334 10.0001 18.3334C12.2102 18.3334 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3334 12.2102 18.3334 10.0001C18.3334 8.90573 18.1179 7.8221 17.6991 6.81105C17.2803 5.80001 16.6665 4.88135 15.8926 4.10753C15.1188 3.3337 14.2002 2.71987 13.1891 2.30109C12.1781 1.8823 11.0944 1.66675 10.0001 1.66675ZM10.0001 16.6668C6.32508 16.6668 3.33342 13.6751 3.33342 10.0001C3.33342 6.32508 6.32508 3.33342 10.0001 3.33342C13.6751 3.33342 16.6668 6.32508 16.6668 10.0001C16.6668 13.6751 13.6751 16.6668 10.0001 16.6668ZM10.0001 5.00008C9.11603 5.00008 8.26818 5.35127 7.64306 5.97639C7.01794 6.60151 6.66675 7.44936 6.66675 8.33342H8.33342C8.33342 7.89139 8.50901 7.46747 8.82157 7.1549C9.13413 6.84234 9.55806 6.66675 10.0001 6.66675C10.4421 6.66675 10.866 6.84234 11.1786 7.1549C11.4912 7.46747 11.6667 7.89139 11.6667 8.33342C11.6667 10.0001 9.16675 9.79175 9.16675 12.5001H10.8334C10.8334 10.6251 13.3334 10.4167 13.3334 8.33342C13.3334 7.44936 12.9822 6.60151 12.3571 5.97639C11.732 5.35127 10.8841 5.00008 10.0001 5.00008Z"
                    fill={
                      this.state.showHelp
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </button>
              <button
                type="button"
                id={printButtonID}
                onClick={this.onConfirmPrintURL}
                title="Print"
                className={'sk-button ' + (this.state.printMode ? 'on' : 'off')}
              >
                <svg
                  role="button"
                  aria-label="Printer icon to toggle printer"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0001 2.5H5.00008V5.83333H15.0001V2.5ZM15.8334 10C15.6124 10 15.4004 9.9122 15.2442 9.75592C15.0879 9.59964 15.0001 9.38768 15.0001 9.16667C15.0001 8.94565 15.0879 8.73369 15.2442 8.57741C15.4004 8.42113 15.6124 8.33333 15.8334 8.33333C16.0544 8.33333 16.2664 8.42113 16.4227 8.57741C16.579 8.73369 16.6668 8.94565 16.6668 9.16667C16.6668 9.38768 16.579 9.59964 16.4227 9.75592C16.2664 9.9122 16.0544 10 15.8334 10ZM13.3334 15.8333H6.66675V11.6667H13.3334V15.8333ZM15.8334 6.66667H4.16675C3.50371 6.66667 2.86782 6.93006 2.39898 7.3989C1.93014 7.86774 1.66675 8.50363 1.66675 9.16667V14.1667H5.00008V17.5H15.0001V14.1667H18.3334V9.16667C18.3334 8.50363 18.07 7.86774 17.6012 7.3989C17.1323 6.93006 16.4965 6.66667 15.8334 6.66667Z"
                    fill={
                      this.state.printMode
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </button>
              <button
                type="button"
                id={settingsButtonID}
                onClick={this.onSettingsMode}
                title="Settings"
                className={
                  'sk-button ' + (this.state.settingsMode ? 'on' : 'off')
                }
              >
                <svg
                  role="button"
                  aria-label="Settings gear icon to toggle settings"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0001 6.66675C10.8842 6.66675 11.732 7.01794 12.3571 7.64306C12.9823 8.26818 13.3334 9.11603 13.3334 10.0001C13.3334 10.8841 12.9823 11.732 12.3571 12.3571C11.732 12.9822 10.8842 13.3334 10.0001 13.3334C9.11606 13.3334 8.26821 12.9822 7.64309 12.3571C7.01797 11.732 6.66678 10.8841 6.66678 10.0001C6.66678 9.11603 7.01797 8.26818 7.64309 7.64306C8.26821 7.01794 9.11606 6.66675 10.0001 6.66675ZM10.0001 8.33342C9.55808 8.33342 9.13416 8.50901 8.8216 8.82157C8.50904 9.13413 8.33344 9.55805 8.33344 10.0001C8.33344 10.4421 8.50904 10.866 8.8216 11.1786C9.13416 11.4912 9.55808 11.6667 10.0001 11.6667C10.4421 11.6667 10.8661 11.4912 11.1786 11.1786C11.4912 10.866 11.6668 10.4421 11.6668 10.0001C11.6668 9.55805 11.4912 9.13413 11.1786 8.82157C10.8661 8.50901 10.4421 8.33342 10.0001 8.33342ZM8.33344 18.3334C8.12511 18.3334 7.95011 18.1834 7.91678 17.9834L7.60844 15.7751C7.08344 15.5667 6.63344 15.2834 6.20011 14.9501L4.12511 15.7917C3.94178 15.8584 3.71678 15.7917 3.61678 15.6084L1.95011 12.7251C1.84178 12.5417 1.89178 12.3167 2.05011 12.1917L3.80844 10.8084L3.75011 10.0001L3.80844 9.16675L2.05011 7.80841C1.89178 7.68341 1.84178 7.45841 1.95011 7.27508L3.61678 4.39175C3.71678 4.20841 3.94178 4.13341 4.12511 4.20842L6.20011 5.04175C6.63344 4.71675 7.08344 4.43341 7.60844 4.22508L7.91678 2.01675C7.95011 1.81675 8.12511 1.66675 8.33344 1.66675H11.6668C11.8751 1.66675 12.0501 1.81675 12.0834 2.01675L12.3918 4.22508C12.9168 4.43341 13.3668 4.71675 13.8001 5.04175L15.8751 4.20842C16.0584 4.13341 16.2834 4.20841 16.3834 4.39175L18.0501 7.27508C18.1584 7.45841 18.1084 7.68341 17.9501 7.80841L16.1918 9.16675L16.2501 10.0001L16.1918 10.8334L17.9501 12.1917C18.1084 12.3167 18.1584 12.5417 18.0501 12.7251L16.3834 15.6084C16.2834 15.7917 16.0584 15.8667 15.8751 15.7917L13.8001 14.9584C13.3668 15.2834 12.9168 15.5667 12.3918 15.7751L12.0834 17.9834C12.0501 18.1834 11.8751 18.3334 11.6668 18.3334H8.33344ZM9.37511 3.33341L9.06678 5.50841C8.06678 5.71675 7.18344 6.25008 6.54178 6.99175L4.53344 6.12508L3.90844 7.20841L5.66678 8.50008C5.33344 9.47508 5.33344 10.5334 5.66678 11.5001L3.90011 12.8001L4.52511 13.8834L6.55011 13.0167C7.19178 13.7501 8.06678 14.2834 9.05844 14.4834L9.36678 16.6667H10.6334L10.9418 14.4917C11.9334 14.2834 12.8084 13.7501 13.4501 13.0167L15.4751 13.8834L16.1001 12.8001L14.3334 11.5084C14.6668 10.5334 14.6668 9.47508 14.3334 8.50008L16.0918 7.20841L15.4668 6.12508L13.4584 6.99175C12.8168 6.25008 11.9334 5.71675 10.9334 5.51675L10.6251 3.33341H9.37511Z"
                    fill={
                      this.state.settingsMode
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
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
            </div>
          </div>,
        ]}
        <div
          id={contentID}
          className={
            'content ' + (this.state.printMode ? 'printModeOn' : 'printModeOff')
          }
        >
          {this.state.settingsMode && (
            <Settings
              cancelText="Cancel"
              confirmText="Save"
              customStyles={this.state.customStyles}
              debugMode={debugMode}
              editingMode={this.state.editingMode}
              fontEdit={this.state.fontEdit}
              fontSize={this.state.fontSize}
              fontView={this.state.fontView}
              helpLink={'https://appendeditor.com/#settings'}
              keyMap={keyMap}
              onConfirm={this.onSaveSettings}
              onCancel={this.onSettingsMode}
              appendRows={this.state.appendRows}
              title={`Append Editor Settings`}
              MonacoEditorLanguage={this.state.MonacoEditorLanguage}
              useCodeMirror={this.state.useCodeMirror}
              useDynamicEditor={useDynamicEditor}
              useMonacoEditor={useMonacoEditor}
            />
          )}
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              debugMode={debugMode}
              editingMode={this.state.editingMode}
              fontEdit={this.state.fontEdit}
              fontSize={this.state.fontSize}
              keyMap={keyMap}
              MonacoEditorLanguage={this.state.MonacoEditorLanguage}
              onKeyDown={this.onKeyDown}
              onKeyDownEditTextArea={this.onKeyDownEditTextArea}
              onKeyDownTextArea={this.onKeyDownTextArea}
              onKeyUp={this.onKeyUp}
              printMode={this.state.printMode}
              saveText={this.saveText}
              text={this.state.text}
              useDynamicEditor={useDynamicEditor}
              useMonacoEditor={useMonacoEditor}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              debugMode={debugMode}
              editingMode={this.state.editingMode}
              fontEdit={this.state.fontEdit}
              fontSize={this.state.fontSize}
              keyMap={keyMap}
              MonacoEditorLanguage={this.state.MonacoEditorLanguage}
              onKeyDown={this.onKeyDown}
              onKeyDownEditTextArea={this.onKeyDownEditTextArea}
              onKeyDownTextArea={this.onKeyDownTextArea}
              onKeyUp={this.onKeyUp}
              printMode={this.state.printMode}
              saveText={this.saveText}
              text={this.state.text}
              useDynamicEditor={useDynamicEditor}
              useMonacoEditor={useMonacoEditor}
              viewMode={this.state.viewMode}
            />
          )}
          {(this.state.viewMode || this.state.printMode) &&
            !this.state.refreshView && (
              <ViewNote
                editingMode={this.state.editingMode}
                fontView={this.state.fontView}
                MonacoEditorLanguage={this.state.MonacoEditorLanguage}
                printMode={this.state.printMode}
                printURL={this.state.printURL}
                showHelp={this.state.showHelp}
                saveText={this.saveText}
                text={this.state.text}
                useDynamicEditor={useDynamicEditor}
                useMonacoEditor={useMonacoEditor}
              />
            )}
          {(this.state.viewMode || this.state.printMode) &&
            this.state.refreshView && (
              <ViewNote
                editingMode={this.state.editingMode}
                fontView={this.state.fontView}
                MonacoEditorLanguage={this.state.MonacoEditorLanguage}
                printMode={this.state.printMode}
                printURL={this.state.printURL}
                showHelp={this.state.showHelp}
                saveText={this.saveText}
                text={this.state.text}
                useDynamicEditor={useDynamicEditor}
                useMonacoEditor={useMonacoEditor}
              />
            )}
          {this.state.confirmPrintURL && (
            <PrintDialog
              title={`Would you like to print URLs?`}
              onUndo={this.onCancelPrint}
              onConfirm={this.printURLTrue}
              onCancel={this.printURLFalse}
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
            id={appendixID}
            className={
              'appendix ' +
              (this.state.printMode ? 'printModeOn' : 'printModeOff')
            }
          >
            {this.state.appendMode && (
              <AppendText
                appendTextToNote={this.appendTextToNote}
                autoSaveAppendText={this.autoSaveAppendText}
                autoSaveCheckBoxes={this.autoSaveCheckBoxes}
                debugMode={debugMode}
                editingMode={this.state.editingMode}
                fontEdit={this.state.fontEdit}
                fontSize={this.state.fontSize}
                keyMap={keyMap}
                appendNewLine={this.state.appendNewLine}
                appendNewParagraph={this.state.appendNewParagraph}
                MonacoEditorLanguage={this.state.MonacoEditorLanguage}
                onKeyDown={this.onKeyDown}
                onKeyDownAppendTextArea={this.onKeyDownAppendTextArea}
                onKeyDownTextArea={this.onKeyDownTextArea}
                onKeyUp={this.onKeyUp}
                printMode={this.state.printMode}
                appendRows={this.state.appendRows}
                text={this.state.appendText}
                useDynamicEditor={useDynamicEditor}
                useMonacoEditor={useMonacoEditor}
              />
            )}
            <button
              type="button"
              id="scrollToTopButton"
              onClick={this.scrollToTop}
              className="sk-button info"
            >
              <div className="sk-label"> ▲ </div>
            </button>
            <button
              type="button"
              id="scrollToBottomButton"
              onClick={this.scrollToBottom}
              className="sk-button info"
            >
              <div className="sk-label"> ▼ </div>
            </button>
          </div>,
        ]}
      </div>
    );
  }
}
