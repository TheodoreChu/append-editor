import React from 'react';

const ConfirmDialog = ({ title, message, onUndo, onConfirm, onCancel, confirmText, cancelText, helpLink }) => (
  <div className="note-overlay">
    <div className="note-dialog sk-panel">
      <div className="sk-panel-header">
        <div className="sk-panel-header-title">{title}
        </div>
        <button id="printHelpButton" className="sk-button info" style={{position:"absolute", right:"7.1rem"}}>
          <div className="sk-label"><a href={helpLink}target="_blank" rel="noopener">Help</a></div>
        </button>
        <button className="sk-button info" onClick={onUndo} style={{position:"absolute", right:"2.2rem"}}>
          <div className="sk-label">Cancel</div>
        </button>
      </div>
      <div className="sk-panel-content">
        <div className="sk-panel-section sk-panel-hero">
          <div className="sk-panel-row">
            <div className="sk-h1" style={{marginLeft:"auto", marginRight:"auto"}}>{message}</div>
          </div>
        </div>
      </div>
      <div className="sk-panel-footer">
        <div className="sk-button-group stretch">
          <button className="sk-button neutral" onClick={onCancel}>
            <div className="sk-label">{cancelText}</div>
          </button>
          <button className="sk-button info" onClick={onConfirm}>
            <div className="sk-label">{confirmText}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
