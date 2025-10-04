import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SwimmingTimes.css';

const SwimmingTimes = () => {
  const navigate = useNavigate();
  const [swimmingTimes, setSwimmingTimes] = useState([]);
  const [personalBests, setPersonalBests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCursant, setSelectedCursant] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    poolLength: '',
    dateRange: ''
  });

  // Swimming events configuration
  const swimmingEvents = [
    { key: 'freestyle50m', label: 'Liber 50m', icon: '🏊‍♂️' },
    { key: 'freestyle100m', label: 'Liber 100m', icon: '🏊‍♂️' },
    { key: 'freestyle200m', label: 'Liber 200m', icon: '🏊‍♂️' },
    { key: 'freestyle400m', label: 'Liber 400m', icon: '🏊‍♂️' },
    { key: 'freestyle800m', label: 'Liber 800m', icon: '🏊‍♂️' },
    { key: 'freestyle1500m', label: 'Liber 1500m', icon: '🏊‍♂️' },
    { key: 'backstroke50m', label: 'Spate 50m', icon: '🏊‍♀️' },
    { key: 'backstroke100m', label: 'Spate 100m', icon: '🏊‍♀️' },
    { key: 'backstroke200m', label: 'Spate 200m', icon: '🏊‍♀️' },
    { key: 'breaststroke50m', label: 'Bras 50m', icon: '🤽‍♂️' },
    { key: 'breaststroke100m', label: 'Bras 100m', icon: '🤽‍♂️' },
    { key: 'breaststroke200m', label: 'Bras 200m', icon: '🤽‍♂️' },
    { key: 'butterfly50m', label: 'Fluture 50m', icon: '🦋' },
    { key: 'butterfly100m', label: 'Fluture 100m', icon: '🦋' },
    { key: 'butterfly200m', label: 'Fluture 200m', icon: '🦋' },
    { key: 'im100m', label: 'Mixt 100m', icon: '🏆' },
    { key: 'im200m', label: 'Mixt 200m', icon: '🏆' }
  ];

  // Format time from seconds to MM:SS.cc
  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const totalSeconds = parseFloat(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const sec = Math.floor(remainingSeconds);
    const centiseconds = Math.round((remainingSeconds - sec) * 100);
    return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Fetch swimming times from API
  useEffect(() => {
    const fetchSwimmingTimes = async () => {
      try {
        setIsLoading(true);
        const csrfResponse = await fetch('/csrf', {
          credentials: 'include'
        });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        
        // For now, we'll fetch all cursants and their times
        // In a real app, you might want to fetch by specific cursant
        const response = await fetch('/api/swimming-times', {
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': csrfToken
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSwimmingTimes(Array.isArray(data) ? data : []);
        } else {
          console.error('Response status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch swimming times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwimmingTimes();
  }, []);

  // Group times by cursant and get personal bests
  const groupedByCursant = swimmingTimes.reduce((acc, time) => {
    const cursantId = time.cursantId;
    if (!acc[cursantId]) {
      acc[cursantId] = {
        cursantInfo: {
          id: cursantId,
          nume: time.cursantNume || `Cursant ${cursantId}`,
          email: time.cursantEmail
        },
        times: [],
        personalBests: {}
      };
    }
    acc[cursantId].times.push(time);
    
    // Calculate personal bests for each event
    swimmingEvents.forEach(event => {
      if (time[event.key]) {
        const currentBest = acc[cursantId].personalBests[event.key];
        if (!currentBest || parseFloat(time[event.key]) < parseFloat(currentBest.time)) {
          acc[cursantId].personalBests[event.key] = {
            time: time[event.key],
            date: time.recordedDate,
            recordId: time.id
          };
        }
      }
    });
    
    return acc;
  }, {});

  const cursantsList = Object.values(groupedByCursant);

  // Filter cursants based on search
  const filteredCursants = cursantsList.filter(cursant => {
    const matchesSearch = !filters.search || 
      cursant.cursantInfo.nume?.toLowerCase().includes(filters.search.toLowerCase()) ||
      cursant.cursantInfo.id?.toString().includes(filters.search);
    
    return matchesSearch;
  });

  const CursantCard = ({ cursant }) => {
    const personalBestsCount = Object.keys(cursant.personalBests).length;
    const totalRecords = cursant.times.length;
    
    return (
      <div className="planificare-swimmer-card">
        <div className="swimmer-card-header">
          <h3 className="swimmer-title">{cursant.cursantInfo.nume}</h3>
          <span className="swimmer-id-badge">ID: {cursant.cursantInfo.id}</span>
        </div>
        
        <div className="swimmer-stats">
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <div className="stat-content">
              <span className="stat-value">{personalBestsCount}</span>
              <span className="stat-label">Recorduri Personale</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-content">
              <span className="stat-value">{totalRecords}</span>
              <span className="stat-label">Total Înregistrări</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📅</span>
            <div className="stat-content">
              <span className="stat-value">
                {cursant.times.length > 0 
                  ? new Date(Math.max(...cursant.times.map(t => new Date(t.recordedDate)))).toLocaleDateString('ro-RO')
                  : 'N/A'
                }
              </span>
              <span className="stat-label">Ultimul Timp</span>
            </div>
          </div>
        </div>
        
        {/* Personal Bests Preview */}
        <div className="personal-bests-preview">
          <h4>Recorduri Personale (Top 4)</h4>
          <div className="bests-grid">
            {Object.entries(cursant.personalBests)
              .slice(0, 4)
              .map(([eventKey, best]) => {
                const event = swimmingEvents.find(e => e.key === eventKey);
                return (
                  <div key={eventKey} className="best-item">
                    <span className="best-event">{event?.label}</span>
                    <span className="best-time">{formatTime(best.time)}</span>
                  </div>
                );
              })}
          </div>
          {Object.keys(cursant.personalBests).length > 4 && (
            <p className="more-bests">
              +{Object.keys(cursant.personalBests).length - 4} alte recorduri
            </p>
          )}
        </div>
        
        <div className="swimmer-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => navigate(`/admin/swimming-times/cursant/${cursant.cursantInfo.id}/details`)}
          >
            <span className="btn-icon">👁️</span>
            Vezi Toate Timpii
          </button>
          <button 
            className="action-btn edit-btn"
            onClick={() => navigate(`/admin/swimming-times/cursant/${cursant.cursantInfo.id}/statistics`)}
          >
            <span className="btn-icon">📊</span>
            Statistici & Grafice
          </button>
          <button 
            className="action-btn primary-btn"
            onClick={() => navigate(`/admin/swimming-times/create?cursantId=${cursant.cursantInfo.id}`)}
          >
            <span className="btn-icon">➕</span>
            Adaugă Timp Nou
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="swimmers-container">
      {/* Header */}
      <div className="swimmers-header">
        <div className="header-content">
          <h1 className="page-title">Timpii de Înot</h1>
          <p className="page-subtitle">Monitorizează progresul și recordurile personale ale înotătorilor</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/admin/swimming-times/create')}
          >
            <span className="btn-icon">➕</span>
            Adaugă Timp Nou
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="swimmers-stats">
        <div className="stat-card">
          <span className="stat-icon">🏊‍♂️</span>
          <div className="stat-content">
            <span className="stat-value">{filteredCursants.length}</span>
            <span className="stat-label">Înotători cu Timpii</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-content">
            <span className="stat-value">
              {filteredCursants.reduce((sum, c) => sum + Object.keys(c.personalBests).length, 0)}
            </span>
            <span className="stat-label">Total Recorduri Personale</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <span className="stat-value">
              {filteredCursants.reduce((sum, c) => sum + c.times.length, 0)}
            </span>
            <span className="stat-label">Total Înregistrări</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🗓️</span>
          <div className="stat-content">
            <span className="stat-value">
              {swimmingTimes.length > 0 
                ? new Date(Math.max(...swimmingTimes.map(t => new Date(t.recordedDate)))).toLocaleDateString('ro-RO')
                : 'N/A'
              }
            </span>
            <span className="stat-label">Ultima Înregistrare</span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="swimmers-filters">
        <div className="filters-row">
          <div className="filter-group search-group">
            <label className="filter-label">Căutare Înotător:</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Caută după nume sau ID..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({ search: '', poolLength: '', dateRange: '' })}
            disabled={!filters.search && !filters.poolLength && !filters.dateRange}
          >
            <span className="btn-icon">🗑️</span>
            Șterge Filtrele
          </button>
        </div>
        
        {/* Active filters display */}
        {filters.search && (
          <div className="active-filters">
            <span className="active-filters-label">Filtre active:</span>
            <span className="filter-tag">
              Căutare: "{filters.search}"
              <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>×</button>
            </span>
          </div>
        )}
      </div>
      
      {/* Swimming Times Grid */}
      <div className="swimmers-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <p>Se încarcă timpii de înot...</p>
          </div>
        ) : filteredCursants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⏱️</div>
            <h3>Nu au fost găsiți timpii de înot</h3>
            <p>
              {cursantsList.length === 0 
                ? "Nu ai încă timpii înregistrați. Începe prin a adăuga primul!"
                : "Încearcă să modifici filtrele pentru a vedea mai multe rezultate."
              }
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/admin/swimming-times/create')}
            >
              <span className="btn-icon">➕</span>
              Adaugă Primul Timp
            </button>
          </div>
        ) : (
          <div className="swimmers-grid">
            {filteredCursants.map(cursant => (
              <CursantCard key={cursant.cursantInfo.id} cursant={cursant} />
            ))}
          </div>
        )}
      </div>
      
      {/* Results info */}
      {!isLoading && filteredCursants.length > 0 && (
        <div className="results-info">
          <p>
            Afișez {filteredCursants.length} din {cursantsList.length} înotători cu timpii înregistrați
            {filters.search && " (filtrat)"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SwimmingTimes;