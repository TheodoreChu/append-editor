import React from 'react';

const ConfirmDialog = ({ title, onUndo, onConfirm, onCancel, confirmText, cancelText, helpLink }) => (
  <div className="note-overlay">
    <div tabIndex="0" className="note-dialog sk-panel">
      <div className="sk-panel-content">
        <div className="sk-panel-section">
        <div className="sk-panel-row">
          <div className="sk-h1"><h3>{title}</h3></div>
        <button id="undoDialog" onClick={onUndo} title="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.2459 5.92917C15.5704 5.6047 15.5704 5.07864 15.2459 4.75417C14.9214 4.4297 14.3954 4.4297 14.0709 4.75417L10.0001 8.82501L5.92925 4.75417C5.60478 4.4297 5.07872 4.4297 4.75425 4.75417C4.42978 5.07864 4.42978 5.6047 4.75425 5.92917L8.82508 10L4.75425 14.0708C4.42978 14.3953 4.42978 14.9214 4.75425 15.2458C5.07872 15.5703 5.60478 15.5703 5.92925 15.2458L10.0001 11.175L14.0709 15.2458C14.3954 15.5703 14.9214 15.5703 15.2459 15.2458C15.5704 14.9214 15.5704 14.3953 15.2459 14.0708L11.1751 10L15.2459 5.92917Z" fill={"var(--sn-stylekit-foreground-color)"}/>
          </svg>
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
