import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import './CursantTimesDetails.css';

const CursantTimesDetails = () => {
  const { t } = useTranslation();
  const { cursantId, lang } = useParams();
  const navigate = useNavigate();
  const [cursantTimes, setCursantTimes] = useState([]);
  const [personalBests, setPersonalBests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('toate'); // toate, recorduri, statistici
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const swimmingEvents = [
    { key: 'freestyle50m', label: t('timesDetails.events.freestyle50'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'freestyle100m', label: t('timesDetails.events.freestyle100'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'freestyle200m', label: t('timesDetails.events.freestyle200'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'freestyle400m', label: t('timesDetails.events.freestyle400'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'freestyle800m', label: t('timesDetails.events.freestyle800'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'freestyle1500m', label: t('timesDetails.events.freestyle1500'), icon: '🏊‍♂️', category: t('timesDetails.categories.freestyle') },
    { key: 'backstroke50m', label: t('timesDetails.events.backstroke50'), icon: '🏊‍♀️', category: t('timesDetails.categories.backstroke') },
    { key: 'backstroke100m', label: t('timesDetails.events.backstroke100'), icon: '🏊‍♀️', category: t('timesDetails.categories.backstroke') },
    { key: 'backstroke200m', label: t('timesDetails.events.backstroke200'), icon: '🏊‍♀️', category: t('timesDetails.categories.backstroke') },
    { key: 'breaststroke50m', label: t('timesDetails.events.breaststroke50'), icon: '🤽‍♂️', category: t('timesDetails.categories.breaststroke') },
    { key: 'breaststroke100m', label: t('timesDetails.events.breaststroke100'), icon: '🤽‍♂️', category: t('timesDetails.categories.breaststroke') },
    { key: 'breaststroke200m', label: t('timesDetails.events.breaststroke200'), icon: '🤽‍♂️', category: t('timesDetails.categories.breaststroke') },
    { key: 'butterfly50m', label: t('timesDetails.events.butterfly50'), icon: '🦋', category: t('timesDetails.categories.butterfly') },
    { key: 'butterfly100m', label: t('timesDetails.events.butterfly100'), icon: '🦋', category: t('timesDetails.categories.butterfly') },
    { key: 'butterfly200m', label: t('timesDetails.events.butterfly200'), icon: '🦋', category: t('timesDetails.categories.butterfly') },
    { key: 'im100m', label: t('timesDetails.events.im100'), icon: '🏆', category: t('timesDetails.categories.im') },
    { key: 'im200m', label: t('timesDetails.events.im200'), icon: '🏆', category: t('timesDetails.categories.im') }
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
    if (data.length < 2) return <p>{t('timesDetails.graph.notEnoughData')}</p>;

    const minTime = Math.min(...data.map(d => d.time));
    const maxTime = Math.max(...data.map(d => d.time));
    const timeRange = maxTime - minTime;

    return (
      <div className="simple-graph">
        <h4>{eventLabel} - {t('timesDetails.graph.evolution')}</h4>
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

  const cursantName = cursantTimes.length > 0 ? cursantTimes[0].cursantNume : `${t('timesDetails.student')} ${cursantId}`;

  return (
    <div className="cursant-details-container">
      {/* Header */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(`/${lang}/admin/swimming-times`)}>
          ← {t('timesDetails.backButton')}
        </button>
        <div className="header-content">
          <h1 className="page-title">{cursantName}</h1>
          <p className="page-subtitle">{t('timesDetails.pageSubtitle')}</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate(`/${lang}/admin/swimming-times/create?cursantId=${cursantId}`)}
        >
          ➕ {t('timesDetails.addNewTime')}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab-btn ${activeView === 'toate' ? 'active' : ''}`}
          onClick={() => setActiveView('toate')}
        >
          📊 {t('timesDetails.tabs.allTimes')}
        </button>
        <button 
          className={`tab-btn ${activeView === 'recorduri' ? 'active' : ''}`}
          onClick={() => setActiveView('recorduri')}
        >
          🏆 {t('timesDetails.tabs.personalBests')}
        </button>
        <button 
          className={`tab-btn ${activeView === 'statistici' ? 'active' : ''}`}
          onClick={() => setActiveView('statistici')}
        >
          📈 {t('timesDetails.tabs.statistics')}
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>{t('timesDetails.loading')}</p>
        </div>
      ) : (
        <>
          {/* All Times View */}
          {activeView === 'toate' && (
            <div className="times-grid">
              {cursantTimes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⏱️</div>
                  <h3>{t('timesDetails.allTimes.noTimes')}</h3>
                  <p>{t('timesDetails.allTimes.noTimesDescription')}</p>
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
                          <span className="competition-badge">🏆 {t('timesDetails.allTimes.competition')}</span>
                        )}
                        {time.isPersonalBest && (
                          <span className="pb-badge">🥇 {t('timesDetails.allTimes.personalRecord')}</span>
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
                        <strong>{t('timesDetails.allTimes.notes')}:</strong> {time.notes}
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
                  <h3>{t('timesDetails.personalBests.noRecords')}</h3>
                  <p>{t('timesDetails.personalBests.noRecordsDescription')}</p>
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
                        {showGraph && selectedEvent === event.key ? t('timesDetails.personalBests.hideGraph') : t('timesDetails.personalBests.showGraph')}
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
                        <span className="stat-label">{t('timesDetails.statistics.totalRecords')}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🏆</span>
                      <div className="stat-content">
                        <span className="stat-value">{statistics.personalBestsCount}</span>
                        <span className="stat-label">{t('timesDetails.statistics.personalBests')}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <span className="stat-icon">🏅</span>
                      <div className="stat-content">
                        <span className="stat-value">{statistics.competitionTimesCount}</span>
                        <span className="stat-label">{t('timesDetails.statistics.competitionTimes')}</span>
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
                        <span className="stat-label">{t('timesDetails.statistics.monitoringDays')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stats-details">
                    <h3>{t('timesDetails.statistics.monitoringPeriod')}</h3>
                    <p>
                      {t('timesDetails.statistics.from')}: {statistics.earliestDate ? new Date(statistics.earliestDate).toLocaleDateString('ro-RO') : 'N/A'}
                      {' '}{t('timesDetails.statistics.to')}: {statistics.latestDate ? new Date(statistics.latestDate).toLocaleDateString('ro-RO') : 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📈</div>
                  <h3>{t('timesDetails.statistics.notEnoughData')}</h3>
                  <p>{t('timesDetails.statistics.notEnoughDataDescription')}</p>
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