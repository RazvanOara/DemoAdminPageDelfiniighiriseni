import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TimeRecorder.css';

// Mock API with demo data
const api = {
  async getSessionDetails(sessionId) {
    // Simulate async delay
    await new Promise(res => setTimeout(res, 500));

    return {
      id: sessionId,
      workoutName: "Antrenament Demo",
      totalDistance: 1200,
      workoutItems: [
        {
          id: 1,
          type: "STEP",
          distance: 100,
          stroke: "Freestyle",
          effort: "Medium",
          notes: "Menține tehnica",
          repeats: 2,
          stepType: "SWIM"
        },
        {
          id: 2,
          type: "REST",
          stepType: "REST",
          rest: 30
        },
        {
          id: 3,
          type: "REPEAT",
          idRepeat: "R1",
          repeats: 2,
          notes: "Set de anduranță",
          childItems: [
            {
              id: 4,
              type: "STEP",
              distance: 50,
              stroke: "Backstroke",
              effort: "High",
              notes: "Accelerează ultimele 10m",
              repeats: 2,
              stepType: "SWIM"
            },
            {
              id: 5,
              type: "REST",
              stepType: "REST",
              rest: 20
            }
          ]
        }
      ],
      performances: [
        {
          cursantId: "s1",
          cursantNume: "Ion Popescu",
          attendanceStatus: "present",
          workoutItemId: 1,
          repetitionPath: "1",
          recordedTime: 75000
        },
        {
          cursantId: "s1",
          cursantNume: "Ion Popescu",
          attendanceStatus: "present",
          workoutItemId: 1,
          repetitionPath: "2",
          recordedTime: 77000
        },
        {
          cursantId: "s2",
          cursantNume: "Maria Ionescu",
          attendanceStatus: "late",
          workoutItemId: 4,
          repetitionPath: "1.1",
          recordedTime: 38000
        }
      ]
    };
  },

  async recordTime(data) {
    // Simulate async save
    await new Promise(res => setTimeout(res, 500));

    console.log("Mock save time:", data);
    return { success: true };
  }
};

const SwimmerSearch = ({ swimmers, selectedSwimmer, onSelect }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredSwimmers = swimmers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
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

  if (selectedSwimmer) {
    return (
      <div className="selected-swimmer-display">
        <div className="swimmer-info-display">
          <span className="swimmer-name-display">{selectedSwimmer.name}</span>
          <span className={`status-badge-small status-${selectedSwimmer.status}`}>
            {selectedSwimmer.status}
          </span>
        </div>
        <button className="btn-change-swimmer" onClick={() => onSelect(null)}>
          Schimbă
        </button>
      </div>
    );
  }

  return (
    <div className="swimmer-search-wrapper" ref={dropdownRef}>
      <input
        type="text"
        className="swimmer-search-field"
        placeholder="Caută înotător..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      <span className="search-icon-times">🔍</span>

      {showDropdown && (
        <div className="swimmer-dropdown-times">
          {filteredSwimmers.length > 0 ? (
            filteredSwimmers.map(swimmer => (
              <div
                key={swimmer.id}
                className="swimmer-dropdown-item-times"
                onClick={() => {
                  onSelect(swimmer);
                  setSearch('');
                  setShowDropdown(false);
                }}
              >
                <span className="swimmer-name-item">{swimmer.name}</span>
                <span className={`status-badge-small status-${swimmer.status}`}>
                  {swimmer.status}
                </span>
              </div>
            ))
          ) : (
            <div className="no-results-times">Niciun înotător găsit</div>
          )}
        </div>
      )}
    </div>
  );
};

