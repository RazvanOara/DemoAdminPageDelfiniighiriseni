import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAdvancedSwimmer.css';

// Mock cursants data (filtered - those without advanced profiles)
const MOCK_CURSANTS = [
  {
    id: 4,
    numeComplet: 'Popa Mihai',
    telefon: '0755444555',
    dataNasterii: '2010-05-15',
    email: 'mihai.popa@email.com'
  },
  {
    id: 6,
    numeComplet: 'Stan Gabriel',
    telefon: '0777666777',
    dataNasterii: '2012-08-22',
    email: 'gabriel.stan@email.com'
  },
  {
    id: 8,
    numeComplet: 'Radu Andrei',
    telefon: '0799888999',
    dataNasterii: '2011-03-10',
    email: 'andrei.radu@email.com'
  }
];

const CreateAdvancedSwimmer = () => {
  const navigate = useNavigate();
  const [allCursants, setAllCursants] = useState([]);
  const [filteredCursants, setFilteredCursants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCursant, setSelectedCursant] = useState(null);
  const [heartRateData, setHeartRateData] = useState({
    maxHeartRate: '',
    restingHeartRate: '',
    thresholdHeartRate: ''
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Fetch with mock data loading
  useEffect(() => {
    const fetchAllCursants = () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setAllCursants(MOCK_CURSANTS);
        setFilteredCursants(MOCK_CURSANTS);
        setIsLoading(false);
      }, 500);
    };

    fetchAllCursants();
  }, []);

  // Normalize string for search (handle Romanian diacritics)
  const normalizeString = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ă/g, 'a')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/ș/g, 's')
      .replace(/ț/g, 't');
  };

  // Filter cursants based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCursants(allCursants);
    } else {
      const normalizedQuery = normalizeString(searchQuery);
      const filtered = allCursants.filter(cursant => {
        const name = cursant.numeComplet || cursant.nume || '';
        const email = cursant.email || '';
        const normalizedName = normalizeString(name);
        const normalizedEmail = normalizeString(email);
        return normalizedName.includes(normalizedQuery) || normalizedEmail.includes(normalizedQuery);
      });
      setFilteredCursants(filtered);
    }
  }, [searchQuery, allCursants]);

  // Auto-calculate heart rates when a cursant is selected
  useEffect(() => {
    if (selectedCursant?.dataNasterii) {
      const age = calculateAge(selectedCursant.dataNasterii);
      const calculatedHR = calculateHeartRates(age);
      
      setHeartRateData({
        maxHeartRate: calculatedHR.maxHeartRate.toString(),
        restingHeartRate: calculatedHR.restingHeartRate.toString(),
        thresholdHeartRate: calculatedHR.thresholdHeartRate.toString()
      });
    }
  }, [selectedCursant]);

  const showNotification = (type, title, message) => {
    setNotification({ isVisible: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const calculateAge = (dataNasterii) => {
    const birthDate = new Date(dataNasterii);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateHeartRates = (age) => {
    const maxHeartRate = 220 - age;
    const thresholdHeartRate = Math.round(maxHeartRate * 0.87);
    
    let restingHeartRate;
    if (age < 18) {
      restingHeartRate = 70;
    } else if (age < 30) {
      restingHeartRate = 65;
    } else if (age < 50) {
      restingHeartRate = 68;
    } else {
      restingHeartRate = 72;
    }
    
    return { maxHeartRate, restingHeartRate, thresholdHeartRate };
  };

  const handleCreateAdvancedSwimmer = async () => {
    if (!selectedCursant) {
      setError('Vă rugăm să selectați un cursant');
      showNotification('warning', 'Avertisment', 'Vă rugăm să selectați un cursant');
      return;
    }

    // Validation
    const maxHr = parseInt(heartRateData.maxHeartRate);
    const restingHr = parseInt(heartRateData.restingHeartRate);
    const thresholdHr = parseInt(heartRateData.thresholdHeartRate);

    if (maxHr < 120 || maxHr > 220) {
      setError('Frecvența cardiacă maximă trebuie să fie între 120 și 220 bpm');
      showNotification('warning', 'Validare', 'Frecvența cardiacă maximă trebuie să fie între 120 și 220 bpm');
      return;
    }

    if (restingHr < 30 || restingHr > 100) {
      setError('Frecvența cardiacă de repaus trebuie să fie între 30 și 100 bpm');
      showNotification('warning', 'Validare', 'Frecvența cardiacă de repaus trebuie să fie între 30 și 100 bpm');
      return;
    }

    if (thresholdHr < 100 || thresholdHr > 200) {
      setError('Frecvența cardiacă prag trebuie să fie între 100 și 200 bpm');
      showNotification('warning', 'Validare', 'Frecvența cardiacă prag trebuie să fie între 100 și 200 bpm');
      return;
    }

    if (restingHr >= maxHr) {
      setError('Frecvența cardiacă de repaus trebuie să fie mai mică decât cea maximă');
      showNotification('warning', 'Validare', 'Frecvența cardiacă de repaus trebuie să fie mai mică decât cea maximă');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      showNotification(
        'success',
        'Profil Creat',
        `Înotător avansat creat cu succes pentru ${selectedCursant.numeComplet}! (Mock)`
      );
      
      setTimeout(() => {
        navigate('/admin/advanced-swimmers');
      }, 2000);
    }, 800);
  };

  const calculateHeartRateZones = (maxHr, restingHr) => {
    if (!maxHr || !restingHr) return null;
    
    const hrReserve = maxHr - restingHr;
    return {
      zone1: { min: restingHr + Math.round(hrReserve * 0.5), max: restingHr + Math.round(hrReserve * 0.6) },
      zone2: { min: restingHr + Math.round(hrReserve * 0.6), max: restingHr + Math.round(hrReserve * 0.7) },
      zone3: { min: restingHr + Math.round(hrReserve * 0.7), max: restingHr + Math.round(hrReserve * 0.8) },
      zone4: { min: restingHr + Math.round(hrReserve * 0.8), max: restingHr + Math.round(hrReserve * 0.9) },
      zone5: { min: restingHr + Math.round(hrReserve * 0.9), max: maxHr }
    };
  };

  return (
    <div className="create-swimmer-container">
      {/* Notification */}
      {notification.isVisible && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
          <button onClick={closeNotification} className="notification-close">×</button>
        </div>
      )}

      {/* Header */}
      <div className="create-swimmer-header">
        <div className="header-content">
          <button 
            className="btn-secondary back-btn"
            onClick={() => navigate('/admin/advanced-swimmers')}
          >
            <span className="btn-icon">←</span>
            Înapoi
          </button>
          <div>
            <h1 className="page-title">Adaugă Înotător Avansat (Demo)</h1>
            <p className="page-subtitle">Creează un nou profil de înotător cu monitorizare avansată - Date mock</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-text">{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="create-swimmer-content">
        {/* Step 1: Select Cursant */}
        <div className="step-card">
          <div className="step-header">
            <h2>1. Selectează Cursantul</h2>
            <p>Alege cursantul pentru care dorești să creezi profilul de înotător avansat</p>
          </div>
          
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Caută după nume sau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner">🔄</div>
              <p>Se încarcă cursanții...</p>
            </div>
          ) : (
            <div className="cursants-list">
              {filteredCursants.length === 0 ? (
                <div className="no-results">
                  {searchQuery ? 'Nu s-au găsit cursanți care să corespundă căutării' : 'Toți cursanții au deja profiluri de înotători avansați'}
                </div>
              ) : (
                filteredCursants.map(cursant => (
                  <div 
                    key={cursant.id}
                    className={`cursant-item ${selectedCursant?.id === cursant.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCursant(cursant)}
                  >
                    <div className="cursant-info">
                      <h4>{cursant.numeComplet || cursant.nume}</h4>
                      {cursant.telefon && <p>📞 {cursant.telefon}</p>}
                      {cursant.dataNasterii && (
                        <p>🎂 {calculateAge(cursant.dataNasterii)} ani</p>
                      )}
                    </div>
                    <div className="cursant-select">
                      {selectedCursant?.id === cursant.id && '✓'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Step 2: Heart Rate Configuration */}
        {selectedCursant && (
          <div className="step-card">
            <div className="step-header">
              <h2>2. Configurează Datele de Frecvență Cardiacă</h2>
              <p>
                Introdu valorile pentru frecvența cardiacă ale cursantului <strong>{selectedCursant.numeComplet || selectedCursant.nume}</strong>
                {selectedCursant.dataNasterii && (
                  <span> ({calculateAge(selectedCursant.dataNasterii)} ani)</span>
                )}
              </p>
              <small className="auto-calculated-note">
                ⚡ Valorile au fost calculate automat pe baza vârstei. Poți să le modifici dacă este necesar.
              </small>
            </div>
            
            <div className="heart-rate-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Frecvența Cardiacă Maximă (bpm)</label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={heartRateData.maxHeartRate}
                    onChange={(e) => setHeartRateData({
                      ...heartRateData,
                      maxHeartRate: e.target.value
                    })}
                    placeholder="ex. 190"
                  />
                  <small>Calculată: 220 - vârsta | Valori normale: 120-220 bpm</small>
                </div>

                <div className="form-group">
                  <label>Frecvența Cardiacă de Repaus (bpm)</label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    value={heartRateData.restingHeartRate}
                    onChange={(e) => setHeartRateData({
                      ...heartRateData,
                      restingHeartRate: e.target.value
                    })}
                    placeholder="ex. 60"
                  />
                  <small>Estimată pe baza vârstei și nivelului de fitness | Valori normale: 30-100 bpm</small>
                </div>

                <div className="form-group">
                  <label>Frecvența Cardiacă Prag (bpm)</label>
                  <input
                    type="number"
                    min="100"
                    max="200"
                    value={heartRateData.thresholdHeartRate}
                    onChange={(e) => setHeartRateData({
                      ...heartRateData,
                      thresholdHeartRate: e.target.value
                    })}
                    placeholder="ex. 170"
                  />
                  <small>Calculată: 87% din FC max | Valori normale: 100-200 bpm</small>
                </div>
              </div>
            </div>

            {/* Heart Rate Zones Preview */}
            {heartRateData.maxHeartRate && heartRateData.restingHeartRate && (
              <div className="zones-preview">
                <h3>Previzualizare Zone de Antrenament</h3>
                <div className="zones-preview-grid">
                  {(() => {
                    const zones = calculateHeartRateZones(
                      parseInt(heartRateData.maxHeartRate),
                      parseInt(heartRateData.restingHeartRate)
                    );
                    if (!zones) return null;
                    
                    return (
                      <>
                        <div className="zone-preview zone-1">
                          <span className="zone-name">Zona 1 (Recuperare)</span>
                          <span className="zone-range">{zones.zone1.min}-{zones.zone1.max} bpm</span>
                        </div>
                        <div className="zone-preview zone-2">
                          <span className="zone-name">Zona 2 (Aerob Ușor)</span>
                          <span className="zone-range">{zones.zone2.min}-{zones.zone2.max} bpm</span>
                        </div>
                        <div className="zone-preview zone-3">
                          <span className="zone-name">Zona 3 (Aerob)</span>
                          <span className="zone-range">{zones.zone3.min}-{zones.zone3.max} bpm</span>
                        </div>
                        <div className="zone-preview zone-4">
                          <span className="zone-name">Zona 4 (Prag)</span>
                          <span className="zone-range">{zones.zone4.min}-{zones.zone4.max} bpm</span>
                        </div>
                        <div className="zone-preview zone-5">
                          <span className="zone-name">Zona 5 (Anaerob)</span>
                          <span className="zone-range">{zones.zone5.min}-{zones.zone5.max} bpm</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                className="btn-secondary"
                onClick={() => navigate('/admin/advanced-swimmers')}
                disabled={isLoading}
              >
                Anulează
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateAdvancedSwimmer}
                disabled={!heartRateData.maxHeartRate || !heartRateData.restingHeartRate || !heartRateData.thresholdHeartRate || isLoading}
              >
                {isLoading ? 'Se creează...' : 'Creează Profilul (Mock)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAdvancedSwimmer;