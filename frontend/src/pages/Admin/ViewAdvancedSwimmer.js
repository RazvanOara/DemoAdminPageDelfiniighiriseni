import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewAdvancedSwimmer.css";

// ADD: Mock swimmers data
const MOCK_SWIMMERS = {
  '1': {
    id: 1,
    cursantId: 1,
    cursantNume: 'Popescu Alex',
    maxHeartRate: 195,
    restingHeartRate: 60,
    thresholdHeartRate: 170,
    createdAt: '2024-09-15T10:00:00'
  },
  '2': {
    id: 2,
    cursantId: 2,
    cursantNume: 'Ionescu David',
    maxHeartRate: 188,
    restingHeartRate: 65,
    thresholdHeartRate: 164,
    createdAt: '2024-09-20T14:30:00'
  },
  '3': {
    id: 3,
    cursantId: 3,
    cursantNume: 'Georgescu Sofia',
    maxHeartRate: 192,
    restingHeartRate: 58,
    thresholdHeartRate: 167,
    createdAt: '2024-09-25T11:15:00'
  }
};

// ADD: Mock swimming times
const MOCK_SWIMMING_TIMES = {
  '1': [
    {
      id: 1,
      cursantId: 1,
      recordedDate: '2024-10-01',
      poolLength: 25,
      competitionName: 'Campionatul Județean',
      freestyle50m: 26.45,
      freestyle100m: 58.12,
      backstroke50m: 30.22,
      breaststroke100m: 72.34,
      isPersonalBest: true
    },
    {
      id: 2,
      cursantId: 1,
      recordedDate: '2024-09-20',
      poolLength: 25,
      competitionName: null,
      freestyle50m: 27.10,
      freestyle100m: 59.45,
      freestyle200m: 128.90,
      isPersonalBest: false
    },
    {
      id: 3,
      cursantId: 1,
      recordedDate: '2024-09-10',
      poolLength: 25,
      competitionName: null,
      freestyle50m: 27.50,
      freestyle100m: 60.20,
      butterfly50m: 31.15,
      isPersonalBest: false
    }
  ],
  '2': [
    {
      id: 4,
      cursantId: 2,
      recordedDate: '2024-09-28',
      poolLength: 50,
      competitionName: 'Cupa României',
      freestyle100m: 55.30,
      freestyle200m: 120.45,
      backstroke100m: 65.20,
      isPersonalBest: true
    }
  ],
  '3': [
    {
      id: 5,
      cursantId: 3,
      recordedDate: '2024-10-02',
      poolLength: 25,
      competitionName: null,
      freestyle50m: 28.90,
      breaststroke50m: 35.40,
      breaststroke100m: 75.80,
      butterfly50m: 32.10,
      isPersonalBest: true
    },
    {
      id: 6,
      cursantId: 3,
      recordedDate: '2024-09-22',
      poolLength: 25,
      competitionName: 'Concurs Local',
      freestyle50m: 29.20,
      breaststroke50m: 36.10,
      im100m: 68.50,
      isPersonalBest: false
    }
  ]
};

