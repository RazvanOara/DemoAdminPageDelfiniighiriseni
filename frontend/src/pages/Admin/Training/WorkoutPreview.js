import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WorkoutPreview.css';

const WorkoutPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({ name: '', items: [] });
  const [isLoading, setIsLoading] = useState(true);

  const strokeTypes = [
    { value: 'freestyle', label: 'Freestyle', short: 'Fr' },
    { value: 'backstroke', label: 'Backstroke', short: 'Bk' },
    { value: 'breaststroke', label: 'Breaststroke', short: 'Br' },
    { value: 'butterfly', label: 'Butterfly', short: 'Fly' },
    { value: 'choice', label: "Swimmer's Choice", short: 'Ch' },
    { value: 'IM', label: 'Individual Medley', short: 'IM' },
    { value: 'IM-by-round', label: 'IM by round', short: 'IMr' },
    { value: 'reverse-IM', label: 'Reverse IM', short: 'RIM' },
    { value: 'mixed', label: 'Mixed', short: 'Mix' }
  ];

  const equipment = [
    { value: 'none', label: 'No Equipment' },
    { value: 'kickboard', label: 'Kickboard' },
    { value: 'pullbuoy', label: 'Pull Buoy' },
    { value: 'fins', label: 'Fins' },
    { value: 'paddles', label: 'Paddles' },
    { value: 'snorkel', label: 'Snorkel' }
  ];
  useEffect(() => {
    // Instead of fetch, just set a mock workout
    const mockWorkout = {
      name: "Complex Training Session",
      items: [
        {
          id: "w1",
          type: "step",
          stepType: "warmup",
          distance: 400,
          stroke: "freestyle",
          effort: "easy",
          intensityTarget: "effort-base",
          equipment: ["none"],
          notes: "Înot relaxat pentru încălzire"
        },
        {
          id: "w2",
          type: "repeat",
          stepType: "main",
          repeats: 3,
          notes: "Serii principale mixte",
          items: [
            {
              id: "m1",
              type: "step",
              stepType: "main",
              distance: 100,
              stroke: "butterfly",
              effort: "hard",
              intensityTarget: "target-pace",
              targetPace: "1:25",
              equipment: ["fins"],
              notes: "Menține ritmul constant"
            },
            {
              id: "m2",
              type: "step",
              stepType: "rest",
              rest: 30,
              notes: "Recuperare activă"
            },
            {
              id: "m3",
              type: "step",
              stepType: "main",
              distance: 200,
              stroke: "backstroke",
              drillType: "drill",
              effort: "moderate",
              intensityTarget: "css-target",
              cssTarget: "-2",
              equipment: ["pullbuoy", "paddles"],
              notes: "Axează-te pe rotația umerilor"
            }
          ]
        },
        {
          id: "w3",
          type: "step",
          stepType: "rest",
          rest: 60,
          notes: "Pauză între seturi"
        },
        {
          id: "w4",
          type: "repeat",
          stepType: "main",
          repeats: 4,
          notes: "Sprinturi freestyle",
          items: [
            {
              id: "s1",
              type: "step",
              stepType: "main",
              distance: 50,
              stroke: "freestyle",
              effort: "sprint",
              intensityTarget: "effort-base",
              equipment: ["none"],
              notes: "Explozivitate maximă"
            }
          ]
        },
        {
          id: "w5",
          type: "step",
          stepType: "cooldown",
          distance: 300,
          stroke: "choice",
          effort: "recovery",
          equipment: ["snorkel"],
          notes: "Înot ușor pentru revenire"
        }
      ]
    };
  
    setWorkout(mockWorkout);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const mockWorkout = {
      name: "Complex Training Session",
      items: [
        {
          id: "w1",
          type: "step",
          stepType: "warmup",
          distance: 400,
          stroke: "freestyle",
          effort: "easy",
          intensityTarget: "effort-base",
          equipment: ["none"],
          notes: "Înot relaxat pentru încălzire"
        },
        {
          id: "w2",
          type: "repeat",
          stepType: "main",
          repeats: 3,
          notes: "Serii principale mixte",
          items: [
            {
              id: "m1",
              type: "step",
              stepType: "main",
              distance: 100,
              stroke: "butterfly",
              effort: "hard",
              intensityTarget: "target-pace",
              targetPace: "1:25",
              equipment: ["fins"],
              notes: "Menține ritmul constant"
            },
            {
              id: "m2",
              type: "step",
              stepType: "rest",
              rest: 30,
              notes: "Recuperare activă"
            },
            {
              id: "m3",
              type: "step",
              stepType: "main",
              distance: 200,
              stroke: "backstroke",
              drillType: "drill",
              effort: "moderate",
              intensityTarget: "css-target",
              cssTarget: "-2",
              equipment: ["pullbuoy", "paddles"],
              notes: "Axează-te pe rotația umerilor"
            }
          ]
        },
        {
          id: "w3",
          type: "step",
          stepType: "rest",
          rest: 60,
          notes: "Pauză între seturi"
        },
        {
          id: "w4",
          type: "repeat",
          stepType: "main",
          repeats: 4,
          notes: "Sprinturi freestyle",
          items: [
            {
              id: "s1",
              type: "step",
              stepType: "main",
              distance: 50,
              stroke: "freestyle",
              effort: "sprint",
              intensityTarget: "effort-base",
              equipment: ["none"],
              notes: "Explozivitate maximă"
            }
          ]
        },
        {
          id: "w5",
          type: "step",
          stepType: "cooldown",
          distance: 300,
          stroke: "choice",
          effort: "recovery",
          equipment: ["snorkel"],
          notes: "Înot ușor pentru revenire"
        }
      ]
    };
  
    setWorkout(mockWorkout);
    setIsLoading(false);
  }, []);
  

  const calculateDistance = (items) => {
    return items.reduce((total, item) => {
      if (item.type === 'repeat') {
        const repeatDistance = item.items ? calculateDistance(item.items) : 0;
        return total + (repeatDistance * (item.repeats || 1));
      }
      return item.stepType !== 'rest' ? total + (item.distance || 0) : total;
    }, 0);
  };

  const generateNotation = (items) => {
    return items.map(item => {
      if (item.type === 'repeat' && item.items) {
        const inner = generateNotation(item.items).join(' + ');
        return `${item.repeats}x{${inner}}`;
      }
      if (item.stepType === 'rest') {
        return item.rest ? `${item.rest}s Rest` : 'Rest';
      }
      const strokeShort = strokeTypes.find(s => s.value === item.stroke)?.short || '';
      return `${item.distance}${strokeShort}`;
    }).filter(Boolean);
  };

  const renderWhiteboardItem = (item, level = 0) => {
    if (item.type === 'repeat') {
      return (
        <div className="repeat-block">
          <div className="repeat-header">
            <span className="repeat-count">{item.repeats}x</span>
            <span className="repeat-label">REPEAT:</span>
            {item.notes && <span className="repeat-notes">{item.notes}</span>}
          </div>
          <div className="repeat-items">
            {(item.items || item.childItems || []).map((subItem, idx) => (
              <div key={subItem.id || idx} className="repeat-sub-item">
                {renderWhiteboardItem(subItem, level + 1)}
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    if (item.stepType === 'rest') {
      return (
        <div className="rest-item">
          <span className="rest-icon">⏸️</span>
          <span className="rest-text">
            {item.rest ? `${item.rest}s Rest` : 'Rest'}
          </span>
          {item.notes && <span className="rest-notes">{item.notes}</span>}
        </div>
      );
    }
  
    // Define effort levels for display - matching builder
    const effortLevels = [
      { value: 'recovery', label: 'Recovery' },
      { value: 'easy', label: 'Easy' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'hard', label: 'Hard' },
      { value: 'very-hard', label: 'Very Hard' },
      { value: 'all-out', label: 'All Out' },
      { value: 'ascending', label: 'Ascending' },
      { value: 'descending', label: 'Descending' },
      { value: 'sprint', label: 'Sprint' }
    ];
  
    return (
      <div className="swim-item">
        <div className="swim-main-info">
          <div className="swim-distance">{item.distance}m</div>
          <div className="swim-stroke">
            {strokeTypes.find(s => s.value === item.stroke?.toLowerCase())?.label || item.stroke}
            {item.drillType && item.drillType !== 'none' && (
              <span className="drill-type"> ({item.drillType})</span>
            )}
            {/* Display intensity info inline */}
            {item.intensityTarget === 'target-pace' && item.targetPace && (
              <span className="inline-pace"> @ {item.targetPace}/100m</span>
            )}
          {item.intensityTarget === 'css-target' && item.cssTarget && (
  <span className="inline-pace">
    {' @ CSS '}{parseInt(item.cssTarget) > 0 ? '+' : ''}{item.cssTarget}s
  </span>
)}
            {item.intensityTarget === 'effort-base' && item.effort && (
              <span className="inline-effort"> - {effortLevels.find(e => e.value === item.effort)?.label || item.effort}</span>
            )}
          </div>
        </div>
        
        <div className="swim-details">
          {item.equipment && !item.equipment.includes('none') && item.equipment.length > 0 && (
            <div className="equipment-list">
              Equipment: {Array.isArray(item.equipment) 
                ? item.equipment.map(eq => equipment.find(e => e.value === eq)?.label || eq).join(', ')
                : equipment.find(e => e.value === item.equipment)?.label || item.equipment
              }
            </div>
          )}
          
          {item.notes && (
            <div className="item-notes">{item.notes}</div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="workout-whiteboard">
        <div className="loading-state">
          <h2>Loading workout...</h2>
        </div>
      </div>
    );
  }

  const totalDistance = calculateDistance(workout.items);
  const notation = generateNotation(workout.items);

  return (
    <div className="workout-whiteboard">
      <div className="whiteboard-header no-print">
        <div className="workout-info">
          <h1 className="workout-name">{workout.name}</h1>
          <div className="workout-summary">
            <span className="total-distance">{totalDistance}m Total</span>
            <span className="total-items">{workout.items.length} Sets</span>
          </div>
        </div>
        <div className="whiteboard-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/traininghub/workouts')}
          >
            ← Back to Workouts
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            🖨️ Print Workout
          </button>
        </div>
      </div>

      <div className="print-header">
        <h1 className="print-title">{workout.name}</h1>
        <div className="print-summary">
          Total Distance: {totalDistance}m | Sets: {workout.items.length}
        </div>
      </div>

      <div className="whiteboard-content">
        {workout.items.length === 0 ? (
          <div className="empty-workout">
            <p>No workout items to display</p>
          </div>
        ) : (
          <div className="workout-board">
            {workout.items.map((item, index) => (
              <div key={item.id || index} className="board-item">
                <div className="item-number">{index + 1}</div>
                <div className="item-content">
                  {renderWhiteboardItem(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="whiteboard-footer">
        <div className="notation-display">
          <strong>Workout Notation:</strong> {notation.join(' + ')}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPreview;