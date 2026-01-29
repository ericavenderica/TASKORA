import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal confirmation-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title || 'Confirm Action'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <p className="confirmation-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button type="button" className="modal-btn secondary" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}>Cancel</button>
          <button type="button" className="modal-btn delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