const ViewAdvancedSwimmer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [swimmer, setSwimmer] = useState(null);
  const [swimmingTimes, setSwimmingTimes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  
  const [heartRateData, setHeartRateData] = useState({
    maxHeartRate: '',
    restingHeartRate: '',
    thresholdHeartRate: ''
  });

  const swimmingEvents = [
    { key: 'freestyle50m', label: 'Liber 50m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'freestyle100m', label: 'Liber 100m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'freestyle200m', label: 'Liber 200m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'freestyle400m', label: 'Liber 400m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'freestyle800m', label: 'Liber 800m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'freestyle1500m', label: 'Liber 1500m', icon: '🏊‍♂️', category: 'Liber' },
    { key: 'backstroke50m', label: 'Spate 50m', icon: '🏊‍♀️', category: 'Spate' },
    { key: 'backstroke100m', label: 'Spate 100m', icon: '🏊‍♀️', category: 'Spate' },
    { key: 'backstroke200m', label: 'Spate 200m', icon: '🏊‍♀️', category: 'Spate' },
    { key: 'breaststroke50m', label: 'Bras 50m', icon: '🤽‍♂️', category: 'Bras' },
    { key: 'breaststroke100m', label: 'Bras 100m', icon: '🤽‍♂️', category: 'Bras' },
    { key: 'breaststroke200m', label: 'Bras 200m', icon: '🤽‍♂️', category: 'Bras' },
    { key: 'butterfly50m', label: 'Fluture 50m', icon: '🦋', category: 'Fluture' },
    { key: 'butterfly100m', label: 'Fluture 100m', icon: '🦋', category: 'Fluture' },
    { key: 'butterfly200m', label: 'Fluture 200m', icon: '🦋', category: 'Fluture' },
    { key: 'im100m', label: 'Mixt 100m', icon: '🏆', category: 'Mixt' },
    { key: 'im200m', label: 'Mixt 200m', icon: '🏆', category: 'Mixt' }
  ];

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const totalSeconds = parseFloat(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const sec = Math.floor(remainingSeconds);
    const centiseconds = Math.round((remainingSeconds - sec) * 100);
    return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // REPLACED: Fetch with mock data loading
  useEffect(() => {
    const fetchAllData = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const mockSwimmer = MOCK_SWIMMERS[id];
        if (mockSwimmer) {
          setSwimmer(mockSwimmer);
          setHeartRateData({
            maxHeartRate: mockSwimmer.maxHeartRate || '',
            restingHeartRate: mockSwimmer.restingHeartRate || '',
            thresholdHeartRate: mockSwimmer.thresholdHeartRate || ''
          });

          const times = MOCK_SWIMMING_TIMES[mockSwimmer.cursantId] || [];
          setSwimmingTimes(times);

          // Calculate statistics
          const totalRecords = times.length;
          const personalBestsCount = times.filter(t => t.isPersonalBest).length;
          const competitionTimesCount = times.filter(t => t.competitionName).length;
          
          setStatistics({
            totalRecords,
            personalBestsCount,
            competitionTimesCount
          });
        } else {
          setError("Nu s-a găsit înotătorul.");
        }
        
        setIsLoading(false);
      }, 500);
    };

    fetchAllData();
  }, [id]);

  const calculateHeartRateZones = (maxHr, restingHr) => {
    if (!maxHr || !restingHr) return null;
    const hrReserve = maxHr - restingHr;
    return {
      zone1: { min: restingHr + Math.round(hrReserve * 0.5), max: restingHr + Math.round(hrReserve * 0.6) },
      zone2: { min: restingHr + Math.round(hrReserve * 0.6), max: restingHr + Math.round(hrReserve * 0.7) },
      zone3: { min: restingHr + Math.round(hrReserve * 0.7), max: restingHr + Math.round(hrReserve * 0.8) },
      zone4: { min: restingHr + Math.round(hrReserve * 0.8), max: restingHr + Math.round(hrReserve * 0.9) },
      zone5: { min: restingHr + Math.round(hrReserve * 0.9), max: maxHr },
    };
  };

  // DISABLED: Update swimmer (mock - does nothing)
  const handleUpdateSwimmer = () => {
    const maxHr = parseInt(heartRateData.maxHeartRate);
    const restingHr = parseInt(heartRateData.restingHeartRate);
    const thresholdHr = parseInt(heartRateData.thresholdHeartRate);

    if (maxHr < 120 || maxHr > 220) {
      setError('Frecvența cardiacă maximă trebuie să fie între 120 și 220 bpm');
      return;
    }
    if (restingHr < 30 || restingHr > 100) {
      setError('Frecvența cardiacă de repaus trebuie să fie între 30 și 100 bpm');
      return;
    }
    if (thresholdHr < 100 || thresholdHr > 200) {
      setError('Frecvența cardiacă prag trebuie să fie între 100 și 200 bpm');
      return;
    }
    if (restingHr >= maxHr) {
      setError('Frecvența cardiacă de repaus trebuie să fie mai mică decât cea maximă');
      return;
    }

    // Mock update - just update state
    setSwimmer({
      ...swimmer,
      maxHeartRate: maxHr,
      restingHeartRate: restingHr,
      thresholdHeartRate: thresholdHr
    });
    setEditMode(false);
    setError(null);
    alert('Date actualizate cu succes (mock)!');
  };

  // DISABLED: Delete swimmer (mock - just navigates back)
  const handleDeleteSwimmer = () => {
    if (window.confirm('Sunteți sigur că doriți să ștergeți acest profil de înotător avansat? (Mock - nu va șterge efectiv)')) {
      navigate('/admin/advanced-swimmers');
    }
  };

  const getEventData = (eventKey) => {
    return swimmingTimes
      .filter(time => time[eventKey])
      .map(time => ({
        date: time.recordedDate,
        time: parseFloat(time[eventKey]),
        formattedTime: formatTime(time[eventKey]),
        competition: time.competitionName,
        isPersonalBest: time.isPersonalBest,
        poolLength: time.poolLength
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const SimpleGraph = ({ eventKey, eventLabel }) => {
    const data = getEventData(eventKey);
    if (data.length < 2) return <p>Nu sunt suficiente date pentru grafic</p>;

    const minTime = Math.min(...data.map(d => d.time));
    const maxTime = Math.max(...data.map(d => d.time));
    const timeRange = maxTime - minTime;

    return (
      <div className="simple-graph">
        <h4>{eventLabel} - Evoluție Timpii</h4>
        <div className="graph-container">
          <div className="graph-area">
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = timeRange > 0 ? ((maxTime - point.time) / timeRange) * 100 : 50;
              return (
                <div
                  key={index}
                  className={`graph-point ${point.isPersonalBest ? 'personal-best' : ''}`}
                  style={{ left: `${x}%`, bottom: `${y}%` }}
                  title={`${point.formattedTime} - ${new Date(point.date).toLocaleDateString('ro-RO')}`}
                />
              );
            })}
            <svg className="graph-line" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = timeRange > 0 ? 100 - ((maxTime - point.time) / timeRange) * 100 : 50;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && !swimmer) {
    return (
      <div className="swimmer-details-container">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>Se încarcă datele...</p>
        </div>
      </div>
    );
  }

  if (error && !swimmer) {
    return (
      <div className="swimmer-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Eroare</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate("/admin/advanced-swimmers")}>
            Înapoi la Lista
          </button>
        </div>
      </div>
    );
  }

  if (!swimmer) return null;

  const zones = calculateHeartRateZones(swimmer.maxHeartRate, swimmer.restingHeartRate);

  return (
    <div className="swimmer-details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate("/admin/advanced-swimmers")}>
          ← Înapoi la Lista
        </button>
        <div className="header-content">
          <div className="swimmer-info">
            <h1 className="swimmer-name">{swimmer?.cursantNume || `Cursant ID: ${swimmer?.cursantId}`} (Demo)</h1>
            <p className="swimmer-subtitle">Profil Înotător Avansat - Date mock</p>
            <div className="swimmer-badges">
              <span className="badge">ID: {swimmer.id}</span>
              <span className="badge">Cursant: {swimmer.cursantId}</span>
              <span className="badge">Creat: {new Date(swimmer.createdAt).toLocaleDateString('ro-RO')}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate(`/admin/swimming-times/create?cursantId=${swimmer.cursantId}`)}
          >
            ➕ Adaugă Timp
          </button>
          <button 
            className={`btn-edit ${editMode ? 'active' : ''}`}
            onClick={() => {
              setEditMode(!editMode);
              setError(null);
            }}
          >
            ✏️ {editMode ? 'Anulează' : 'Editează'}
          </button>
          <button className="btn-danger" onClick={handleDeleteSwimmer}>
            🗑️ Șterge (Mock)
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-text">{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Prezentare Generală
        </button>
        <button 
          className={`tab-btn ${activeTab === 'times' ? 'active' : ''}`}
          onClick={() => setActiveTab('times')}
        >
          ⏱️ Timpii de Înot ({swimmingTimes.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analize și Grafice
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="cards-grid">
              <div className="info-card heart-rate-card">
                <div className="card-header">
                  <h3>Frecvență Cardiacă</h3>
                  {editMode && <span className="edit-indicator">Mod Editare</span>}
                </div>
                <div className="heart-rate-stats">
                  <div className="hr-stat">
                    <div className="hr-icon">❤️</div>
                    <div className="hr-content">
                      {editMode ? (
                        <input
                          type="number"
                          min="120"
                          max="220"
                          value={heartRateData.maxHeartRate}
                          onChange={(e) => setHeartRateData({
                            ...heartRateData,
                            maxHeartRate: e.target.value
                          })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.maxHeartRate}</span>
                      )}
                      <span className="hr-label">HR Max (bpm)</span>
                    </div>
                  </div>
                  <div className="hr-stat">
                    <div className="hr-icon">💤</div>
                    <div className="hr-content">
                      {editMode ? (
                        <input
                          type="number"
                          min="30"
                          max="100"
                          value={heartRateData.restingHeartRate}
                          onChange={(e) => setHeartRateData({
                            ...heartRateData,
                            restingHeartRate: e.target.value
                          })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.restingHeartRate}</span>
                      )}
                      <span className="hr-label">HR Repaus (bpm)</span>
                    </div>
                  </div>
                  <div className="hr-stat">
                    <div className="hr-icon">🎯</div>
                    <div className="hr-content">
                      {editMode ? (
                        <input
                          type="number"
                          min="100"
                          max="200"
                          value={heartRateData.thresholdHeartRate}
                          onChange={(e) => setHeartRateData({
                            ...heartRateData,
                            thresholdHeartRate: e.target.value
                          })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.thresholdHeartRate}</span>
                      )}
                      <span className="hr-label">HR Prag (bpm)</span>
                    </div>
                  </div>
                </div>
                {editMode && (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleUpdateSwimmer} disabled={isLoading}>
                      {isLoading ? 'Se salvează...' : '💾 Salvează (Mock)'}
                    </button>
                  </div>
                )}
              </div>

              {zones && (
                <div className="info-card zones-card">
                  <div className="card-header">
                    <h3>Zone de Antrenament</h3>
                  </div>
                  <div className="zones-grid">
                    <div className="zone-item zone-1">
                      <span className="zone-number">Z1</span>
                      <span className="zone-name">Recuperare</span>
                      <span className="zone-range">{zones.zone1.min}-{zones.zone1.max} bpm</span>
                    </div>
                    <div className="zone-item zone-2">
                      <span className="zone-number">Z2</span>
                      <span className="zone-name">Aerob Ușor</span>
                      <span className="zone-range">{zones.zone2.min}-{zones.zone2.max} bpm</span>
                    </div>
                    <div className="zone-item zone-3">
                      <span className="zone-number">Z3</span>
                      <span className="zone-name">Aerob</span>
                      <span className="zone-range">{zones.zone3.min}-{zones.zone3.max} bpm</span>
                    </div>
                    <div className="zone-item zone-4">
                      <span className="zone-number">Z4</span>
                      <span className="zone-name">Prag</span>
                      <span className="zone-range">{zones.zone4.min}-{zones.zone4.max} bpm</span>
                    </div>
                    <div className="zone-item zone-5">
                      <span className="zone-number">Z5</span>
                      <span className="zone-name">Anaerob</span>
                      <span className="zone-range">{zones.zone5.min}-{zones.zone5.max} bpm</span>
                    </div>
                  </div>
                </div>
              )}

              {statistics && (
                <div className="info-card stats-card">
                  <div className="card-header">
                    <h3>Statistici Înot</h3>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <span className="stat-value">{statistics.totalRecords}</span>
                      <span className="stat-label">Total Timpii</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-value">{statistics.personalBestsCount}</span>
                      <span className="stat-label">Recorduri</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🏅</span>
                      <span className="stat-value">{statistics.competitionTimesCount}</span>
                      <span className="stat-label">Competiții</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'times' && (
          <div className="times-content">
            {swimmingTimes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⏱️</div>
                <h3>Nu sunt timpii înregistrați</h3>
                <p>Acest înotător nu are încă timpii înregistrați.</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate(`/admin/swimming-times/create?cursantId=${swimmer.cursantId}`)}
                >
                  ➕ Adaugă Primul Timp
                </button>
              </div>
            ) : (
              <div className="times-grid">
                {swimmingTimes.slice(0, 10).map(time => (
                  <div key={time.id} className="time-card">
                    <div className="time-header">
                      <span className="time-date">
                        {new Date(time.recordedDate).toLocaleDateString('ro-RO')}
                      </span>
                      <div className="time-badges">
                        {time.poolLength && <span className="badge pool">{time.poolLength}m</span>}
                        {time.competitionName && <span className="badge competition">🏆</span>}
                        {time.isPersonalBest && <span className="badge pb">PB</span>}
                      </div>
                    </div>
                    {time.competitionName && (
                      <div className="competition-name">{time.competitionName}</div>
                    )}
                    <div className="times-list">
                      {swimmingEvents.map(event => {
                        if (!time[event.key]) return null;
                        return (
                          <div key={event.key} className="time-entry">
                            <span className="event-icon">{event.icon}</span>
                            <span className="event-name">{event.label}</span>
                            <span className="time-value">{formatTime(time[event.key])}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {swimmingTimes.length > 10 && (
                  <div className="show-more-card">
                    <p>Și încă {swimmingTimes.length - 10} timpii...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            {swimmingTimes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📈</div>
                <h3>Nu sunt date pentru analize</h3>
                <p>Adaugă mai multe timpii pentru a vedea grafice și analize.</p>
              </div>
            ) : (
              <div className="personal-bests-grid">
                {swimmingEvents.map(event => {
                  const timesForEvent = swimmingTimes
                    .filter(time => time[event.key])
                    .sort((a, b) => parseFloat(a[event.key]) - parseFloat(b[event.key]));
                  
                  if (timesForEvent.length === 0) return null;
                  
                  const bestTime = timesForEvent[0];
                  const latestTime = timesForEvent.sort((a, b) => new Date(b.recordedDate) - new Date(a.recordedDate))[0];
                  
                  return (
                    <div key={event.key} className="pb-card">
                      <div className="pb-header">
                        <span className="event-icon">{event.icon}</span>
                        <div className="event-info">
                          <h4>{event.label}</h4>
                          <span className="event-category">{event.category}</span>
                        </div>
                      </div>
                      
                      <div className="event-stats">
                        <div className="stat-row">
                          <span className="stat-label">🏆 Cel mai bun:</span>
                          <span className="stat-value">{formatTime(bestTime[event.key])}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">📅 Cel mai recent:</span>
                          <span className="stat-value">{formatTime(latestTime[event.key])}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">📊 Total înregistrări:</span>
                          <span className="stat-value">{timesForEvent.length}</span>
                        </div>
                      </div>

                      <div className="all-times-section">
                        <h5>Toate timpii ({timesForEvent.length}):</h5>
                        <div className="times-list-analytics">
                          {timesForEvent.slice(0, 5).map((time, index) => (
                            <div key={time.id} className="time-row">
                              <span className="time-position">#{index + 1}</span>
                              <span className="time-value">{formatTime(time[event.key])}</span>
                              <span className="time-date">{new Date(time.recordedDate).toLocaleDateString('ro-RO')}</span>
                              {time.competitionName && <span className="time-competition">🏆</span>}
                              {time.poolLength && <span className="time-pool">{time.poolLength}m</span>}
                            </div>
                          ))}
                          {timesForEvent.length > 5 && (
                            <div className="more-times">
                              +{timesForEvent.length - 5} timpii în plus
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        className="graph-btn"
                        onClick={() => {
                          setSelectedEvent(event.key);
                          setShowGraph(!showGraph || selectedEvent !== event.key);
                        }}
                      >
                        {showGraph && selectedEvent === event.key ? 'Ascunde Graficul' : '📈 Arată Graficul'}
                      </button>
                      
                      {showGraph && selectedEvent === event.key && (
                        <div className="graph-section">
                          <SimpleGraph eventKey={event.key} eventLabel={event.label} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAdvancedSwimmer;