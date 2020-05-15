import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import ConfirmDialog from './ConfirmDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';

const initialState = {
  text: '',
  appendText: '',
  appendNewLine: false,
  appendNewParagraph: false,
  appendMode: false,
  //editMode: false,
  viewMode: true,
  showMenu: false,
  showHeader: true,
  showAppendix: true,
  showHelp: false,
  refreshEdit: false,
  refreshView: false,
  confirmPrintURL: false,
  printURL: true,
  appendTextRetrieved: false,
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
    })
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
      viewMode: true,
    })
    this.onRefreshView();
  }

  onUndoPrint = () => {
    this.setState({
      confirmPrintURL: false,
      printMode: false,
    }, () => {
      var printButton = document.getElementById("printButton");
      printButton.focus();
    });
  }
  
  confirmPrintURL = () => {
    if (!this.state.printMode) {
      this.setState({
        confirmPrintURL: true,
      }, () => {
        var printHelpButton = document.getElementById("printHelpButton");
        printHelpButton.focus();
      });
    }
    else if (this.state.printMode) {
      this.setState({
        printMode: false,
        viewMode: true,
        confirmPrintURL: false,
      });
    }
  }

  onConfirmPrintURL = () => {
    this.setState({
      confirmPrintURL: false,
      printURL: true,
    });
    this.onPrintMode();
  }

  onCancelPrintURL = () => {
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
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
    appendix.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
  }

  // Need both content and appendix for mobile
  scrollToTop = () => {
    var content = document.getElementById("content")
    var header = document.getElementById("header");
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
    header.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
  }

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    // Click the top Append if 'Control' and 'e' are pressed
    if (keyMap.get('Control') && keyMap.get('e')) {
      e.preventDefault();
      var editButton = document.getElementById("editButton");
      editButton.click();
    }
    // Click the top Append if 'Control' and 'u' are pressed
    else if (keyMap.get('Control') && !keyMap.get('Alt') && keyMap.get('u')) {
      e.preventDefault();
      var appendButton = document.getElementById("appendButton");
      appendButton.click();
    }
    // Click view if 'Control' and 'p' are pressed
    else if (keyMap.get('Control') && keyMap.get('p')) {
      e.preventDefault();
      var viewButton = document.getElementById("viewButton");
      viewButton.click();
    }
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
            <button type="button" id="helpButton" onClick={this.onToggleShowHelp} className={"sk-button info " + (this.state.showHelp ? 'on' : 'off' )}>
              <div className="sk-label"> Help </div>
            </button>
            <button type="button" id="printButton" onClick={this.confirmPrintURL} className={"sk-button info " + ((this.state.printMode) ? 'on' : 'off' )}>
              <div className="sk-label"> Print </div>
            </button>
          </div>
        </div>
        ])}
        <div id="content" className={ "content "  + (this.state.printMode ? 'printModeOn' : 'printModeOff' )}>
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              printMode={this.state.printMode}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              printMode={this.state.printMode}
            />
          )}
          {(this.state.viewMode || this.state.printMode) && !this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
              showHelp={this.state.showHelp}
              printMode={this.state.printMode}
              printURL={this.state.printURL}
            />
          )}
          {(this.state.viewMode || this.state.printMode) && this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
              showHelp={this.state.showHelp}
              printMode={this.state.printMode}
              printURL={this.state.printURL}
            />
          )}
          {this.state.confirmPrintURL && (
            <ConfirmDialog
              title={`Preparing to print...`}
              message="Would you like to print URLs?"
              onUndo={this.onUndoPrint}
              onConfirm={this.onConfirmPrintURL}
              onCancel={this.onCancelPrintURL}
              helpLink={"https://appendeditor.com/#printing"}
              confirmText="Yes"
              cancelText="No"
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