import React from 'react';
import './Hero.css';
import Magnet from '../../utils/Magnet';

const Hero = ({ onRegistrationClick, onGalleryClick, onContactClick, onEvenimenteClick }) => {
  return (
    <section className="hero-fullscreen">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </div>
      
      <div className="hero-content-center">
        <div className="hero-logos">
          <Magnet padding={80} magnetStrength={40}>
            <img 
              src="/assets/images/delfinii_logo.jpeg" 
              alt="Delfinii Ghirișeni Logo" 
              className="hero-logo" 
            />
          </Magnet>
          <Magnet padding={80} magnetStrength={40}>
            <img 
              src="/assets/images/logo_primarie.png" 
              alt="Prim Camp Turzi Logo" 
              className="hero-logo" 
            />
          </Magnet>
        </div>
        
              <h1 className="hero-main-title">
        <span className="highlight">Înotul</span> pentru toți, în Câmpia Turzii
      </h1>

      <p className="hero-description">
        Organizăm cursuri de înot în Câmpia Turzii pentru copii și adulți. Fie că ești la început sau vrei să îți perfecționezi tehnica, vei găsi aici programe adaptate pentru fiecare nivel.
      </p>

        
        <div className="hero-action-cards">
          <div className="action-card" onClick={onRegistrationClick}>
            <div className="card-icon"><span>+</span></div>
            <div className="card-content">
              <h3>Înscrie-te Acum</h3>
              <p>Rezervă locul tău la cursurile de înot</p>
            </div>
          </div>
          
          <div className="action-card" onClick={onGalleryClick}>
            <div className="card-icon"><span>📸</span></div>
            <div className="card-content">
              <h3>Galerie Foto</h3>
              <p>Vezi momentele noastre speciale</p>
            </div>
          </div>

          <div className="action-card" onClick={onEvenimenteClick}>
  <div className="card-icon"><span>📢</span></div>
  <div className="card-content">
    <h3>Anunțuri</h3>
    <p>Evenimente și noutăți importante</p>
  </div>
</div>
          
          <div className="action-card" onClick={onContactClick}>
            <div className="card-icon"><span>📞</span></div>
            <div className="card-content">
              <h3>Contact</h3>
              <p>Informații și programări</p>
            </div>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">🏊‍♂️</div>
            <div className="stat-number">3</div>
            <div className="stat-label">INSTRUCTORI</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">😊</div>
            <div className="stat-number">13+</div>
            <div className="stat-label">ANI EXPERIENȚĂ</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏊‍♀️</div>
            <div className="stat-number">5</div>
            <div className="stat-label">ZILE/SĂPTĂMÂNĂ</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;  