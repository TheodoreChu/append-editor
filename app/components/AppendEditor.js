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
  appendTextRetrieved: false,
  appendRows: 5,
  confirmPrintURL: false,
  customStyles: "",
  customStylesActivated: false,
  //editMode: false,
  //showMenu: false,
  fontEdit: undefined,
  fontView: undefined,
  printURL: true,
  refreshEdit: false,
  refreshView: false,
  showHeader: true,
  showAppendix: true,
  showHelp: false,
  showSettings: false,
  viewMode: true,
};

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
      if (note.content.appendEditorFontEdit || note.content.appendEditorFontView || note.content.appendEditorCustomStyles) {
        this.setState({
          customStyles: note.content.appendEditorCustomStyles,
          fontEdit: note.content.appendEditorFontEdit,
          fontView: note.content.appendEditorFontView,
        }, () => {
          this.activateStyles();
        });
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
    //console.log("text saved:" + text );
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
      const appendTextArea = document.getElementById("appendTextArea");
      if (!appendTextArea.value) { 
        this.setState({
          appendMode: false,
        });
      }
      this.setState({
        editMode: true,
        }, () => {
          const editTextArea = document.getElementById("editTextArea");
          editTextArea.focus();
        });
    }
    // If edit mode is on and print mode is off, then turn edit mode off and turn view mode on
    else if (this.state.editMode && !this.state.printMode) {
      this.setState({
      editMode: false,
      viewMode: true,
      }, () => {
        const editButton = document.getElementById("editButton");
        editButton.focus();
        });
    }
    else if (!this.state.editMode) {
      this.setState({
      editMode: !this.state.editMode,
      }, () => {
        const editTextArea = document.getElementById("editTextArea");
        editTextArea.focus();
        });
    }
    else {
      this.setState({
        editMode: !this.state.editMode,
        }, () => {
          const editButton = document.getElementById("editButton");
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
      const appendTextArea = document.getElementById("appendTextArea");
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
        const content = document.getElementById("appendButton");
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
        const printButton = document.getElementById("printButton");
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
      const helpButton = document.getElementById("helpButton");
      helpButton.focus();
    });
  }

  onToggleShowSettings = () => {
    if (this.state.showSettings) {
      this.setState({
        showSettings: false,
      }, () => {
        const settingsButton = document.getElementById("settingsButton");
        settingsButton.focus();
      });
    }
    else if (!this.state.showSettings) {
      this.setState({
        showSettings: !this.state.showSettings,
      }, () => {
        const undoDialog = document.getElementById("undoDialog");
        undoDialog.focus();
      });
    }
  }

  onConfirmSettings = ({fontEdit}, {fontView}, {customStyles}) => {
    this.setState({
      customStyles: customStyles,
      fontEdit: fontEdit,
      fontView: fontView,
      showSettings: false,
    }, () => {
      this.activateStyles();
    });
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendEditorCustomStyles = customStyles;
        note.content.appendEditorFontEdit = fontEdit;
        note.content.appendEditorFontView = fontView;
      });
    }
  }

  activateStyles = () => {
    if (this.state.customStylesActivated) {
      const sheetToBeRemoved = document.getElementById('customStyleSheet');
      const sheetParent = sheetToBeRemoved.parentNode;
      sheetParent.removeChild(sheetToBeRemoved);
    }
    const sheet = document.createElement('style');
    sheet.setAttribute("id", "customStyleSheet");
    sheet.innerHTML = this.state.customStyles;
    document.body.appendChild(sheet);
    this.setState({
      customStylesActivated: true,
    });
  }

  onCancelPrint = () => {
    this.setState({
      confirmPrintURL: false,
    }, () => {
      const printButton = document.getElementById("printButton");
      printButton.focus();
    });
  }
  
  onConfirmPrintURL = () => {
    if (!this.state.printMode) {
      this.setState({
        confirmPrintURL: true,
      }, () => {
        const undoDialog = document.getElementById("undoDialog");
        undoDialog.focus();
      });
    }
    else if (this.state.printMode) {
      this.setState({
        printMode: false,
        viewMode: true,
      }, () => {
        const printButton = document.getElementById("printButton");
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
    const content = document.getElementById("content");
    const appendix = document.getElementById("appendix");
    if (this.state.editMode) {
      const textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 10000000;
    }
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
    appendix.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}); // Bottom
  }

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToBottom = () => {
    const content = document.getElementById("content");
    const appendix = document.getElementById("appendix");
    if (this.state.editMode) {
      const textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 10000000;
    }
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"}); // Bottom
    appendix.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"}); // Bottom
  }

  // Need both content and appendix for mobile
  scrollToTop = () => {
    const content = document.getElementById("content")
    const header = document.getElementById("header");
    if (this.state.editMode) {
      const textarea = document.getElementById("editTextArea");
      textarea.scrollTop = 0;
    }
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
    header.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}); // Top
  }

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToTop = () => {
    const content = document.getElementById("content")
    const header = document.getElementById("header");
    if (this.state.editMode) {
      const textarea = document.getElementById("editTextArea");
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
    else if (keyMap.get('Control') && keyMap.get('{')) {
      e.preventDefault();
      this.scrollToTop();
    }
    else if (keyMap.get('Control') && keyMap.get('}')) {
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
    //console.log("")
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
            <button type="button" id="editButton" onClick={this.onEditMode} title="Toggle Edit" className={"sk-button info " + (this.state.editMode ? 'on' : 'off' )}>
              <div className="sk-label"> Edit </div>
            </button>
            <button type="button" id="appendButton" onClick={this.onAppendMode} title="Toggle Append" className={"sk-button info " + (this.state.appendMode ? 'on' : 'off' )}>
              <div className="sk-label"> Append </div>
            </button>
            <button type="button" id="viewButton" onClick={this.onViewMode} title="Toggle View" className={"sk-button info " + (this.state.viewMode ? 'on' : 'off' )}>
              <div className="sk-label"> View </div>
            </button>
            <button type="button" id="helpButton" onClick={this.onToggleShowHelp} title="Help" className={"sk-button"}>
              <div className="sk-label">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16675 15.0001H10.8334V13.3334H9.16675V15.0001ZM10.0001 1.66675C8.90573 1.66675 7.8221 1.8823 6.81105 2.30109C5.80001 2.71987 4.88135 3.3337 4.10753 4.10753C2.54472 5.67033 1.66675 7.78995 1.66675 10.0001C1.66675 12.2102 2.54472 14.3298 4.10753 15.8926C4.88135 16.6665 5.80001 17.2803 6.81105 17.6991C7.8221 18.1179 8.90573 18.3334 10.0001 18.3334C12.2102 18.3334 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3334 12.2102 18.3334 10.0001C18.3334 8.90573 18.1179 7.8221 17.6991 6.81105C17.2803 5.80001 16.6665 4.88135 15.8926 4.10753C15.1188 3.3337 14.2002 2.71987 13.1891 2.30109C12.1781 1.8823 11.0944 1.66675 10.0001 1.66675ZM10.0001 16.6668C6.32508 16.6668 3.33342 13.6751 3.33342 10.0001C3.33342 6.32508 6.32508 3.33342 10.0001 3.33342C13.6751 3.33342 16.6668 6.32508 16.6668 10.0001C16.6668 13.6751 13.6751 16.6668 10.0001 16.6668ZM10.0001 5.00008C9.11603 5.00008 8.26818 5.35127 7.64306 5.97639C7.01794 6.60151 6.66675 7.44936 6.66675 8.33342H8.33342C8.33342 7.89139 8.50901 7.46747 8.82157 7.1549C9.13413 6.84234 9.55806 6.66675 10.0001 6.66675C10.4421 6.66675 10.866 6.84234 11.1786 7.1549C11.4912 7.46747 11.6667 7.89139 11.6667 8.33342C11.6667 10.0001 9.16675 9.79175 9.16675 12.5001H10.8334C10.8334 10.6251 13.3334 10.4167 13.3334 8.33342C13.3334 7.44936 12.9822 6.60151 12.3571 5.97639C11.732 5.35127 10.8841 5.00008 10.0001 5.00008Z" fill={((this.state.showHelp) ? "var(--sn-stylekit-info-color)" : "var(--sn-stylekit-foreground-color)")}/>
              </svg>
              </div>
            </button>
            <button type="button" id="printButton" onClick={this.onConfirmPrintURL} title="Print" className={"sk-button"}>
              <div className="sk-label"> 
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0001 2.5H5.00008V5.83333H15.0001V2.5ZM15.8334 10C15.6124 10 15.4004 9.9122 15.2442 9.75592C15.0879 9.59964 15.0001 9.38768 15.0001 9.16667C15.0001 8.94565 15.0879 8.73369 15.2442 8.57741C15.4004 8.42113 15.6124 8.33333 15.8334 8.33333C16.0544 8.33333 16.2664 8.42113 16.4227 8.57741C16.579 8.73369 16.6668 8.94565 16.6668 9.16667C16.6668 9.38768 16.579 9.59964 16.4227 9.75592C16.2664 9.9122 16.0544 10 15.8334 10ZM13.3334 15.8333H6.66675V11.6667H13.3334V15.8333ZM15.8334 6.66667H4.16675C3.50371 6.66667 2.86782 6.93006 2.39898 7.3989C1.93014 7.86774 1.66675 8.50363 1.66675 9.16667V14.1667H5.00008V17.5H15.0001V14.1667H18.3334V9.16667C18.3334 8.50363 18.07 7.86774 17.6012 7.3989C17.1323 6.93006 16.4965 6.66667 15.8334 6.66667Z" fill={((this.state.printMode) ? "var(--sn-stylekit-info-color)" : "var(--sn-stylekit-foreground-color)")}/>
              </svg>
              </div>
            </button>
              <button type="button" id="settingsButton" onClick={this.onToggleShowSettings} title="Settings" className={"sk-button"}>
              <div className="sk-label">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0001 6.66675C10.8842 6.66675 11.732 7.01794 12.3571 7.64306C12.9823 8.26818 13.3334 9.11603 13.3334 10.0001C13.3334 10.8841 12.9823 11.732 12.3571 12.3571C11.732 12.9822 10.8842 13.3334 10.0001 13.3334C9.11606 13.3334 8.26821 12.9822 7.64309 12.3571C7.01797 11.732 6.66678 10.8841 6.66678 10.0001C6.66678 9.11603 7.01797 8.26818 7.64309 7.64306C8.26821 7.01794 9.11606 6.66675 10.0001 6.66675ZM10.0001 8.33342C9.55808 8.33342 9.13416 8.50901 8.8216 8.82157C8.50904 9.13413 8.33344 9.55805 8.33344 10.0001C8.33344 10.4421 8.50904 10.866 8.8216 11.1786C9.13416 11.4912 9.55808 11.6667 10.0001 11.6667C10.4421 11.6667 10.8661 11.4912 11.1786 11.1786C11.4912 10.866 11.6668 10.4421 11.6668 10.0001C11.6668 9.55805 11.4912 9.13413 11.1786 8.82157C10.8661 8.50901 10.4421 8.33342 10.0001 8.33342ZM8.33344 18.3334C8.12511 18.3334 7.95011 18.1834 7.91678 17.9834L7.60844 15.7751C7.08344 15.5667 6.63344 15.2834 6.20011 14.9501L4.12511 15.7917C3.94178 15.8584 3.71678 15.7917 3.61678 15.6084L1.95011 12.7251C1.84178 12.5417 1.89178 12.3167 2.05011 12.1917L3.80844 10.8084L3.75011 10.0001L3.80844 9.16675L2.05011 7.80841C1.89178 7.68341 1.84178 7.45841 1.95011 7.27508L3.61678 4.39175C3.71678 4.20841 3.94178 4.13341 4.12511 4.20842L6.20011 5.04175C6.63344 4.71675 7.08344 4.43341 7.60844 4.22508L7.91678 2.01675C7.95011 1.81675 8.12511 1.66675 8.33344 1.66675H11.6668C11.8751 1.66675 12.0501 1.81675 12.0834 2.01675L12.3918 4.22508C12.9168 4.43341 13.3668 4.71675 13.8001 5.04175L15.8751 4.20842C16.0584 4.13341 16.2834 4.20841 16.3834 4.39175L18.0501 7.27508C18.1584 7.45841 18.1084 7.68341 17.9501 7.80841L16.1918 9.16675L16.2501 10.0001L16.1918 10.8334L17.9501 12.1917C18.1084 12.3167 18.1584 12.5417 18.0501 12.7251L16.3834 15.6084C16.2834 15.7917 16.0584 15.8667 15.8751 15.7917L13.8001 14.9584C13.3668 15.2834 12.9168 15.5667 12.3918 15.7751L12.0834 17.9834C12.0501 18.1834 11.8751 18.3334 11.6668 18.3334H8.33344ZM9.37511 3.33341L9.06678 5.50841C8.06678 5.71675 7.18344 6.25008 6.54178 6.99175L4.53344 6.12508L3.90844 7.20841L5.66678 8.50008C5.33344 9.47508 5.33344 10.5334 5.66678 11.5001L3.90011 12.8001L4.52511 13.8834L6.55011 13.0167C7.19178 13.7501 8.06678 14.2834 9.05844 14.4834L9.36678 16.6667H10.6334L10.9418 14.4917C11.9334 14.2834 12.8084 13.7501 13.4501 13.0167L15.4751 13.8834L16.1001 12.8001L14.3334 11.5084C14.6668 10.5334 14.6668 9.47508 14.3334 8.50008L16.0918 7.20841L15.4668 6.12508L13.4584 6.99175C12.8168 6.25008 11.9334 5.71675 10.9334 5.51675L10.6251 3.33341H9.37511Z" fill={((this.state.showSettings) ? "var(--sn-stylekit-info-color)" : "var(--sn-stylekit-foreground-color)")}/>
              </svg>
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
              customStyles={this.state.customStyles}
              fontEdit={this.state.fontEdit}
              fontView={this.state.fontView}
              rows={this.state.appendRows}
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