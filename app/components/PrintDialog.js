import React from 'react';

const ConfirmDialog = ({ title, onUndo, onConfirm, onCancel, confirmText, cancelText, helpLink }) => (
  <div className="note-overlay">
    <div tabIndex="0" className="note-dialog sk-panel">
      <div className="sk-panel-content">
        <div className="sk-panel-section">
        <div className="sk-panel-row">
          <div className="sk-h1"><h3>{title}</h3></div>
        <button id="undoDialog" onClick={onUndo}>
          <img src="icons/ic-close.svg"/>
        </button>
        </div>
          <div className="sk-panel-row">
            <div className="sk-h2">Need help deciding? Check out the <a href={helpLink}target="_blank" rel="noopener">documentation</a>.</div>
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
