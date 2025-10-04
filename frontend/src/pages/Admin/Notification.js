import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ 
  type = 'info', // success, error, warning, info
  title,
  message, 
  isVisible, 
  onClose, 
  autoClose = 5000 
}) => {
  useEffect(() => {
    if (isVisible && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-text">
          {title && <div className="notification-title">{title}</div>}
          <div className="notification-message">{message}</div>
        </div>
        <button 
          className="notification-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
      <div className="notification-progress">
        <div 
          className="notification-progress-bar" 
          style={{ animationDuration: `${autoClose}ms` }}
        />
      </div>
    </div>
  );
};

export default Notification;