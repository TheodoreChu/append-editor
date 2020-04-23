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
  appendMode: false,
  editMode: false,
  viewMode: true,
  showMenu: false,
  showHelp: false,
  refreshEdit: false,
  refreshView: false,
  confirmOpenEdit: false,
  confirmStopEdit: false,
  confirmOpenAppend: false,
  appendTextRetrieved: false,
};

export default class AppendEditor extends React.Component {
  constructor(props) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit() {
    let delegate = new EditorKitDelegate({
      setEditorRawText: text => {

        if (text) {
          this.setState({
            text: text,
          })
        }
        this.setState({
          ...initialState,
          text,
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
      })
      if (note.content.appendText) {
        this.setState({
        appendText: note.content.appendText,
        },
        () => {
        console.log("loaded append text: " + this.state.appendText)
        this.setState({
        appendMode: true
        });
        })
      }
      else {
        this.setState({
        appendMode: true,
        })
      }
    })
  }

  saveNote(text) {
    this.editorKit.onEditorValueChanged(text);
  }

  // Entry operations

  onAppend = ({text}) => {
    if (text) {
    console.log("append attempted")
    const currentText = this.state.text;
    var newText = currentText + text;
    this.editText(newText)
    this.onRefreshEdit();
    console.log("append completed)")
    }
  }

  onSave = ({text}) => {
    this.editText(text);
  }

  onSaveAppendText = ({text}) => {
    this.setState({
      appendText: text,
    })
    let note = this.editorKit.internal.note;
    if (note) {
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.appendText = text; // this.editorKit.internal.note.content.appendText
      })
    }
    console.log("internal appendtext " + this.editorKit.internal.note.content.appendText)
    console.log("appendtext " + this.state.appendText)
  }

  editText = text => {
    this.saveNote(text);
    console.log("text saved")
    this.setState({
      text: text,
    });
    console.log("view refreshed")
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
      var AppendTextArea = document.getElementById("AppendTextArea");
      if (!AppendTextArea.value) { 
        this.setState({
          editMode: true,
          appendMode: false,
        });
      }
      else {
        this.setState({
        editMode: true,
        });
      }
    }
    else if (this.state.editMode) {
      this.setState({
      editMode: false,
      viewMode: true,
      appendMode: true,
      });
    }
    else {
      this.setState({
      editMode: !this.state.editMode,
      });
    }
  };

  onAppendMode = () => {
    if (!this.state.appendMode) {
      this.getAppendText();
      /*this.setState({
      appendMode: true,
      editMode: false,
      }, () => {
      this.scrollToBottom();
      });*/
      this.scrollToBottom();
    }
    else {
      this.setState({
        appendMode: !this.state.appendMode,
      });
    }
  }

  onViewMode = () => {
    this.setState({
      viewMode: !this.state.viewMode,
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
    })
    this.onRefreshView();
  }

  onConfirmOpenEdit = () => {
    this.setState({
      confirmOpenEdit: false,
      editMode: true,
    });
  }

  onCancelOpenEdit = () => {
    this.setState({
      confirmOpenEdit: false,
    });
  }

  onConfirmStopEdit = () => {
    this.setState({
      confirmStopEdit: false,
      editMode: false,
    });
  }

  onCancelStopEdit = () => {
    this.setState({
      confirmStopEdit: false,
    });
  }

  onConfirmOpenAppend = () => {
    this.setState({
      confirmOpenAppend: false,
      appendMode: true,
    });
  }

  onCancelOpenAppend = () => {
    this.setState({
      confirmOpenAppend: false,
    });
  }

  // Need both content and appendix for mobile
  scrollToBottom = () => {
    var content = document.getElementById("content")
    var appendix = document.getElementById("appendix");
    content.scrollIntoView(false); // Bottom
    appendix.scrollIntoView(false); // Bottom
  }

  // Need both content and appendix for mobile
  scrollToTop = () => {
    var content = document.getElementById("content")
    var header = document.getElementById("header");
    content.scrollIntoView(true); // Top
    header.scrollIntoView(true); // Top
  }

  render() {
    if (!this.state.appendTextRetrieved) {
      this.getAppendText();
    }
    return (
      <div className="sn-component">
        <div id="header">
          <div className="sk-button-group">
            <div id="editButton" className="sk-button info" onClick={this.onEditMode}>
              <div className="sk-label">Edit</div>
            </div>
            <div id="appendButton" className="sk-button info" onClick={this.onAppendMode}>
              <div className="sk-label">Append</div>
            </div>
            <div id="viewButton" className="sk-button info" onClick={this.onViewMode}>
              <div className="sk-label">View</div>
            </div>
            <div className="sk-button" onClick={this.onToggleMenu}>
              <div className="sk-label">•••</div>
            </div>
            {this.state.showMenu && ([
            <div  className="sk-button info" onClick={this.onToggleShowHelp}>
              <div className="sk-label">Help</div>
            </div>
            ])}
            {this.state.showMenu && ([
            <div  className="sk-button info">
              <div className="sk-label">Search</div>
            </div>
            ])}
          </div>
        </div>
        <div id="content">
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
            />
          )}
          {this.state.viewMode && !this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
              showHelp={this.state.showHelp}
            />
          )}
          {this.state.viewMode && this.state.refreshView && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
              showHelp={this.state.showHelp}
            />
          )}
          {this.state.confirmOpenEdit && (
            <ConfirmDialog
              title={`⚠️ Warning ⚠️`}
              message="You have unsaved text in your Append Box. Editing and Appending simultaneously may result in data loss. Would you still like to open the Edit box?"
              onConfirm={this.onConfirmOpenEdit}
              onCancel={this.onCancelOpenEdit}
            />
          )}
          {this.state.confirmStopEdit && (
            <ConfirmDialog
              title={`⚠️ Warning ⚠️`}
              message="You have unsaved changes in your Edit box. Would you still like to close it?"
              onConfirm={this.onConfirmStopEdit}
              onCancel={this.onCancelStopEdit}
            />
          )}
          {this.state.confirmOpenAppend && (
            <ConfirmDialog
              title={`⚠️ Warning ⚠️`}
              message="You have unsaved changes in your Edit Box. Editing and Appending simultaneously may result in data loss. Would you still like to open the Append box?"
              onConfirm={this.onConfirmOpenAppend}
              onCancel={this.onCancelOpenAppend}
            />
          )}
          {this.state.confirmHideAppend && (
            <ConfirmDialog
              title={`⚠️ Warning ⚠️`}
              message="You have unsaved text in your Append box. Would you still like to close it?"
              onConfirm={this.onConfirmHideAppend}
              onCancel={this.onCancelHideAppend}
            />
          )}
        </div>
        <div id="appendix">
          {this.state.appendMode && (
            <AppendText
              onAppend={this.onAppend}
              onSaveAppendText={this.onSaveAppendText}
              text={this.state.appendText}
            />
          )}
          <div id="scrollToBottomButton" className="sk-button info" onClick={this.scrollToBottom}>
            <div className="sk-label"> ▼ </div>
          </div>
          <div id="scrollToTopButton" className="sk-button info" onClick={this.scrollToTop}>
            <div className="sk-label"> ▲ </div>
          </div>
        </div>
      </div>
    );
  }
}
