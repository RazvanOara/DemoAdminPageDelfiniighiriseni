import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏊‍♀️</span>
              <span className="logo-text">Delfinii Ghirișeni</span>
            </div>
            <p>Cel mai bun loc pentru copiii tăi să învețe să înoate în siguranță și cu bucurie.</p>
            <li><Link to="/politica-confidentialitate">Politica de Confidențialitate</Link></li>
              <li><Link to="/termeni-conditii">Termeni și Condiții</Link></li>
          </div>
          <div className="footer-section">
            <h4>Navigare</h4>
            <ul className="footer-links">
              <li><Link to="/">Acasă</Link></li>
              <li><Link to="/inscriere">Înscrie-te</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/galerie">Galerie</Link></li>
              <li><Link to="/evenimente">Anunțuri</Link></li>
              

            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Oară Răzvan-Dan. Toate drepturile rezervate.</p>
          <li><Link to="/developer">Behind the Code</Link></li>
        </div>
      </div>
    </footer>
  );
};

export default Footer;