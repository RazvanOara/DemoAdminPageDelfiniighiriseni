import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CursantTimesDetails.css';

const CursantTimesDetails = () => {
  const { cursantId } = useParams();
  const navigate = useNavigate();
  const [cursantTimes, setCursantTimes] = useState([]);
  const [personalBests, setPersonalBests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('toate'); // toate, recorduri, statistici
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

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

  // Calculate improvement percentage
  const calculateImprovement = (oldTime, newTime) => {
    if (!oldTime || !newTime) return null;
    const improvement = ((parseFloat(oldTime) - parseFloat(newTime)) / parseFloat(oldTime)) * 100;
    return improvement.toFixed(2);
  };

  // Get event data for graphs
  const getEventData = (eventKey) => {
    return cursantTimes
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const csrfResponse = await fetch('/csrf', { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        // Fetch all times for cursant
        const timesResponse = await fetch(`/api/swimming-times/cursant/${cursantId}`, {
          credentials: 'include',
          headers: { 'X-XSRF-TOKEN': csrfToken }
        });
        
        if (timesResponse.ok) {
          const timesData = await timesResponse.json();
          setCursantTimes(Array.isArray(timesData) ? timesData : []);
        }

        // Fetch personal bests
        const bestsResponse = await fetch(`/api/swimming-times/cursant/${cursantId}/personal-bests`, {
          credentials: 'include',
          headers: { 'X-XSRF-TOKEN': csrfToken }
        });
        
        if (bestsResponse.ok) {
          const bestsData = await bestsResponse.json();
          setPersonalBests(Array.isArray(bestsData) ? bestsData : []);
        }

        // Fetch statistics
        const statsResponse = await fetch(`/api/swimming-times/cursant/${cursantId}/statistics`, {
          credentials: 'include',
          headers: { 'X-XSRF-TOKEN': csrfToken }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStatistics(statsData);
        }

      } catch (error) {
        console.error('Failed to fetch cursant times data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cursantId) {
      fetchData();
    }
  }, [cursantId]);

  // Simple graph component using CSS
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
          <div className="graph-y-axis">
            <span className="y-label">{formatTime(maxTime)}</span>
            <span className="y-label">{formatTime(minTime)}</span>
          </div>
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
                >
                  <div className="point-tooltip">
                    <span>{point.formattedTime}</span>
                    <span>{new Date(point.date).toLocaleDateString('ro-RO')}</span>
                    {point.competition && <span>{point.competition}</span>}
                  </div>
                </div>
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
          <div className="graph-x-axis">
            <span className="x-label">{new Date(data[0].date).toLocaleDateString('ro-RO')}</span>
            <span className="x-label">{new Date(data[data.length - 1].date).toLocaleDateString('ro-RO')}</span>
          </div>
        </div>
      </div>
    );
  };

  const cursantName = cursantTimes.length > 0 ? cursantTimes[0].cursantNume : `Cursant ${cursantId}`;

  return (
    <div className="cursant-details-container">
      {/* Header */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/admin/swimming-times')}>
          ← Înapoi la Timpii de Înot
        </button>
        <div className="header-content">
          <h1 className="page-title">{cursantName}</h1>
          <p className="page-subtitle">Timpii de înot și statistici detaliate</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate(`/admin/swimming-times/create?cursantId=${cursantId}`)}
        >
          ➕ Adaugă Timp Nou
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab-btn ${activeView === 'toate' ? 'active' : ''}`}
          onClick={() => setActiveView('toate')}
        >
          📊 Toți Timpii
        </button>
        <button 
          className={`tab-btn ${activeView === 'recorduri' ? 'active' : ''}`}
          onClick={() => setActiveView('recorduri')}
        >
          🏆 Recorduri Personale
        </button>
        <button 
          className={`tab-btn ${activeView === 'statistici' ? 'active' : ''}`}
          onClick={() => setActiveView('statistici')}
        >
          📈 Statistici & Grafice
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>Se încarcă datele...</p>
        </div>
      ) : (
        <>
          {/* All Times View */}
          {activeView === 'toate' && (
            <div className="times-grid">
              {cursantTimes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⏱️</div>
                  <h3>Nu sunt timpii înregistrați</h3>
                  <p>Acest înotător nu are încă timpii înregistrați.</p>
                </div>
              ) : (
                cursantTimes.map(time => (
                  <div key={time.id} className="time-record-card">
                    <div className="record-header">
                      <span className="record-date">
                        {new Date(time.recordedDate).toLocaleDateString('ro-RO')}
                      </span>
                      <div className="record-badges">
                        {time.poolLength && (
                          <span className="pool-badge">{time.poolLength}m</span>
                        )}
                        {time.competitionName && (
                          <span className="competition-badge">🏆 Competiție</span>
                        )}
                        {time.isPersonalBest && (
                          <span className="pb-badge">🥇 Record Personal</span>
                        )}
                      </div>
                    </div>
                    
                    {time.competitionName && (
                      <div className="competition-name">{time.competitionName}</div>
                    )}
                    
                    <div className="times-grid-inner">
                      {swimmingEvents.map(event => {
                        if (!time[event.key]) return null;
                        return (
                          <div key={event.key} className="time-item">
                            <span className="event-icon">{event.icon}</span>
                            <div className="time-info">
                              <span className="event-name">{event.label}</span>
                              <span className="time-value">{formatTime(time[event.key])}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {time.notes && (
                      <div className="record-notes">
                        <strong>Note:</strong> {time.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Personal Bests View */}
          {activeView === 'recorduri' && (
            <div className="personal-bests-grid">
              {personalBests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏆</div>
                  <h3>Nu sunt recorduri personale</h3>
                  <p>Acest înotător nu are încă recorduri personale stabilite.</p>
                </div>
              ) : (
                swimmingEvents.map(event => {
                  const bestTime = personalBests.find(pb => pb[event.key]);
                  if (!bestTime || !bestTime[event.key]) return null;
                  
                  return (
                    <div key={event.key} className="personal-best-card">
                      <div className="pb-header">
                        <span className="event-icon">{event.icon}</span>
                        <div className="event-info">
                          <h3>{event.label}</h3>
                          <span className="event-category">{event.category}</span>
                        </div>
                      </div>
                      <div className="pb-time">{formatTime(bestTime[event.key])}</div>
                      <div className="pb-details">
                        <span>📅 {new Date(bestTime.recordedDate).toLocaleDateString('ro-RO')}</span>
                        {bestTime.poolLength && <span>🏊‍♂️ {bestTime.poolLength}m</span>}
                        {bestTime.competitionName && <span>🏆 {bestTime.competitionName}</span>}
                      </div>
                      <button 
                        className="show-graph-btn"
                        onClick={() => {
                          setSelectedEvent(event.key);
                          setShowGraph(!showGraph || selectedEvent !== event.key);
                        }}
                      >
                        {showGraph && selectedEvent === event.key ? 'Ascunde Graficul' : 'Arată Graficul'}
                      </button>
                      
                      {showGraph && selectedEvent === event.key && (
                        <div className="graph-section">
                          <SimpleGraph eventKey={event.key} eventLabel={event.label} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Statistics View */}
          {activeView === 'statistici' && (
            <div className="statistics-view">
              {statistics ? (
                <>
                  <div className="stats-summary">
                    <div className="stat-card">
                      <span className="stat-icon">📊</span>
                      <div className="stat-content">
                        <span className="stat-value">{statistics.totalRecords}</span>
                        <span className="stat-label">Total Înregistrări</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🏆</span>
                      <div className="stat-content">
                        <span className="stat-value">{statistics.personalBestsCount}</span>
                        <span className="stat-label">Recorduri Personale</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🏅</span>
                      <div className="stat-content">
                        <span className="stat-value">{statistics.competitionTimesCount}</span>
                        <span className="stat-label">Timpii de Competiție</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">📅</span>
                      <div className="stat-content">
                        <span className="stat-value">
                          {statistics.earliestDate && statistics.latestDate
                            ? Math.ceil((new Date(statistics.latestDate) - new Date(statistics.earliestDate)) / (1000 * 60 * 60 * 24))
                            : 0
                          }
                        </span>
                        <span className="stat-label">Zile de Monitorizare</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stats-details">
                    <h3>Perioada de Monitorizare</h3>
                    <p>
                      De la: {statistics.earliestDate ? new Date(statistics.earliestDate).toLocaleDateString('ro-RO') : 'N/A'}
                      {' '} până la: {statistics.latestDate ? new Date(statistics.latestDate).toLocaleDateString('ro-RO') : 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📈</div>
                  <h3>Nu sunt suficiente date pentru statistici</h3>
                  <p>Adaugă mai mulți timpii pentru a vedea statistici detaliate.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CursantTimesDetails;