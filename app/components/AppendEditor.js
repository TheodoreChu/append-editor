import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import ConfirmDialog from './ConfirmDialog';
import EditNote from './EditNote';
import ViewNote from './ViewNote';
import AppendText from './AppendText';

const initialState = {
  text: '',
  appendMode: true,
  editMode: false,
  viewMode: true,
  refreshStatus: false,
  confirmEdit: false,
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
          //...initialState,
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
    console.log("append attempted")
    const currentText = this.state.text;
    var newText = currentText + text;
    this.editText(newText)
    this.onRefresh();
    console.log("append completed)")
  }

  onSave = ({text}) => {
    this.editText(text);
  }

  editText = text => {
    this.saveNote(text);
    console.log("text saved")
    this.setState({
      text:text,
    });
    console.log("view refreshed")
  };

  onRefresh = () => {
    this.setState({
      refreshStatus: !this.state.refreshStatus,
    });
  }

  onViewMode = () => {
    this.setState({
      viewMode: !this.state.viewMode,
    });
  }

  // Event Handlers
  onEditMode = () => {
    var textarea = document.getElementById("AppendTextArea");
    if (textarea.value && !this.state.editMode) {
      this.setState({
        confirmEdit: true,
      });
    }
    else {
          this.setState({
      editMode: !this.state.editMode,
    });
    }
  };

  onViewMode = () => {
      this.setState({
        viewMode: !this.state.viewMode,
      });
    }

  onConfirmEdit = () => {
    this.setState({
      confirmEdit: false,
      editMode: true,
    });
  }

  onCancelEdit = () => {
    this.setState({
      confirmEdit: false,
      editMode: false,
    });
  }

  render() {
    //const editEntry = this.state.editEntry || {};
    return (
      <div className="sn-component">
        
        <div id="header">
        <div className="sk-button-group">
            <div className="sk-button info" onClick={this.onEditMode}>
              <div className="sk-label">Edit</div>
            </div>
            <div className="sk-button info" onClick={this.onViewMode}>
              <div className="sk-label">View</div>
            </div>
          </div>
        </div>

        <div id="content">
          {this.state.editMode && !this.state.refreshStatus && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
            />
          )}
          {this.state.editMode && this.state.refreshStatus && (
            <EditNote
              text={this.state.text}
              onSave={this.onSave}
            />
          )}
          {this.state.viewMode && !this.state.refreshStatus && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.viewMode && this.state.refreshStatus && (
            <ViewNote
              text={this.state.text}
              viewMode={this.state.viewMode}
            />
          )}
          {this.state.confirmEdit && (
            <ConfirmDialog
              title={`Warning`}
              message="Editing and Appending simultaneously may result in data loss. Would you like to proceed?"
              onConfirm={this.onConfirmEdit}
              onCancel={this.onCancelEdit}
            />
          )}
        </div>
        <div id="footer">
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
