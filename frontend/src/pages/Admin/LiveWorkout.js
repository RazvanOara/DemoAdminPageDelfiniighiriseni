import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LiveWorkout.css';

// ADD: Mock session data
const MOCK_SESSION_DATA = {
  id: 1,
  workoutName: 'Antrenament Intensitate Moderată',
  totalDistance: 2000,
  workoutItems: [
    {
      id: 1,
      type: 'STEP',
      stepType: 'WARMUP',
      distance: 400,
      stroke: 'Liber',
      effort: 'Ușor',
      notes: 'Încălzire progresivă',
      repeats: 1,
      rest: 0
    },
    {
      id: 2,
      type: 'REPEAT',
      repeats: 3,
      notes: 'Serie principală',
      childItems: [
        {
          id: 3,
          type: 'STEP',
          stepType: 'MAIN',
          distance: 200,
          stroke: 'Liber',
          effort: 'Moderat-Intens',
          notes: 'Ritm constant',
          repeats: 2,
          rest: 30
        },
        {
          id: 4,
          type: 'STEP',
          stepType: 'REST',
          rest: 60,
          notes: 'Pauză între serii'
        }
      ]
    },
    {
      id: 5,
      type: 'STEP',
      stepType: 'COOLDOWN',
      distance: 200,
      stroke: 'Liber',
      effort: 'Ușor',
      notes: 'Relaxare',
      repeats: 1,
      rest: 0
    }
  ],
  performances: [
    { cursantId: 1, cursantNume: 'Popescu Alex', attendanceStatus: 'PRESENT' },
    { cursantId: 2, cursantNume: 'Ionescu David', attendanceStatus: 'PRESENT' },
    { cursantId: 3, cursantNume: 'Georgescu Sofia', attendanceStatus: 'PRESENT' }
  ]
};

// Build navigation structure for the workout
const buildWorkoutNavigation = (items, parentPath = []) => {
  const nav = [];
  
  items.forEach((item, idx) => {
    const itemType = item.type?.toUpperCase();
    
    if (itemType === 'REPEAT') {
      const repeatCount = item.repeats || 1;
      
      for (let i = 1; i <= repeatCount; i++) {
        const repeatPath = [...parentPath, { type: 'repeat', iteration: i, total: repeatCount, notes: item.notes }];
        
        if (item.childItems && item.childItems.length > 0) {
          nav.push(...buildWorkoutNavigation(item.childItems, repeatPath));
        }
      }
    } else if (itemType === 'STEP') {
      nav.push({
        item: item,
        path: parentPath,
        id: item.id
      });
    }
  });
  
  return nav;
};