// Flatten workout structure into a list of all steps
const flattenWorkout = (items, parentRepeat = null, parentRepeatItemId = null) => {
  const flattened = [];

  items.forEach((item, itemIndex) => {
    const itemType = item.type?.toUpperCase();

    if (itemType === 'REPEAT') {
      const repeatCount = item.repeats || 1;

      for (let i = 1; i <= repeatCount; i++) {
        flattened.push({
          isRepeatHeader: true,
          repeatNumber: i,
          totalRepeats: repeatCount,
          notes: item.notes,
          uniqueKey: `repeat-header-${item.id}-iter-${i}-idx-${itemIndex}-parent-${parentRepeatItemId || 'root'}`
        });

        if (item.childItems) {
          const childItems = flattenWorkout(item.childItems, i, item.id);
          childItems.forEach((child, childIdx) => {
            child.uniqueKey = `${child.uniqueKey}-iter-${i}-childIdx-${childIdx}`;
            flattened.push(child);
          });
        }
      }
    } else if (itemType === 'STEP' || itemType === 'REST') {
      const uniqueKey = parentRepeat
        ? `step-${item.id}-repeat-${parentRepeat}-parent-${parentRepeatItemId}-idx-${itemIndex}`
        : `step-${item.id}-idx-${itemIndex}`;

      flattened.push({
        ...item,
        parentRepeat,
        isStep: true,
        originalId: item.id,
        uniqueKey: uniqueKey
      });
    }
  });

  return flattened;
};

