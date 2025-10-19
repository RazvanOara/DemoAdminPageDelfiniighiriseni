import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import "./ViewAdvancedSwimmer.css";

// Mock data (unchanged)
const MOCK_SWIMMERS = {
  '1': { id: 1, cursantId: 1, cursantNume: 'Popescu Alex', maxHeartRate: 195, restingHeartRate: 60, thresholdHeartRate: 170, createdAt: '2024-09-15T10:00:00' },
  '2': { id: 2, cursantId: 2, cursantNume: 'Ionescu David', maxHeartRate: 188, restingHeartRate: 65, thresholdHeartRate: 164, createdAt: '2024-09-20T14:30:00' },
  '3': { id: 3, cursantId: 3, cursantNume: 'Georgescu Sofia', maxHeartRate: 192, restingHeartRate: 58, thresholdHeartRate: 167, createdAt: '2024-09-25T11:15:00' }
};

const MOCK_SWIMMING_TIMES = {
  '1': [
    { id: 1, cursantId: 1, recordedDate: '2024-10-01', poolLength: 25, competitionName: 'Campionatul Județean', freestyle50m: 26.45, freestyle100m: 58.12, backstroke50m: 30.22, breaststroke100m: 72.34, isPersonalBest: true },
    { id: 2, cursantId: 1, recordedDate: '2024-09-20', poolLength: 25, competitionName: null, freestyle50m: 27.10, freestyle100m: 59.45, freestyle200m: 128.90, isPersonalBest: false },
    { id: 3, cursantId: 1, recordedDate: '2024-09-10', poolLength: 25, competitionName: null, freestyle50m: 27.50, freestyle100m: 60.20, butterfly50m: 31.15, isPersonalBest: false }
  ],
  '2': [{ id: 4, cursantId: 2, recordedDate: '2024-09-28', poolLength: 50, competitionName: 'Cupa României', freestyle100m: 55.30, freestyle200m: 120.45, backstroke100m: 65.20, isPersonalBest: true }],
  '3': [
    { id: 5, cursantId: 3, recordedDate: '2024-10-02', poolLength: 25, competitionName: null, freestyle50m: 28.90, breaststroke50m: 35.40, breaststroke100m: 75.80, butterfly50m: 32.10, isPersonalBest: true },
    { id: 6, cursantId: 3, recordedDate: '2024-09-22', poolLength: 25, competitionName: 'Concurs Local', freestyle50m: 29.20, breaststroke50m: 36.10, im100m: 68.50, isPersonalBest: false }
  ]
};