const LiveWorkout = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [swimmers, setSwimmers] = useState([]);
  const [workoutNav, setWorkoutNav] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [times, setTimes] = useState({});
  const [activeSwimmers, setActiveSwimmers] = useState(new Set());

  // REPLACED: Load with mock data
  useEffect(() => {
    const loadSession = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const data = MOCK_SESSION_DATA;
        setSessionData(data);
        
        if (data.workoutItems) {
          const nav = buildWorkoutNavigation(data.workoutItems);
          setWorkoutNav(nav);
        }
        
        const swimmerMap = new Map();
        data.performances?.forEach(perf => {
          if (!swimmerMap.has(perf.cursantId)) {
            swimmerMap.set(perf.cursantId, {
              id: perf.cursantId,
              name: perf.cursantNume,
              status: perf.attendanceStatus
            });
          }
        });
        
        setSwimmers(Array.from(swimmerMap.values()));
        setIsLoading(false);
      }, 500);
    };
    
    if (sessionId) loadSession();
  }, [sessionId]);

  const currentStep = workoutNav[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === workoutNav.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (!isFirst) setCurrentIndex(currentIndex - 1);
  };

  const toggleSwimmer = (swimmerId) => {
    setActiveSwimmers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(swimmerId)) {
        newSet.delete(swimmerId);
      } else {
        newSet.add(swimmerId);
      }
      return newSet;
    });
  };

  const handleTimeChange = (swimmerId, rep, value) => {
    const key = `${currentStep.id}-${swimmerId}-${rep}`;
    const digits = value.replace(/\D/g, '').slice(0, 6);
    
    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
      if (digits.length >= 3) formatted += ':' + digits.slice(2, 4);
      if (digits.length >= 5) formatted += ':' + digits.slice(4, 6);
    }
    
    setTimes(prev => ({ ...prev, [key]: formatted }));
  };

  const handleTimeBlur = (swimmerId, rep) => {
    const key = `${currentStep.id}-${swimmerId}-${rep}`;
    const currentValue = times[key];
    if (!currentValue) return;
    
    const digits = currentValue.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 6) {
      let padded;
      if (digits.length === 1) {
        padded = '0' + digits + '0000';
      } else {
        padded = digits.padEnd(6, '0');
      }
      const formatted = padded.slice(0, 2) + ':' + padded.slice(2, 4) + ':' + padded.slice(4, 6);
      setTimes(prev => ({ ...prev, [key]: formatted }));
    }
  };

  // DISABLED: Save time (mock - just clears input)
  const handleSaveTime = (swimmerId, rep) => {
    const key = `${currentStep.id}-${swimmerId}-${rep}`;
    const timeValue = times[key];
    if (!timeValue) return;

    const digits = timeValue.replace(/\D/g, '');
    if (digits.length < 4) {
      alert('Timp invalid (minim mm:ss)');
      return;
    }

    // Mock save - just clear the input and show success
    setTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[key];
      return newTimes;
    });
    
    alert(`Timp salvat (mock): ${timeValue} pentru ${swimmers.find(s => s.id === swimmerId)?.name}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.key === 'ArrowRight' && !isLast) handleNext();
      if (e.key === 'ArrowLeft' && !isFirst) handlePrevious();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isLast, isFirst]);

  if (isLoading) {
    return (
      <div className="live-workout-page">
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="live-workout-page">
        <div className="empty-state">
          <p>Antrenament gol</p>
          <button onClick={() => navigate('/admin/traininghub/sessionManager')}>
            ← Înapoi
          </button>
        </div>
      </div>
    );
  }

  const item = currentStep.item;
  const stepType = item.stepType?.toUpperCase();
  const repeats = item.repeats || 1;

  return (
    <div className="live-workout-page">
      {/* Top Bar */}
      <div className="live-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/admin/traininghub/sessionManager')}>
            ← Ieșire
          </button>
          <div className="workout-title">
            <h2>{sessionData?.workoutName} (Demo)</h2>
            <span className="workout-meta">{sessionData?.totalDistance}m</span>
          </div>
        </div>
        
        <div className="progress-indicator">
          <span className="progress-text">
            {currentIndex + 1} / {workoutNav.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIndex + 1) / workoutNav.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Repeat Path Breadcrumb */}
      {currentStep.path.length > 0 && (
        <div className="repeat-breadcrumb">
          {currentStep.path.map((p, idx) => (
            <div key={idx} className="breadcrumb-item">
              <span className="breadcrumb-label">Repetare</span>
              <span className="breadcrumb-count">{p.iteration}/{p.total}</span>
              {p.notes && <span className="breadcrumb-notes">{p.notes}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="live-content">
        {stepType === 'REST' ? (
          <div className="rest-display">
            <div className="rest-icon-large">⏸</div>
            <h1>Pauză</h1>
            {item.rest > 0 && <div className="rest-timer">{item.rest}s</div>}
          </div>
        ) : (
          <div className="step-display">
            <div className="step-main-info">
              <div className="distance-display">{item.distance}m</div>
              <div className="stroke-display">{item.stroke}</div>
              {item.effort && <div className="effort-display">{item.effort}</div>}
            </div>
            
            {item.notes && <div className="step-notes-display">{item.notes}</div>}

            {/* Swimmer Selection */}
            <div className="swimmer-chips">
              {swimmers.map(swimmer => (
                <button
                  key={swimmer.id}
                  className={`swimmer-chip ${activeSwimmers.has(swimmer.id) ? 'active' : ''}`}
                  onClick={() => toggleSwimmer(swimmer.id)}
                >
                  {swimmer.name}
                </button>
              ))}
            </div>

            {/* Time Entry for Active Swimmers */}
            {activeSwimmers.size > 0 && (
              <div className="time-entry-section">
                <h3>Notează Timpi (Mock)</h3>
                {Array.from(activeSwimmers).map(swimmerId => {
                  const swimmer = swimmers.find(s => s.id === swimmerId);
                  return (
                    <div key={swimmerId} className="swimmer-time-group">
                      <div className="swimmer-time-header">{swimmer.name}</div>
                      <div className="reps-grid">
                        {[...Array(repeats)].map((_, idx) => {
                          const rep = idx + 1;
                          const key = `${currentStep.id}-${swimmerId}-${rep}`;
                          
                          return (
                            <div key={rep} className="rep-time-input">
                              <label>#{rep}</label>
                              <input
                                type="text"
                                placeholder="mm:ss:cs"
                                value={times[key] || ''}
                                onChange={(e) => handleTimeChange(swimmerId, rep, e.target.value)}
                                onBlur={() => handleTimeBlur(swimmerId, rep)}
                              />
                              <button
                                onClick={() => handleSaveTime(swimmerId, rep)}
                                disabled={!times[key]}
                              >
                                ✓
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="live-nav-buttons">
        <button
          className="nav-btn nav-btn-prev"
          onClick={handlePrevious}
          disabled={isFirst}
        >
          ← Anterior
        </button>
        <button
          className="nav-btn nav-btn-next"
          onClick={handleNext}
          disabled={isLast}
        >
          Următor →
        </button>
      </div>
    </div>
  );
};

export default LiveWorkout;