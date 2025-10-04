  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './Workouts.css';
  import './Planificare.css';
  const Workouts = () => {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
      type: '',
      difficulty: '',
      search: ''
    });

    // Calculate estimated workout duration in minutes
    const calculateWorkoutDuration = (workout) => {
      if (!workout.items || workout.items.length === 0) return 0;
      
      const calculateItemDuration = (items) => {
        return items.reduce((total, item) => {
          if (item.type === 'REPEAT' && item.childItems) {
            const childDuration = calculateItemDuration(item.childItems);
            return total + (childDuration * item.repeats);
          }
          
          if (item.stepType === 'REST') {
            return total + (item.rest || 30);
          }
          
          const distance = item.distance || 0;
          let pacePerMeter = 1.5;
          
          switch (item.effort) {
            case 'RECOVERY':
            case 'EASY':
              pacePerMeter = 2.0;
              break;
            case 'MODERATE':
              pacePerMeter = 1.5;
              break;
            case 'HARD':
            case 'VERY_HARD':
              pacePerMeter = 1.2;
              break;
            case 'SPRINT':
            case 'ALL_OUT':
              pacePerMeter = 1.0;
              break;
            default:
              pacePerMeter = 1.5;
          }
          
          switch (item.stroke) {
            case 'BREASTSTROKE':
              pacePerMeter *= 1.3;
              break;
            case 'BUTTERFLY':
              pacePerMeter *= 1.2;
              break;
            case 'BACKSTROKE':
              pacePerMeter *= 1.1;
              break;
            case 'IM':
            case 'REVERSE_IM':
              pacePerMeter *= 1.25;
              break;
          }
          
          if (item.drillType === 'KICK') {
            pacePerMeter *= 1.8;
          } else if (item.drillType === 'PULL') {
            pacePerMeter *= 1.1;
          } else if (item.drillType === 'DRILL') {
            pacePerMeter *= 1.4;
          }
          
          const swimTime = distance * pacePerMeter;
          const restTime = 15;
          
          return total + swimTime + restTime;
        }, 0);
      };
      
      const totalSeconds = calculateItemDuration(workout.items);
      return Math.round(totalSeconds / 60);
    };

    

    const getWorkoutStrokes = (workout) => {
      if (!workout.items || workout.items.length === 0) return ['Unknown'];
      
      const strokeCounts = {};
      
      const countStrokes = (items) => {
        items.forEach(item => {
          if (item.type === 'REPEAT' && item.childItems) {
            countStrokes(item.childItems);
          } else if (item.stroke && item.stepType !== 'REST') {
            const distance = item.distance || 0;
            const repeats = item.repeats || 1;
            const totalDistance = distance * repeats;
            
            strokeCounts[item.stroke] = (strokeCounts[item.stroke] || 0) + totalDistance;
          }
        });
      };
      
      countStrokes(workout.items);
      
      const strokeLabels = {
        'FREESTYLE': 'Freestyle',
        'BACKSTROKE': 'Backstroke', 
        'BREASTSTROKE': 'Breaststroke',
        'BUTTERFLY': 'Butterfly',
        'IM': 'IM',
        'IM_BY_ROUND': 'IM by Round',
        'REVERSE_IM': 'Reverse IM',
        'CHOICE': 'Choice',
        'MIXED': 'Mixed'
      };
      
      const sortedStrokes = Object.entries(strokeCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([stroke]) => strokeLabels[stroke] || stroke);
      
      if (sortedStrokes.length === 0) return ['Unknown'];
      if (sortedStrokes.length === 1) return sortedStrokes;
      if (sortedStrokes.length > 3) return ['Mixed'];
      
      return sortedStrokes;
    };

    const formatEnumValue = (value) => {
      if (!value) return value;
      
      const enumMappings = {
        'SPRINT': 'Sprint',
        'REZISTENTA': 'Rezistență',
        'TEHNIC': 'Tehnic',
        'RECUPERARE': 'Recuperare',
        'GENERAL': 'General',
        'INCEPATOR': 'Începător',
        'INTERMEDIAR': 'Intermediar',
        'AVANSAT': 'Avansat'
      };
      
      return enumMappings[value] || value;
    };

    useEffect(() => {
      setIsLoading(true);
    
      // mock real-life workouts
      const mockWorkouts = [
        {
          id: 1,
          name: "Sprint Freestyle",
          level: "INTERMEDIAR",
          type: "SPRINT",
          updatedAt: "2025-09-20",
          totalDistance: 1800,
          items: [
            { stepType: "WARMUP", stroke: "FREESTYLE", distance: 400, effort: "EASY" },
            { stepType: "MAIN", stroke: "FREESTYLE", distance: 8 * 50, effort: "HARD", repeats: 8 },
            { stepType: "REST", rest: 60 },
            { stepType: "MAIN", stroke: "FREESTYLE", distance: 4 * 100, effort: "SPRINT", repeats: 4 },
            { stepType: "COOLDOWN", stroke: "CHOICE", distance: 200, effort: "EASY" }
          ]
        },
        {
          id: 2,
          name: "Tehnică Fluture",
          level: "INCEPATOR",
          type: "TEHNIC",
          updatedAt: "2025-09-18",
          totalDistance: 1200,
          items: [
            { stepType: "WARMUP", stroke: "FREESTYLE", distance: 200, effort: "EASY" },
            { stepType: "DRILL", stroke: "BUTTERFLY", distance: 8 * 25, drillType: "KICK", effort: "MODERATE", repeats: 8 },
            { stepType: "MAIN", stroke: "BUTTERFLY", distance: 4 * 50, effort: "HARD", repeats: 4 },
            { stepType: "COOLDOWN", stroke: "CHOICE", distance: 200, effort: "EASY" }
          ]
        },
        {
          id: 3,
          name: "Rezistență Mixată",
          level: "AVANSAT",
          type: "REZISTENTA",
          updatedAt: "2025-09-22",
          totalDistance: 3000,
          items: [
            { stepType: "WARMUP", stroke: "FREESTYLE", distance: 400, effort: "EASY" },
            { stepType: "MAIN", stroke: "FREESTYLE", distance: 6 * 200, effort: "MODERATE", repeats: 6 },
            { stepType: "REST", rest: 45 },
            { stepType: "MAIN", stroke: "IM", distance: 4 * 100, effort: "HARD", repeats: 4 },
            { stepType: "COOLDOWN", stroke: "CHOICE", distance: 300, effort: "RECOVERY" }
          ]
        }
      ];
    
      // transform them for UI
      const transformedWorkouts = mockWorkouts.map(workout => ({
        id: workout.id,
        name: workout.name,
        duration: calculateWorkoutDuration(workout),
        totalDistance: workout.totalDistance || 0,
        type: formatEnumValue(workout.type) || "General",
        difficulty: formatEnumValue(workout.level) || "Intermediar",
        lastModified: workout.updatedAt,
        sets: workout.items?.length || 0,
        strokes: getWorkoutStrokes(workout),
        rawType: workout.type,
        rawLevel: workout.level
      }));
    
      setWorkouts(transformedWorkouts);
      setIsLoading(false);
    }, []);
    

    const filteredWorkouts = workouts.filter(workout => {
      const matchesType = !filters.type || workout.rawType === filters.type;
      const matchesDifficulty = !filters.difficulty || workout.rawLevel === filters.difficulty;
      const matchesSearch = !filters.search || workout.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesDifficulty && matchesSearch;
    });
    
    const handleFilterChange = (filterName, value) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
    };

    const clearFilters = () => {
      setFilters({
        type: '',
        difficulty: '',
        search: ''
      });
    };

    const WorkoutCard = ({ workout }) => (
      <div className="planificare-workout-card">
        <div className="workout-card-header">
          <h3 className="workout-title">{workout.name}</h3>
          <span className={`difficulty-badge ${workout.difficulty.toLowerCase().replace('î', 'i').replace('ă', 'a')}`}>
            {workout.difficulty}
          </span>
        </div>
        
        <div className="workout-meta">
          <span className="workout-type-badge">{workout.type}</span>
          <span className="workout-date">Modificat: {workout.lastModified}</span>
        </div>
        
        <div className="workout-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <div className="stat-content">
              <span className="stat-value">{workout.duration}</span>
              <span className="stat-label">minute</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏊</span>
            <div className="stat-content">
              <span className="stat-value">{workout.totalDistance}</span>
              <span className="stat-label">metri</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📋</span>
            <div className="stat-content">
              <span className="stat-value">{workout.sets}</span>
              <span className="stat-label">serii</span>
            </div>
          </div>
        </div>
        
        <div className="workout-strokes">
          {workout.strokes.map((stroke, index) => (
            <span key={index} className="stroke-tag">{stroke}</span>
          ))}
        </div>
        
        <div className="workout-actions">
        <button className="action-btn edit-btn">
  <span className="btn-icon">✏️</span>
  Editează
</button>


          <button 
            className="action-btn duplicate-btn"
            onClick={() => {
              const duplicate = {
                ...workout,
                id: Date.now(), // fake new ID
                name: workout.name + " (copie)",
                lastModified: new Date().toISOString().split('T')[0]
              };
              setWorkouts(prev => [...prev, duplicate]);
              alert("Workout duplicat!");
            }}
          >
            <span className="btn-icon">📋</span>
            Duplică
          </button>
          <button 
            className="action-btn preview-btn"
            onClick={() => navigate(`/admin/traininghub/workouts/${workout.id}/preview`)}
          >
            <span className="btn-icon">👁️</span>
            Vezi
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => {
              if (window.confirm("Ștergi acest antrenament?")) {
                setWorkouts(prev => prev.filter(w => w.id !== workout.id));
                alert("Workout șters!");
              }
            }}
            
          >
            <span className="btn-icon">🗑️</span>
            Șterge
          </button>
        </div>
      </div>
    );

    return (
      <div className="workouts-container">
        <div className="planificare-header">
          <nav className="planificare-nav">
            <button 
              className="nav-tab"
              onClick={() => navigate('/admin/traininghub')}
            >
              <span className="tab-icon">📊</span>
              Tablou de Bord
            </button>
            <button 
              className="nav-tab active"
            >
              <span className="tab-icon">🏊</span>
              Antrenamente
            </button>
            <button 
              className="nav-tab"
              onClick={() => navigate('/admin/traininghub/plans')}
            >
              <span className="tab-icon">📋</span>
              Planuri
            </button>
          </nav>
        </div>
        
        <div className="workouts-header">
          <div className="header-content">
            <h1 className="page-title">Biblioteca de Antrenamente</h1>
            <p className="page-subtitle">Creează, editează și gestionează sesiunile de antrenament</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/admin/traininghub/create-workout')}
            >
              <span className="btn-icon">➕</span>
              Creează Antrenament
            </button>
          </div>
        </div>
        
        <div className="workouts-stats">
          <div className="stat-card">
            <span className="stat-icon">🏊</span>
            <div className="stat-content">
              <span className="stat-value">{filteredWorkouts.length}</span>
              <span className="stat-label">Total Antrenamente</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📏</span>
            <div className="stat-content">
              <span className="stat-value">
                {filteredWorkouts.reduce((sum, w) => sum + w.totalDistance, 0).toLocaleString()}
              </span>
              <span className="stat-label">Metri Totali</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-content">
              <span className="stat-value">
                {Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60)}
              </span>
              <span className="stat-label">Ore de Antrenament</span>
            </div>
          </div>
        </div>
        
        <div className="workouts-filters">
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Tip:</label>
              <select 
                className="filter-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Toate Tipurile</option>
                <option value="SPRINT">Sprint</option>
                <option value="REZISTENTA">Rezistență</option>
                <option value="TEHNIC">Tehnic</option>
                <option value="RECUPERARE">Recuperare</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Dificultate:</label>
              <select 
                className="filter-select"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">Toate Nivelele</option>
                <option value="INCEPATOR">Începător</option>
                <option value="INTERMEDIAR">Intermediar</option>
                <option value="AVANSAT">Avansat</option>
              </select>
            </div>
            
            <div className="filter-group search-group">
              <label className="filter-label">Căutare:</label>
              <input 
                type="text" 
                className="filter-input" 
                placeholder="Caută antrenamente..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
              disabled={!filters.type && !filters.difficulty && !filters.search}
            >
              <span className="btn-icon">🗑️</span>
              Șterge Filtrele
            </button>
          </div>
          
          {(filters.type || filters.difficulty || filters.search) && (
            <div className="active-filters">
              <span className="active-filters-label">Filtre active:</span>
              {filters.type && (
                <span className="filter-tag">
                  Tip: {formatEnumValue(filters.type)}
                  <button onClick={() => handleFilterChange('type', '')}>×</button>
                </span>
              )}
              {filters.difficulty && (
                <span className="filter-tag">
                  Dificultate: {formatEnumValue(filters.difficulty)}
                  <button onClick={() => handleFilterChange('difficulty', '')}>×</button>
                </span>
              )}
              {filters.search && (
                <span className="filter-tag">
                  Căutare: "{filters.search}"
                  <button onClick={() => handleFilterChange('search', '')}>×</button>
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="workouts-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner">🔄</div>
              <p>Se încarcă antrenamentele...</p>
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏊</div>
              <h3>Nu au fost găsite antrenamente</h3>
              <p>
                {workouts.length === 0 
                  ? "Nu ai încă antrenamente create. Începe prin a crea primul tău antrenament!"
                  : "Încearcă să modifici filtrele pentru a vedea mai multe rezultate."
                }
              </p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/admin/traininghub/create-workout')}
              >
                <span className="btn-icon">➕</span>
                Creează Primul Antrenament
              </button>
            </div>
          ) : (
            <div className="workouts-grid">
              {filteredWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </div>
        
        {!isLoading && filteredWorkouts.length > 0 && (
          <div className="results-info">
            <p>
              Afișez {filteredWorkouts.length} din {workouts.length} antrenamente
              {(filters.type || filters.difficulty || filters.search) && " (filtrate)"}
            </p>
          </div>
        )}
      </div>
    );
  };

  export default Workouts;