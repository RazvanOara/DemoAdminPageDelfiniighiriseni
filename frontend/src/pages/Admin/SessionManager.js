import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SessionManager.css';
import SwimmerFeedbackModal from './Training/SwimmerFeedbackModal';

// Mock data (unchanged)
let MOCK_PLANS = [
  {
    id: 1,
    name: 'Plan 1',
    status: 'Active',
    participants: [
      { participantType: 'GROUP', groupId: 1, groupColor: '#00d4ff' }
    ],
    weeks: [
      {
        weekNumber: 1,
        phaseType: 'BUILD',
        days: [
          {
            id: 101,
            dayDate: new Date().toISOString().split('T')[0] + 'T00:00:00',
            dayOfWeek: 1,
            trainingType: 'ENDURANCE'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Plan 2',
    status: 'Active',
    participants: [
      { participantType: 'GROUP', groupId: 2, groupColor: '#ff6b6b' }
    ],
    weeks: [
      {
        weekNumber: 2,
        phaseType: 'TECHNIQUE',
        days: [
          {
            id: 102,
            dayDate: new Date().toISOString().split('T')[0] + 'T00:00:00',
            dayOfWeek: 2,
            trainingType: 'TECHNIQUE'
          }
        ]
      }
    ]
  }
];

let MOCK_WORKOUTS = [
  { id: 1, name: 'Antrenament Intensitate Moderată', totalDistance: 2000, type: 'ENDURANCE' },
  { id: 2, name: 'Serie Viteză', totalDistance: 1500, type: 'SPEED' },
  { id: 3, name: 'Tehnici Fluture', totalDistance: 1800, type: 'TECHNIQUE' },
  { id: 4, name: 'Rezistență Aerobă', totalDistance: 3000, type: 'ENDURANCE' }
];

const MOCK_SWIMMERS = [
  { cursantId: 1, cursantNume: 'Popescu Alex', groupId: 1 },
  { cursantId: 2, cursantNume: 'Ionescu David', groupId: 1 },
  { cursantId: 3, cursantNume: 'Georgescu Sofia', groupId: 2 },
  { cursantId: 5, cursantNume: 'Marin Ana', groupId: 2 },
  { cursantId: 4, cursantNume: 'Dumitrescu Ioana', groupId: null }
];

let MOCK_SESSIONS = {};
let sessionIdCounter = 1000;

const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const WorkoutSearch = ({ workouts, onSelect, disabled, selectedWorkout, isPastDate }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useIsMobile();

  const filteredWorkouts = workouts.filter(w =>
    w.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selectedWorkout) {
    return (
      <div className={`selected-workout-display ${isMobile ? 'mobile' : ''}`}>
        <div className="workout-info">
          <div className="workout-name">{selectedWorkout.name}</div>
          <div className="workout-distance">{selectedWorkout.totalDistance}m</div>
        </div>
        {!isPastDate && (
          <button
            className="btn-change-workout"
            onClick={() => onSelect(null)}
            disabled={disabled}
          >
            {isMobile ? '✏️' : t('sessionManager.change')}
          </button>
        )}
      </div>
    );
  }

  if (isPastDate) {
    return (
      <div className={`selected-workout-display ${isMobile ? 'mobile' : ''}`}>
        <div className="workout-info">
          <div className="workout-name" style={{ color: '#999' }}>
            {t('sessionManager.noWorkout')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`workout-search-container ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
      <input
        type="text"
        className="workout-search-input"
        placeholder={isMobile ? t('sessionManager.searchShort') : t('sessionManager.searchWorkout')}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        disabled={disabled}
      />
      <span className="search-icon">🔍</span>

      {showDropdown && (
        <div className="workout-dropdown">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.slice(0, 10).map(workout => (
              <div
                key={workout.id}
                className="workout-dropdown-item"
                onClick={() => {
                  onSelect(workout);
                  setSearch('');
                  setShowDropdown(false);
                }}
              >
                <div className="workout-item-info">
                  <span className="workout-item-name">{workout.name}</span>
                  <span className="workout-item-meta">
                    {workout.totalDistance}m
                    {workout.type && ` • ${workout.type}`}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              {search ? t('sessionManager.noWorkoutFound') : t('sessionManager.noWorkoutsAvailable')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SwimmerRow = ({ swimmer, status, onStatusChange, sessionExists, isPastDate }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const getStatusText = (status) => {
    const statusMap = {
      'present': t('sessionManager.status.present'),
      'absent': t('sessionManager.status.absent'),
      'late': t('sessionManager.status.late'),
      'injured': t('sessionManager.status.injured')
    };
    return statusMap[status] || status;
  };

  if (isMobile) {
    return (
      <div className="swimmer-row-mobile">
        <div className="swimmer-row-mobile-header" onClick={() => sessionExists && setExpanded(!expanded)}>
          <span className="swimmer-name-mobile">{swimmer.name}</span>
          <div className="swimmer-row-mobile-actions">
            {sessionExists && (
              <>
                <span className={`status-dot status-${status}`}></span>
                {expanded ? '▲' : '▼'}
              </>
            )}
          </div>
        </div>
        
        {expanded && sessionExists && (
          <div className="swimmer-row-mobile-expanded">
            {!isPastDate && (
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="status-select-mobile"
              >
                <option value="present">{t('sessionManager.status.present')}</option>
                <option value="absent">{t('sessionManager.status.absent')}</option>
                <option value="late">{t('sessionManager.status.late')}</option>
                <option value="injured">{t('sessionManager.status.injured')}</option>
              </select>
            )}
            <button className="btn-rate-swimmer-mobile">
              ⭐ {t('sessionManager.evaluate')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="swimmer-row">
      <div className="swimmer-info-row">
        <span className="swimmer-name">{swimmer.name}</span>
        {sessionExists && (
          <span className={`swimmer-status-badge status-${status}`}>
            {getStatusText(status)}
          </span>
        )}
      </div>
      <div className="swimmer-actions">
        {sessionExists && !isPastDate && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="status-select"
          >
            <option value="present">{t('sessionManager.status.present')}</option>
            <option value="absent">{t('sessionManager.status.absent')}</option>
            <option value="late">{t('sessionManager.status.late')}</option>
            <option value="injured">{t('sessionManager.status.injured')}</option>
          </select>
        )}
        {sessionExists && (
          <button className="btn-rate-swimmer" title={t('sessionManager.evaluateSwimmer')}>
            ⭐
          </button>
        )}
      </div>
    </div>
  );
};

const PlanCard = ({ plan, existingSession, availableWorkouts, allSwimmers, onUpdate, isPastDate }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swimmerSearch, setSwimmerSearch] = useState('');
  const [sessionTime, setSessionTime] = useState(
    existingSession?.sessionTime?.substring(0, 5) || '10:00'
  );
  const [originalTime, setOriginalTime] = useState(
    existingSession?.sessionTime?.substring(0, 5) || '10:00'
  );
  const [selectedWorkout, setSelectedWorkout] = useState(
    existingSession ? { 
      id: existingSession.workoutId, 
      name: existingSession.workoutName,
      totalDistance: existingSession.totalDistance 
    } : null
  );

  const planSwimmers = [];
  
  if (plan.participants) {
    plan.participants.forEach(participant => {
      if (participant.participantType === 'INDIVIDUAL' && participant.cursantId) {
        const swimmer = allSwimmers.find(s => s.cursantId === participant.cursantId);
        if (swimmer) {
          planSwimmers.push({
            id: swimmer.cursantId,
            name: swimmer.cursantNume
          });
        }
      } else if (participant.participantType === 'GROUP' && participant.groupId) {
        const groupSwimmers = allSwimmers.filter(s => s.groupId === participant.groupId);
        groupSwimmers.forEach(gs => {
          if (!planSwimmers.find(ps => ps.id === gs.cursantId)) {
            planSwimmers.push({
              id: gs.cursantId,
              name: gs.cursantNume
            });
          }
        });
      }
    });
  }

  const filteredSwimmers = planSwimmers.filter(s =>
    s.name.toLowerCase().includes(swimmerSearch.toLowerCase())
  );

  const swimmerStatuses = {};
  if (existingSession?.performances) {
    existingSession.performances.forEach(perf => {
      swimmerStatuses[perf.cursantId] = perf.attendanceStatus;
    });
  }

  const handleWorkoutSelect = (workout) => {
    if (isPastDate) return;

    if (!workout) {
      if (existingSession && window.confirm(t('sessionManager.confirmChangeWorkout'))) {
        const sessionKey = `plan-${plan.id}`;
        delete MOCK_SESSIONS[sessionKey];
        setSelectedWorkout(null);
        onUpdate();
      }
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newSession = {
        id: sessionIdCounter++,
        planDayId: plan.currentDay?.id,
        workoutId: workout.id,
        workoutName: workout.name,
        totalDistance: workout.totalDistance,
        sessionDate: plan.currentDay?.dayDate,
        sessionTime: sessionTime + ':00',
        performances: planSwimmers.map(s => ({
          cursantId: s.id,
          cursantNume: s.name,
          attendanceStatus: 'present'
        }))
      };
      
      MOCK_SESSIONS[`plan-${plan.id}`] = newSession;
      setSelectedWorkout(workout);
      onUpdate();
      setIsLoading(false);
    }, 300);
  };

  const handleAttendanceChange = (cursantId, newStatus) => {
    if (!existingSession || isPastDate) return;
    
    const sessionKey = `plan-${plan.id}`;
    const session = MOCK_SESSIONS[sessionKey];
    if (session) {
      session.performances = session.performances.map(p =>
        p.cursantId === cursantId ? { ...p, attendanceStatus: newStatus } : p
      );
      onUpdate();
    }
  };

  const handleTimeChange = () => {
    if (!existingSession || sessionTime === originalTime || isPastDate) return;
    
    const sessionKey = `plan-${plan.id}`;
    const session = MOCK_SESSIONS[sessionKey];
    if (session) {
      session.sessionTime = sessionTime + ':00';
      setOriginalTime(sessionTime);
    }
  };

  const groupColor = plan.participants?.find(
    p => p.participantType === 'GROUP'
  )?.groupColor || '#00d4ff';

  if (isMobile) {
    return (
      <div className={`plan-card-mobile ${isPastDate ? 'past-date' : ''}`} style={{ borderLeftColor: groupColor }}>
        {isPastDate && (
          <div className="past-date-banner-mobile">
            📅 {t('sessionManager.pastDate')}
          </div>
        )}
        
        <div className="plan-card-mobile-header" onClick={() => setExpanded(!expanded)}>
          <div className="plan-card-mobile-title">
            <h3>{plan.name}</h3>
            {plan.currentDay && (
              <div className="plan-meta-mobile">
                <span className="type-badge-mobile" style={{ background: groupColor }}>
                  {plan.currentDay.trainingType}
                </span>
                <span className="week-info-mobile">
                  {t('sessionManager.week')} {plan.currentDay.weekNumber} • {t('sessionManager.day')} {plan.currentDay.dayOfWeek}
                </span>
              </div>
            )}
          </div>
          <div className="expand-icon">{expanded ? '▲' : '▼'}</div>
        </div>

        {expanded && (
          <div className="plan-card-mobile-content">
            <div className="mobile-compact-row">
              <span className="mobile-label">{t('sessionManager.time')}</span>
              <input 
                type="time" 
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="session-time-input-mobile"
                disabled={isLoading || !existingSession || isPastDate}
              />
              {existingSession && sessionTime !== originalTime && !isPastDate && (
                <button 
                  className="btn-update-time-mobile"
                  onClick={handleTimeChange}
                  disabled={isLoading}
                >
                  ✓
                </button>
              )}
            </div>

            <div className="mobile-section">
              <span className="mobile-label">{t('sessionManager.workout')}</span>
              <WorkoutSearch
                workouts={availableWorkouts}
                onSelect={handleWorkoutSelect}
                disabled={isLoading || isPastDate}
                selectedWorkout={selectedWorkout}
                isPastDate={isPastDate}
              />
            </div>

            <div className="mobile-section">
              <div className="swimmers-header-mobile">
                <span className="mobile-label">
                  {t('sessionManager.swimmers')} ({filteredSwimmers.length})
                </span>
              </div>

              <div className="swimmers-list-mobile-wrapper">
                <div className="swimmers-list-mobile">
                  {filteredSwimmers.length > 0 ? (
                    filteredSwimmers.map(swimmer => (
                      <SwimmerRow
                        key={swimmer.id}
                        swimmer={swimmer}
                        status={swimmerStatuses[swimmer.id] || 'present'}
                        onStatusChange={(status) => handleAttendanceChange(swimmer.id, status)}
                        sessionExists={!!existingSession}
                        isPastDate={isPastDate}
                      />
                    ))
                  ) : (
                    <div className="no-swimmers-mobile">
                      {swimmerSearch ? t('sessionManager.noSwimmerFound') : t('sessionManager.noSwimmersInPlan')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {existingSession && (
              <div className="action-buttons-mobile">
                <button className="btn-mobile btn-secondary-mobile">
                  ⏱️ {t('sessionManager.recordTimes')}
                </button>
                {!isPastDate && (
                  <button className="btn-mobile btn-primary-mobile">
                    🏊 {t('sessionManager.liveSession')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`plan-card ${isPastDate ? 'past-date' : ''}`} style={{ borderLeftColor: groupColor }}>
      {isPastDate && (
        <div className="past-date-banner">
          <span>📅 {t('sessionManager.pastDateBanner')}</span>
        </div>
      )}
      
      <div className="plan-header">
        <div className="plan-title-section">
          <h3>{plan.name}</h3>
          {plan.currentDay && (
            <div className="plan-badges">
              <span className="plan-badge type-badge" style={{ 
                background: `linear-gradient(135deg, ${groupColor}, ${groupColor}dd)` 
              }}>
                {plan.currentDay.trainingType}
              </span>
              <span className="plan-badge week-badge">
                {t('sessionManager.week')} {plan.currentDay.weekNumber} • {t('sessionManager.day')} {plan.currentDay.dayOfWeek}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="workout-assignment-section">
        <div className="time-input-row">
          <label className="section-label">{t('sessionManager.time')}</label>
          <div className="time-input-with-button">
            <input 
              type="time" 
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="session-time-input"
              disabled={isLoading || !existingSession || isPastDate}
            />
            {existingSession && sessionTime !== originalTime && !isPastDate && (
              <button 
                className="btn-update-time"
                onClick={handleTimeChange}
                disabled={isLoading}
              >
                {t('sessionManager.update')}
              </button>
            )}
          </div>
        </div>
        <label className="section-label">{t('sessionManager.workout')}</label>
        <WorkoutSearch
          workouts={availableWorkouts}
          onSelect={handleWorkoutSelect}
          disabled={isLoading || isPastDate}
          selectedWorkout={selectedWorkout}
          isPastDate={isPastDate}
        />
      </div>

      <div className="swimmers-section">
        <div className="swimmers-header">
          <label className="section-label">
            {t('sessionManager.swimmers')} ({filteredSwimmers.length})
          </label>
          <input
            type="text"
            className="swimmer-search-input"
            placeholder={t('sessionManager.searchSwimmer')}
            value={swimmerSearch}
            onChange={(e) => setSwimmerSearch(e.target.value)}
          />
        </div>

        <div className="swimmers-list">
          {filteredSwimmers.length > 0 ? (
            filteredSwimmers.map(swimmer => (
              <SwimmerRow
                key={swimmer.id}
                swimmer={swimmer}
                status={swimmerStatuses[swimmer.id] || 'present'}
                onStatusChange={(status) => handleAttendanceChange(swimmer.id, status)}
                sessionExists={!!existingSession}
                isPastDate={isPastDate}
              />
            ))
          ) : (
            <div className="no-swimmers">
              {swimmerSearch ? t('sessionManager.noSwimmerFound') : t('sessionManager.noSwimmersInPlan')}
            </div>
          )}
        </div>
      </div>

      {existingSession && (
        <div className="action-buttons">
          <button className="btn btn-secondary">
            {t('sessionManager.recordTimes')}
          </button>
          {!isPastDate && (
            <button className="btn btn-primary">
              {t('sessionManager.liveSession')}
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};const AdHocSession = ({ availableWorkouts, allSwimmers, selectedDate, onUpdate, onRemove, canRemove, existingSession, isPastDate }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(
    existingSession ? {
      id: existingSession.workoutId,
      name: existingSession.workoutName,
      totalDistance: existingSession.totalDistance
    } : null
  );
  const [addedSwimmers, setAddedSwimmers] = useState([]);
  const [swimmerSearch, setSwimmerSearch] = useState('');
  const [showSwimmerDropdown, setShowSwimmerDropdown] = useState(false);
  const [sessionId, setSessionId] = useState(existingSession?.id || null);
  const [sessionTime, setSessionTime] = useState(
    existingSession?.sessionTime?.substring(0, 5) || '10:00'
  );
  const [originalTime, setOriginalTime] = useState(
    existingSession?.sessionTime?.substring(0, 5) || '10:00'
  );
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (existingSession?.performances) {
      const swimmers = existingSession.performances.map(perf => ({
        id: perf.cursantId,
        name: perf.cursantNume,
        status: perf.attendanceStatus || 'present'
      }));
      const uniqueSwimmers = swimmers.filter((swimmer, index, self) =>
        index === self.findIndex(s => s.id === swimmer.id)
      );
      setAddedSwimmers(uniqueSwimmers);
    }
  }, [existingSession]);

  const filteredSwimmers = allSwimmers.filter(s =>
    s.cursantNume?.toLowerCase().includes(swimmerSearch.toLowerCase()) &&
    !addedSwimmers.find(as => as.id === s.cursantId)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSwimmerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWorkoutSelect = (workout) => {
    if (isPastDate) return;

    if (!workout) {
      if (sessionId && window.confirm(t('sessionManager.confirmDeleteSession'))) {
        delete MOCK_SESSIONS[`adhoc-${sessionId}`];
        setSelectedWorkout(null);
        setSessionId(null);
        setAddedSwimmers([]);
        onUpdate();
      }
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newSessionId = sessionIdCounter++;
      const newSession = {
        id: newSessionId,
        workoutId: workout.id,
        workoutName: workout.name,
        totalDistance: workout.totalDistance,
        planDayId: null,
        sessionDate: selectedDate.toISOString().split('T')[0],
        sessionTime: sessionTime + ':00',
        performances: []
      };
      
      MOCK_SESSIONS[`adhoc-${newSessionId}`] = newSession;
      setSessionId(newSessionId);
      setSelectedWorkout(workout);
      setIsLoading(false);
    }, 300);
  };

  const handleAddSwimmer = (swimmer) => {
    if (isPastDate) return;

    const newSwimmer = {
      id: swimmer.cursantId,
      name: swimmer.cursantNume,
      status: 'present'
    };
  
    if (sessionId) {
      const session = MOCK_SESSIONS[`adhoc-${sessionId}`];
      if (session) {
        session.performances.push({
          cursantId: newSwimmer.id,
          cursantNume: newSwimmer.name,
          attendanceStatus: 'present'
        });
      }
    }
  
    setAddedSwimmers(prev => [...prev, newSwimmer]);
    setSwimmerSearch('');
    setShowSwimmerDropdown(false);
  };

  const handleStatusChange = (swimmerId, newStatus) => {
    if (!sessionId || isPastDate) return;
    
    const session = MOCK_SESSIONS[`adhoc-${sessionId}`];
    if (session) {
      session.performances = session.performances.map(p =>
        p.cursantId === swimmerId ? { ...p, attendanceStatus: newStatus } : p
      );
    }
    
    setAddedSwimmers(addedSwimmers.map(s =>
      s.id === swimmerId ? { ...s, status: newStatus } : s
    ));
  };

  const handleTimeChange = () => {
    if (!sessionId || sessionTime === originalTime || isPastDate) return;
    
    const session = MOCK_SESSIONS[`adhoc-${sessionId}`];
    if (session) {
      session.sessionTime = sessionTime + ':00';
      setOriginalTime(sessionTime);
    }
  };

  if (isMobile) {
    return (
      <div className={`plan-card-mobile adhoc-mobile ${isPastDate ? 'past-date' : ''}`}>
        {isPastDate && (
          <div className="past-date-banner-mobile">
            📅 {t('sessionManager.pastDate')}
          </div>
        )}
        
        <div className="plan-card-mobile-header" onClick={() => setExpanded(!expanded)}>
          <div className="plan-card-mobile-title">
            <h3>{t('sessionManager.adHocSession')}</h3>
            <span className="type-badge-mobile adhoc-badge-mobile">
              {t('sessionManager.free')}
            </span>
          </div>
          <div className="header-actions-mobile">
            {canRemove && !isPastDate && (
              <button 
                className="btn-remove-adhoc-mobile"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                ✕
              </button>
            )}
            <div className="expand-icon">{expanded ? '▲' : '▼'}</div>
          </div>
        </div>

        {expanded && (
          <div className="plan-card-mobile-content">
            <div className="mobile-compact-row">
              <span className="mobile-label">{t('sessionManager.time')}</span>
              <input 
                type="time" 
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="session-time-input-mobile"
                disabled={isLoading || !sessionId || isPastDate}
              />
              {sessionId && sessionTime !== originalTime && !isPastDate && (
                <button 
                  className="btn-update-time-mobile"
                  onClick={handleTimeChange}
                  disabled={isLoading}
                >
                  ✓
                </button>
              )}
            </div>

            <div className="mobile-section">
              <span className="mobile-label">{t('sessionManager.workout')}</span>
              <WorkoutSearch
                workouts={availableWorkouts}
                onSelect={handleWorkoutSelect}
                disabled={isLoading || isPastDate}
                selectedWorkout={selectedWorkout}
                isPastDate={isPastDate}
              />
            </div>

            {sessionId && (
              <>
                <div className="mobile-section">
                  <div className="swimmers-header-mobile">
                    <span className="mobile-label">
                      {t('sessionManager.swimmers')} ({addedSwimmers.length})
                    </span>
                    {!isPastDate && (
                      <div className="swimmer-search-container-mobile" ref={dropdownRef}>
                        <input
                          type="text"
                          className="swimmer-search-input-mobile"
                          placeholder={t('sessionManager.addSwimmer')}
                          value={swimmerSearch}
                          onChange={(e) => {
                            setSwimmerSearch(e.target.value);
                            setShowSwimmerDropdown(true);
                          }}
                          onFocus={() => setShowSwimmerDropdown(true)}
                        />
                        {showSwimmerDropdown && (
                          <div className="swimmer-dropdown-mobile">
                            {filteredSwimmers.length > 0 ? (
                              filteredSwimmers.slice(0, 10).map(swimmer => (
                                <div
                                  key={swimmer.cursantId}
                                  className="swimmer-dropdown-item"
                                  onClick={() => handleAddSwimmer(swimmer)}
                                >
                                  {swimmer.cursantNume}
                                </div>
                              ))
                            ) : (
                              <div className="no-results">
                                {swimmerSearch ? t('sessionManager.noSwimmerFound') : t('sessionManager.noMoreSwimmers')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="swimmers-list-mobile-wrapper">
                    <div className="swimmers-list-mobile">
                      {addedSwimmers.length > 0 ? (
                        addedSwimmers.map(swimmer => (
                          <SwimmerRow
                            key={swimmer.id}
                            swimmer={swimmer}
                            status={swimmer.status}
                            onStatusChange={(status) => handleStatusChange(swimmer.id, status)}
                            sessionExists={true}
                            isPastDate={isPastDate}
                          />
                        ))
                      ) : (
                        <div className="no-swimmers-mobile">
                          {t('sessionManager.noSwimmersAdded')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="action-buttons-mobile">
                  <button className="btn-mobile btn-secondary-mobile">
                    ⏱️ {t('sessionManager.recordTimes')}
                  </button>
                  {!isPastDate && (
                    <button className="btn-mobile btn-primary-mobile">
                      🏊 {t('sessionManager.liveSession')}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`plan-card adhoc-card ${isPastDate ? 'past-date' : ''}`}>
      {isPastDate && (
        <div className="past-date-banner">
          <span>📅 {t('sessionManager.pastDateBanner')}</span>
        </div>
      )}
      
      <div className="plan-header">
        <div className="plan-title-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{t('sessionManager.adHocSession')}</h3>
              <div className="plan-badges">
                <span className="plan-badge type-badge adhoc-badge">
                  {t('sessionManager.free')}
                </span>
              </div>
            </div>
            {canRemove && !isPastDate && (
              <button 
                className="btn-remove-adhoc"
                onClick={onRemove}
                title={t('sessionManager.deleteSession')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="workout-assignment-section">
        <div className="time-input-row">
          <label className="section-label">{t('sessionManager.time')}</label>
          <div className="time-input-with-button">
            <input 
              type="time" 
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="session-time-input"
              disabled={isLoading || !sessionId || isPastDate}
            />
            {sessionId && sessionTime !== originalTime && !isPastDate && (
              <button 
                className="btn-update-time"
                onClick={handleTimeChange}
                disabled={isLoading}
              >
                {t('sessionManager.update')}
              </button>
            )}
          </div>
        </div>
        <label className="section-label">{t('sessionManager.workout')}</label>
        <WorkoutSearch
          workouts={availableWorkouts}
          onSelect={handleWorkoutSelect}
          disabled={isLoading || isPastDate}
          selectedWorkout={selectedWorkout}
          isPastDate={isPastDate}
        />
      </div>

      {sessionId && (
        <>
          <div className="swimmers-section">
            <div className="swimmers-header">
              <label className="section-label">
                {t('sessionManager.swimmers')} ({addedSwimmers.length})
              </label>
              {!isPastDate && (
                <div className="swimmer-search-container" ref={dropdownRef}>
                  <input
                    type="text"
                    className="swimmer-search-input"
                    placeholder={t('sessionManager.addSwimmer')}
                    value={swimmerSearch}
                    onChange={(e) => {
                      setSwimmerSearch(e.target.value);
                      setShowSwimmerDropdown(true);
                    }}
                    onFocus={() => setShowSwimmerDropdown(true)}
                  />
                  {showSwimmerDropdown && (
                    <div className="swimmer-dropdown">
                      {filteredSwimmers.length > 0 ? (
                        filteredSwimmers.slice(0, 10).map(swimmer => (
                          <div
                            key={swimmer.cursantId}
                            className="swimmer-dropdown-item"
                            onClick={() => handleAddSwimmer(swimmer)}
                          >
                            {swimmer.cursantNume}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">
                          {swimmerSearch ? t('sessionManager.noSwimmerFound') : t('sessionManager.noMoreSwimmers')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="swimmers-list">
              {addedSwimmers.length > 0 ? (
                addedSwimmers.map(swimmer => (
                  <SwimmerRow
                    key={swimmer.id}
                    swimmer={swimmer}
                    status={swimmer.status}
                    onStatusChange={(status) => handleStatusChange(swimmer.id, status)}
                    sessionExists={true}
                    isPastDate={isPastDate}
                  />
                ))
              ) : (
                <div className="no-swimmers">
                  {t('sessionManager.noSwimmersAdded')}
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary">
              {t('sessionManager.recordTimes')}
            </button>
            {!isPastDate && (
              <button className="btn btn-primary">
                {t('sessionManager.liveSession')}
              </button>
            )}
          </div>
        </>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

const SessionManager = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activePlans, setActivePlans] = useState([]);
  const [sessionsByPlanId, setSessionsByPlanId] = useState({});
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [allSwimmers, setAllSwimmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adHocSessions, setAdHocSessions] = useState([]);

  const isPastDate = isDateInPast(selectedDate);

  const normalizeDate = (dateStr) => dateStr.split('T')[0];

  const findDayForDate = (plan, dateStr) => {
    if (!plan.weeks || plan.weeks.length === 0) return null;
  
    for (const week of plan.weeks) {
      if (week.days && Array.isArray(week.days)) {
        const day = week.days.find(d => normalizeDate(d.dayDate) === dateStr);
        if (day) {
          return {
            ...day,
            weekNumber: week.weekNumber,
            phaseType: week.phaseType
          };
        }
      }
    }
    return null;
  };

  const loadData = () => {
    setIsLoading(true);
    setError(null);
  
    setTimeout(() => {
      const dateStr = selectedDate.toISOString().split('T')[0];

      const activePlansData = MOCK_PLANS.filter(plan => plan.status === 'Active');
      const sessionsMap = {};
      const adHocSessionsFromStorage = [];
      
      Object.entries(MOCK_SESSIONS).forEach(([key, session]) => {
        if (key.startsWith('plan-')) {
          const planId = parseInt(key.split('-')[1]);
          sessionsMap[planId] = session;
        } else if (key.startsWith('adhoc-')) {
          adHocSessionsFromStorage.push({
            id: session.id,
            session: session
          });
        }
      });
  
      const plansWithCurrentDay = activePlansData.map(plan => {
        const anyDay = plan.weeks?.[0]?.days?.[0];
        const demoDay = anyDay || {
          id: Date.now(),
          dayDate: dateStr + 'T00:00:00',
          dayOfWeek: 1,
          weekNumber: 1,
          trainingType: 'DEMO'
        };
      
        return { ...plan, currentDay: demoDay };
      });
      
      setActivePlans(plansWithCurrentDay);
      setSessionsByPlanId(sessionsMap);
      setAvailableWorkouts(MOCK_WORKOUTS);
      setAllSwimmers(MOCK_SWIMMERS);
      setAdHocSessions(adHocSessionsFromStorage);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (e) => {
    setSelectedDate(new Date(e.target.value));
    setShowCalendar(false);
  };

  const handleAddAdHocSession = () => {
    if (isPastDate) {
      alert(t('sessionManager.cannotAddPastSession'));
      return;
    }
    setAdHocSessions([...adHocSessions, { id: Date.now() }]);
  };

  const handleRemoveAdHocSession = (adHocSessionObj) => {
    if (isPastDate) {
      alert(t('sessionManager.cannotDeletePastSession'));
      return;
    }

    if (adHocSessionObj.session?.id) {
      if (!window.confirm(t('sessionManager.confirmDeleteSession'))) {
        return;
      }
      
      delete MOCK_SESSIONS[`adhoc-${adHocSessionObj.session.id}`];
      loadData();
    } else {
      setAdHocSessions(adHocSessions.filter(s => s.id !== adHocSessionObj.id));
    }
  };

  if (isLoading) {
    return (
      <div className="session-manager">
        <div className="loading">
          <div className="spinner"></div>
          <p>{t('sessionManager.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="session-manager">
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>
            {t('sessionManager.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`session-manager ${isMobile ? 'mobile' : ''}`}>
      <header className={`session-header ${isMobile ? 'mobile' : ''}`}>
        <h1>{isMobile ? t('sessionManager.sessionsShort') : t('sessionManager.trainingSessions')}</h1>

        <div className={`date-navigation ${isMobile ? 'mobile' : ''}`}>
          <button className="btn-nav" onClick={handlePreviousDay}>
            ◀
          </button>

          <div className={`current-date-display ${isMobile ? 'mobile' : ''}`}>
            <p className="current-date">
              {isMobile ? (
                selectedDate.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              ) : (
                selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </p>
            <button
              className="btn-calendar"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              📅
            </button>
          </div>

          <button className="btn-nav" onClick={handleNextDay}>
            ▶
          </button>
        </div>

        {showCalendar && (
          <div className="calendar-picker">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateSelect}
              className="date-input"
            />
          </div>
        )}
      </header>

      <div className={`sessions-container ${isMobile ? 'mobile' : ''}`}>
        {activePlans.length > 0 ? (
          <div className={`plans-grid ${isMobile ? 'mobile' : ''}`}>
            {activePlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                existingSession={sessionsByPlanId[plan.id]}
                availableWorkouts={availableWorkouts}
                allSwimmers={allSwimmers}
                onUpdate={loadData}
                isPastDate={isPastDate}
              />
            ))}
            {adHocSessions.map((session) => (
              <AdHocSession
                key={session.id}
                availableWorkouts={availableWorkouts}
                allSwimmers={allSwimmers}
                selectedDate={selectedDate}
                onUpdate={loadData}
                onRemove={() => handleRemoveAdHocSession(session)}
                canRemove={true}
                existingSession={session.session || null}
                isPastDate={isPastDate}
              />
            ))}
            {!isPastDate && (
              <div className={`add-adhoc-container ${isMobile ? 'mobile' : ''}`}>
                <button className="btn-add-adhoc" onClick={handleAddAdHocSession}>
                  + {isMobile ? t('sessionManager.adHocShort') : t('sessionManager.addAdHocSession')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t('sessionManager.noActivePlans')}</p>
            <div className={`plans-grid ${isMobile ? 'mobile' : ''}`}>
              {adHocSessions.map((session) => (
                <AdHocSession
                  key={session.id}
                  availableWorkouts={availableWorkouts}
                  allSwimmers={allSwimmers}
                  selectedDate={selectedDate}
                  onUpdate={loadData}
                  onRemove={() => handleRemoveAdHocSession(session)}
                  canRemove={true}
                  existingSession={session.session || null}
                  isPastDate={isPastDate}
                />
              ))}
              {!isPastDate && (
                <div className={`add-adhoc-container ${isMobile ? 'mobile' : ''}`}>
                  <button className="btn-add-adhoc" onClick={handleAddAdHocSession}>
                    + {isMobile ? t('sessionManager.adHocShort') : t('sessionManager.addAdHocSession')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;