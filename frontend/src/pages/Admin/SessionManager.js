import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionManager.css';

// ADD: Mock data
let MOCK_PLANS = [
  {
    id: 1,
    name: 'Plan Competițional - Grupa A',
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
    name: 'Plan Tehnic - Grupa B',
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

const MOCK_GROUPS = [
  { id: 1, name: 'Grupa A - Avansați', color: '#00d4ff' },
  { id: 2, name: 'Grupa B - Competiție', color: '#ff6b6b' }
];

let MOCK_SESSIONS = {};
let sessionIdCounter = 1000;

const WorkoutSearch = ({ workouts, onSelect, disabled, selectedWorkout }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="selected-workout-display">
        <div className="workout-info">
          <div className="workout-name">{selectedWorkout.name}</div>
          <div className="workout-distance">{selectedWorkout.totalDistance}m</div>
        </div>
        <button
          className="btn-change-workout"
          onClick={() => onSelect(null)}
          disabled={disabled}
        >
          Schimbă
        </button>
      </div>
    );
  }

  return (
    <div className="workout-search-container" ref={dropdownRef}>
      <input
        type="text"
        className="workout-search-input"
        placeholder="Caută antrenament..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        disabled={disabled}
      />
      <span className="search-icon">🔍</span>

      {showDropdown && search && (
        <div className="workout-dropdown">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map(workout => (
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
            <div className="no-results">Niciun antrenament găsit</div>
          )}
        </div>
      )}
    </div>
  );
};

const SwimmerRow = ({ swimmer, status, onStatusChange, sessionExists }) => {
  return (
    <div className="swimmer-row">
      <div className="swimmer-info-row">
        <span className="swimmer-name">{swimmer.name}</span>
        {sessionExists && (
          <span className={`swimmer-status-badge status-${status}`}>
            {status}
          </span>
        )}
      </div>
      {sessionExists && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="present">Prezent</option>
          <option value="absent">Absent</option>
          <option value="late">Întârziat</option>
          <option value="injured">Accidentat</option>
        </select>
      )}
    </div>
  );
};

const PlanCard = ({ plan, existingSession, availableWorkouts, allSwimmers, onUpdate, onOpenTimeRecorder, onOpenLiveWorkout }) => {
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
    if (!workout) {
      if (existingSession && window.confirm('Sigur vrei să schimbi antrenamentul? (Mock)')) {
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
    if (!existingSession) return;
    
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
    if (!existingSession || sessionTime === originalTime) return;
    
    const sessionKey = `plan-${plan.id}`;
    const session = MOCK_SESSIONS[sessionKey];
    if (session) {
      session.sessionTime = sessionTime + ':00';
      setOriginalTime(sessionTime);
      alert(`Ora schimbată la ${sessionTime} (mock)`);
    }
  };

  const groupColor = plan.participants?.find(
    p => p.participantType === 'GROUP'
  )?.groupColor || '#00d4ff';

  return (
    <div className="plan-card" style={{ borderLeftColor: groupColor }}>
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
                Săptămâna {plan.currentDay.weekNumber} • Ziua {plan.currentDay.dayOfWeek}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="workout-assignment-section">
        <div className="time-input-row">
          <label className="section-label">Ora sesiunii</label>
          <div className="time-input-with-button">
            <input 
              type="time" 
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="session-time-input"
              disabled={isLoading || !existingSession}
            />
            {existingSession && sessionTime !== originalTime && (
              <button 
                className="btn-update-time"
                onClick={handleTimeChange}
                disabled={isLoading}
              >
                Schimbă ora
              </button>
            )}
          </div>
        </div>
        <label className="section-label">Antrenament</label>
        <WorkoutSearch
          workouts={availableWorkouts}
          onSelect={handleWorkoutSelect}
          disabled={isLoading}
          selectedWorkout={selectedWorkout}
        />
      </div>

      <div className="swimmers-section">
        <div className="swimmers-header">
          <label className="section-label">
            Înotători ({filteredSwimmers.length})
          </label>
          <input
            type="text"
            className="swimmer-search-input"
            placeholder="Caută înotător..."
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
              />
            ))
          ) : (
            <div className="no-swimmers">
              {swimmerSearch ? 'Niciun înotător găsit' : 'Niciun înotător în acest plan'}
            </div>
          )}
        </div>
      </div>

      {existingSession && (
        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => onOpenTimeRecorder(existingSession.id)}
          >
            Notează timpi
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onOpenLiveWorkout(existingSession.id)}
          >
            Sesiune Live
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