const ViewAdvancedSwimmer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, lang } = useParams();
  
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
    { key: 'freestyle50m', label: t('viewSwimmer.events.freestyle50'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'freestyle100m', label: t('viewSwimmer.events.freestyle100'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'freestyle200m', label: t('viewSwimmer.events.freestyle200'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'freestyle400m', label: t('viewSwimmer.events.freestyle400'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'freestyle800m', label: t('viewSwimmer.events.freestyle800'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'freestyle1500m', label: t('viewSwimmer.events.freestyle1500'), icon: '🏊‍♂️', category: t('viewSwimmer.categories.freestyle') },
    { key: 'backstroke50m', label: t('viewSwimmer.events.backstroke50'), icon: '🏊‍♀️', category: t('viewSwimmer.categories.backstroke') },
    { key: 'backstroke100m', label: t('viewSwimmer.events.backstroke100'), icon: '🏊‍♀️', category: t('viewSwimmer.categories.backstroke') },
    { key: 'backstroke200m', label: t('viewSwimmer.events.backstroke200'), icon: '🏊‍♀️', category: t('viewSwimmer.categories.backstroke') },
    { key: 'breaststroke50m', label: t('viewSwimmer.events.breaststroke50'), icon: '🤽‍♂️', category: t('viewSwimmer.categories.breaststroke') },
    { key: 'breaststroke100m', label: t('viewSwimmer.events.breaststroke100'), icon: '🤽‍♂️', category: t('viewSwimmer.categories.breaststroke') },
    { key: 'breaststroke200m', label: t('viewSwimmer.events.breaststroke200'), icon: '🤽‍♂️', category: t('viewSwimmer.categories.breaststroke') },
    { key: 'butterfly50m', label: t('viewSwimmer.events.butterfly50'), icon: '🦋', category: t('viewSwimmer.categories.butterfly') },
    { key: 'butterfly100m', label: t('viewSwimmer.events.butterfly100'), icon: '🦋', category: t('viewSwimmer.categories.butterfly') },
    { key: 'butterfly200m', label: t('viewSwimmer.events.butterfly200'), icon: '🦋', category: t('viewSwimmer.categories.butterfly') },
    { key: 'im100m', label: t('viewSwimmer.events.im100'), icon: '🏆', category: t('viewSwimmer.categories.im') },
    { key: 'im200m', label: t('viewSwimmer.events.im200'), icon: '🏆', category: t('viewSwimmer.categories.im') }
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

          const totalRecords = times.length;
          const personalBestsCount = times.filter(t => t.isPersonalBest).length;
          const competitionTimesCount = times.filter(t => t.competitionName).length;
          
          setStatistics({ totalRecords, personalBestsCount, competitionTimesCount });
        } else {
          setError(t('viewSwimmer.errors.notFound'));
        }
        
        setIsLoading(false);
      }, 500);
    };

    fetchAllData();
  }, [id, t]);

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

  const handleUpdateSwimmer = () => {
    const maxHr = parseInt(heartRateData.maxHeartRate);
    const restingHr = parseInt(heartRateData.restingHeartRate);
    const thresholdHr = parseInt(heartRateData.thresholdHeartRate);

    if (maxHr < 120 || maxHr > 220) {
      setError(t('viewSwimmer.validation.maxHrRange'));
      return;
    }
    if (restingHr < 30 || restingHr > 100) {
      setError(t('viewSwimmer.validation.restingHrRange'));
      return;
    }
    if (thresholdHr < 100 || thresholdHr > 200) {
      setError(t('viewSwimmer.validation.thresholdHrRange'));
      return;
    }
    if (restingHr >= maxHr) {
      setError(t('viewSwimmer.validation.restingLessThanMax'));
      return;
    }

    setSwimmer({ ...swimmer, maxHeartRate: maxHr, restingHeartRate: restingHr, thresholdHeartRate: thresholdHr });
    setEditMode(false);
    setError(null);
    alert(t('viewSwimmer.success.dataUpdated'));
  };

  const handleDeleteSwimmer = () => {
    if (window.confirm(t('viewSwimmer.confirmDelete'))) {
      navigate(`/${lang}/admin/advanced-swimmers`);
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
    if (data.length < 2) return <p>{t('viewSwimmer.graph.notEnoughData')}</p>;

    const minTime = Math.min(...data.map(d => d.time));
    const maxTime = Math.max(...data.map(d => d.time));
    const timeRange = maxTime - minTime;

    return (
      <div className="simple-graph">
        <h4>{eventLabel} - {t('viewSwimmer.graph.evolution')}</h4>
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
          <p>{t('viewSwimmer.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !swimmer) {
    return (
      <div className="swimmer-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>{t('viewSwimmer.error')}</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate(`/${lang}/admin/advanced-swimmers`)}>
            {t('viewSwimmer.backToList')}
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
        <button className="back-btn" onClick={() => navigate(`/${lang}/admin/advanced-swimmers`)}>
          ← {t('viewSwimmer.backToList')}
        </button>
        <div className="header-content">
          <div className="swimmer-info">
            <h1 className="swimmer-name">{swimmer?.cursantNume || `${t('viewSwimmer.studentId')}: ${swimmer?.cursantId}`} ({t('viewSwimmer.demo')})</h1>
            <p className="swimmer-subtitle">{t('viewSwimmer.subtitle')}</p>
            <div className="swimmer-badges">
              <span className="badge">ID: {swimmer.id}</span>
              <span className="badge">{t('viewSwimmer.student')}: {swimmer.cursantId}</span>
              <span className="badge">{t('viewSwimmer.created')}: {new Date(swimmer.createdAt).toLocaleDateString('ro-RO')}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate(`/${lang}/admin/swimming-times/create?cursantId=${swimmer.cursantId}`)}
          >
            ➕ {t('viewSwimmer.addTime')}
          </button>
          <button 
            className={`btn-edit ${editMode ? 'active' : ''}`}
            onClick={() => {
              setEditMode(!editMode);
              setError(null);
            }}
          >
            ✏️ {editMode ? t('viewSwimmer.cancel') : t('viewSwimmer.edit')}
          </button>
          <button className="btn-danger" onClick={handleDeleteSwimmer}>
            🗑️ {t('viewSwimmer.deleteMock')}
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
          📊 {t('viewSwimmer.tabs.overview')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'times' ? 'active' : ''}`}
          onClick={() => setActiveTab('times')}
        >
          ⏱️ {t('viewSwimmer.tabs.times')} ({swimmingTimes.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 {t('viewSwimmer.tabs.analytics')}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="cards-grid">
              <div className="info-card heart-rate-card">
                <div className="card-header">
                  <h3>{t('viewSwimmer.overview.heartRate')}</h3>
                  {editMode && <span className="edit-indicator">{t('viewSwimmer.overview.editMode')}</span>}
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
                          onChange={(e) => setHeartRateData({ ...heartRateData, maxHeartRate: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.maxHeartRate}</span>
                      )}
                      <span className="hr-label">{t('viewSwimmer.overview.hrMax')}</span>
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
                          onChange={(e) => setHeartRateData({ ...heartRateData, restingHeartRate: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.restingHeartRate}</span>
                      )}
                      <span className="hr-label">{t('viewSwimmer.overview.hrResting')}</span>
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
                          onChange={(e) => setHeartRateData({ ...heartRateData, thresholdHeartRate: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        <span className="hr-value">{swimmer.thresholdHeartRate}</span>
                      )}
                      <span className="hr-label">{t('viewSwimmer.overview.hrThreshold')}</span>
                    </div>
                  </div>
                </div>
                {editMode && (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleUpdateSwimmer} disabled={isLoading}>
                      {isLoading ? t('viewSwimmer.overview.saving') : `💾 ${t('viewSwimmer.overview.saveMock')}`}
                    </button>
                  </div>
                )}
              </div>

              {zones && (
                <div className="info-card zones-card">
                  <div className="card-header">
                    <h3>{t('viewSwimmer.overview.trainingZones')}</h3>
                  </div>
                  <div className="zones-grid">
                    <div className="zone-item zone-1">
                      <span className="zone-number">Z1</span>
                      <span className="zone-name">{t('viewSwimmer.zones.recovery')}</span>
                      <span className="zone-range">{zones.zone1.min}-{zones.zone1.max} bpm</span>
                    </div>
                    <div className="zone-item zone-2">
                      <span className="zone-number">Z2</span>
                      <span className="zone-name">{t('viewSwimmer.zones.lightAerobic')}</span>
                      <span className="zone-range">{zones.zone2.min}-{zones.zone2.max} bpm</span>
                    </div>
                    <div className="zone-item zone-3">
                      <span className="zone-number">Z3</span>
                      <span className="zone-name">{t('viewSwimmer.zones.aerobic')}</span>
                      <span className="zone-range">{zones.zone3.min}-{zones.zone3.max} bpm</span>
                    </div>
                    <div className="zone-item zone-4">
                      <span className="zone-number">Z4</span>
                      <span className="zone-name">{t('viewSwimmer.zones.threshold')}</span>
                      <span className="zone-range">{zones.zone4.min}-{zones.zone4.max} bpm</span>
                    </div>
                    <div className="zone-item zone-5">
                      <span className="zone-number">Z5</span>
                      <span className="zone-name">{t('viewSwimmer.zones.anaerobic')}</span>
                      <span className="zone-range">{zones.zone5.min}-{zones.zone5.max} bpm</span>
                    </div>
                  </div>
                </div>
              )}

              {statistics && (
                <div className="info-card stats-card">
                  <div className="card-header">
                    <h3>{t('viewSwimmer.overview.swimmingStats')}</h3>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <span className="stat-value">{statistics.totalRecords}</span>
                      <span className="stat-label">{t('viewSwimmer.overview.totalTimes')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-value">{statistics.personalBestsCount}</span>
                      <span className="stat-label">{t('viewSwimmer.overview.records')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🏅</span>
                      <span className="stat-value">{statistics.competitionTimesCount}</span>
                      <span className="stat-label">{t('viewSwimmer.overview.competitions')}</span>
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
                <h3>{t('viewSwimmer.times.noTimes')}</h3>
                <p>{t('viewSwimmer.times.noTimesDescription')}</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate(`/${lang}/admin/swimming-times/create?cursantId=${swimmer.cursantId}`)}
                >
                  ➕ {t('viewSwimmer.times.addFirst')}
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
                    <p>{t('viewSwimmer.times.andMore', { count: swimmingTimes.length - 10 })}</p>
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
                <h3>{t('viewSwimmer.analytics.noData')}</h3>
                <p>{t('viewSwimmer.analytics.noDataDescription')}</p>
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
                          <span className="stat-label">🏆 {t('viewSwimmer.analytics.bestTime')}:</span>
                          <span className="stat-value">{formatTime(bestTime[event.key])}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">📅 {t('viewSwimmer.analytics.mostRecent')}:</span>
                          <span className="stat-value">{formatTime(latestTime[event.key])}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">📊 {t('viewSwimmer.analytics.totalRecords')}:</span>
                          <span className="stat-value">{timesForEvent.length}</span>
                        </div>
                      </div>

                      <div className="all-times-section">
                        <h5>{t('viewSwimmer.analytics.allTimes', { count: timesForEvent.length })}:</h5>
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
                              {t('viewSwimmer.analytics.moreTimes', { count: timesForEvent.length - 5 })}
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
                        {showGraph && selectedEvent === event.key ? t('viewSwimmer.analytics.hideGraph') : `📈 ${t('viewSwimmer.analytics.showGraph')}`}
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