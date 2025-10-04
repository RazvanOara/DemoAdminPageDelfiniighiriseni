import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CreateSwimmingTimes.css';

// ADD: Mock cursant info
const MOCK_CURSANTS = {
  '1': { id: 1, nume: 'Popescu Alex', advancedSwimmerId: 1 },
  '2': { id: 2, nume: 'Ionescu David', advancedSwimmerId: 2 },
  '3': { id: 3, nume: 'Georgescu Sofia', advancedSwimmerId: 3 },
  '4': { id: 4, nume: 'Popa Mihai', advancedSwimmerId: null },
  '5': { id: 5, nume: 'Dumitrescu Ioana', advancedSwimmerId: 4 }
};

const CreateSwimmingTimes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cursantIdFromUrl = searchParams.get('cursantId');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyFilled, setShowOnlyFilled] = useState(false);

  const [formData, setFormData] = useState({
    cursantId: cursantIdFromUrl || '',
    recordedDate: new Date().toISOString().split('T')[0],
    poolLength: 25,
    competitionName: '',
    notes: '',
    freestyle50m: '',
    freestyle100m: '',
    freestyle200m: '',
    freestyle400m: '',
    freestyle800m: '',
    freestyle1500m: '',
    backstroke50m: '',
    backstroke100m: '',
    backstroke200m: '',
    breaststroke50m: '',
    breaststroke100m: '',
    breaststroke200m: '',
    butterfly50m: '',
    butterfly100m: '',
    butterfly200m: '',
    im100m: '',
    im200m: ''
  });
  
  const [cursantInfo, setCursantInfo] = useState(null);
  const [advancedSwimmerId, setAdvancedSwimmerId] = useState(null);

  const swimmingEvents = [
    { key: 'freestyle50m', label: 'Liber 50m', category: 'Liber', distance: '50m' },
    { key: 'freestyle100m', label: 'Liber 100m', category: 'Liber', distance: '100m' },
    { key: 'freestyle200m', label: 'Liber 200m', category: 'Liber', distance: '200m' },
    { key: 'freestyle400m', label: 'Liber 400m', category: 'Liber', distance: '400m' },
    { key: 'freestyle800m', label: 'Liber 800m', category: 'Liber', distance: '800m' },
    { key: 'freestyle1500m', label: 'Liber 1500m', category: 'Liber', distance: '1500m' },
    { key: 'backstroke50m', label: 'Spate 50m', category: 'Spate', distance: '50m' },
    { key: 'backstroke100m', label: 'Spate 100m', category: 'Spate', distance: '100m' },
    { key: 'backstroke200m', label: 'Spate 200m', category: 'Spate', distance: '200m' },
    { key: 'breaststroke50m', label: 'Bras 50m', category: 'Bras', distance: '50m' },
    { key: 'breaststroke100m', label: 'Bras 100m', category: 'Bras', distance: '100m' },
    { key: 'breaststroke200m', label: 'Bras 200m', category: 'Bras', distance: '200m' },
    { key: 'butterfly50m', label: 'Fluture 50m', category: 'Fluture', distance: '50m' },
    { key: 'butterfly100m', label: 'Fluture 100m', category: 'Fluture', distance: '100m' },
    { key: 'butterfly200m', label: 'Fluture 200m', category: 'Fluture', distance: '200m' },
    { key: 'im100m', label: 'Mixt 100m', category: 'Mixt', distance: '100m' },
    { key: 'im200m', label: 'Mixt 200m', category: 'Mixt', distance: '200m' }
  ];

  const categories = ['all', 'Liber', 'Spate', 'Bras', 'Fluture', 'Mixt'];

  // Filter events based on search and category
  const filteredEvents = swimmingEvents.filter(event => {
    const matchesSearch = event.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.distance.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesFilled = !showOnlyFilled || (formData[event.key] && formData[event.key].trim() !== '');
    
    return matchesSearch && matchesCategory && matchesFilled;
  });

  // Convert time from MM:SS.CC format to seconds
  const parseTime = (timeString) => {
    if (!timeString || timeString.trim() === '') return null;
    
    try {
      const parts = timeString.split(':');
      if (parts.length !== 2) return null;
      
      const minutes = parseInt(parts[0]);
      const secondsParts = parts[1].split('.');
      const seconds = parseInt(secondsParts[0]);
      const centiseconds = secondsParts.length > 1 ? parseInt(secondsParts[1].padEnd(2, '0')) : 0;
      
      return minutes * 60 + seconds + centiseconds / 100;
    } catch (error) {
      return null;
    }
  };

  // Validate time format (MM:SS.CC)
  const isValidTimeFormat = (timeString) => {
    if (!timeString || timeString.trim() === '') return true;
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9])(\.[0-9]{1,2})?$/;
    return timeRegex.test(timeString);
  };

  // Format time input with improved logic
  const formatTimeInput = (value) => {
    const digits = value.replace(/[^\d]/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      return `${digits.substring(0, 2)}:${digits.substring(2)}`;
    }
    if (digits.length <= 6) {
      return `${digits.substring(0, 2)}:${digits.substring(2, 4)}.${digits.substring(4)}`;
    }
    
    return `${digits.substring(0, 2)}:${digits.substring(2, 4)}.${digits.substring(4, 6)}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError(null);
  };

  const handleTimeInputChange = (eventKey, value) => {
    const formattedTime = formatTimeInput(value);
    handleInputChange(eventKey, formattedTime);
  };

  // REPLACED: Fetch cursant info with mock data
  useEffect(() => {
    const fetchCursantInfo = () => {
      if (cursantIdFromUrl) {
        setTimeout(() => {
          const mockCursant = MOCK_CURSANTS[cursantIdFromUrl];
          if (mockCursant) {
            setCursantInfo({ 
              id: mockCursant.id, 
              nume: mockCursant.nume 
            });
            setAdvancedSwimmerId(mockCursant.advancedSwimmerId);
          } else {
            setCursantInfo({ 
              id: cursantIdFromUrl, 
              nume: `Cursant ${cursantIdFromUrl}` 
            });
          }
        }, 300);
      }
    };

    fetchCursantInfo();
  }, [cursantIdFromUrl]);

  // REPLACED: Submit with mock implementation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.cursantId) {
      setError('ID-ul cursantului este obligatoriu');
      return;
    }

    if (!formData.recordedDate) {
      setError('Data înregistrării este obligatorie');
      return;
    }

    const hasAtLeastOneTime = swimmingEvents.some(event => 
      formData[event.key] && formData[event.key].trim() !== ''
    );

    if (!hasAtLeastOneTime) {
      setError('Trebuie să introduci cel puțin un timp');
      return;
    }

    // Validate all filled times
    for (const event of swimmingEvents) {
      const timeValue = formData[event.key];
      if (timeValue && timeValue.trim() !== '') {
        if (!isValidTimeFormat(timeValue)) {
          setError(`Formatul timpului pentru ${event.label} este invalid. Folosește formatul MM:SS sau MM:SS.CC`);
          return;
        }
      }
    }

    setIsLoading(true);

    // Simulate save delay
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
      
      setTimeout(() => {
        if (advancedSwimmerId) {
          navigate(`/admin/advanced-swimmers/${advancedSwimmerId}/details`);
        } else {
          navigate('/admin/swimming-times');
        }
      }, 1500);
    }, 800);
  };

  const clearAllTimes = () => {
    const clearedData = { ...formData };
    swimmingEvents.forEach(event => {
      clearedData[event.key] = '';
    });
    setFormData(clearedData);
  };

  const filledTimesCount = swimmingEvents.filter(event => 
    formData[event.key] && formData[event.key].trim() !== ''
  ).length;

  return (
    <div className="create-times-container">
      {/* Header */}
      <div className="create-times-header">
        <button 
          className="back-btn" 
          onClick={() => {
            if (advancedSwimmerId) {
              navigate(`/admin/advanced-swimmers/${advancedSwimmerId}/details`);
            } else {
              navigate('/admin/swimming-times');
            }
          }}
        >
          ← Înapoi
        </button>
        <div className="header-content">
          <h1 className="page-title">Adaugă Timpii de Înot (Demo)</h1>
          <p className="page-subtitle">
            Înregistrează timpii pentru antrenament sau competiție - Mock data
            {filledTimesCount > 0 && <span className="times-counter">({filledTimesCount} timpii completați)</span>}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-text">{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-text">Timpii au fost salvați cu succes (mock)!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-times-form">
        {/* Basic Information */}
        <div className="form-section">
          <div className="section-header">
            <h2>Informații Generale</h2>
            <p>Completează informațiile de bază despre sesiunea de înot</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cursant</label>
              <div className="cursant-display">
                <span className="cursant-name">{cursantInfo?.nume || 'Se încarcă...'}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data Înregistrării *</label>
              <input
                type="date"
                className="form-input"
                value={formData.recordedDate}
                onChange={(e) => handleInputChange('recordedDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lungimea Bazinului</label>
              <select
                className="form-select"
                value={formData.poolLength}
                onChange={(e) => handleInputChange('poolLength', e.target.value)}
              >
                <option value={25}>25 metri</option>
                <option value={50}>50 metri</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Numele Competiției (opțional)</label>
              <input
                type="text"
                className="form-input"
                value={formData.competitionName}
                onChange={(e) => handleInputChange('competitionName', e.target.value)}
                placeholder="ex. Campionatul Național de Înot"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Note (opțional)</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Adaugă note despre performanță, condiții, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>🔍 Caută și Filtrează Evenimente</h2>
            <p>Găsește rapid evenimentele pentru care vrei să adaugi timpii</p>
          </div>

          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Caută evenimente (ex. 100m, liber, fluture)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
              <select
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toate Categoriile' : category}
                  </option>
                ))}
              </select>

              <label className="checkbox-control">
                <input
                  type="checkbox"
                  checked={showOnlyFilled}
                  onChange={(e) => setShowOnlyFilled(e.target.checked)}
                />
                <span>Doar timpii completați</span>
              </label>

              <button
                type="button"
                className="clear-all-btn"
                onClick={clearAllTimes}
                disabled={filledTimesCount === 0}
              >
                Șterge toate timpii
              </button>
            </div>
          </div>

          <div className="search-results-info">
            <span>
              Se afișează {filteredEvents.length} din {swimmingEvents.length} evenimente
              {filledTimesCount > 0 && ` • ${filledTimesCount} timpii completați`}
            </span>
          </div>
        </div>

        {/* Swimming Times */}
        <div className="form-section">
          <div className="section-header">
            <h2>⏱️ Timpii de Înot</h2>
            <p>Introduce timpii în formatul MM:SS.CC (ex: 1:23.45 sau 01:23.45)</p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="no-events-message">
              <p>Nu s-au găsit evenimente care să corespundă criteriilor de căutare.</p>
              <button 
                type="button" 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowOnlyFilled(false);
                }}
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="times-grid">
              {filteredEvents.map(event => (
                <div key={event.key} className="time-input-group">
                  <label className="time-label">
                    <span className="event-icon">{event.icon}</span>
                    <span className="event-name">{event.label}</span>
                    {formData[event.key] && <span className="filled-indicator">✓</span>}
                  </label>
                  <input
                    type="text"
                    className={`time-input ${formData[event.key] ? 'has-value' : ''}`}
                    value={formData[event.key]}
                    onChange={(e) => handleTimeInputChange(event.key, e.target.value)}
                    placeholder="00:00.00"
                    maxLength="9"
                  />
                  {formData[event.key] && (
                    <button
                      type="button"
                      className="clear-time-btn"
                      onClick={() => handleInputChange(event.key, '')}
                      title="Șterge timpul"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              if (advancedSwimmerId) {
                navigate(`/admin/advanced-swimmers/${advancedSwimmerId}/details`);
              } else {
                navigate('/admin/swimming-times');
              }
            }}
            disabled={isLoading}
          >
            Anulează
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || success || filledTimesCount === 0}
          >
            {isLoading ? 'Se salvează...' : success ? 'Salvat (Mock)!' : `Salvează Timpii (${filledTimesCount})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSwimmingTimes;