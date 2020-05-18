import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import PrintDialog from './PrintDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';
import Settings from './Settings';

const initialState = {
  text: '',
  appendText: '',
  appendNewLine: false,
  appendNewParagraph: false,
  appendMode: false,
  //editMode: false,
  viewMode: true,
  //showMenu: false,
  showHeader: true,
  showAppendix: true,
  showHelp: false,
  showSettings: false,
  fontEdit: undefined,
  fontView: undefined,
  refreshEdit: false,
  refreshView: false,
  confirmPrintURL: false,
  printURL: true,
  appendTextRetrieved: false,
  appendRows: 5,
};

// TODO: Use a single global keyMap (currently there is also one in EditNote.js and ViewNote.js)
let keyMap = new Map();

export default class AppendEditor extends React.Component {
  constructor(props) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit() {
    let delegate = new EditorKitDelegate({
      setEditorRawText: text => {
        this.setState({
          ...initialState,
          text,
        }, () => {
          this.onRefreshEdit();
        });
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => []
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'plaintext',
      supportsFilesafe: false
    });
  }

  getAppendText = () => {
    this.editorKit.internal.componentManager.streamContextItem((note) => {
      this.setState({
        appendTextRetrieved: true,
      });
      if (note.content.appendEditorFontEdit || note.content.appendEditorFontView) {
        this.setState({
          fontEdit: note.content.appendEditorFontEdit,
          fontView: note.content.appendEditorFontView,
        })
      }
      // If either are true, then they are all defined, so we load them all
      if (note.content.appendNewLine || note.content.appendNewParagraph) {
        this.setState({
        appendText: note.content.appendText,
        appendNewLine: note.content.appendNewLine,
        appendNewParagraph: note.content.appendNewParagraph,
        }, () => {
          this.setState({
            appendMode: true
          });
        });
      }
      // If both are false or undefined and appendText is not empty,
      // Then user has made them both false or are still false by default
      // Therefore we leave them as false (see above for the initial state)
      else if (note.content.appendText) {
        this.setState({
        appendText: note.content.appendText,
        }, () => {
          this.setState({
            appendMode: true
          });
        });
      }
      else {
        this.setState({
        appendMode: true,
        });
      }
      // For debugging:
      //console.log("loaded append text: " + this.state.appendText);
      //console.log("loaded append newline: " + this.state.newLine);
      //console.log("loaded append new paragraph: " + this.state.newParagraph);
      //console.log("internal appendText: " + this.editorKit.internal.note.content.appendText);
    })
  }

  saveNote = (text) => {
    this.editorKit.onEditorValueChanged(text);
  }

  // Entry operations

  onAppend = (text) => {
    // Do nothing if there's no append text
    if (text) {
      /* 
      * We usually use this.editText() to save the main text
      * However, we want to save the main text and clear the appendText
      * Consecutive calls to the component manager does not work well,
      * so we want to do both with one call to the component manager 
      * This means we need multiple versions of this function depending on what we want to save */
      this.setState({
        text: this.state.text.concat(text),
        appendText: '',
      }, () => {
        let note = this.editorKit.internal.note;
        if (note) {
          this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
            note.content.text = this.state.text; // this.editorKit.internal.note.content.text
            note.content.appendText = this.state.appendText; // this.editorKit.internal.note.content.appendText
          });
        }
        this.onRefreshEdit();
      });
    }
  }

  onSave = ({text}) => {
    this.editText(text);
  }

  onSaveAppendText = (text) => {
    // This code is similar to this.onAppend();, but we only save the appendText and not the main text
    this.setState({
      appendText: text,
    });
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendText = text;
      });
    }
  }

  onSaveAppendTextAndCheckboxes = (text, newLine, newParagraph) => {
    // Here we save the appendText, appendNewLine, and appendNewParagraph
    // We have an additional function for this because we only call it when the user clicks a checkbox
    this.setState({
      appendText: text,
      appendNewLine: newLine,
      appendNewParagraph: newParagraph,
    })
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendText = text;
        note.content.appendNewLine = newLine;
        note.content.appendNewParagraph = newParagraph
      });
    }
  }

  editText = (text) => {
    this.saveNote(text);
    console.log("text saved:" + text );
    this.setState({
      text: text,
    });
  };

  onRefreshEdit = () => {
    this.setState({
      refreshEdit: !this.state.refreshEdit,
    });
  }

  onRefreshView = () => {
    this.setState({
      refreshView: !this.state.refreshView,
    });
  }

  // Event Handlers
  onEditMode = () => {
    // if Append box is empty, close it and open Edit mode
    // if Edit mode is on, then close it, open View mode, and Append mode
    if (this.state.appendMode && !this.state.editMode) {
      var appendTextArea = document.getElementById("appendTextArea");
      if (!appendTextArea.value) { 
        this.setState({
          appendMode: false,
        });
      }
      this.setState({
        editMode: true,
        }, () => {
          var editTextArea = document.getElementById("editTextArea");
          editTextArea.focus();
        });
    }
    // If edit mode is on and print mode is off, then turn edit mode off and turn view mode on
    else if (this.state.editMode && !this.state.printMode) {
      this.setState({
      editMode: false,
      viewMode: true,
      }, () => {
        var editButton = document.getElementById("editButton");
        editButton.focus();
        });
    }
    else if (!this.state.editMode) {
      this.setState({
      editMode: !this.state.editMode,
      }, () => {
        var editTextArea = document.getElementById("editTextArea");
        editTextArea.focus();
        });
    }
    else {
      this.setState({
        editMode: !this.state.editMode,
        }, () => {
          var editButton = document.getElementById("editButton");
          editButton.focus();
        });
    }
  };

  onAppendMode = () => {
    if (!this.state.appendMode) {
      this.getAppendText();
      this.setState({
      appendMode: true,
      editMode: false,
      }, () => {
      this.scrollToBottom();
      var appendTextArea = document.getElementById("appendTextArea");
      appendTextArea.focus();
      });
      if (!this.state.printMode) {
        this.setState({
          viewMode: true
        })
      }
    }
    else if (this.state.appendMode) {
      this.setState({
        appendMode: false,
      }, () => {
        var content = document.getElementById("appendButton");
        content.focus();
        });
    }
  }

  onPrintMode = () => {
    this.setState({
    showHeader: false,
    showAppendix: false,
    editMode: false,
    printMode: true,
    viewMode: false,
    refreshView: !this.state.refreshView,
    }, () => {
      window.print();
      this.setState({
        showHeader: true,
        showAppendix: true,
      }, () => {
        var printButton = document.getElementById("printButton");
        printButton.focus();
      })
    });
  }

  onViewMode = () => {
    this.setState({
      viewMode: !this.state.viewMode,
      printMode: false,
    }, () => {
      if (this.state.appendMode && !this.state.editMode) {
        this.skipToBottom();
      }
    });
  }

  onToggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  onToggleShowHelp = () => {
    this.setState({
      showHelp: !this.state.showHelp,
    }, () => {
      this.onRefreshView();
      var helpButton = document.getElementById("helpButton");
      helpButton.focus();
    });
  }

  onToggleShowSettings = () => {
    if (this.state.showSettings) {
      this.setState({
        showSettings: false,
      }, () => {
        var settingsButton = document.getElementById("settingsButton");
        settingsButton.focus();
      });
    }
    else if (!this.state.showSettings) {
      this.setState({
        showSettings: !this.state.showSettings,
      }, () => {
        var undoDialog = document.getElementById("undoDialog");
        undoDialog.focus();
      });
    }
  }

  onConfirmSettings = ({fontEdit}, {fontView}) => {
    this.setState({
      fontEdit: fontEdit,
      fontView: fontView,
      showSettings: false,
    });
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendEditorFontEdit = fontEdit;
        note.content.appendEditorFontView = fontView;
      });
    }
  }

  onCancelPrint = () => {
    this.setState({
      confirmPrintURL: false,
    }, () => {
      var printButton = document.getElementById("printButton");
      printButton.focus();
    });
  }
  
  onConfirmPrintURL = () => {
    if (!this.state.printMode) {
      this.setState({
        confirmPrintURL: true,
      }, () => {
        var undoDialog = document.getElementById("undoDialog");
        undoDialog.focus();
      });
    }
    else if (this.state.printMode) {
      this.setState({
        printMode: false,
        viewMode: true,
      }, () => {
        var printButton = document.getElementById("printButton");
        printButton.focus();
      });
    }
  }

  printURLTrue = () => {
    this.setState({
      confirmPrintURL: false,
      printURL: true,
    });
    this.onPrintMode();
  }

  printURLFalse = () => {
    this.setState({
      confirmPrintURL: false,
      printURL: false,
    });
    this.onPrintMode();
  }

  // Need both content and appendix for mobile
  scrollToBottom = () => {
    var content = document.getElementById("content");
    var appendix = document.getElementById("appendix");
    if (this.state.editMode) {
      var textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 10000000;
    }
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
    appendix.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
  }

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToBottom = () => {
    var content = document.getElementById("content");
    var appendix = document.getElementById("appendix");
    if (this.state.editMode) {
      var textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 10000000;
    }
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"}); // Bottom
    appendix.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"}); // Bottom
  }

  // Need both content and appendix for mobile
  scrollToTop = () => {
    var content = document.getElementById("content")
    var header = document.getElementById("header");
    if (this.state.editMode) {
      var textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 0;
    }
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
    header.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
  }

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToTop = () => {
    var content = document.getElementById("content")
    var header = document.getElementById("header");
    if (this.state.editMode) {
      var textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 0;
    }
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({behavior: "auto", block: "start", inline: "nearest"}); // Top
    header.scrollIntoView({behavior: "auto", block: "start", inline: "nearest"}); // Top
  }

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    // Click the top Append if 'Control' and 'e' are pressed
    if (keyMap.get('Control') && keyMap.get('e')) {
      e.preventDefault();
      this.onEditMode();
    }
    // Click the top Append if 'Control' and 'u' are pressed
    else if (keyMap.get('Control') && !keyMap.get('Alt') && keyMap.get('u')) {
      e.preventDefault();
      this.onAppendMode();
    }
    // Click view if 'Control' and 'p' are pressed
    else if (keyMap.get('Control') && keyMap.get('p')) {
      e.preventDefault();
      this.onViewMode();
    }
    else if (keyMap.get('Control') && keyMap.get('.')) {
      e.preventDefault();
      this.setState({
        appendRows: this.state.appendRows + 1,
      });
    }
    else if (keyMap.get('Control') && keyMap.get(',')) {
      e.preventDefault();
      if (this.state.appendRows > 5) {
        this.setState({
          appendRows: this.state.appendRows - 1,
        });
      }
    }
    else if (keyMap.get('Control') && keyMap.get('ArrowUp')) {
      e.preventDefault();
      this.scrollToTop();
    }
    else if (keyMap.get('Control') && keyMap.get('ArrowDown')) {
      e.preventDefault();
      this.scrollToBottom();
    }
    else if (keyMap.get('Control') && keyMap.get('[')) {
      e.preventDefault();
      this.skipToTop();
    }
    else if (keyMap.get('Control') && keyMap.get(']')) {
      e.preventDefault();
      this.skipToBottom();
    }
    console.log("")
    // TODO: If you close it with Ctrl + W and open it again, the Ctrl event key isn't set to false
    // So, if you have minimize to tray on, then it'll open with Ctrl still down
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  }

  render() {
    if (!this.state.appendTextRetrieved) {
      this.getAppendText();
    }
    /*
    <button type="button" id="menuButton" onClick={this.onToggleMenu} className="sk-button">
      <div className="sk-label"> ••• </div>
    </button>
    {this.state.showMenu && ([
    <button type="button" id="helpButton" onClick={this.onToggleShowHelp} className="sk-button info">
      <div className="sk-label"> Help </div>
    </button>
    ])}
    {this.state.showMenu && ([
    <button type="button" id="settingsButton" onClick={this.onToggleShowHelp} className="sk-button info">
    <div className="sk-label"> Settings </div>
    </button>
    ])}
    */
    return (
      <div tabIndex="0" className="sn-component" onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
        {this.state.showHeader && ([
        <div id="header">
          <div className="sk-button-group">
            <button type="button" id="editButton" onClick={this.onEditMode} className={"sk-button info " + (this.state.editMode ? 'on' : 'off' )}>
              <div className="sk-label"> Edit </div>
            </button>
            <button type="button" id="appendButton" onClick={this.onAppendMode} className={"sk-button info " + (this.state.appendMode ? 'on' : 'off' )}>
              <div className="sk-label"> Append </div>
            </button>
            <button type="button" id="viewButton" onClick={this.onViewMode} className={"sk-button info " + (this.state.viewMode ? 'on' : 'off' )}>
              <div className="sk-label"> View </div>
            </button>
            <button type="button" id="helpButton" onClick={this.onToggleShowHelp} className={"sk-button " + (this.state.showHelp ? 'info on' : 'off' )}>
              <div className="sk-label">
                <img src="icons/ic-help.svg"/>
              </div>
            </button>
            <button type="button" id="printButton" onClick={this.onConfirmPrintURL} className={"sk-button " + ((this.state.printMode) ? 'info on' : 'off' )}>
              <div className="sk-label"> 
                <img src="icons/ic-print.svg"/>
              </div>
            </button>
              <button type="button" id="settingsButton" onClick={this.onToggleShowSettings} className={"sk-button " + ((this.state.showSettings) ? 'info on' : 'off' )}>
              <div className="sk-label">
                <img src="icons/ic-settings.svg"/>
              </div>
              </button>
          </div>
        </div>
        ])}
        <div id="content" 
        className={ "content "  + (this.state.printMode ? 'printModeOn' : 'printModeOff' )}>
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              printMode={this.state.printMode}
              fontEdit={this.state.fontEdit}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              printMode={this.state.printMode}
              fontEdit={this.state.fontEdit}
            />
          )}
          {(this.state.viewMode || this.state.printMode) && !this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              showHelp={this.state.showHelp}
              printMode={this.state.printMode}
              printURL={this.state.printURL}
              fontView={this.state.fontView}
            />
          )}
          {(this.state.viewMode || this.state.printMode) && this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              showHelp={this.state.showHelp}
              printMode={this.state.printMode}
              printURL={this.state.printURL}
              fontView={this.state.fontView}
            />
          )}
          {this.state.showSettings && (
              <Settings
              title={`Settings`}
              onConfirm={this.onConfirmSettings}
              onCancel={this.onToggleShowSettings}
              helpLink={"https://appendeditor.com/#settings"}
              confirmText="Save"
              cancelText="Cancel"
              fontEdit={this.state.fontEdit}
              fontView={this.state.fontView}
            />
          )}
          {this.state.confirmPrintURL && (
            <PrintDialog
              title={`Would you like to print URLs?`}
              onUndo={this.onCancelPrint}
              onConfirm={this.printURLTrue}
              onCancel={this.printURLFalse}
              helpLink={"https://appendeditor.com/#printing"}
              confirmText="Yes, print URLs"
              cancelText="No, thanks"
            />
          )}
        </div>
        {this.state.showAppendix && ([
        <div id="appendix" className={ "appendix "  + (this.state.printMode ? 'printModeOn' : 'printModeOff' )}>
          {this.state.appendMode && (
            <AppendText
              onAppend={this.onAppend}
              onSaveAppendText={this.onSaveAppendText}
              onSaveAppendTextAndCheckboxes={this.onSaveAppendTextAndCheckboxes}
              text={this.state.appendText}
              newLine={this.state.appendNewLine}
              newParagraph={this.state.appendNewParagraph}
              printMode={this.state.printMode}
              rows={this.state.appendRows}
              fontEdit={this.state.fontEdit}
            />
          )}
          <button type="button" id="scrollToTopButton" onClick={this.scrollToTop} className="sk-button info">
            <div className="sk-label"> ▲ </div>
          </button>
          <button type="button" id="scrollToBottomButton" onClick={this.scrollToBottom} className="sk-button info">
            <div className="sk-label"> ▼ </div>
          </button>
        </div>
        ])}
      </div>
    );
  }
}