const AdHocSession = ({ availableWorkouts, allSwimmers, selectedDate, onUpdate, onRemove, canRemove, existingSession, onOpenTimeRecorder, onOpenLiveWorkout }) => {
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
        status: perf.attendanceStatus
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
    if (!workout) {
      if (sessionId && window.confirm('Sigur vrei să ștergi această sesiune? (Mock)')) {
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
    if (!sessionId) return;
    
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
    if (!sessionId || sessionTime === originalTime) return;
    
    const session = MOCK_SESSIONS[`adhoc-${sessionId}`];
    if (session) {
      session.sessionTime = sessionTime + ':00';
      setOriginalTime(sessionTime);
      alert(`Ora schimbată la ${sessionTime} (mock)`);
    }
  };

  const handleFinalize = () => {
    if (!sessionId) return;
    alert('Sesiune finalizată (mock)!');
    onUpdate();
  };

  return (
    <div className="plan-card adhoc-card">
      <div className="plan-header">
        <div className="plan-title-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Sesiune ad-hoc</h3>
              <div className="plan-badges">
                <span className="plan-badge type-badge adhoc-badge">LIBER</span>
              </div>
            </div>
            {canRemove && (
              <button 
                className="btn-remove-adhoc"
                onClick={onRemove}
                title="Șterge sesiunea"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="workout-assignment-section">
        <div className="time-input-row">
          <label className="section-label">Ora sesiunii</label>
          <div className="time-input-with-button">
            <input 
              type="time" 
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="session-time-input"
              disabled={isLoading || !sessionId}
            />
            {sessionId && sessionTime !== originalTime && (
              <button 
                className="btn-update-time"
                onClick={handleTimeChange}
                disabled={isLoading}
              >
                Schimbă ora
              </button>
            )}
          </div>
        </div>
        <label className="section-label">Antrenament</label>
        <WorkoutSearch
          workouts={availableWorkouts}
          onSelect={handleWorkoutSelect}
          disabled={isLoading}
          selectedWorkout={selectedWorkout}
        />
      </div>

      {sessionId && (
        <>
          <div className="swimmers-section">
            <div className="swimmers-header">
              <label className="section-label">
                Înotători ({addedSwimmers.length})
              </label>
              <div className="swimmer-search-container" ref={dropdownRef}>
                <input
                  type="text"
                  className="swimmer-search-input"
                  placeholder="Adaugă înotător..."
                  value={swimmerSearch}
                  onChange={(e) => {
                    setSwimmerSearch(e.target.value);
                    setShowSwimmerDropdown(true);
                  }}
                  onFocus={() => setShowSwimmerDropdown(true)}
                />
                {showSwimmerDropdown && swimmerSearch && (
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
                      <div className="no-results">Niciun înotător găsit</div>
                    )}
                  </div>
                )}
              </div>
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
                  />
                ))
              ) : (
                <div className="no-swimmers">Niciun înotător adăugat</div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-secondary"
              onClick={() => onOpenTimeRecorder(sessionId)}
            >
              Notează timpi
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onOpenLiveWorkout(sessionId)}
            >
              Sesiune Live
            </button>
            <button className="btn btn-primary" onClick={handleFinalize}>
              Finalizează
            </button>
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
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activePlans, setActivePlans] = useState([]);
  const [sessionsByPlanId, setSessionsByPlanId] = useState({});
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [allSwimmers, setAllSwimmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adHocSessions, setAdHocSessions] = useState([]);

  const normalizeDate = (dateStr) => dateStr.split('T')[0];

  const handleOpenLiveWorkout = (sessionId) => {
    navigate(`/admin/traininghub/session/${sessionId}/live`);
  };
  
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
        const currentDay = findDayForDate(plan, dateStr);
        return { ...plan, currentDay };
      }).filter(plan => plan.currentDay !== null);
  
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
    setAdHocSessions([...adHocSessions, { id: Date.now() }]);
  };

  const handleRemoveAdHocSession = (adHocSessionObj) => {
    if (adHocSessionObj.session?.id) {
      if (!window.confirm('Sigur vrei să ștergi această sesiune? (Mock)')) {
        return;
      }
      
      delete MOCK_SESSIONS[`adhoc-${adHocSessionObj.session.id}`];
      loadData();
    } else {
      setAdHocSessions(adHocSessions.filter(s => s.id !== adHocSessionObj.id));
    }
  };

  const handleOpenTimeRecorder = (sessionId) => {
    navigate(`/admin/traininghub/session/${sessionId}/times`);
  };

  if (isLoading) {
    return (
      <div className="session-manager">
        <div className="loading">
          <div className="spinner"></div>
          <p>Se încarcă...</p>
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
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-manager">
      <header className="session-header">
        <h1>Sesiuni de antrenament (Demo)</h1>

        <div className="date-navigation">
          <button className="btn-nav" onClick={handlePreviousDay}>
            ◀
          </button>

          <div className="current-date-display">
            <p className="current-date">
              {selectedDate.toLocaleDateString('ro-RO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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

      <div className="sessions-container">
        {activePlans.length > 0 ? (
          <div className="plans-grid">
            {activePlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                existingSession={sessionsByPlanId[plan.id]}
                availableWorkouts={availableWorkouts}
                allSwimmers={allSwimmers}
                onUpdate={loadData}
                onOpenTimeRecorder={handleOpenTimeRecorder}
                onOpenLiveWorkout={handleOpenLiveWorkout}
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
                onOpenTimeRecorder={handleOpenTimeRecorder}
                onOpenLiveWorkout={handleOpenLiveWorkout} 
              />
            ))}
            <div className="add-adhoc-container">
              <button className="btn-add-adhoc" onClick={handleAddAdHocSession}>
                + Adaugă sesiune ad-hoc
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Nu există planuri active pentru această dată</p>
            <div className="plans-grid">
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
                  onOpenTimeRecorder={handleOpenTimeRecorder}
                  onOpenLiveWorkout={handleOpenLiveWorkout}
                />
              ))}
              <div className="add-adhoc-container">
                <button className="btn-add-adhoc" onClick={handleAddAdHocSession}>
                  + Adaugă sesiune ad-hoc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;