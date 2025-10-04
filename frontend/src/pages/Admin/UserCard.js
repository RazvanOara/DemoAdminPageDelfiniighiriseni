import React, { useState } from 'react';
// DELETED: import { API_BASE_URL } from '../../utils/config';
import './UserCard.css';

const UserCard = ({ inscriere, onDelete, onStatusUpdate }) => {
  const { numeComplet, email, telefon, id, dataNasterii, dataInregistrarii, expired } = inscriere.cursant;
  const [isToggling, setIsToggling] = useState(false);

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
    return `${age} ani`;
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

  // DISABLED: Status toggle does nothing in demo mode
  const handleToggleExpired = async () => {
    // Do nothing - feature disabled in demo
    return;
  };

  return (
    <div className={`user-card ${expired ? 'expired' : 'active'}`}>
      <div className="user-header">
        <h3 className="user-name">{numeComplet}</h3>
        <div className="user-status">
          <span className={`status-badge ${expired ? 'expired' : 'active'}`}>
            {expired ? 'Expirat' : 'Activ'}
          </span>
        </div>
      </div>

      <div className="user-info">
        <div className="info-row">
          <span className="info-label">Email:</span>
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
          <span className="info-label">Telefon:</span>
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
          <span className="info-label">Varsta:</span>
          <span className="info-value">{calculateAge(dataNasterii)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Data nasterii:</span>
          <span className="info-value">{formatDate(dataNasterii)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Data inregistrarii:</span>
          <span className="info-value">{formatDate(dataInregistrarii)}</span>
        </div>

        {!expired && expirationInfo && (
          <div className="info-row">
            <span className="info-label">Zile ramase:</span>
            <span className={`info-value expiration-${expirationInfo.status}`}>
              {expirationInfo.days === 0 ? 'Expiră azi!' : 
               expirationInfo.days === 1 ? '1 zi rămasă' :
               `${expirationInfo.days} zile rămase`}
            </span>
          </div>
        )}

        {inscriere.contact && (
          <div className="info-row">
            <span className="info-label">Contact:</span>
            <span className="info-value">
              {inscriere.contact.persoanaContact} ({inscriere.contact.calitate})
            </span>
          </div>
        )}
      </div>

      <div className="program-section">
        <h4>Program</h4>
        {inscriere.program && inscriere.program.length > 0 ? (
          <ul className="program-list">
            {inscriere.program.map((p, i) => (
              <li key={i} className="program-item">
                <span className="day">{p.zi}</span>
                <span className="time">{p.ora}</span>
                <span className="instructor">cu {p.instructor}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-program">Nu există program înregistrat</p>
        )}
      </div>

      <div className="documents-section">
        <h4>Documente (Demo - Indisponibil)</h4>
        <div className="document-links">
          <span className="document-link disabled">
            📄 Fișă de înscriere
          </span>
          <span className="document-link disabled">
            📋 Declarație
          </span>
          <span className="document-link disabled">
            🏥 Adeverință medicală
          </span>
        </div>
      </div>

      <div className="user-actions">
        <button 
          onClick={handleToggleExpired}
          className={`toggle-btn ${expired ? 'activate-btn' : 'expire-btn'} disabled-demo`}
          disabled={true}
          title="Funcție dezactivată în modul demo"
        >
          {expired ? '🔄 Activează (Demo)' : '⏰ Marchează expirat (Demo)'}
        </button>
        
        <button 
          onClick={() => onDelete(id)}
          className="delete-btn"
        >
          🗑️ Șterge
        </button>
      </div>
    </div>
  );
};

export default UserCard;