import React from 'react';
import './CookieBanner.css';

const CookieBanner = ({ onAccept, onReject }) => {
  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <h3>Cookie-uri și Protecția Datelor</h3>
          <p>
            Acest site utilizează cookie-uri necesare pentru funcționarea corectă a aplicației, 
            inclusiv pentru securitate și stocarea sesiunii. Prin continuarea navigării, 
            acceptați utilizarea acestor cookie-uri în conformitate cu 
            <strong> Regulamentul GDPR</strong>.
          </p>
          <p className="cookie-details">
            <strong>Cookie-uri folosite:</strong>
            <br />
            • Cookie-uri de sesiune (necesare pentru autentificare și securitate)
            <br />
            • Cookie-uri CSRF (protecție împotriva atacurilor)
            <br />
            • Cookie-uri de funcționare (pentru formularele de înscriere)
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button 
            className="cookie-btn cookie-btn-accept" 
            onClick={onAccept}
          >
            Accept Cookie-urile
          </button>
          <button 
            className="cookie-btn cookie-btn-reject" 
            onClick={onReject}
          >
            Refuz și Părăsesc Site-ul
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;