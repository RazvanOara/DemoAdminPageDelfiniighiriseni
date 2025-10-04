import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmă', 
  cancelText = 'Anulează',
  type = 'danger', // danger, warning, info, success
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return '🗑️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'show' : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <span className={`modal-icon ${type}`}>{getIcon()}</span>
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button 
            className="modal-btn secondary" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`modal-btn ${type}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
