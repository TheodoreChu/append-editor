// import { Method } from '@testing-library/react';
import React from 'react';
import { CloseIcon } from './Icons';
import { HtmlElementId } from './AppendEditor';

interface PrintDialogTypes {
  cancelText: string;
  confirmText: string;
  helpLink: string;
  onCancel: () => void;
  onConfirm: () => void;
  onUndo: () => void;
  title: string;
}

const PrintDialog: React.FC<PrintDialogTypes> = ({
  cancelText,
  confirmText,
  helpLink,
  onCancel,
  onConfirm,
  onUndo,
  title,
}) => (
  <div className="note-overlay">
    <div className="sk-panel note-dialog">
      <div className="sk-panel-content">
        <div className="sk-panel-section">
          <div className="sk-panel-row title-section">
            <h2>{title}</h2>
            <button
              id={HtmlElementId.undoDialogButton}
              onClick={onUndo}
              title="Close"
            >
              <span>&nbsp;</span>
              <CloseIcon role="button" />
              <span>&nbsp;</span>
            </button>
          </div>
          <p>
            Need help deciding? Check out the{' '}
            <a href={helpLink} target="_blank" rel="noopener noreferrer">
              documentation
            </a>
            .
          </p>
        </div>
      </div>
      <div className="sk-panel-footer">
        <div className="sk-button-group stretch">
          <button className="sk-button neutral" onClick={onCancel}>
            <div>{cancelText}</div>
          </button>
          <button className="sk-button info" onClick={onConfirm}>
            <div>{confirmText}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PrintDialog;
