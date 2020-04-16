import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import ConfirmDialog from './ConfirmDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';

const initialState = {
  text: '',
  autoSave: true,
  appendMode: true,
  editMode: false,
  viewMode: true,
  showMenu: false,
  showHelp: false,
  refreshEdit: false,
  refreshView: false,
  confirmAutoSaveOff: false,
  confirmOpenEdit: false,
  confirmStopEdit: false,
  confirmHideAppend: false,
  confirmOpenAppend: false,
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
    // if the append area has text and edit mode is off,
    // ask user if they want to confirm opening the edit box
    if (this.state.appendMode && !this.state.editMode) {
      var AppendTextArea = document.getElementById("AppendTextArea");
      if (AppendTextArea.value && !this.state.editMode) { 
        this.setState({
          confirmOpenEdit: true,
        });
      }
      else {
        this.setState({
        editMode: true,
        appendMode: false,
        });
      }
    }
    else if (this.state.editMode) {
      // if you have unsaved text, confirm if you want to save it
      // if there's no unsaved text, close the edit box and open append
      var EditTextArea = document.getElementById("EditTextArea");
      if (!(EditTextArea.value === this.state.text)) { 
        this.setState({
          confirmStopEdit: true,
        });
      }
      else {
        this.setState({
        editMode: false,
        viewMode: true,
        appendMode: true,
        });
      }
    }
    else if (!this.state.editMode) {
      this.setState({
      editMode: true,
      });
    }
  };

  onAppendMode = () => {
    if (this.state.appendMode) {
      var AppendTextArea = document.getElementById("AppendTextArea");
      if (AppendTextArea.value) { 
        this.setState({
          confirmHideAppend: true,
        });
      }
      else {
        this.setState({
          appendMode: !this.state.appendMode,
        });
      }
    }
    else if (this.state.editMode && !this.state.appendMode) {
      var EditTextArea = document.getElementById("EditTextArea");
      if (!(EditTextArea.value === this.state.text)) { 
        this.setState({
          confirmOpenAppend: true,
        });
      }
      else {
        this.setState({
        editMode: false,
        appendMode: true,
        });
      }
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

  onToggleAutoSave = () => {
    if (this.state.autoSave) {
      this.setState({
        confirmAutoSaveOff: true,
      })
    }
    else {
      this.setState({
        autoSave: true,
      })
      if (this.state.editMode) {
        alert("You turned AutoSave ON. Please save your work and refresh your edit box.");
      }
    }
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

  onConfirmHideAppend = () => {
    this.setState({
      confirmHideAppend: false,
      appendMode: false,
    });
  }

  onCancelHideAppend = () => {
    this.setState({
      confirmHideAppend: false,
    });
  }

  onConfirmAutoSaveOff = () => {
    this.setState({
      confirmAutoSaveOff: false,
      autoSave: false,
    });
    this.onRefreshEdit();
  }

  onCancelAutoSaveOff = () => {
    this.setState({
      confirmAutoSaveOff: false,
    });
  }

  render() {
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
            {this.state.showMenu && this.state.autoSave && ([
            <div  className="sk-button info" onClick={this.onToggleAutoSave}>
              <div className="sk-label">AutoSave: ON</div>
            </div>
            ])}
            {this.state.showMenu && !this.state.autoSave && ([
            <div  className="sk-button info" onClick={this.onToggleAutoSave}>
              <div className="sk-label">AutoSave: OFF</div>
            </div>
            ])}
          </div>
        </div>
        <div id="content">
          {this.state.editMode && !this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              autoSave={this.state.autoSave}
            />
          )}
          {this.state.editMode && this.state.refreshEdit && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
              autoSave={this.state.autoSave}
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
          {this.state.confirmAutoSaveOff && (
            <ConfirmDialog
              title={`⚠️ Warning ⚠️`}
              message="Are you sure you want to turn AutoSave OFF?"
              onConfirm={this.onConfirmAutoSaveOff}
              onCancel={this.onCancelAutoSaveOff}
            />
          )}
        </div>
        <div id="appendix">
          {this.state.appendMode && (
            <AppendText
              onAppend={this.onAppend}
            />
          )}
        </div>
      </div>
    );
  }
}