const WorkoutStep = ({ step, swimmer, sessionId, existingTimes, onTimeRecorded }) => {
  const [times, setTimes] = useState({});
  const [isRecording, setIsRecording] = useState({});

  const formatTime = (milliseconds) => {
    if (!milliseconds) return '';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const cs = Math.floor((milliseconds % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${cs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (existingTimes && step.isStep) {
      const itemTimes = {};
      const repeats = step.repeats || 1;

      for (let i = 1; i <= repeats; i++) {
        const repPath = step.parentRepeat ? `${step.parentRepeat}.${i}` : String(i);
        const existing = existingTimes.find(
          t => t.workoutItemId === step.id && t.repetitionPath === repPath
        );
        if (existing) {
          itemTimes[i] = formatTime(existing.recordedTime);
        }
      }
      setTimes(itemTimes);
    }
  }, [existingTimes, step]);

  const handleBlur = (repetition) => {
    const currentValue = times[repetition];
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
      setTimes({ ...times, [repetition]: formatted });
    }
  };

  const handleTimeChange = (repetition, value) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 6);

    let formatted = '';
    if (limited.length > 0) {
      formatted = limited.slice(0, 2);
      if (limited.length >= 3) {
        formatted += ':' + limited.slice(2, 4);
      }
      if (limited.length >= 5) {
        formatted += ':' + limited.slice(4, 6);
      }
    }

    setTimes({ ...times, [repetition]: formatted });
  };

  const handleSaveTime = async (repetition) => {
    if (!swimmer || !times[repetition]) return;

    const timeValue = times[repetition];
    const digits = timeValue.replace(/\D/g, '');

    if (digits.length < 4) {
      alert('Introduceți un timp valid (minim mm:ss)');
      return;
    }

    const mins = parseInt(digits.slice(0, 2)) || 0;
    const secs = parseInt(digits.slice(2, 4)) || 0;
    const cs = parseInt(digits.slice(4, 6)) || 0;
    const totalMs = (mins * 60 * 1000) + (secs * 1000) + (cs * 10);

    const repPath = step.parentRepeat ? `${step.parentRepeat}.${repetition}` : String(repetition);

    setIsRecording({ ...isRecording, [repetition]: true });
    try {
      await api.recordTime({
        trainingSessionId: sessionId,
        cursantId: swimmer.id,
        workoutItemId: step.id,
        repetitionPath: repPath,
        recordedTime: totalMs
      });
      onTimeRecorded();
    } catch (error) {
      console.error('Error recording time:', error);
      alert('Eroare la salvarea timpului');
    } finally {
      setIsRecording({ ...isRecording, [repetition]: false });
    }
  };

  if (step.isRepeatHeader) {
    return (
      <div className="repeat-header-divider">
        <div className="repeat-header-content">
          <span className="repeat-iteration-badge">
            Repetare {step.repeatNumber} din {step.totalRepeats}
          </span>
          {step.notes && <span className="repeat-notes">{step.notes}</span>}
        </div>
      </div>
    );
  }

  if (step.isStep) {
    const stepType = step.stepType?.toUpperCase();
    const repeats = step.repeats || 1;

    if (stepType === 'REST') {
      return (
        <div className="rest-step">
          <span className="rest-icon">⏸</span>
          <span className="rest-text">Pauză</span>
          {step.rest > 0 && <span className="rest-duration">{step.rest}s</span>}
        </div>
      );
    }

    return (
      <div className="workout-step-card">
        <div className="step-header">
          <div className="step-title">
            <span className="step-distance-big">{step.distance}m</span>
            <span className="step-stroke-name">{step.stroke}</span>
          </div>
          {step.effort && <span className="step-effort-badge">{step.effort}</span>}
        </div>

        {step.notes && (
          <div className="step-notes-text">{step.notes}</div>
        )}

        {swimmer && (
          <div className="times-grid">
            {[...Array(repeats)].map((_, index) => {
              const rep = index + 1;
              const hasValue = times[rep];

              return (
                <div key={rep} className={`time-entry ${hasValue ? 'has-value' : ''}`}>
                  <div className="time-entry-label">Rep {rep}</div>
                  <input
                    type="text"
                    className="time-entry-input"
                    placeholder="--:--:--"
                    value={times[rep] || ''}
                    onChange={(e) => handleTimeChange(rep, e.target.value)}
                    onBlur={() => handleBlur(rep)}
                    disabled={isRecording[rep]}
                  />
                  <button
                    className="time-entry-save"
                    onClick={() => handleSaveTime(rep)}
                    disabled={isRecording[rep] || !times[rep]}
                    title="Salvează"
                  >
                    {isRecording[rep] ? '...' : '✓'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const TimeRecorder = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [swimmers, setSwimmers] = useState([]);
  const [selectedSwimmer, setSelectedSwimmer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flattenedWorkout, setFlattenedWorkout] = useState([]);

  const loadSessionData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getSessionDetails(sessionId);
      setSessionData(data);

      if (data.workoutItems) {
        const flattened = flattenWorkout(data.workoutItems);
        setFlattenedWorkout(flattened);
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
    } catch (err) {
      console.error('Error loading session data:', err);
      setError('Eroare la încărcarea datelor sesiunii');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId]);

  const getExistingTimes = () => {
    if (!selectedSwimmer || !sessionData?.performances) return [];
    return sessionData.performances.filter(p => p.cursantId === selectedSwimmer.id);
  };

  const handleBack = () => {
    navigate('/admin/traininghub/sessionManager');
  };

  if (isLoading) {
    return (
      <div className="time-recorder-page">
        <div className="time-recorder-container">
          <div className="loading-center">
            <div className="spinner"></div>
            <p>Se încarcă...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="time-recorder-page">
        <div className="time-recorder-container">
          <div className="error-center">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadSessionData}>
              Reîncearcă
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="time-recorder-page">
      <div className="time-recorder-container">
        <div className="time-recorder-header">
          <div className="header-info">
            <h2>Notează timpi</h2>
            <p className="session-info">
              {sessionData?.workoutName} • {sessionData?.totalDistance}m
            </p>
          </div>
          <button className="btn-back" onClick={handleBack}>
            ← Înapoi
          </button>
        </div>

        <div className="time-recorder-body">
          <div className="swimmer-selector">
            <SwimmerSearch
              swimmers={swimmers}
              selectedSwimmer={selectedSwimmer}
              onSelect={setSelectedSwimmer}
            />
          </div>

          {selectedSwimmer && flattenedWorkout.length > 0 && (
            <div className="workout-timeline">
              {flattenedWorkout.map((step, index) => (
                <WorkoutStep
                  key={step.uniqueKey || `fallback-${index}`}
                  step={step}
                  swimmer={selectedSwimmer}
                  sessionId={sessionId}
                  existingTimes={getExistingTimes()}
                  onTimeRecorded={loadSessionData}
                />
              ))}
            </div>
          )}

          {!selectedSwimmer && (
            <div className="empty-state-times">
              <div className="empty-icon">👤</div>
              <p>Selectează un înotător pentru a nota timpii</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeRecorder;
