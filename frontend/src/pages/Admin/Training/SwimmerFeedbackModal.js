import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Mock feedback storage
let MOCK_FEEDBACK = {};

const SwimmerFeedbackModal = ({ swimmer, sessionId, isOpen, onClose, onSave }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing feedback when modal opens
  useEffect(() => {
    if (isOpen && swimmer && sessionId) {
      loadExistingFeedback();
    }
  }, [isOpen, swimmer, sessionId]);

  const loadExistingFeedback = () => {
    const key = `${sessionId}-${swimmer.id}`;
    const existingFeedback = MOCK_FEEDBACK[key];
    
    if (existingFeedback) {
      setRating(existingFeedback.overallRating || 0);
      setFeedback(existingFeedback.coachFeedback || '');
    } else {
      setRating(0);
      setFeedback('');
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const key = `${sessionId}-${swimmer.id}`;
      MOCK_FEEDBACK[key] = {
        overallRating: rating || null,
        coachFeedback: feedback.trim() || null,
        swimmerId: swimmer.id,
        swimmerName: swimmer.name,
        sessionId: sessionId,
        updatedAt: new Date().toISOString()
      };

      console.log('Feedback saved:', MOCK_FEEDBACK[key]);
      
      setIsLoading(false);
      onSave();
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    onClose();
  };

  if (!isOpen || !swimmer) return null;

  const getRatingLabel = (ratingValue) => {
    switch(ratingValue) {
      case 1: return 'Slab';
      case 2: return 'Satisfăcător';
      case 3: return 'Bun';
      case 4: return 'Foarte bun';
      case 5: return 'Excelent';
      default: return '';
    }
  };

  // Use portal to render modal outside the component hierarchy
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Evaluare pentru {swimmer.name}</h3>
          <button className="btn-close-modal" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="rating-section">
            <label>Evaluare generală</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-button ${
                    star <= (hoveredRating || rating) ? 'active' : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isLoading}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-label">
                {getRatingLabel(rating)}
              </div>
            )}
          </div>

          <div className="feedback-section">
            <label>Note antrenor</label>
            <textarea
              className="feedback-textarea"
              placeholder="Adaugă observații despre performanța înotătorului..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isLoading}
              rows={6}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Anulează
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Se salvează...' : 'Salvează'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SwimmerFeedbackModal;