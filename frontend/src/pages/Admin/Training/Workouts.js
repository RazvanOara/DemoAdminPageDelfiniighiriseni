import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Workouts.css';
import './Planificare.css';

const Workouts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const getCurrentLang = () => lang || 'ro';
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    search: ''
  });

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
    if (!workout.items || workout.items.length === 0) return [t('workouts.strokes.unknown')];
    
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
      'FREESTYLE': t('workouts.strokes.freestyle'),
      'BACKSTROKE': t('workouts.strokes.backstroke'), 
      'BREASTSTROKE': t('workouts.strokes.breaststroke'),
      'BUTTERFLY': t('workouts.strokes.butterfly'),
      'IM': t('workouts.strokes.im'),
      'IM_BY_ROUND': t('workouts.strokes.imByRound'),
      'REVERSE_IM': t('workouts.strokes.reverseIm'),
      'CHOICE': t('workouts.strokes.choice'),
      'MIXED': t('workouts.strokes.mixed')
    };
    
    const sortedStrokes = Object.entries(strokeCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([stroke]) => strokeLabels[stroke] || stroke);
    
    if (sortedStrokes.length === 0) return [t('workouts.strokes.unknown')];
    if (sortedStrokes.length === 1) return sortedStrokes;
    if (sortedStrokes.length > 3) return [t('workouts.strokes.mixed')];
    
    return sortedStrokes;
  };

  const formatEnumValue = (value) => {
    if (!value) return value;
    
    const enumMappings = {
      'SPRINT': t('workouts.types.sprint'),
      'REZISTENTA': t('workouts.types.endurance'),
      'TEHNIC': t('workouts.types.technical'),
      'RECUPERARE': t('workouts.types.recovery'),
      'GENERAL': t('workouts.types.general'),
      'INCEPATOR': t('workouts.difficulties.beginner'),
      'INTERMEDIAR': t('workouts.difficulties.intermediate'),
      'AVANSAT': t('workouts.difficulties.advanced')
    };
    
    return enumMappings[value] || value;
  };

  useEffect(() => {
    setIsLoading(true);
  
    const mockWorkouts = [
      {
        id: 1,
        name: t('workouts.mockWorkouts.sprintFreestyle'),
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
        name: t('workouts.mockWorkouts.butterflyTechnique'),
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
        name: t('workouts.mockWorkouts.mixedEndurance'),
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
  
    const transformedWorkouts = mockWorkouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      duration: calculateWorkoutDuration(workout),
      totalDistance: workout.totalDistance || 0,
      type: formatEnumValue(workout.type) || t('workouts.types.general'),
      difficulty: formatEnumValue(workout.level) || t('workouts.difficulties.intermediate'),
      lastModified: workout.updatedAt,
      sets: workout.items?.length || 0,
      strokes: getWorkoutStrokes(workout),
      rawType: workout.type,
      rawLevel: workout.level
    }));
  
    setWorkouts(transformedWorkouts);
    setIsLoading(false);
  }, [t]);

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
        <span className="workout-date">{t('workouts.card.modified')}: {workout.lastModified}</span>
      </div>
      
      <div className="workout-stats">
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-value">{workout.duration}</span>
            <span className="stat-label">{t('workouts.card.minutes')}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏊</span>
          <div className="stat-content">
            <span className="stat-value">{workout.totalDistance}</span>
            <span className="stat-label">{t('workouts.card.meters')}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📋</span>
          <div className="stat-content">
            <span className="stat-value">{workout.sets}</span>
            <span className="stat-label">{t('workouts.card.sets')}</span>
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
          {t('workouts.actions.edit')}
        </button>

        <button 
          className="action-btn duplicate-btn"
          onClick={() => {
            const duplicate = {
              ...workout,
              id: Date.now(),
              name: workout.name + " " + t('workouts.actions.copyLabel'),
              lastModified: new Date().toISOString().split('T')[0]
            };
            setWorkouts(prev => [...prev, duplicate]);
            alert(t('workouts.alerts.duplicated'));
          }}
        >
          <span className="btn-icon">📋</span>
          {t('workouts.actions.duplicate')}
        </button>
        <button 
          className="action-btn preview-btn"
          onClick={() => navigate(`/${getCurrentLang()}/admin/traininghub/workouts/${workout.id}/preview`)}
        >
          <span className="btn-icon">👁️</span>
          {t('workouts.actions.view')}
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => {
            if (window.confirm(t('workouts.alerts.confirmDelete'))) {
              setWorkouts(prev => prev.filter(w => w.id !== workout.id));
              alert(t('workouts.alerts.deleted'));
            }
          }}
        >
          <span className="btn-icon">🗑️</span>
          {t('workouts.actions.delete')}
        </button>
      </div>
    </div>
  );// Continuing from Part 1...

  return (
    <div className="workouts-container">
      <div className="planificare-header">
        <nav className="planificare-nav">
          <button 
            className="nav-tab"
            onClick={() => navigate(`/${getCurrentLang()}/admin/traininghub`)}
          >
            <span className="tab-icon">📊</span>
            {t('planificare.nav.dashboard')}
          </button>
          <button 
            className="nav-tab active"
          >
            <span className="tab-icon">🏊</span>
            {t('planificare.nav.workouts')}
          </button>
          <button 
            className="nav-tab"
            onClick={() => navigate(`/${getCurrentLang()}/admin/traininghub/plans`)}
          >
            <span className="tab-icon">📋</span>
            {t('planificare.nav.plans')}
          </button>
        </nav>
      </div>
      
      <div className="workouts-header">
        <div className="header-content">
          <h1 className="page-title">{t('workouts.header.title')}</h1>
          <p className="page-subtitle">{t('workouts.header.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/${getCurrentLang()}/admin/traininghub/create-workout`)}
          >
            <span className="btn-icon">➕</span>
            {t('workouts.header.createWorkout')}
          </button>
        </div>
      </div>
      
      <div className="workouts-stats">
        <div className="stat-card">
          <span className="stat-icon">🏊</span>
          <div className="stat-content">
            <span className="stat-value">{filteredWorkouts.length}</span>
            <span className="stat-label">{t('workouts.stats.totalWorkouts')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📏</span>
          <div className="stat-content">
            <span className="stat-value">
              {filteredWorkouts.reduce((sum, w) => sum + w.totalDistance, 0).toLocaleString()}
            </span>
            <span className="stat-label">{t('workouts.stats.totalMeters')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-value">
              {Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60)}
            </span>
            <span className="stat-label">{t('workouts.stats.trainingHours')}</span>
          </div>
        </div>
      </div>
      
      <div className="workouts-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">{t('workouts.filters.type')}:</label>
            <select 
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">{t('workouts.filters.allTypes')}</option>
              <option value="SPRINT">{t('workouts.types.sprint')}</option>
              <option value="REZISTENTA">{t('workouts.types.endurance')}</option>
              <option value="TEHNIC">{t('workouts.types.technical')}</option>
              <option value="RECUPERARE">{t('workouts.types.recovery')}</option>
              <option value="GENERAL">{t('workouts.types.general')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">{t('workouts.filters.difficulty')}:</label>
            <select 
              className="filter-select"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">{t('workouts.filters.allLevels')}</option>
              <option value="INCEPATOR">{t('workouts.difficulties.beginner')}</option>
              <option value="INTERMEDIAR">{t('workouts.difficulties.intermediate')}</option>
              <option value="AVANSAT">{t('workouts.difficulties.advanced')}</option>
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label className="filter-label">{t('workouts.filters.search')}:</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder={t('workouts.filters.searchPlaceholder')}
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
            {t('workouts.filters.clearFilters')}
          </button>
        </div>
        
        {(filters.type || filters.difficulty || filters.search) && (
          <div className="active-filters">
            <span className="active-filters-label">{t('workouts.filters.activeFilters')}:</span>
            {filters.type && (
              <span className="filter-tag">
                {t('workouts.filters.type')}: {formatEnumValue(filters.type)}
                <button onClick={() => handleFilterChange('type', '')}>×</button>
              </span>
            )}
            {filters.difficulty && (
              <span className="filter-tag">
                {t('workouts.filters.difficulty')}: {formatEnumValue(filters.difficulty)}
                <button onClick={() => handleFilterChange('difficulty', '')}>×</button>
              </span>
            )}
            {filters.search && (
              <span className="filter-tag">
                {t('workouts.filters.search')}: "{filters.search}"
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
            <p>{t('workouts.loading')}</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏊</div>
            <h3>{t('workouts.empty.title')}</h3>
            <p>
              {workouts.length === 0 
                ? t('workouts.empty.noWorkouts')
                : t('workouts.empty.noResults')
              }
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate(`/${getCurrentLang()}/admin/traininghub/create-workout`)}
            >
              <span className="btn-icon">➕</span>
              {t('workouts.empty.createFirst')}
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
            {t('workouts.resultsInfo.showing', { 
              filtered: filteredWorkouts.length, 
              total: workouts.length 
            })}
            {(filters.type || filters.difficulty || filters.search) && ` (${t('workouts.resultsInfo.filtered')})`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Workouts;