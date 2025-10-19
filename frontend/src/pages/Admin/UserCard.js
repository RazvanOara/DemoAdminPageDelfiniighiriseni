import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../utils/config';
import './UserCard.css';

const UserCard = ({ inscriere, onDelete, onStatusUpdate }) => {
  const { t } = useTranslation();
  const { numeComplet, email, telefon, id, dataNasterii, dataInregistrarii, expired } = inscriere.cursant;
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} ${t('userCard.years')}`;
  };

  const calculateDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate || expired) return null;
    
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { days: 0, status: 'expired' };
    if (diffDays <= 7) return { days: diffDays, status: 'warning' };
    if (diffDays <= 14) return { days: diffDays, status: 'caution' };
    return { days: diffDays, status: 'normal' };
  };

  const formatPhoneForCall = (phone) => {
    if (!phone) return '';
    return phone.replace(/[\s\-()]/g, '');
  };

  const expirationInfo = calculateDaysUntilExpiration(inscriere.cursant.dataExpirarii);

  const handleToggleExpired = async () => {
    setIsToggling(true);
    
    try {
      const csrfResponse = await fetch(`${API_BASE_URL}/csrf`, {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;

      const response = await fetch(`${API_BASE_URL}/api/admin/cursanti/${id}/expired`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          expired: !expired
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      
      if (onStatusUpdate) {
        onStatusUpdate(id, result.expired, result.dataExpirarii, result.dataInregistrarii);
      }

    } catch (error) {
      console.error('Error toggling expired status:', error);
      alert(t('userCard.errors.updateStatus'));
    } finally {
      setIsToggling(false);
    }
  };

  const getDaysRemainingText = () => {
    if (!expirationInfo) return '';
    if (expirationInfo.days === 0) return t('userCard.expiresTraday');
    if (expirationInfo.days === 1) return t('userCard.oneDayRemaining');
    return t('userCard.daysRemaining', { days: expirationInfo.days });
  };

  return (
    <div className={`user-card ${expired ? 'expired' : 'active'} ${isExpanded ? 'expanded' : ''}`}>
      {/* Mobile Compact Header */}
      <div className="mobile-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="mobile-header-left">
          <div className="mobile-name-section">
            <h3 className="user-name">{numeComplet}</h3>
            <span className={`mobile-status-badge ${expired ? 'expired' : 'active'}`}>
              {expired ? t('userCard.status.expired') : t('userCard.status.active')}
            </span>
          </div>
          <div className="mobile-quick-info">
            <span className="mobile-info-item">
              📞 <a 
                href={`tel:${formatPhoneForCall(telefon)}`} 
                className="mobile-phone-link"
                onClick={(e) => e.stopPropagation()}
              >
                {telefon || 'N/A'}
              </a>
            </span>
            <span className="mobile-info-item">
              🎂 {calculateAge(dataNasterii)}
            </span>
          </div>
        </div>
        <div className="mobile-expand-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Desktop Header (unchanged) */}
      <div className="desktop-user-header">
        <h3 className="user-name">{numeComplet}</h3>
        <div className="user-status">
          <span className={`status-badge ${expired ? 'expired' : 'active'}`}>
            {expired ? t('userCard.status.expired') : t('userCard.status.active')}
          </span>
        </div>
      </div>

      {/* Expandable Details Section */}
      <div className={`card-details ${isExpanded ? 'show' : ''}`}>
        <div className="user-info">
          <div className="info-row">
            <span className="info-label">{t('userCard.labels.email')}:</span>
            <span className="info-value">
              {email ? (
                <a href={`mailto:${email}`} className="contact-link">
                  {email}
                </a>
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('userCard.labels.phone')}:</span>
            <span className="info-value">
              {telefon ? (
                <a href={`tel:${formatPhoneForCall(telefon)}`} className="contact-link phone-link">
                  {telefon}
                </a>
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('userCard.labels.age')}:</span>
            <span className="info-value">{calculateAge(dataNasterii)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('userCard.labels.birthDate')}:</span>
            <span className="info-value">{formatDate(dataNasterii)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('userCard.labels.registrationDate')}:</span>
            <span className="info-value">{formatDate(dataInregistrarii)}</span>
          </div>

          {!expired && expirationInfo && (
            <div className="info-row">
              <span className="info-label">{t('userCard.labels.daysRemaining')}:</span>
              <span className={`info-value expiration-${expirationInfo.status}`}>
                {getDaysRemainingText()}
              </span>
            </div>
          )}

          {inscriere.contact && (
            <div className="info-row">
              <span className="info-label">{t('userCard.labels.contact')}:</span>
              <span className="info-value">
                {inscriere.contact.persoanaContact} ({inscriere.contact.calitate})
              </span>
            </div>
          )}
        </div>

        <div className="program-section">
          <h4>{t('userCard.program.title')}</h4>
          {inscriere.program && inscriere.program.length > 0 ? (
            <ul className="program-list">
              {inscriere.program.map((p, i) => (
                <li key={i} className="program-item">
                  <span className="day">{p.zi}</span>
                  <span className="time">{p.ora}</span>
                  <span className="instructor">{t('userCard.program.with')} {p.instructor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-program">{t('userCard.program.noProgram')}</p>
          )}
        </div>

        <div className="documents-section">
          <h4>{t('userCard.documents.title')}</h4>
          <div className="document-links">
            <a 
              href={`${API_BASE_URL}/api/admin/pdf/inscriere/${id}`} 
              target="_blank" 
              rel="noreferrer"
              className="document-link"
            >
              📄 {t('userCard.documents.registrationForm')}
            </a>
            <a 
              href={`${API_BASE_URL}/api/admin/pdf/declaratie/${id}`} 
              target="_blank" 
              rel="noreferrer"
              className="document-link"
            >
              📋 {t('userCard.documents.declaration')}
            </a>
            <a 
              href={`${API_BASE_URL}/api/admin/pdf/adeverinta/${id}`} 
              target="_blank" 
              rel="noreferrer"
              className="document-link"
            >
              🏥 {t('userCard.documents.medicalCertificate')}
            </a>
          </div>
        </div>

        <div className="user-actions">
          <button 
            onClick={handleToggleExpired}
            className={`toggle-btn ${expired ? 'activate-btn' : 'expire-btn'}`}
            disabled={isToggling}
          >
            {isToggling ? t('userCard.actions.updating') : 
             expired ? `🔄 ${t('userCard.actions.activate')}` : 
             `⏰ ${t('userCard.actions.markExpired')}`}
          </button>
          
          <button 
            onClick={() => onDelete(id)}
            className="delete-btn"
          >
            🗑️ {t('userCard.actions.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;